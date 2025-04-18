// pages/api/classroom/content.ts
// Update this endpoint to also fetch media files

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db'; // Adjust to match your db setup
import { chapterContent, mediaFiles } from '@/db/schema'; // Import from your schema
import { eq } from 'drizzle-orm';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { chapterId } = req.query;

  if (!chapterId || typeof chapterId !== 'string') {
    return res.status(400).json({ error: 'Chapter ID is required' });
  }

  if (req.method === 'GET') {
    try {
      // Fetch chapter content
      const content = await db.query.chapterContent.findFirst({
        where: eq(chapterContent.chapterId, chapterId)
      });

      // Fetch any associated media files
      const files = await db.query.mediaFiles.findMany({
        where: eq(mediaFiles.chapterId, chapterId)
      });

      // Return the data, handling the case if no content exists
      return res.status(200).json({
        ...(content || {}),
        mediaFiles: files || []
      });
    } catch (error) {
      console.error('Error fetching chapter content:', error);
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch chapter content' 
      });
    }
  } else if (req.method === 'POST') {
    try {
      const contentData = req.body;

      if (!contentData) {
        return res.status(400).json({ error: 'Request body is required' });
      }

      // Prepare data for storage
      const dataToStore = {
        chapterId,
        title: contentData.title || '',
        standardContent: contentData.standardContent || '',
        simplifiedContent: contentData.simplifiedContent || '',
        detailedContent: contentData.detailedContent || '',
        importantWords: JSON.stringify(contentData.importantWords || []),
        quizQuestions: JSON.stringify(contentData.quizQuestions || []),
        images: JSON.stringify(contentData.images || []),
        settings: JSON.stringify(contentData.settings || {
          enableTTS: true,
          enableEmotionDetection: true,
          enableAdaptiveContent: true,
          enableSignLanguage: false,
          enableVoiceNavigation: false
        }),
        updatedAt: new Date()
      };

      // Check if chapter content already exists
      const existingChapter = await db.query.chapterContent.findFirst({
        where: eq(chapterContent.chapterId, chapterId)
      });

      if (existingChapter) {
        // Update existing chapter
        await db.update(chapterContent)
          .set(dataToStore)
          .where(eq(chapterContent.chapterId, chapterId));
      } else {
        // Create new chapter
        await db.insert(chapterContent).values({
          ...dataToStore,
          createdAt: new Date()
        });
      }

      return res.status(200).json({ success: true, message: 'Content saved successfully' });
    } catch (error) {
      console.error('Error saving chapter content:', error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to save chapter content'
      });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}