// app/api/documents/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { db } from "@/db";
import { documents, studentDocuments, classroomStudents } from "@/db/schema";
import { eq } from "drizzle-orm";

// Ensure the uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'documents');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user from session (implement according to your auth system)
    // This is a placeholder - replace with your actual auth logic
    const auth = { 
      userId: 1, // Replace with actual user ID from session
      role: 'teacher' // Replace with actual user role from session
    };
    
    // Only teachers can upload documents
    if (auth.role !== 'teacher') {
      return NextResponse.json({ error: "Only teachers can upload documents" }, { status: 403 });
    }

    // Process the multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const classroomId = Number(formData.get("classroomId") as string);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string || "";

    if (!file || !classroomId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Process the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique filename to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const relativePath = `documents/${classroomId}/${fileName}`;
    const directoryPath = path.join(UPLOADS_DIR, String(classroomId));
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    
    const filePath = path.join(directoryPath, fileName);
    
    // Write the file to disk
    fs.writeFileSync(filePath, buffer);
    
    // File URL for client-side access
    const fileUrl = `/uploads/documents/${classroomId}/${fileName}`;

    // Create document record in the database
    const [documentRecord] = await db.insert(documents).values({
      title,
      description,
      fileUrl,
      fileType: file.type,
      fileSize: file.size,
      classroomId,
      teacherId: auth.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    // Get all students in the classroom
    const classroomStudentsResult = await db.select().from(classroomStudents).where(eq(classroomStudents.classroomId, classroomId));

    // Create student_documents entries for each student
    for (const student of classroomStudentsResult) {
      await db.insert(studentDocuments).values({
        studentId: student.studentId,
        documentId: documentRecord.id,
        viewed: 0,
        completed: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return NextResponse.json({
      id: documentRecord.id,
      title: documentRecord.title,
      fileUrl: documentRecord.fileUrl,
      fileType: documentRecord.fileType,
      message: "Document uploaded successfully"
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}