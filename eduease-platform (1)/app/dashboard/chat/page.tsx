"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, Send, User, Bot, Volume2, ArrowLeft, Lightbulb, Zap } from "lucide-react"
import Link from "next/link"

type Message = {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI learning assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help explain that concept in a simpler way. Let me break it down for you.",
        "That's a great question! Here's how you can approach this problem.",
        "Would you like me to provide some visual examples to help you understand?",
        "I notice you might be struggling with this topic. Let's try a different approach.",
        "You're making excellent progress! Let's continue building on what you've learned.",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "assistant",
        timestamp: new Date(),
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, assistantMessage])
    }, 1500)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)

    // Simulate voice recognition
    if (!isRecording) {
      setTimeout(() => {
        setInput("Can you help me understand fractions better?")
        setIsRecording(false)
      }, 2000)
    }
  }

  const speakMessage = (text: string) => {
    // In a real app, this would use the Web Speech API
    console.log("Speaking:", text)
    // Example implementation:
    // const speech = new SpeechSynthesisUtterance(text)
    // window.speechSynthesis.speak(speech)
  }

  const suggestedQuestions = [
    "Can you explain fractions in a simple way?",
    "How do I solve word problems?",
    "Help me understand photosynthesis",
    "What are some reading comprehension strategies?"
  ]

  return (
    <div className="container mx-auto max-w-4xl">
      <Card className="h-[calc(100vh-2rem)] bg-white border-blue-100 shadow-md">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Back to Dashboard</span>
            </Link>
            <CardTitle className="flex items-center">
              <Bot className="mr-2 h-5 w-5 text-primary" />
              AI Learning Assistant
            </CardTitle>
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden pt-6">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-6 pr-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex max-w-[80%] items-start gap-3 rounded-2xl px-4 py-3 ${
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-blue-50 border border-blue-100"
                    }`}
                  >
                    {message.sender === "assistant" && (
                      <div className="bg-white border border-blue-100 rounded-full p-1 mt-1">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="leading-relaxed">{message.content}</p>
                      <div className="mt-2 flex items-center justify-end gap-2">
                        {message.sender === "assistant" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-blue-100"
                            onClick={() => speakMessage(message.content)}
                          >
                            <Volume2 className="h-3.5 w-3.5 text-primary" />
                            <span className="sr-only">Read aloud</span>
                          </Button>
                        )}
                        <span className="text-xs opacity-60">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    {message.sender === "user" && (
                      <div className="bg-white border border-blue-100 rounded-full p-1 mt-1">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] items-start gap-3 rounded-2xl px-4 py-3 bg-blue-50 border border-blue-100">
                    <div className="bg-white border border-blue-100 rounded-full p-1 mt-1">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex space-x-1 p-1">
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <div className="border rounded-xl p-4 bg-blue-50/50">
              <div className="flex items-center mb-3">
                <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
                <h3 className="font-medium">Try asking me about...</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="justify-start border-blue-100 hover:border-primary text-left h-auto py-2.5"
                    onClick={() => {
                      setInput(question);
                    }}
                  >
                    <Zap className="h-4 w-4 mr-2 text-primary" />
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <CardFooter className="border-t">
          <div className="flex w-full items-center space-x-2 pt-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleRecording}
              className={`border-blue-100 ${isRecording ? "animate-pulse bg-red-50 border-red-200" : ""}`}
            >
              <Mic className={isRecording ? "text-red-500" : "text-primary"} />
              <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
            </Button>
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 font-lexend border-blue-100 focus:border-primary/60"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim()} 
              className="bg-primary hover:bg-primary/90 focus:bg-primary/90"
            >
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}