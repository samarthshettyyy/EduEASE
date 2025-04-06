"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

const assessmentQuestions = [
  {
    id: "q1",
    question: "How do you prefer to learn new information?",
    options: [
      { id: "a", text: "By reading text" },
      { id: "b", text: "By listening to audio" },
      { id: "c", text: "By watching videos" },
      { id: "d", text: "By interactive activities" },
    ],
  },
  {
    id: "q2",
    question: "Which font style is easiest for you to read?",
    options: [
      { id: "a", text: "Standard fonts (like Times New Roman)" },
      { id: "b", text: "Sans-serif fonts (like Arial)" },
      { id: "c", text: "Dyslexia-friendly fonts (like OpenDyslexic)" },
      { id: "d", text: "Larger text with any font" },
    ],
  },
  {
    id: "q3",
    question: "How long can you typically focus on a learning task?",
    options: [
      { id: "a", text: "Less than 10 minutes" },
      { id: "b", text: "10-20 minutes" },
      { id: "c", text: "20-30 minutes" },
      { id: "d", text: "More than 30 minutes" },
    ],
  },
  {
    id: "q4",
    question: "What helps you understand complex concepts best?",
    options: [
      { id: "a", text: "Step-by-step written instructions" },
      { id: "b", text: "Visual diagrams and charts" },
      { id: "c", text: "Examples and analogies" },
      { id: "d", text: "Hands-on practice" },
    ],
  },
  {
    id: "q5",
    question: "What type of environment helps you learn best?",
    options: [
      { id: "a", text: "Quiet with minimal distractions" },
      { id: "b", text: "With soft background music" },
      { id: "c", text: "In a group setting" },
      { id: "d", text: "With regular breaks and movement" },
    ],
  },
]

export default function AssessmentPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleNext = () => {
    if (!selectedOption) {
      toast({
        title: "Please select an option",
        description: "You need to select an answer before proceeding.",
        variant: "destructive",
      })
      return
    }

    const newAnswers = { ...answers, [assessmentQuestions[currentQuestion].id]: selectedOption }
    setAnswers(newAnswers)

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
    } else {
      // Assessment complete
      toast({
        title: "Assessment complete",
        description: "Your learning profile has been created.",
      })

      // In a real app, you would send the answers to your backend
      console.log("Assessment answers:", newAnswers)

      // Navigate to dashboard
      router.push("/dashboard")
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedOption(answers[assessmentQuestions[currentQuestion - 1].id] || null)
    }
  }

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Initial Learning Assessment</CardTitle>
          <CardDescription>Help us understand your learning preferences to personalize your experience</CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              Question {currentQuestion + 1} of {assessmentQuestions.length}
            </h3>
            <p className="text-base">{assessmentQuestions[currentQuestion].question}</p>
          </div>

          <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} className="space-y-3">
            {assessmentQuestions[currentQuestion].options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="font-normal">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>
          <Button onClick={handleNext}>
            {currentQuestion < assessmentQuestions.length - 1 ? "Next" : "Complete Assessment"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

