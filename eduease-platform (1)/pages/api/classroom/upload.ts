// pages/api/classroom/upload.ts

import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { db } from '@/db'; // Adjust to match your db setup
import { mediaFiles } from '@/db/schema'; // Import from your schema

// Define response type
interface UploadResponse {
  success?: boolean;
  id?: number;
  url?: string;
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
    
    const { fields, files }: { 
      fields: formidable.Fields; 
      files: formidable.Files;
    } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const file = files.file as formidable.File;
    const chapterId = Array.isArray(fields.chapterId) 
      ? fields.chapterId[0] 
      : fields.chapterId as string;
    
    const fileType = Array.isArray(fields.type)
      ? fields.type[0]
      : fields.type as string;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Generate a unique filename
    const fileExtension = path.extname(file.originalFilename || 'file');
    const uniqueFilename = `${Date.now()}-${Math.floor(Math.random() * 10000)}${fileExtension}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    
    // Copy the file to the uploads directory
    fs.copyFileSync(file.filepath, filePath);
    
    // Create the URL path for the file
    const fileUrl = `/uploads/${uniqueFilename}`;
    
    // Store file reference in database
    const result = await db.insert(mediaFiles).values({
      chapterId,
      type: fileType,
      filename: file.originalFilename || 'unnamed-file',
      url: fileUrl
    });
    
    // Get the inserted ID
    const insertedId = result.insertId;
    
    // Return success response
    return res.status(200).json({
      success: true,
      id: insertedId,
      url: fileUrl
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to upload file' 
    });
  }
}