// File: /app/api/student/quiz/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chapterContent, quizAttempts, quizResponses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET endpoint to fetch quiz questions for a chapter
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

    // Get the user session to check if they're authorized
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the chapter content from the database
    const content = await db.query.chapterContent.findFirst({
      where: eq(chapterContent.chapterId, chapterId),
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Parse the quiz questions from JSON
    const quizQuestions = content.quizQuestions ? JSON.parse(content.quizQuestions) : [];

    // For students, we need to remove the correct answers
    const studentQuizQuestions = quizQuestions.map(question => ({
      question: question.question,
      options: question.options,
      // Don't include correctAnswer for students
    }));

    // Return the quiz questions
    return NextResponse.json({
      chapterId,
      title: content.title,
      quizQuestions: studentQuizQuestions
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz', details: error.message },
      { status: 500 }
    );
  }
}

// POST endpoint for students to submit quiz answers
export async function POST(req: NextRequest) {
  try {
    // Get the user session to check if they're authorized
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const { chapterId, answers, timeTaken } = body;

    if (!chapterId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Get the chapter content from the database to check answers
    const content = await db.query.chapterContent.findFirst({
      where: eq(chapterContent.chapterId, chapterId),
    });

    if (!content || !content.quizQuestions) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Parse the quiz questions from JSON
    const quizQuestions = JSON.parse(content.quizQuestions);

    // Calculate score
    let score = 0;
    const totalQuestions = quizQuestions.length;
    const responses = [];

    for (let i = 0; i < Math.min(answers.length, quizQuestions.length); i++) {
      const answer = answers[i];
      const question = quizQuestions[i];
      
      // Check if the answer is correct
      const isCorrect = parseInt(answer) === question.correctAnswer;
      if (isCorrect) {
        score++;
      }
      
      // Store the response
      responses.push({
        questionIndex: i,
        userAnswer: answer,
        isCorrect: isCorrect ? 1 : 0
      });
    }

    // Calculate percentage score
    const percentageScore = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    // Create a new quiz attempt
    const [attemptResult] = await db.insert(quizAttempts).values({
      quizId: parseInt(chapterId.replace('chapter-', '')), // Assuming chapter IDs map to quiz IDs
      userId: parseInt(session.user.id),
      score: percentageScore,
      timeTaken: timeTaken || null,
      completed: 1,
      completedAt: new Date()
    }).returning({ id: quizAttempts.id });

    // Store individual responses if the attempt was created successfully
    if (attemptResult && attemptResult.id) {
      for (const response of responses) {
        await db.insert(quizResponses).values({
          attemptId: attemptResult.id,
          questionId: parseInt(chapterId.replace('chapter-', '')) * 100 + response.questionIndex, // Generate a unique ID
          userAnswer: JSON.stringify(response.userAnswer),
          isCorrect: response.isCorrect
        });
      }
    }

    // Return the quiz results
    return NextResponse.json({
      success: true,
      score: percentageScore,
      correctAnswers: score,
      totalQuestions,
      passingScore: 70 // This could be configurable in the future
    });
  } catch (error) {
    console.error('Error submitting quiz answers:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz answers', details: error.message },
      { status: 500 }
    );
  }
}