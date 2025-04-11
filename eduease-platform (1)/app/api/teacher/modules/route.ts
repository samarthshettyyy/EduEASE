import { NextResponse } from 'next/server';
import { db } from '@/db';  // Assuming you have your database client set up here
import { modules } from '@/db/schema';  // Assuming modules schema is correctly imported
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    // Extract classroom_id from the query params in the request URL
    const url = new URL(req.url);
    const classroomId = url.searchParams.get('classroom_id');

    // If classroom_id is missing, return an error
    if (!classroomId) {
      return NextResponse.json({ error: 'Classroom ID is required.' }, { status: 400 });
    }

    // Fetch modules associated with the classroom_id
    const modulesData = await db
      .select()
      .from(modules)
      .where(eq(modules.classroomId, Number(classroomId)))  // Ensure classroomId is a number
      .execute();  // Fetch all modules for the given classroom ID

    // If no modules are found for the classroom, return a message
    if (modulesData.length === 0) {
      return NextResponse.json({ message: 'No modules found for this classroom.' }, { status: 404 });
    }

    // Return the modules in the response
    return NextResponse.json({ modules: modulesData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching modules:', error);
    // Handle unexpected errors and return an internal server error
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
