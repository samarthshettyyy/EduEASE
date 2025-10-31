// File: /app/api/gemini/process/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// In-memory cache for document contexts
const documentContextCache = new Map<string, DocumentContext>();

interface KeyFact {
  concept: string;
  description: string;
}

interface DocumentContext {
  mainTopics: string[];
  keyFacts: KeyFact[];
  relationships: string[];
  summary: string;
  rawText: string;
  title?: string;
}

interface RequestBody {
  documentText: string;
  documentTitle?: string;
  documentId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { documentText, documentTitle, documentId } = body;

    if (!documentText) {
      return NextResponse.json({ error: 'Document text is required' }, { status: 400 });
    }

    // Generate a unique ID for this document if not provided
    const docId = documentId || `doc_${Date.now()}`;

    // Process the document
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Create a system prompt for document processing
    const prompt = `
    Analyze this document titled "${documentTitle || 'Untitled Document'}" for question answering:

    ${documentText.substring(0, 30000)} ${documentText.length > 30000 ? '...[truncated]' : ''}

    Extract the following:
    1. Main topics and concepts
    2. Key facts and definitions
    3. Important relationships between concepts
    4. Summary (max 3 paragraphs)

    Format your response as structured JSON with these keys:
    - mainTopics (array of strings)
    - keyFacts (array of objects with 'concept' and 'description' keys)
    - relationships (array of strings)
    - summary (string)
    `;

    // Get Gemini's analysis
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    // Extract JSON from response
    let documentContext: DocumentContext;
    try {
      // First try to parse as JSON directly
      documentContext = JSON.parse(textResponse);
    } catch (e) {
      // Try to extract JSON from the text
      const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                        textResponse.match(/{[\s\S]*}/);
                        
      if (jsonMatch) {
        try {
          documentContext = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } catch (err) {
          console.error("Failed to parse JSON from Gemini response:", err);
          // Fall back to raw text
          documentContext = {
            mainTopics: [],
            keyFacts: [],
            relationships: [],
            summary: "Failed to extract structured data from document.",
            rawText: documentText,
          };
        }
      } else {
        // If we couldn't find JSON at all
        documentContext = {
          mainTopics: [],
          keyFacts: [],
          relationships: [],
          summary: "Failed to extract structured data from document.",
          rawText: documentText,
        };
      }
    }

    // Add raw text and title
    documentContext.rawText = documentText;
    documentContext.title = documentTitle;
    
    // Store in cache
    documentContextCache.set(docId, documentContext);
    
    return NextResponse.json({ 
      docId,
      message: 'Document processed successfully',
      topics: documentContext.mainTopics
    });
  } catch (error) {
    console.error('Error processing document:', error);
    return NextResponse.json({ 
      error: 'Failed to process document',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 });
  }
}