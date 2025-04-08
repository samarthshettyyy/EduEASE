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
  extraction_stats?: {
    extraction_method: string;
    character_count: number;
    word_count: number;
    is_empty: boolean;
  };
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
        // Check if Python script exists
        const scriptDir = path.join(process.cwd(), 'scripts');
        const pythonScriptPath = path.join(scriptDir, 'process_text.py');
        
        if (!fs.existsSync(pythonScriptPath)) {
          return res.status(500).json({ 
            error: `Python script not found at: ${pythonScriptPath}` 
          });
        }
        
        // Create a mock response if the Python script fails
        // This is a fallback when the script execution environment has issues
        const mockProcessedData = createMockResponse(fileName);
        
        try {
          // Run Python script to process the file
          // Use double quotes around paths to handle spaces
          // And specify that we only want stdout, not stderr
          const command = `python "${pythonScriptPath}" "${filePath}" "${fileName}"`;
          console.log(`Executing command: ${command}`);
          
          const { stdout, stderr } = await execPromise(command);
          
          if (stderr) {
            console.error('Python script stderr:', stderr);
          }
          
          // Extract JSON from stdout - remove any non-JSON output that might precede it
          let jsonOutput = stdout.trim();
          
          // Find the first '{' character which should be the start of our JSON
          const jsonStartIndex = jsonOutput.indexOf('{');
          if (jsonStartIndex > 0) {
            jsonOutput = jsonOutput.substring(jsonStartIndex);
          }
          
          try {
            // Try parsing the cleaned output
            const processedData = JSON.parse(jsonOutput);
            
            // Store in session data
            sessionData[sessionId] = {
              filename: fileName,
              processed_text: {
                full_text: processedData.full_text,
                sentences: processedData.sentences
              },
              important_words: processedData.important_words || []
            };
            
            // Return the processed data with session ID
            return res.status(200).json({
              success: true,
              session_id: sessionId,
              filename: fileName,
              text: processedData.full_text,
              sentences: processedData.sentences,
              important_words: processedData.important_words || [],
              extraction_stats: processedData.extraction_stats
            });
          } catch (jsonError) {
            console.error('JSON parsing error:', jsonError);
            console.error('Raw stdout:', stdout);
            
            // Fall back to the mock data
            throw new Error(`Failed to parse Python script output: ${jsonError.message}`);
          }
        } catch (scriptError) {
          console.error('Script execution error:', scriptError);
          
          // Use mock data as fallback
          sessionData[sessionId] = {
            filename: fileName,
            processed_text: {
              full_text: mockProcessedData.full_text,
              sentences: mockProcessedData.sentences
            },
            important_words: mockProcessedData.important_words
          };
          
          // Return the mock data with session ID
          return res.status(200).json({
            success: true,
            session_id: sessionId,
            filename: fileName,
            text: mockProcessedData.full_text,
            sentences: mockProcessedData.sentences,
            important_words: mockProcessedData.important_words,
            extraction_stats: {
              extraction_method: "fallback",
              character_count: mockProcessedData.full_text.length,
              word_count: mockProcessedData.full_text.split(/\s+/).length,
              is_empty: false
            }
          });
        }
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

// Function to create mock response when Python processing fails
function createMockResponse(fileName: string) {
  const baseText = "This is a sample text that will be used as a fallback when the Python script fails to process the document. " +
    "The file processing system encountered an error with the Python script execution. " +
    "This could be due to Python not being installed, missing dependencies, or path issues. " +
    "You can still use the TTS reader with this sample text while you fix the backend processing.";
  
  // Split into sentences
  const sentences = baseText.split('. ').map(s => s.trim() + '.');
  
  // Create some mock important words
  const important_words = ['sample', 'processing', 'Python', 'document', 'system'];
  
  return {
    full_text: baseText,
    sentences: sentences,
    important_words: important_words
  };
}