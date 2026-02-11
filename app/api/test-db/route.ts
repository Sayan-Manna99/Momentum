import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/mongoose";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectToDB();

    if (mongoose.connection.readyState === 1) {
      return NextResponse.json(
        { 
          success: true, 
          message: "✅ MongoDB connected",
          database: mongoose.connection.db?.databaseName 
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: "❌ MongoDB not connected" },
      { status: 503 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: "❌ Connection failed",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
