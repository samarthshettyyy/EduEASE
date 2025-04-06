"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function WelcomeMessage() {
  const [isVisible, setIsVisible] = useState(true)
  const [greeting, setGreeting] = useState("Good morning")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning")
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }
  }, [])

  if (!isVisible) return null

  return (
    <Card className="bg-primary/10 border-primary/20">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{greeting}, Alex!</h2>
          <p className="text-muted-foreground">
            Welcome to your personalized learning dashboard. You have 3 lessons scheduled for today.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)}>
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </CardContent>
    </Card>
  )
}

