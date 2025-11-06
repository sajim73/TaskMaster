import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/middleware/auth";
import { Task, Category } from "@/lib/types";
import { ObjectId } from "mongodb";
import { predefinedCategories } from "@/lib/category-icons";
import { demoTasks, getDueDate } from "@/lib/demo-data";

// POST /api/test/reset-demo - Reset user data and add demo tasks
export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const db = await getDatabase();
    const tasksCollection = db.collection<Task>("tasks");
    const categoriesCollection = db.collection<Category>("categories");

    const userId = new ObjectId(user.userId);

    // Delete all existing tasks and categories
    await tasksCollection.deleteMany({ userId });
    await categoriesCollection.deleteMany({ userId });

    // Create demo categories from predefined ones
    const now = new Date();
    const categoriesToInsert = predefinedCategories.map((cat) => ({
      userId,
      name: cat.name,
      description: cat.description,
      color: cat.color,
      icon: cat.icon,
      createdAt: now,
      updatedAt: now,
    }));

    await categoriesCollection.insertMany(categoriesToInsert as Category[]);

    // Create demo tasks
    const tasksToInsert = demoTasks.map((task) => ({
      userId,
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      status: task.status,
      dueDate: getDueDate(task.dueDateOffset),
      createdAt: now,
      updatedAt: now,
    }));

    await tasksCollection.insertMany(tasksToInsert as Task[]);

    return NextResponse.json({
      success: true,
      message: "Demo data created successfully",
      stats: {
        categoriesCreated: categoriesToInsert.length,
        tasksCreated: tasksToInsert.length,
      },
    });
  } catch (error) {
    console.error("Failed to reset demo data:", error);
    return NextResponse.json(
      { error: "Failed to reset demo data" },
      { status: 500 }
    );
  }
}

