import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/middleware/auth";
import { Task } from "@/lib/types";
import { ObjectId } from "mongodb";
import { parseDateString } from "@/lib/date-utils";

// GET /api/tasks - List all tasks with filtering, sorting, pagination
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const { searchParams } = new URL(request.url);

    // Filters
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Pagination (optional when using date filters)
    const page = parseInt(searchParams.get("page") || "1");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : (startDate || endDate) ? undefined : 10;
    const skip = limit ? (page - 1) * limit : 0;

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const db = await getDatabase();
    const tasksCollection = db.collection<Task>("tasks");

    // Build query
    const query: any = { userId: new ObjectId(user.userId) };

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    // Date range filter
    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) {
        const start = parseDateString(startDate);
        if (start) query.dueDate.$gte = start;
      }
      if (endDate) {
        const end = parseDateString(endDate);
        if (end) {
          // Set to end of day
          end.setHours(23, 59, 59, 999);
          query.dueDate.$lte = end;
        }
      }
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count for pagination
    const total = await tasksCollection.countDocuments(query);

    // Get tasks (with optional pagination)
    let taskQuery = tasksCollection
      .find(query)
      .sort({ [sortBy]: sortOrder });
    
    if (limit) {
      taskQuery = taskQuery.skip(skip).limit(limit);
    }
    
    const tasks = await taskQuery.toArray();

    return NextResponse.json({
      success: true,
      tasks: tasks.map((task) => ({
        ...task,
        _id: task._id?.toString(),
        userId: task.userId.toString(),
      })),
      pagination: limit ? {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      } : {
        total,
      },
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const body = await request.json();

    const { title, description, category, priority, status, dueDate } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (priority && !["low", "medium", "high"].includes(priority)) {
      return NextResponse.json(
        { error: "Invalid priority" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const tasksCollection = db.collection<Task>("tasks");

    const newTask: Omit<Task, "_id"> = {
      userId: new ObjectId(user.userId),
      title,
      description: description || "",
      category: category || "",
      priority: priority || "medium",
      status: status || "pending",
      dueDate: dueDate ? parseDateString(dueDate) ?? undefined : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await tasksCollection.insertOne(newTask as Task);

    return NextResponse.json({
      success: true,
      task: {
        _id: result.insertedId.toString(),
        ...newTask,
        userId: newTask.userId.toString(),
      },
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create task error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}



