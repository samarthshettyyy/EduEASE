import { NextResponse } from 'next/server';
import { db } from '@/db';  // Assuming you have your database client set up here
import { modules } from '@/db/schema';  // Assuming modules schema is correctly imported
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        // Parse the request body
        const { name, description, lockModule, classroomId } = await req.json();

        // Validate required fields
        if (!name || !description || !classroomId) {
            return NextResponse.json({ error: 'Module name, description, and classroom ID are required.' }, { status: 400 });
        }

        // Insert new module into the database
        const result = await db
            .insert(modules)
            .values({
                name,
                description,
                classroomId: Number(classroomId), // Ensure classroomId is a number
            })
            .execute();  // Execute the insertion

        // Return the result (new module details or a success message)
        return NextResponse.json({ message: 'Module created successfully', data: result }, { status: 201 });

    } catch (error) {
        console.error('Error creating module:', error);
        // Handle unexpected errors and return an internal server error
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
