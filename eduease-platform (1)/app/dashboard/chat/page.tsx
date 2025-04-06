"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, Send, User, Bot, Volume2 } from "lucide-react"

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

      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
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

  return (
    <div className="container mx-auto max-w-4xl">
      <Card className="h-[calc(100vh-2rem)]">
        <CardHeader>
          <CardTitle>AI Learning Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-4 pr-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex max-w-[80%] items-start gap-2 rounded-lg px-4 py-2 ${
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.sender === "assistant" && <Bot className="mt-1 h-5 w-5 shrink-0" />}
                    <div className="flex-1">
                      <p>{message.content}</p>
                      <div className="mt-1 flex items-center justify-end gap-2">
                        {message.sender === "assistant" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => speakMessage(message.content)}
                          >
                            <Volume2 className="h-3 w-3" />
                            <span className="sr-only">Read aloud</span>
                          </Button>
                        )}
                        <span className="text-xs opacity-50">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    {message.sender === "user" && <User className="mt-1 h-5 w-5 shrink-0" />}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleRecording}
              className={isRecording ? "animate-pulse bg-red-100" : ""}
            >
              <Mic className={isRecording ? "text-red-500" : ""} />
              <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
            </Button>
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 font-lexend"
            />
            <Button onClick={handleSend} disabled={!input.trim()}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

