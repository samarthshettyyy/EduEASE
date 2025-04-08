// app/api/teacher/classrooms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { classrooms } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    // Get the authenticated user from session (implement according to your auth system)
    // This is a placeholder - replace with your actual auth logic
    const auth = { 
      userId: 1, // Replace with actual user ID from session
      role: 'teacher' // Replace with actual user role from session
    };
    
    // Only teachers can access their classrooms
    if (auth.role !== 'teacher') {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    
    // Get all classrooms where this teacher is the owner
    const teacherClassrooms = await db.select().from(classrooms).where(eq(classrooms.teacherId, auth.userId));
    
    // For development, if no classrooms exist, return mock data
    if (teacherClassrooms.length === 0) {
      // Mock classrooms for development
      return NextResponse.json({
        classrooms: [
          { id: 1, name: "Mathematics 101" },
          { id: 2, name: "Science Class" },
          { id: 3, name: "Language Arts" }
        ]
      });
    }
    
    return NextResponse.json({
      classrooms: teacherClassrooms
    });
  } catch (error) {
    console.error('Error fetching teacher classrooms:', error);
    return NextResponse.json(
      { error: "Failed to fetch classrooms" },
      { status: 500 }
    );
  }
}