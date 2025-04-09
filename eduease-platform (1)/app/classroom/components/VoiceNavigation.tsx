"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic } from "lucide-react"

interface VoiceNavigationProps {
  onVoiceCommand: (command: string) => void
}

export function VoiceNavigation({ onVoiceCommand }: VoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false)
  const [command, setCommand] = useState("")

  const toggleListening = () => {
    if (!isListening) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition

      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser.")
        return
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase()
        setCommand(transcript)

        // Trigger action in parent
        onVoiceCommand(transcript)

        setIsListening(false)
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      setIsListening(false)
      setCommand("")
    }
  }

  function playBeep() {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()
  
    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(880, context.currentTime) // A5 note
    gainNode.gain.setValueAtTime(0.2, context.currentTime) // volume
  
    oscillator.connect(gainNode)
    gainNode.connect(context.destination)
  
    oscillator.start()
    oscillator.stop(context.currentTime + 0.15) // short beep
  }  

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent spacebar from scrolling
      if (event.code === "Space") {
        event.preventDefault()
        if (!isListening) playBeep()
        toggleListening()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isListening])

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Voice Navigation</CardTitle>
        <CardDescription>Navigate using voice commands</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="sm"
            onClick={toggleListening}
            className="flex items-center gap-2"
          >
            <Mic className="h-4 w-4" />
            {isListening ? "Listening..." : "Start Listening"}
          </Button>
          {command && (
            <p className="text-sm">
              Command detected: <span className="font-medium">{command}</span>
            </p>
          )}
        </div>
        <div className="mt-2">
          <p className="text-xs text-muted-foreground">
            Try saying: "read aloud", "next page", "go to chapter 3"
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default VoiceNavigation