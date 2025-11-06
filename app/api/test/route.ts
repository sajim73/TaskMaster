import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    
    // Test connection by listing collections
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({ 
      success: true, 
      message: "MongoDB connected successfully",
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json(
      { success: false, error: "Database connection failed" },
      { status: 500 }
    );
  }
}

