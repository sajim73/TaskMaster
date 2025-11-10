import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/middleware/auth";
import { User } from "@/lib/types";
import { ObjectId } from "mongodb";

// POST /api/profile - Update user profile
export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const body = await request.json();

    const { name, email } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>("users");

    // Check if email is already taken by another user
    const existingUser = await usersCollection.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
      _id: { $ne: new ObjectId(user.userId) },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 400 }
      );
    }

    // Update user
    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(user.userId) },
      {
        $set: {
          name,
          email,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: result._id.toString(),
        name: result.name,
        email: result.email,
      },
    });
  } catch (error: unknown) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}

