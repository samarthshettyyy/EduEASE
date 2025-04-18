// File: /app/api/classroom/content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chapterContent } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const {
      chapterId,
      title,
      standardContent,
      simplifiedContent,
      detailedContent,
      importantWords,
      quizQuestions,
      images,
      settings,
    } = body;

    // Validate the required fields
    if (!chapterId || !title) {
      return NextResponse.json(
        { error: 'Chapter ID and title are required' },
        { status: 400 }
      );
    }

    // Check if the chapter content already exists
    const existingContent = await db.query.chapterContent.findFirst({
      where: eq(chapterContent.chapterId, chapterId),
    });

    // Convert complex data to JSON strings for storage
    const quizQuestionsJSON = quizQuestions ? JSON.stringify(quizQuestions) : null;
    const importantWordsJSON = importantWords ? JSON.stringify(importantWords) : null;
    const imagesJSON = images ? JSON.stringify(images) : null;
    const settingsJSON = settings ? JSON.stringify(settings) : null;

    if (existingContent) {
      // Update existing content
      await db
        .update(chapterContent)
        .set({
          title,
          standardContent,
          simplifiedContent,
          detailedContent,
          importantWords: importantWordsJSON,
          quizQuestions: quizQuestionsJSON,
          images: imagesJSON,
          settings: settingsJSON,
          updatedAt: new Date(),
        })
        .where(eq(chapterContent.chapterId, chapterId));
    } else {
      // Insert new content
      await db.insert(chapterContent).values({
        chapterId,
        title,
        standardContent,
        simplifiedContent,
        detailedContent,
        importantWords: importantWordsJSON,
        quizQuestions: quizQuestionsJSON,
        images: imagesJSON,
        settings: settingsJSON,
      });
    }

    // Return success response
    return NextResponse.json({ success: true, message: 'Content saved successfully' });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json(
      { error: 'Failed to save content', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get the chapter ID from the request URL
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get('chapterId');

    if (!chapterId) {
      return NextResponse.json(
        { error: 'Chapter ID is required' },
        { status: 400 }
      );
    }

    // Get the chapter content from the database
    const content = await db.query.chapterContent.findFirst({
      where: eq(chapterContent.chapterId, chapterId),
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Chapter content not found' },
        { status: 404 }
      );
    }

    // Parse JSON strings back to objects for the frontend
    const result = {
      ...content,
      quizQuestions: content.quizQuestions ? JSON.parse(content.quizQuestions) : [],
      importantWords: content.importantWords ? JSON.parse(content.importantWords) : [],
      images: content.images ? JSON.parse(content.images) : [],
      settings: content.settings ? JSON.parse(content.settings) : {},
    };

    // Return the chapter content
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content', details: error.message },
      { status: 500 }
    );
  }
}