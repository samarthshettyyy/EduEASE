"use client"

import { useState } from "react"
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { School, ArrowRight, Loader } from "lucide-react"

interface JoinClassroomProps {
  onJoinSuccess?: (classroom: any) => void
}

export function JoinClassroom({ onJoinSuccess }: JoinClassroomProps) {
  const [code, setCode] = useState("")
  const [isJoining, setIsJoining] = useState(false)

  const handleJoin = async () => {
    if (!code.trim()) {
      toast({
        title: "Please enter a code",
        description: "You need to enter a classroom code to join",
        variant: "destructive"
      })
      return
    }

    setIsJoining(true)

    try {
      const response = await fetch("/api/classrooms/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to join classroom")
      }

      const data = await response.json()

      toast({
        title: "Success!",
        description: `You've joined ${data.classroom.name}`
      })

      // Reset the form
      setCode("")
      
      // Call the success callback if provided
      if (onJoinSuccess) {
        onJoinSuccess(data.classroom)
      }
    } catch (error) {
      console.error("Error joining classroom:", error)
      toast({
        title: "Failed to join classroom",
        description: error.message || "Please check the code and try again",
        variant: "destructive"
      })
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <School className="h-5 w-5 text-primary" />
          Join a Classroom
        </CardTitle>
        <CardDescription>
          Enter the code provided by your teacher
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-digit code"
            className="font-mono text-base uppercase tracking-wider"
            maxLength={6}
          />
          <Button onClick={handleJoin} disabled={isJoining || !code.trim()}>
            {isJoining ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                Join
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t pt-4">
        Codes are typically 6 characters, e.g. "AB12CD"
      </CardFooter>
    </Card>
  )
}

export default JoinClassroom