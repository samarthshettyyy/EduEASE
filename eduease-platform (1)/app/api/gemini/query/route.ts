// File: /app/api/gemini/query/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDluNAD8Ytq_1OkvIP83HUvtPWB023xPJ8');

// In-memory cache for document contexts (in production, use Redis or similar)
const documentContextCache = new Map<string, DocumentContext>();

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

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
  query: string;
  documentId?: string;
  documentText?: string;
  documentTitle?: string;
  conversationHistory?: Message[];
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { query, documentId, documentText, documentTitle, conversationHistory = [] } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Check if we need to process a new document or use cached context
    let documentContext: DocumentContext;
    if (documentId && documentContextCache.has(documentId)) {
      documentContext = documentContextCache.get(documentId)!;
    } else if (documentText) {
      // Process new document
      documentContext = await processDocument(documentText, documentTitle);
      
      // Cache the context if we have a documentId
      if (documentId) {
        documentContextCache.set(documentId, documentContext);
      }
    } else {
      return NextResponse.json({ error: 'Either documentId or documentText is required' }, { status: 400 });
    }

    // Generate response based on document context and query
    const response = await generateResponse(query, documentContext, conversationHistory);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in Gemini API:', error);
    return NextResponse.json({ 
      error: 'Failed to process your request',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 });
  }
}

/**
 * Process a document to extract key information and prepare it for Q&A
 */
async function processDocument(documentText: string, documentTitle?: string): Promise<DocumentContext> {
  // Initialize Gemini model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Create a system prompt for document processing
  const prompt = `
  I need you to analyze this document titled "${documentTitle || 'Untitled Document'}" for question answering:

  ${documentText.substring(0, 30000)} ${documentText.length > 30000 ? '...[truncated]' : ''}

  Extract the following information:
  1. Main topics and concepts
  2. Key facts and definitions
  3. Important relationships between concepts
  4. Summary of the document (max 3 paragraphs)

  Format your response as structured JSON with the following keys:
  - mainTopics (array of strings)
  - keyFacts (array of objects with 'concept' and 'description' keys)
  - relationships (array of strings describing relationships)
  - summary (string)
  `;

  // Get Gemini's analysis of the document
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const textResponse = response.text();
  
  // Extract JSON from response
  // Note: Gemini might not always return perfect JSON, so we need to handle errors
  try {
    // First try to parse the response as JSON directly
    let extractedData = JSON.parse(textResponse);
    return {
      ...extractedData,
      rawText: documentText,
      title: documentTitle
    };
  } catch (e) {
    // If it's not valid JSON, try to extract JSON from the text
    const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                      textResponse.match(/{[\s\S]*}/);
                      
    if (jsonMatch) {
      try {
        let extractedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        return {
          ...extractedData,
          rawText: documentText,
          title: documentTitle
        };
      } catch (err) {
        console.error("Failed to parse JSON from Gemini response:", err);
      }
    }
    
    // Fall back to raw text
    return {
      mainTopics: [],
      keyFacts: [],
      relationships: [],
      summary: "Failed to extract structured data from document.",
      rawText: documentText,
      title: documentTitle
    };
  }
}

/**
 * Generate a response to the user's query based on document context
 */
async function generateResponse(query: string, documentContext: DocumentContext, conversationHistory: Message[]): Promise<string> {
  // Initialize Gemini model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  // Create chat history from conversation history
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [`I'll be asking questions about this document titled "${documentContext.title || 'Untitled Document'}". 
                Here's a summary of the document:
                ${documentContext.summary}
                
                Key topics include: ${documentContext.mainTopics.join(', ')}
                
                Please answer my questions based only on the information in this document.`]
      },
      {
        role: "model",
        parts: ["I'll answer your questions based on the document you've shared. What would you like to know?"]
      },
      // Add previous conversation turns if available
      ...conversationHistory.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [msg.content]
      }))
    ]
  });
  
  // Send the user's query
  const result = await chat.sendMessage(query);
  const response = await result.response;
  
  return response.text();
}