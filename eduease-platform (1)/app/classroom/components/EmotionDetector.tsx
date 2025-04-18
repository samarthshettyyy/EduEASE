"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smile } from "lucide-react"

interface EmotionDetectorProps {
  onEmotionDetected: (emotion: string) => void
}

export function EmotionDetector({ onEmotionDetected }: EmotionDetectorProps) {
  const [isActive, setIsActive] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState("neutral")

  // Poll emotion from backend when toggle is ON
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/emotion')
        const data = await res.json()
        if (data?.emotion) {
          setCurrentEmotion(data.emotion)
          onEmotionDetected(data.emotion)
        }
      } catch (err) {
        console.error('Failed to fetch emotion:', err)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isActive, onEmotionDetected])

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Emotion Detection</CardTitle>
          <Switch checked={isActive} onCheckedChange={setIsActive} aria-label="Toggle emotion detection" />
        </div>
        <CardDescription>Adapts content based on your emotional state</CardDescription>
      </CardHeader>

      {isActive && (
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <Smile className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm">
                Current state: <span className="font-medium">{currentEmotion}</span>
              </p>

              {currentEmotion === "overwhelmed" && (
                <p className="text-xs text-muted-foreground mt-1">
                  Content simplified to reduce cognitive load
                </p>
              )}
              {currentEmotion === "confused" && (
                <p className="text-xs text-muted-foreground mt-1">
                  Additional explanations provided
                </p>
              )}
              {currentEmotion === "engaged" && (
                <p className="text-xs text-muted-foreground mt-1">
                  Great job staying focused!
                </p>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default EmotionDetector
