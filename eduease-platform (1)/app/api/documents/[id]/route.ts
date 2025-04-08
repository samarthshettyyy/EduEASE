// app/api/documents/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { documents, studentDocuments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import fs from 'fs';
import path from 'path';

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
    
    const documentId = Number(params.id);
    if (isNaN(documentId)) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
    }

    // Get the document
    const [document] = await db.select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .limit(1);

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // If the user is a student, mark the document as viewed
    if (auth.role === 'student') {
      const [studentDoc] = await db.select()
        .from(studentDocuments)
        .where(
          and(
            eq(studentDocuments.studentId, auth.userId),
            eq(studentDocuments.documentId, documentId)
          )
        )
        .limit(1);
      
      if (studentDoc && studentDoc.viewed === 0) {
        await db.update(studentDocuments)
          .set({ 
            viewed: 1, 
            firstViewedAt: new Date(),
            updatedAt: new Date()
          })
          .where(
            and(
              eq(studentDocuments.studentId, auth.userId),
              eq(studentDocuments.documentId, documentId)
            )
          );
      }
    }

    // Try to extract text content from the document
    let text = "";
    let sentences = [];
    let importantWords = [];
    
    try {
      // In a real implementation, you would use a document parsing service
      // This is a simplified version that tries to read local files
      
      // Remove '/uploads' from the beginning of the file URL
      const filePath = document.fileUrl.replace(/^\/uploads/, '');
      const fullPath = path.join(process.cwd(), 'public', 'uploads', filePath);
      
      if (fs.existsSync(fullPath)) {
        // For text files
        if (document.fileType === 'text/plain') {
          text = fs.readFileSync(fullPath, 'utf-8');
        } 
        // For other file types, you would use specific parsers
        else {
          text = "This document's content would be extracted using a dedicated parser for " + document.fileType;
        }
      } else {
        text = "This document is available for download but the text content extraction is not available.";
      }
      
      // Simple sentence splitting - in a real app, you'd use NLP
      sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      
      // Simple important words extraction - in a real app, you'd use NLP
      const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      const wordFreq = {};
      words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });
      
      importantWords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word]) => word);
      
    } catch (error) {
      console.error('Error extracting document content:', error);
      text = "Error extracting document content. The document is still available for download.";
      sentences = [text];
    }
    
    // For development, if text extraction fails or is empty, return mock data
    if (!text) {
      text = "This is sample content for the document titled '" + document.title + "'. In a real implementation, this content would be extracted from the document file.";
      sentences = [
        "This is sample content for the document titled '" + document.title + "'.",
        "In a real implementation, this content would be extracted from the document file."
      ];
      importantWords = ["sample", "content", "document", "implementation", "extracted"];
    }

    return NextResponse.json({
      id: document.id,
      sessionId: `doc-${document.id}`,
      title: document.title,
      description: document.description,
      fileUrl: document.fileUrl,
      fileType: document.fileType,
      text,
      sentences,
      importantWords,
      extractionStats: {
        extraction_method: "api",
        character_count: text.length,
        word_count: text.split(/\s+/).length,
        is_empty: text.length === 0
      }
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: "Failed to get document" },
      { status: 500 }
    );
  }
}