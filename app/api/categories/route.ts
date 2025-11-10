import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/middleware/auth";
import { Category } from "@/lib/types";
import { ObjectId } from "mongodb";
import { serializeCategory } from "@/lib/serializers/category";

// GET /api/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);

    const db = await getDatabase();
    const categoriesCollection = db.collection<Category>("categories");

    const categories = await categoriesCollection
      .find({ userId: new ObjectId(user.userId) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      categories: categories.map((cat) => serializeCategory(cat)),
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const body = await request.json();

    const { name, description, color, icon } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const categoriesCollection = db.collection<Category>("categories");

    // Check if category already exists
    const existingCategory = await categoriesCollection.findOne({
      userId: new ObjectId(user.userId),
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    const newCategory: Category = {
      userId: new ObjectId(user.userId),
      name,
      description: description || "",
      color: color || "#6366f1",
      icon: icon || "folder",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await categoriesCollection.insertOne({
      ...newCategory,
    });

    return NextResponse.json({
      success: true,
      category: serializeCategory({
        ...newCategory,
        _id: result.insertedId,
      }),
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

