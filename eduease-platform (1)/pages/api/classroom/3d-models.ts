// pages/api/classroom/3d-models.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db'; // Adjust to match your db setup
import { module3DModels } from '@/db/schema'; // Import from your schema
import { eq } from 'drizzle-orm';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { chapterId, modelId } = req.query;

  // For fetching 3D models associated with a chapter
  if (req.method === 'GET') {
    try {
      // If modelId is provided, fetch a specific model
      if (modelId) {
        const model = await db.query.module3DModels.findFirst({
          where: eq(module3DModels.id, parseInt(modelId as string))
        });

        if (!model) {
          return res.status(404).json({ error: 'Model not found' });
        }

        return res.status(200).json(model);
      }
      
      // Otherwise, fetch all models for the chapter
      if (!chapterId) {
        return res.status(400).json({ error: 'Chapter ID is required' });
      }

      const moduleId = parseInt(chapterId as string);
      
      // If moduleId is not a valid number, return empty array
      if (isNaN(moduleId)) {
        return res.status(200).json([]);
      }

      const models = await db.query.module3DModels.findMany({
        where: eq(module3DModels.moduleId, moduleId)
      });

      return res.status(200).json(models);
    } catch (error) {
      console.error('Error fetching 3D models:', error);
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch 3D models' 
      });
    }
  }
  
  // For updating a 3D model
  else if (req.method === 'PUT') {
    try {
      if (!modelId) {
        return res.status(400).json({ error: 'Model ID is required' });
      }

      const modelData = req.body;
      
      if (!modelData) {
        return res.status(400).json({ error: 'Request body is required' });
      }

      // Update the model
      await db.update(module3DModels)
        .set({
          title: modelData.title,
          description: modelData.description,
          // Only update these if provided
          ...(modelData.modelPath && { modelPath: modelData.modelPath }),
          ...(modelData.thumbnailPath && { thumbnailPath: modelData.thumbnailPath }),
          ...(modelData.format && { format: modelData.format })
        })
        .where(eq(module3DModels.id, parseInt(modelId as string)));

      return res.status(200).json({ success: true, message: 'Model updated successfully' });
    } catch (error) {
      console.error('Error updating 3D model:', error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to update 3D model'
      });
    }
  }
  
  // For deleting a 3D model
  else if (req.method === 'DELETE') {
    try {
      if (!modelId) {
        return res.status(400).json({ error: 'Model ID is required' });
      }

      // Delete the model
      await db.delete(module3DModels)
        .where(eq(module3DModels.id, parseInt(modelId as string)));

      return res.status(200).json({ success: true, message: 'Model deleted successfully' });
    } catch (error) {
      console.error('Error deleting 3D model:', error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to delete 3D model'
      });
    }
  }
  
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}