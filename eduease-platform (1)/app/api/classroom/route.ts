import { db } from '@/db'
import { classroomContents } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/classroom
export async function POST(req: Request) {
  try {
    const data = await req.json()

    const {
      chapterId,
      title,
      standardContent,
      simplifiedContent,
      detailedContent,
      importantWords,
      quizQuestions,
      settings,
    } = data

    // Validate required fields
    if (!title || !chapterId || !standardContent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Insert into DB
    await db.insert(classroomContents).values({
      chapterId,
      title,
      standardContent,
      simplifiedContent: simplifiedContent ?? '',
      detailedContent: detailedContent ?? '',
      importantWords: importantWords ?? [],
      quiz: quizQuestions ?? [],
      settings: settings ?? {},
    })

    return NextResponse.json({ message: 'Content saved successfully' }, { status: 200 })
  } catch (error) {
    console.error('[POST /api/classroom] Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET /api/classroom?chapterId=xyz
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const chapterId = searchParams.get('chapterId')

  if (!chapterId) {
    return NextResponse.json({ error: 'Missing chapterId' }, { status: 400 })
  }

  try {
    const result = await db
      .select()
      .from(classroomContents)
      .where(eq(classroomContents.chapterId, chapterId))

    if (result.length === 0) {
      return NextResponse.json({ error: 'No content found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('[GET /api/classroom] Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
