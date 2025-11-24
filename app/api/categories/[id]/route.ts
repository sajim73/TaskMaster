import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/middleware/auth";
import { Category, Task } from "@/lib/types";
import { ObjectId } from "mongodb";
import { serializeCategory } from "@/lib/serializers/category";

// POST /api/categories/[id] - Update category
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    const body = await request.json();
    const { id: categoryId } = await params;

    if (!ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    const { name, description, color, icon } = body;

    const db = await getDatabase();
    const categoriesCollection = db.collection<Category>("categories");

    // Build update object
    const updateFields: Partial<Category> = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (color !== undefined) updateFields.color = color;
    if (icon !== undefined) updateFields.icon = icon;

    const result = await categoriesCollection.findOneAndUpdate(
      {
        _id: new ObjectId(categoryId),
        userId: new ObjectId(user.userId),
      },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category: serializeCategory(result),
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update category error:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAuth(request);
    const { id: categoryId } = await params;

    if (!ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const categoriesCollection = db.collection<Category>("categories");
    const tasksCollection = db.collection<Task>("tasks");

    // Get category to check its name
    const category = await categoriesCollection.findOne({
      _id: new ObjectId(categoryId),
      userId: new ObjectId(user.userId),
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has tasks
    const taskCount = await tasksCollection.countDocuments({
      userId: new ObjectId(user.userId),
      category: category.name,
    });

    if (taskCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category. ${taskCount} task(s) are using this category.`,
        },
        { status: 400 }
      );
    }

    // Delete category
    const result = await categoriesCollection.deleteOne({
      _id: new ObjectId(categoryId),
      userId: new ObjectId(user.userId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}

