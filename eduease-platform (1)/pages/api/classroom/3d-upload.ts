// pages/api/classroom/3d-upload.ts
// This is an improved version of your API endpoint

import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { db } from '@/db'; // Adjust to match your db setup
import { mediaFiles, module3DModels } from '@/db/schema'; // Import from your schema

// Define response type
interface UploadResponse {
  success?: boolean;
  id?: string; // Changed to string to be consistent
  url?: string;
  thumbnailUrl?: string;
  error?: string;
}

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<UploadResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the multipart form data
    const form = new formidable.IncomingForm();
    form.keepExtensions = true; // Keep file extensions
    
    const { fields, files }: { 
      fields: formidable.Fields; 
      files: formidable.Files;
    } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const modelFile = files.file as formidable.File;
    const thumbnailFile = files.thumbnail as formidable.File;
    
    const chapterId = Array.isArray(fields.chapterId) 
      ? fields.chapterId[0] 
      : fields.chapterId as string;
    
    const title = Array.isArray(fields.title)
      ? fields.title[0]
      : fields.title as string || 'New 3D Model';
    
    const description = Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description as string || '';
    
    if (!modelFile) {
      return res.status(400).json({ error: 'No model file uploaded' });
    }

    console.log("Processing 3D model upload:", modelFile.originalFilename);

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', '3d-models');
    const thumbnailDir = path.join(process.cwd(), 'public', 'uploads', 'thumbnails');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }
    
    // Generate a unique filename for the model
    const fileExtension = path.extname(modelFile.originalFilename || '.glb').toLowerCase();
    const uniqueFilename = `${Date.now()}-${Math.floor(Math.random() * 10000)}${fileExtension}`;
    const modelPath = path.join(uploadDir, uniqueFilename);
    
    // Copy the model file
    await fs.promises.copyFile(modelFile.filepath, modelPath);
    console.log("Model file saved to:", modelPath);
    
    // The URL path for the model (this is critical for the frontend to load the model)
    const modelUrl = `/uploads/3d-models/${uniqueFilename}`;
    
    // Handle thumbnail if provided
    let thumbnailUrl = '';
    if (thumbnailFile) {
      const thumbExtension = path.extname(thumbnailFile.originalFilename || '.jpg').toLowerCase();
      const thumbFilename = `${Date.now()}-thumb-${Math.floor(Math.random() * 10000)}${thumbExtension}`;
      const thumbPath = path.join(thumbnailDir, thumbFilename);
      
      await fs.promises.copyFile(thumbnailFile.filepath, thumbPath);
      thumbnailUrl = `/uploads/thumbnails/${thumbFilename}`;
    }
    
    // Get the format from file extension
    const format = fileExtension.replace('.', '').toLowerCase();
    
    // Store in database - first in mediaFiles
    const mediaResult = await db.insert(mediaFiles).values({
      chapterId,
      type: '3d',
      filename: modelFile.originalFilename || 'model.glb',
      url: modelUrl
    });
    
    // Generate a model ID
    const modelId = `3d-${Date.now()}`;
    
    // Also store in module3DModels if the table exists
    try {
      await db.insert(module3DModels).values({
        moduleId: parseInt(chapterId),
        title,
        description,
        modelPath: modelUrl,
        thumbnailPath: thumbnailUrl || null,
        format
      });
    } catch (dbError) {
      console.warn("Could not insert into module3DModels, continuing with mediaFiles only:", dbError);
    }
    
    // Return success response with important debugging info
    console.log("Model upload successful, returning URL:", modelUrl);
    return res.status(200).json({
      success: true,
      id: modelId,
      url: modelUrl,
      thumbnailUrl: thumbnailUrl
    });
  } catch (error) {
    console.error('3D model upload error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to upload 3D model' 
    });
  }
}