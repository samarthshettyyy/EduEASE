// app/api/classrooms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ClassroomService } from "@/app/services/ClassroomService";
import { getCurrentUser } from "@/lib/auth";

// Generate a random 6-character alphanumeric code
const generateClassroomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  
  return code;
};

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Only teachers can create classrooms
    if (user.role !== 'teacher') {
      return NextResponse.json({ error: "Only teachers can create classrooms" }, { status: 403 });
    }
    
    // Parse request body
    const body = await request.json();
    const { name, description, subject, grade } = body;
    
    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Classroom name is required" }, { status: 400 });
    }
    
    // Generate a unique room code
    const roomCode = generateClassroomCode();
    
    // Create the classroom
    const classroomService = new ClassroomService();
    const classroom = await classroomService.createClassroom({
      name,
      description,
      subject,
      teacherId: user.id,
      roomCode,
      grade
    });
    
    return NextResponse.json({ 
      message: "Classroom created successfully",
      classroom
    });
  } catch (error) {
    console.error("Error creating classroom:", error);
    return NextResponse.json(
      { error: "Failed to create classroom" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const classroomService = new ClassroomService();
    
    // Return different classrooms based on user role
    if (user.role === 'teacher') {
      const teacherClassrooms = await classroomService.getTeacherClassrooms(user.id);
      return NextResponse.json({ classrooms: teacherClassrooms });
    } else if (user.role === 'student') {
      const studentClassrooms = await classroomService.getStudentClassrooms(user.id);
      return NextResponse.json({ classrooms: studentClassrooms });
    }
    
    return NextResponse.json({ classrooms: [] });
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch classrooms" },
      { status: 500 }
    );
  }
}