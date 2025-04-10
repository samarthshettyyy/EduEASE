"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { School, Book, Users, Calendar, ArrowRight, Loader } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import JoinClassroom from "./join-classroom"

interface Classroom {
  id: number
  name: string
  subject: string
  color: string
  lastActive?: string
  teacherId: number
}

export function StudentClassrooms() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchClassrooms = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/classrooms")
      
      if (!response.ok) {
        throw new Error("Failed to fetch classrooms")
      }
      
      const data = await response.json()
      setClassrooms(data.classrooms || [])
    } catch (error) {
      console.error("Error fetching classrooms:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClassrooms()
  }, [])

  const handleJoinSuccess = (newClassroom: Classroom) => {
    // Refetch classrooms after joining a new one
    fetchClassrooms()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Join Classroom Component */}
      <JoinClassroom onJoinSuccess={handleJoinSuccess} />
      
      {/* My Classrooms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5 text-primary" />
            My Classrooms
          </CardTitle>
          <CardDescription>
            Access your learning materials and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {classrooms.length === 0 ? (
            <div className="text-center py-8">
              <School className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No classrooms yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                Join a classroom by entering the code provided by your teacher above.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {classrooms.map((classroom) => (
                <Link href={`/classroom/${classroom.id}`} key={classroom.id}>
                  <div className="border rounded-lg p-4 hover:border-primary transition-all cursor-pointer h-full">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={classroom.color}>
                        {classroom.subject}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {classroom.lastActive || "New"}
                      </div>
                    </div>
                    <h3 className="font-medium text-lg">{classroom.name}</h3>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Book className="h-4 w-4 mr-1" />
                        <span>View materials</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentClassrooms