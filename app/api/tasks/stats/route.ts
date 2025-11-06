import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/middleware/auth";
import { Task } from "@/lib/types";
import { ObjectId } from "mongodb";

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
          category: stat._id || "Uncategorized",
          count: stat.count,
        })),
        byPriority: priorityStats.map((stat) => ({
          priority: stat._id,
          count: stat.count,
        })),
      },
      recentActivity: recentActivity.map((task) => ({
        _id: task._id?.toString(),
        title: task.title,
        description: task.description,
        status: task.status,
        category: task.category,
        updatedAt: task.updatedAt,
      })),
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}



