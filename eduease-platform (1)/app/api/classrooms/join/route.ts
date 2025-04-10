import { NextResponse } from 'next/server';
import { db } from '@/db';
import { classrooms, classroomStudents } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { roomCode, userId } = await req.json();

    if (!roomCode || !userId) {
      return NextResponse.json({ error: "Missing roomCode or userId." }, { status: 400 });
    }

    // 1. Find the classroom by room code
    const classroomResult = await db
      .select()
      .from(classrooms)
      .where(eq(classrooms.roomCode, roomCode));

    const classroom = classroomResult[0];

    if (!classroom) {
      return NextResponse.json({ error: "Classroom not found." }, { status: 404 });
    }

    // 2. Check if the student is already in the classroom
    const existing = await db
      .select()
      .from(classroomStudents)
      .where(
        eq(classroomStudents.classroomId, classroom.id)
      ).where(
        eq(classroomStudents.studentId, userId)
      );

    if (existing.length > 0) {
      return NextResponse.json({ message: "Already joined this classroom." }, { status: 200 });
    }

    // 3. Insert into classroom_students
    await db.insert(classroomStudents).values({
      classroomId: classroom.id,
      studentId: userId,
    });

    return NextResponse.json({ message: "Joined the classroom successfully." }, { status: 200 });

  } catch (error) {
    console.error("Error joining classroom:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
