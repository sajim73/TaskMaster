import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/middleware/auth";
import { Task } from "@/lib/types";
import { ObjectId } from "mongodb";
import { serializeTask } from "@/lib/serializers/task";
import { isTaskPriority } from "@/lib/types/shared";

// GET /api/tasks/stats - Get task statistics for dashboard
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);

    const db = await getDatabase();
    const tasksCollection = db.collection<Task>("tasks");

    const userId = new ObjectId(user.userId);

    // Get counts by status
    const [total, completed, pending, overdue] = await Promise.all([
      tasksCollection.countDocuments({ userId }),
      tasksCollection.countDocuments({ userId, status: "completed" }),
      tasksCollection.countDocuments({ userId, status: "pending" }),
      tasksCollection.countDocuments({ userId, status: "overdue" }),
    ]);

    // Get counts by category
    const categoryStats = await tasksCollection
      .aggregate([
        { $match: { userId } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // Get counts by priority
    const priorityStats = await tasksCollection
      .aggregate([
        { $match: { userId } },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ])
      .toArray();

    // Get recent activity (last 10 tasks created or updated)
    const recentActivity = await tasksCollection
      .find({ userId })
      .sort({ updatedAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({
      success: true,
      stats: {
        total,
        completed,
        pending,
        overdue,
        byCategory: categoryStats.map((stat) => ({
          category: typeof stat._id === "string" && stat._id.length > 0 ? stat._id : "Uncategorized",
          count: stat.count,
        })),
        byPriority: priorityStats.map((stat) => ({
          priority: isTaskPriority(stat._id) ? stat._id : "medium",
          count: stat.count,
        })),
      },
      recentActivity: recentActivity.map((task) => {
        const { _id, title, description, status, category, updatedAt } = serializeTask(task);
        return {
          _id: _id ?? "",
          title,
          description,
          status,
          category,
          updatedAt,
        };
      }),
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

