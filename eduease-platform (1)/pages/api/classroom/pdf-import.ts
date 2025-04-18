// pages/api/classroom/pdf-import.ts

import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import * as pdfjs from 'pdfjs-dist';
import path from 'path';
import { db } from '@/db'; // Adjust this import to match your db setup
import { chapterContent, mediaFiles } from '@/db/schema'; // Import from your schema
import { eq } from 'drizzle-orm'; // Import the eq operator from drizzle-orm

// Define response type
interface PDFImportResponse {
  success?: boolean;
  title?: string;
  content?: string;
  pageCount?: number;
  chapterId?: string;
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
  res: NextApiResponse<PDFImportResponse>
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

    const pdfFile = files.file as formidable.File;
    const chapterId = Array.isArray(fields.chapterId) 
      ? fields.chapterId[0] 
      : fields.chapterId as string;
    
    if (!pdfFile) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Save the PDF file to a permanent location (e.g., public/uploads)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Create a unique filename
    const uniqueFilename = `${Date.now()}-${pdfFile.originalFilename}`;
    const newPath = path.join(uploadDir, uniqueFilename);
    
    // Copy the file
    fs.copyFileSync(pdfFile.filepath, newPath);
    
    // Store file reference in database
    await db.insert(mediaFiles).values({
      chapterId,
      type: 'pdf',
      filename: pdfFile.originalFilename || 'unnamed.pdf',
      url: `/uploads/${uniqueFilename}`
    });

    // Now process the PDF file content
    const data = fs.readFileSync(pdfFile.filepath);
    const pdfData = new Uint8Array(data);
    
    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    
    // Extract title from the first page (assuming first line is title)
    const firstPage = await pdf.getPage(1);
    const firstPageText = await firstPage.getTextContent();
    const title = firstPageText.items[0]?.str || 'Imported PDF';
    
    // Extract content from all pages
    let fullContent = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullContent += pageText + '\n\n';
    }
    
    // Clean up the content (optional)
    const cleanedContent = fullContent
      .replace(/\s+/g, ' ')
      .trim();
    
    // Generate simplified and detailed versions (basic implementations)
    const simplifiedContent = simplifyContent(cleanedContent);
    const detailedContent = enhanceContent(cleanedContent);
    
    // Extract important words
    const importantWords = extractImportantWords(cleanedContent);
    
    // Check if chapter content already exists
    const existingChapter = await db.query.chapterContent.findFirst({
      where: eq(chapterContent.chapterId, chapterId)
    });
    
    if (existingChapter) {
      // Update existing chapter
      await db.update(chapterContent)
        .set({
          title,
          standardContent: cleanedContent,
          simplifiedContent,
          detailedContent,
          importantWords: JSON.stringify(importantWords),
          updatedAt: new Date()
        })
        .where(eq(chapterContent.chapterId, chapterId));
    } else {
      // Create new chapter
      await db.insert(chapterContent).values({
        chapterId,
        title,
        standardContent: cleanedContent,
        simplifiedContent,
        detailedContent,
        importantWords: JSON.stringify(importantWords),
        quizQuestions: JSON.stringify([]), // Empty array for now
        images: JSON.stringify([]), // Empty array for now
        settings: JSON.stringify({
          enableTTS: true,
          enableEmotionDetection: true,
          enableAdaptiveContent: true,
          enableSignLanguage: false,
          enableVoiceNavigation: false
        })
      });
    }
    
    // Return the extracted data
    return res.status(200).json({
      success: true,
      title,
      content: cleanedContent,
      pageCount: pdf.numPages,
      chapterId
    });
  } catch (error) {
    console.error('PDF processing error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to process PDF file' 
    });
  }
}

// Helper function to simplify content
function simplifyContent(content: string): string {
  if (!content) return "";
  
  // Crude simplification for demonstration
  return content
    .split('. ')
    .slice(0, Math.min(content.split('. ').length, 15)) // Take first 15 sentences or fewer
    .join('. ')
    .replace(/([A-Za-z]{10,})/g, (match) => { // Replace long words with simpler ones when possible
      const simpleWords: Record<string, string> = {
        "fundamental": "basic",
        "structural": "basic",
        "functional": "working",
        "organisms": "living things",
        "microscopic": "tiny",
        "equipment": "parts",
        "specialized": "special",
        "prokaryotic": "simple",
        "eukaryotic": "complex"
      };
      
      return simpleWords[match.toLowerCase()] || match;
    });
}

// Helper function to enhance content
function enhanceContent(content: string): string {
  if (!content) return "";
  
  // Just a crude enhancement for demonstration
  return content + "\n\nAdditional Information: The content above relates to important scientific concepts. Understanding these principles helps build a foundation for more advanced topics in this field.";
}

// Helper function to extract important words
function extractImportantWords(content: string): string[] {
  if (!content) return [];
  
  // Define common science terms to look for
  const scienceTerms = [
    "cell", "biology", "organelle", "nucleus", "membrane", "mitochondria", 
    "prokaryotic", "eukaryotic", "cytoplasm", "ribosome", "chromosome",
    "dna", "rna", "protein", "enzyme", "metabolism", "photosynthesis",
    "respiration", "golgi"
  ];
  
  // Look for these terms in the content
  const foundTerms = scienceTerms.filter(term => 
    new RegExp(`\\b${term}\\b`, 'i').test(content)
  );
  
  return foundTerms.length > 0 ? foundTerms.slice(0, 6) : [];
}