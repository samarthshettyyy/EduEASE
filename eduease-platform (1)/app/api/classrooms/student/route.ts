import { NextResponse } from "next/server";
import { db } from "@/db";
import { classroomStudents, classrooms } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const studentId = url.searchParams.get("student_id");

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required." }, { status: 400 });
    }

    // Join classroom_students with classrooms to get all classrooms of a student
    const results = await db
      .select({
        id: classrooms.id,
        name: classrooms.name,
        subject: classrooms.subject,
        roomCode: classrooms.roomCode,
        createdAt: classrooms.createdAt
      })
      .from(classroomStudents)
      .innerJoin(classrooms, eq(classroomStudents.classroomId, classrooms.id))
      .where(eq(classroomStudents.studentId, Number(studentId)));

    return NextResponse.json({ classrooms: results }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch student classrooms:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
