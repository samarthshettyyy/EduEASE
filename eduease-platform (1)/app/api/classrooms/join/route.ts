// app/api/classrooms/join/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ClassroomService } from "@/app/services/ClassroomService";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Only students can join classrooms
    if (user.role !== 'student') {
      return NextResponse.json({ error: "Only students can join classrooms" }, { status: 403 });
    }
    
    // Parse request body
    const body = await request.json();
    const { code } = body;
    
    if (!code) {
      return NextResponse.json({ error: "Classroom code is required" }, { status: 400 });
    }
    
    // Get the classroom by code
    const classroomService = new ClassroomService();
    const classroom = await classroomService.getClassroomByCode(code);
    
    if (!classroom) {
      return NextResponse.json({ error: "Classroom not found" }, { status: 404 });
    }
    
    // Join the classroom
    await classroomService.joinClassroom(classroom.id, user.id);
    
    return NextResponse.json({ 
      message: "Successfully joined classroom",
      classroom: {
        id: classroom.id,
        name: classroom.name,
        subject: classroom.subject,
        color: classroom.color
      }
    });
  } catch (error) {
    console.error("Error joining classroom:", error);
    return NextResponse.json(
      { error: "Failed to join classroom" },
      { status: 500 }
    );
  }
}