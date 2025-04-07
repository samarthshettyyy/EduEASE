"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, Square, X } from "lucide-react"

interface VoiceAssistantWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceAssistantWidget({ isOpen, onClose }: VoiceAssistantWidgetProps) {
  const [isListening, setIsListening] = useState(false)
  const [responseText, setResponseText] = useState("Ready to assist you")
  const [conversationHistory, setConversationHistory] = useState<{user: string, ai: string}[]>([])
  const recognitionRef = useRef<any>(null)
  const historyEndRef = useRef<HTMLDivElement | null>(null)

  // Function to stop speech recognition
  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      // Also stop any ongoing speech synthesis
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }

  useEffect(() => {
    // Initialize the Web Speech API when component mounts
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false

        recognitionRef.current.onstart = () => {
          setResponseText("Listening...")
          setIsListening(true)
        }

        recognitionRef.current.onspeechend = () => {
          if (recognitionRef.current) {
            recognitionRef.current.stop()
          }
          setIsListening(false)
        }

        recognitionRef.current.onresult = (event: any) => {
          // Type assertion to handle the transcript access
          const userInput = event.results[0][0].transcript
          setResponseText("Processing...")

          // Make API call to your Flask backend
          processVoiceInput(userInput)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
          setResponseText("Error. Please try again.")
          setIsListening(false)
        }
      }
    }

    // Cleanup function
    return () => {
      stopRecognition()
    }
  }, [])

  // Add event listener for keydown to handle spacebar when widget is open
  useEffect(() => {
    if (!isOpen) return
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && event.target === document.body) {
        event.preventDefault()
        if (isListening) {
          stopRecognition()
        } else {
          startListening()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isListening, isOpen])

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversationHistory])

  // Handle close with cleanup
  const handleClose = () => {
    stopRecognition()
    onClose()
  }

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
    } else {
      setResponseText("Speech recognition not supported in this browser.")
    }
  }

  const processVoiceInput = async (userInput: string) => {
    try {
      // API call to your Flask backend
      const response = await fetch("/api/voice-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input: userInput }),
      })

      if (!response.ok) throw new Error("Failed to get response")
      
      const data = await response.json()
      setResponseText("Ready to assist you")
      
      // Update conversation history
      if (data.conversation_history) {
        setConversationHistory(data.conversation_history)
      } else {
        // If your API doesn't return conversation history, update it manually
        setConversationHistory(prev => [
          ...prev, 
          { user: userInput, ai: data.response }
        ])
      }
      
      // Speak the response
      speakResponse(data.response)
    } catch (error) {
      console.error("Error processing request:", error)
      setResponseText("Error processing request. Please try again.")
    }
  }

  const speakResponse = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      window.speechSynthesis.speak(utterance)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 md:w-96 shadow-lg">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" x2="12" y1="19" y2="22"></line>
            </svg>
            <h3 className="font-medium">AI Voice Assistant</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-3">
          <div className="text-center text-sm font-medium text-muted-foreground mb-2">
            {responseText}
          </div>
          
          <div className="flex justify-center gap-2 mb-3">
            <Button 
              onClick={startListening}
              disabled={isListening}
              className={`rounded-full ${
                isListening ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-500'
              }`}
              size="sm"
            >
              <Mic className="mr-1 h-4 w-4" />
              {isListening ? "Listening..." : "Speak"}
            </Button>
            
            {isListening && (
              <Button 
                onClick={stopRecognition}
                className="rounded-full bg-red-500"
                size="sm"
              >
                <Square className="mr-1 h-4 w-4" />
                Stop
              </Button>
            )}
          </div>
          
          {conversationHistory.length > 0 && (
            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
              {conversationHistory.map((entry, index) => (
                <div key={index} className="mb-2 text-sm">
                  <div className="flex items-start mb-1">
                    <div className="w-5 h-5 rounded-full bg-black-100 flex items-center justify-center mr-1 mt-0.5">
                      <span className="text-xs">Y</span>
                    </div>
                    <p className="bg-black-50 p-1.5 rounded-md">{entry.user}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-black-100 flex items-center justify-center mr-1 mt-0.5">
                      <span className="text-xs">A</span>
                    </div>
                    <p className="bg-black-50 p-1.5 rounded-md">{entry.ai}</p>
                  </div>
                </div>
              ))}
              <div ref={historyEndRef} />
            </div>
          )}
          
          <div className="text-center text-xs text-muted-foreground mt-2">
            Press spacebar to {isListening ? 'stop' : 'start'} recording
          </div>
        </div>
      </Card>
    </div>
  )
}