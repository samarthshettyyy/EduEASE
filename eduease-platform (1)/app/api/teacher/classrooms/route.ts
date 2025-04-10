// app/api/classrooms/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';  // Assuming you have your database client set up here
import { classrooms } from '@/db/schema';  // Assuming classrooms schema is correctly imported
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    // Extract teacher_id from the query params in the request URL
    const url = new URL(req.url);
    const teacherId = url.searchParams.get('teacher_id');
    console.warn(teacherId);
    
    // If teacher_id is missing, return an error
    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID is required.' }, { status: 400 });
    }

    // Fetch classrooms associated with the teacher_id
    const classroomsData = await db
      .select()
      .from(classrooms)
      .where(eq(classrooms.teacherId, teacherId))
      .orderBy(desc(classrooms.createdAt)) // Optionally order by creation date (latest first)
      .execute();  // Fetch all classrooms

    // If no classrooms are found for the teacher, return a message
    if (classroomsData.length === 0) {
      return NextResponse.json({ message: 'No classrooms found for this teacher.' }, { status: 404 });
    }

    // Return the classrooms in the response
    return NextResponse.json({ classrooms: classroomsData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    // Handle unexpected errors and return an internal server error
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
