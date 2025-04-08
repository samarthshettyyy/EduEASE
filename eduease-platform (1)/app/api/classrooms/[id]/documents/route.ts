// app/api/classrooms/[id]/documents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { documents, users, studentDocuments } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the authenticated user from session (implement according to your auth system)
    // This is a placeholder - replace with your actual auth logic
    const auth = { 
      userId: 1, // Replace with actual user ID from session
      role: 'student' // Replace with actual user role from session
    };
    
    const classroomId = Number(params.id);
    if (isNaN(classroomId)) {
      return NextResponse.json({ error: "Invalid classroom ID" }, { status: 400 });
    }

    // Get all documents for this classroom
    const documentsResult = await db.select({
      id: documents.id,
      title: documents.title,
      description: documents.description,
      fileUrl: documents.fileUrl,
      fileType: documents.fileType,
      fileSize: documents.fileSize,
      teacherId: documents.teacherId,
      createdAt: documents.createdAt,
      updatedAt: documents.updatedAt
    })
    .from(documents)
    .where(eq(documents.classroomId, classroomId))
    .orderBy(documents.createdAt);

    // For each document, get the teacher name
    const teacherIds = [...new Set(documentsResult.map(doc => doc.teacherId))];
    const teachersResult = await db.select({
      id: users.id,
      name: users.name
    })
    .from(users)
    .where(eq(users.id, teacherIds[0])); // Using first teacherId as example

    const teachersMap = new Map();
    teachersResult.forEach(teacher => {
      teachersMap.set(teacher.id, teacher.name);
    });

    // If the user is a student, get their document status
    let studentDocumentsMap = new Map();
    if (auth.role === 'student') {
      const studentDocsResult = await db.select({
        documentId: studentDocuments.documentId,
        viewed: studentDocuments.viewed,
        completed: studentDocuments.completed
      })
      .from(studentDocuments)
      .where(
        and(
          eq(studentDocuments.studentId, auth.userId),
          eq(studentDocuments.documentId, documentsResult.map(doc => doc.id))
        )
      );

      studentDocsResult.forEach(doc => {
        studentDocumentsMap.set(doc.documentId, {
          viewed: doc.viewed === 1,
          completed: doc.completed === 1
        });
      });
    }

    // Combine document data with teacher names and student status
    const formattedDocuments = documentsResult.map(doc => {
      const teacherName = teachersMap.get(doc.teacherId) || "Unknown Teacher";
      const studentStatus = studentDocumentsMap.get(doc.id) || { viewed: false, completed: false };
      
      return {
        ...doc,
        teacherName,
        viewed: studentStatus.viewed,
        completed: studentStatus.completed
      };
    });

    // For development, if no documents exist, return mock data
    if (formattedDocuments.length === 0) {
      return NextResponse.json({
        documents: [
          { 
            id: 1, 
            title: "Cell Structure Introduction.pdf", 
            teacherName: "Ms. Johnson", 
            createdAt: "2025-04-02T00:00:00.000Z",
            fileUrl: "/uploads/documents/1/cell_structure.pdf",
            fileType: "application/pdf",
            viewed: false,
            completed: false
          },
          { 
            id: 2, 
            title: "Biology Chapter 3 Notes.docx", 
            teacherName: "Mr. Smith", 
            createdAt: "2025-04-05T00:00:00.000Z",
            fileUrl: "/uploads/documents/1/biology_notes.docx",
            fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            viewed: true,
            completed: false
          }
        ]
      });
    }

    return NextResponse.json({ documents: formattedDocuments });
  } catch (error) {
    console.error('Error fetching classroom documents:', error);
    return NextResponse.json(
      { error: "Failed to get classroom documents" },
      { status: 500 }
    );
  }
}