// components/AIQuizGenerator.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader, RefreshCw, Send, CheckCircle, XCircle, AlertTriangle, Brain } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswerId: string;
  explanation: string;
}

interface AIQuizGeneratorProps {
  documentText: string;
  documentTitle: string;
  numberOfQuestions?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  onQuizComplete?: (score: number, totalQuestions: number) => void;
}

const AIQuizGenerator: React.FC<AIQuizGeneratorProps> = ({
  documentText,
  documentTitle,
  numberOfQuestions = 5,
  difficulty = 'medium',
  onQuizComplete
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const generateQuiz = async () => {
    if (!documentText || documentText.trim().length < 50) {
      setError("Document text is too short to generate a meaningful quiz.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setQuestions([]);
    setSelectedAnswers({});
    setSubmittedAnswers({});
    setIsQuizComplete(false);
    setScore(0);
    setShowExplanation({});

    try {
      // Text to send to the Gemini API
      const prompt = `
      Generate a multiple-choice quiz based on the following text. 
      Create exactly ${numberOfQuestions} questions of ${difficulty} difficulty level.
      
      Text: ${documentText.substring(0, 5000)}
      
      Format the response as valid JSON with the following structure:
      {
        "questions": [
          {
            "id": "q1",
            "question": "Question text goes here?",
            "options": [
              { "id": "a", "text": "First option" },
              { "id": "b", "text": "Second option" },
              { "id": "c", "text": "Third option" },
              { "id": "d", "text": "Fourth option" }
            ],
            "correctAnswerId": "b",
            "explanation": "Brief explanation of the correct answer"
          },
          // more questions...
        ]
      }
      
      Make sure that:
      1. Questions are directly related to the text
      2. Questions have varying levels of complexity
      3. Each question has exactly 4 options
      4. All options for a question are different
      5. All JSON is valid with no errors
      `;

      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          documentTitle,
          difficulty,
          numberOfQuestions
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const data = await response.json();
      
      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('Invalid quiz data returned from AI');
      }

      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError(err instanceof Error ? err.message : 'Unknown error generating quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Generate quiz automatically when component mounts and document text is available
    if (documentText && documentText.length > 0) {
      generateQuiz();
    }
  }, []);

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmitAnswer = (questionId: string) => {
    const selectedAnswer = selectedAnswers[questionId];
    const currentQuestion = questions.find(q => q.id === questionId);
    
    if (!selectedAnswer || !currentQuestion) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswerId;
    
    setSubmittedAnswers(prev => ({
      ...prev,
      [questionId]: isCorrect
    }));
    
    setShowExplanation(prev => ({
      ...prev,
      [questionId]: true
    }));
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsQuizComplete(true);
      if (onQuizComplete) {
        onQuizComplete(score, questions.length);
      }
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setSubmittedAnswers({});
    setCurrentQuestionIndex(0);
    setIsQuizComplete(false);
    setScore(0);
    setShowExplanation({});
  };

  if (isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Generating Quiz...
          </CardTitle>
          <CardDescription>
            Creating intelligent questions based on the document content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-center w-full">
            <Loader className="h-5 w-5 mr-2 animate-spin" />
            <span>This may take a moment...</span>
          </div>
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Error Generating Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={generateQuiz}>
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isQuizComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Completed!</CardTitle>
          <CardDescription>
            Your score: {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-center">
            {score === questions.length ? (
              <div className="flex flex-col items-center text-green-500">
                <CheckCircle className="h-16 w-16 mb-2" />
                <p className="text-lg font-medium">Perfect Score! Great job!</p>
              </div>
            ) : score >= questions.length * 0.7 ? (
              <div className="flex flex-col items-center text-green-500">
                <CheckCircle className="h-16 w-16 mb-2" />
                <p className="text-lg font-medium">Well done!</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-amber-500">
                <AlertTriangle className="h-16 w-16 mb-2" />
                <p className="text-lg font-medium">Good effort! Review the material and try again.</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4 mt-6">
            <Button 
              onClick={resetQuiz} 
              variant="outline" 
              className="mr-2"
            >
              Review Questions
            </Button>
            <Button onClick={generateQuiz}>
              <RefreshCw className="h-4 w-4 mr-2" /> Generate New Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Generated Quiz
          </CardTitle>
          <CardDescription>Test your knowledge with AI-generated questions</CardDescription>
        </CardHeader>
        <CardContent className="text-center pt-4">
          <p className="mb-4">No questions available. Generate a quiz to begin.</p>
          <Button onClick={generateQuiz}>
            <Brain className="h-4 w-4 mr-2" /> Generate Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = !!submittedAnswers[currentQuestion.id];
  const isCorrect = submittedAnswers[currentQuestion.id];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Quiz: {documentTitle}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <CardDescription>Generated based on document content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div>
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
          
          <RadioGroup 
            value={selectedAnswers[currentQuestion.id]}
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
            disabled={isAnswered}
            className="space-y-3"
          >
            {currentQuestion.options.map(option => (
              <div 
                key={option.id}
                className={`flex items-center space-x-2 p-3 rounded-lg border ${
                  isAnswered && option.id === currentQuestion.correctAnswerId 
                    ? 'border-green-500 bg-green-50' 
                    : isAnswered && selectedAnswers[currentQuestion.id] === option.id && !isCorrect
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                }`}
              >
                <RadioGroupItem 
                  value={option.id} 
                  id={`option-${currentQuestion.id}-${option.id}`} 
                  disabled={isAnswered}
                />
                <Label 
                  htmlFor={`option-${currentQuestion.id}-${option.id}`}
                  className="flex-1 cursor-pointer"
                >
                  {option.text}
                </Label>
                {isAnswered && option.id === currentQuestion.correctAnswerId && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {isAnswered && selectedAnswers[currentQuestion.id] === option.id && !isCorrect && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </RadioGroup>
          
          {showExplanation[currentQuestion.id] && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-1">Explanation:</h4>
              <p className="text-blue-600 text-sm">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Difficulty: <span className="font-medium">{difficulty}</span>
        </div>
        <div className="space-x-2">
          {!isAnswered ? (
            <Button 
              onClick={() => handleSubmitAnswer(currentQuestion.id)}
              disabled={!selectedAnswers[currentQuestion.id]}
            >
              <Send className="h-4 w-4 mr-2" /> Submit
            </Button>
          ) : (
            <Button 
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIQuizGenerator;