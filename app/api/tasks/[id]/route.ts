import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/middleware/auth";
import { Task } from "@/lib/types";
import { ObjectId, type Filter } from "mongodb";
import { parseDateString } from "@/lib/date-utils";
import { serializeTask } from "@/lib/serializers/task";
import {
  isTaskPriority,
  isTaskStatus,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/types/shared";

// POST /api/tasks/[id] - Update task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    const body = await request.json();
    const { id: taskId } = await params;

    if (!ObjectId.isValid(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const { title, description, category, priority, status, dueDate } = body;

    const db = await getDatabase();
    const tasksCollection = db.collection<Task>("tasks");

    // Build update object
    const updateFields: Partial<Task> = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (category !== undefined) updateFields.category = category;
    if (priority !== undefined) {
      if (!isTaskPriority(priority)) {
        return NextResponse.json(
          { error: "Invalid priority" },
          { status: 400 }
        );
      }
      updateFields.priority = priority;
    }
    if (status !== undefined) {
      if (!isTaskStatus(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updateFields.status = status;
    }
    if (dueDate !== undefined) {
      updateFields.dueDate = dueDate ? parseDateString(dueDate) ?? null : null;
    }

    const filter: Filter<Task> = {
        _id: new ObjectId(taskId),
        userId: new ObjectId(user.userId),
    };

    const result = await tasksCollection.findOneAndUpdate(filter, { $set: updateFields }, {
      returnDocument: "after",
    });

    if (!result) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      task: serializeTask(result),
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    const { id: taskId } = await params;

    if (!ObjectId.isValid(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const tasksCollection = db.collection<Task>("tasks");

    const result = await tasksCollection.deleteOne({
      _id: new ObjectId(taskId),
      userId: new ObjectId(user.userId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete task error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}

