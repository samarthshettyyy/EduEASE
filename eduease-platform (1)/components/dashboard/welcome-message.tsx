"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, BookOpen, Award, Calendar } from "lucide-react"
import { Name } from "drizzle-orm"

export function WelcomeMessage() {
  const [isVisible, setIsVisible] = useState(true)
  const [greeting, setGreeting] = useState("Good morning")

  const user = JSON.parse(localStorage.getItem('user'));
  
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
    <Card className="bg-gradient-to-r from-primary/20 to-primary/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{greeting}, {user.name}! 👋</h2>
            <p className="text-muted-foreground mt-1">
              Ready to continue your learning journey? Here's what you have today.
            </p>
          </div>
          <div className="flex flex-row md:space-x-4 space-x-2">
            <div className="flex flex-col items-center justify-center bg-background p-3 rounded-lg">
              <Calendar className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs font-medium">3 Lessons</span>
              <span className="text-xs text-muted-foreground">Today</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-background p-3 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs font-medium">60 mins</span>
              <span className="text-xs text-muted-foreground">Study time</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-background p-3 rounded-lg">
              <Award className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs font-medium">82%</span>
              <span className="text-xs text-muted-foreground">Weekly goal</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}