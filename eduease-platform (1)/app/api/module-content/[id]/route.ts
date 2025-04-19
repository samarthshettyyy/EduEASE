import { db } from '@/db'
import { chapterContent } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const moduleId = params.id
  
  if (!moduleId) {
    return NextResponse.json({ error: 'Missing module ID' }, { status: 400 })
  }
  
  try {
    // Query the database for the module content
    const result = await db
      .select()
      .from(chapterContent)
      .where(eq(chapterContent.id, parseInt(moduleId)))
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }
    
    const moduleData = result[0]
    
    // Parse JSON stored as text fields
    const importantWords = moduleData.importantWords ? JSON.parse(moduleData.importantWords) : []
    const quizQuestions = moduleData.quizQuestions ? JSON.parse(moduleData.quizQuestions) : []
    const settings = moduleData.settings ? JSON.parse(moduleData.settings) : {}
    
    // Prepare the data in the format expected by the DocumentViewer
    const response = {
      id: moduleData.id,
      chapterId: moduleData.chapterId,
      title: moduleData.title,
      content: moduleData.standardContent || '',
      
      // Break content into sentences for the document viewer
      sentences: moduleData.standardContent
        ? moduleData.standardContent.split(/(?<=[.!?])\s+/).filter(s => s.trim())
        : [],
        
      // Additional content variations for different learning levels
      simplifiedContent: moduleData.simplifiedContent || '',
      detailedContent: moduleData.detailedContent || '',
      
      // Pass through metadata
      keywords: importantWords,
      quiz: quizQuestions,
      settings: settings,
      
      // Stats for the document viewer
      stats: {
        extraction_method: "database",
        character_count: moduleData.standardContent?.length || 0,
        word_count: moduleData.standardContent?.split(/\s+/).length || 0,
        is_empty: !moduleData.standardContent
      }
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('[GET /api/modules/:id] Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}