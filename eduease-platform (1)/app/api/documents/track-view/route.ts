// app/api/documents/track-view/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { studentDocuments } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user from session (implement according to your auth system)
    // This is a placeholder - replace with your actual auth logic
    const auth = { 
      userId: 1, // Replace with actual user ID from session
      role: 'student' // Replace with actual user role from session
    };
    
    // Only students can mark documents as viewed/completed
    if (auth.role !== 'student') {
      return NextResponse.json({ error: "Only students can track document progress" }, { status: 403 });
    }

    const { documentId, viewed, completed, feedback, comprehension } = await req.json();
    
    if (!documentId) {
      return NextResponse.json({ error: "Missing document ID" }, { status: 400 });
    }

    const studentId = auth.userId;
    
    // Check if the student has access to this document
    const studentDocRecord = await db.select()
      .from(studentDocuments)
      .where(
        and(
          eq(studentDocuments.studentId, studentId),
          eq(studentDocuments.documentId, Number(documentId))
        )
      ).limit(1);
    
    if (studentDocRecord.length === 0) {
      return NextResponse.json({ error: "Document access record not found" }, { status: 404 });
    }

    // Prepare the update data
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (viewed !== undefined) {
      updateData.viewed = viewed ? 1 : 0;
      if (viewed && !studentDocRecord[0].firstViewedAt) {
        updateData.firstViewedAt = new Date();
      }
    }
    
    if (completed !== undefined) {
      updateData.completed = completed ? 1 : 0;
      if (completed && !studentDocRecord[0].completedAt) {
        updateData.completedAt = new Date();
      }
    }
    
    // Optional feedback data
    if (feedback) {
      // In a real implementation, you might store this in a separate table
      console.log(`Feedback for document ${documentId} from student ${studentId}: ${feedback}`);
    }
    
    if (comprehension) {
      // In a real implementation, you might store this in a separate table
      console.log(`Comprehension level for document ${documentId} from student ${studentId}: ${comprehension}`);
    }

    // Update the record
    await db.update(studentDocuments)
      .set(updateData)
      .where(
        and(
          eq(studentDocuments.studentId, studentId),
          eq(studentDocuments.documentId, Number(documentId))
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Document tracking error:', error);
    return NextResponse.json(
      { error: "Failed to update document status" },
      { status: 500 }
    );
  }
}