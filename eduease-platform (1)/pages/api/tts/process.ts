// pages/api/tts/process.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import { promisify } from 'util';

// Define Session Data interface
interface SessionData {
  filename: string;
  processed_text: {
    full_text: string;
    sentences: string[];
  };
  important_words: string[];
}

// Define API Response types
interface SuccessResponse {
  success: true;
  session_id: string;
  filename: string;
  text: string;
  sentences: string[];
  important_words: string[];
}

interface ErrorResponse {
  error: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

// Configure API to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// In-memory storage for session data
// In a production app, you would use a database
const sessionData: Record<string, SessionData> = {};

// Convert exec to Promise-based
const execPromise = promisify(exec);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method === 'POST') {
    try {
      // Use formidable directly with promise
      const form = formidable({});
      
      // Parse the form
      const [fields, files] = await form.parse(req);
      
      // Get the uploaded file - note the different access pattern
      const uploadedFiles = files.file;
      
      if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const uploadedFile = uploadedFiles[0];
      const filePath = uploadedFile.filepath;
      const fileName = uploadedFile.originalFilename || 'unknown.txt';
      const fileType = fileName.split('.').pop()?.toLowerCase();
      
      // Check if file type is allowed
      if (!['txt', 'pdf', 'docx'].includes(fileType || '')) {
        return res.status(400).json({ error: 'File type not allowed' });
      }
      
      // Generate session ID
      const sessionId = uuidv4();
      
      try {
        // Run Python script to process the file
        const pythonScriptPath = path.join(process.cwd(), 'scripts', 'process_text.py');
        
        const { stdout } = await execPromise(`python ${pythonScriptPath} "${filePath}" "${fileName}"`);
        
        const processedData = JSON.parse(stdout);
        
        // Store in session data
        sessionData[sessionId] = {
          filename: fileName,
          processed_text: processedData,
          important_words: processedData.important_words
        };
        
        // Return the processed data with session ID
        return res.status(200).json({
          success: true,
          session_id: sessionId,
          filename: fileName,
          text: processedData.full_text,
          sentences: processedData.sentences,
          important_words: processedData.important_words
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ error: `Error processing file: ${errorMessage}` });
      } finally {
        // Clean up the uploaded file
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error('Failed to clean up file:', e);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'File upload failed';
      return res.status(500).json({ error: errorMessage });
    }
  } else if (req.method === 'GET' && req.query.session_id) {
    // Retrieve session data if it exists
    const sessionId = req.query.session_id as string;
    if (sessionData[sessionId]) {
      const data = sessionData[sessionId];
      return res.status(200).json({
        success: true,
        session_id: sessionId,
        filename: data.filename,
        text: data.processed_text.full_text,
        sentences: data.processed_text.sentences,
        important_words: data.important_words
      });
    } else {
      return res.status(404).json({ error: 'Session not found' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}