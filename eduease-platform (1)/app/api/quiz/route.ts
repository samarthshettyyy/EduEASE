import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDluNAD8Ytq_1OkvIP83HUvtPWB023xPJ8');

export async function POST(req: NextRequest) {
  try {
    const { prompt, documentTitle, difficulty, numberOfQuestions } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Configure the generation
    const generationConfig = {
      temperature: 0.7,
      topK: 32,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    // Generate quiz questions
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;
    const textResponse = response.text();

    try {
      // Try to extract JSON from the response
      // The AI might wrap the JSON in markdown code blocks or add explanatory text
      const jsonRegex = /{[\s\S]*}/;
      const jsonMatch = textResponse.match(jsonRegex);
      
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const jsonString = jsonMatch[0];
      const parsedQuiz = JSON.parse(jsonString);
      
      // Validate the response has the expected structure
      if (!parsedQuiz.questions || !Array.isArray(parsedQuiz.questions)) {
        throw new Error('Invalid quiz format returned');
      }
      
      // Ensure we have the right number of questions and they're properly formatted
      const formattedQuestions = parsedQuiz.questions
        .slice(0, numberOfQuestions)
        .map((q, index) => ({
          id: q.id || `q${index + 1}`,
          question: q.question,
          options: Array.isArray(q.options) ? q.options.map((opt, idx) => ({
            id: opt.id || String.fromCharCode(97 + idx), // a, b, c, d if not provided
            text: opt.text
          })).slice(0, 4) : [], // Ensure max 4 options
          correctAnswerId: q.correctAnswerId,
          explanation: q.explanation || "Correct answer based on the text."
        }));
      
      // Store the quiz in the database (optional)
      // await db.insert(quizzes).values({
      //   documentTitle,
      //   difficulty,
      //   questions: JSON.stringify(formattedQuestions),
      //   createdAt: new Date()
      // });
      
      return NextResponse.json({ 
        questions: formattedQuestions,
        metadata: {
          documentTitle,
          difficulty,
          generatedAt: new Date().toISOString()
        }
      });
      
    } catch (jsonError) {
      console.error('Error parsing AI response:', jsonError);
      console.log('Raw AI response:', textResponse);
      
      // Fallback: Create a simple quiz with generic questions
      const fallbackQuestions = generateFallbackQuestions(numberOfQuestions, documentTitle);
      
      return NextResponse.json({ 
        questions: fallbackQuestions,
        metadata: {
          documentTitle,
          difficulty,
          generatedAt: new Date().toISOString(),
          isAutomaticFallback: true
        }
      });
    }
    
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate quiz' }, 
      { status: 500 }
    );
  }
}

// Fallback function to generate generic questions if AI generation fails
function generateFallbackQuestions(count: number, title: string) {
  const genericQuestions = [
    {
      id: 'q1',
      question: `What is the main topic of "${title}"?`,
      options: [
        { id: 'a', text: 'The document covers this topic specifically' },
        { id: 'b', text: 'The document is about a related but different subject' },
        { id: 'c', text: 'The document does not address this topic' },
        { id: 'd', text: 'The document only briefly mentions this topic' }
      ],
      correctAnswerId: 'a',
      explanation: 'The document focuses primarily on this specific topic.'
    },
    {
      id: 'q2',
      question: 'Which of the following best describes the content structure?',
      options: [
        { id: 'a', text: 'Chronological narrative' },
        { id: 'b', text: 'Comparison of concepts' },
        { id: 'c', text: 'Explanation of processes' },
        { id: 'd', text: 'Problem and solution analysis' }
      ],
      correctAnswerId: 'c',
      explanation: 'The document primarily explains processes related to the topic.'
    },
    {
      id: 'q3',
      question: 'Based on the document, which statement is most accurate?',
      options: [
        { id: 'a', text: 'The topic is well-established with little debate' },
        { id: 'b', text: 'The topic is controversial with multiple viewpoints' },
        { id: 'c', text: 'The topic is still developing with new research' },
        { id: 'd', text: 'The topic is theoretical with limited practical applications' }
      ],
      correctAnswerId: 'a',
      explanation: 'The document presents the topic as well-established.'
    },
    {
      id: 'q4',
      question: 'Which audience would benefit most from this document?',
      options: [
        { id: 'a', text: 'Advanced experts in the field' },
        { id: 'b', text: 'Students learning the basics' },
        { id: 'c', text: 'General public with casual interest' },
        { id: 'd', text: 'Professionals applying concepts' }
      ],
      correctAnswerId: 'b',
      explanation: 'The document appears to be educational and suitable for students.'
    },
    {
      id: 'q5',
      question: 'What is the primary purpose of this document?',
      options: [
        { id: 'a', text: 'To entertain the reader' },
        { id: 'b', text: 'To inform about key concepts' },
        { id: 'c', text: 'To persuade on a position' },
        { id: 'd', text: 'To critique existing ideas' }
      ],
      correctAnswerId: 'b',
      explanation: 'The document primarily aims to inform readers about key concepts.'
    }
  ];
  
  return genericQuestions.slice(0, count);
}