"use client"

import { useState, useEffect } from "react"
import { WelcomeMessage } from "@/components/dashboard/welcome-message"
import { LearningProgress } from "@/components/dashboard/learning-progress"
import { UpcomingLessons } from "@/components/dashboard/upcoming-lessons"
import { RecommendedResources } from "@/components/dashboard/recommended-resources"
import { Rooms } from "@/components/dashboard/rooms"
import { StudentClassrooms } from "@/components/dashboard/student-classrooms"
import { VoiceAssistantWidget } from "@/components/voice-assistant-widget"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Video, MessageSquare, BarChart, Mic, LogOut } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function DashboardPage() {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false)
  const [userRole, setUserRole] = useState("student")

  // Check authentication on component mount
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user')
      console.warn("User data:", userData)
      
      if (userData) {
        setUser(JSON.parse(userData))
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Error checking auth:", error)
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push("/login")
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // If no user is found after loading, don't render the dashboard
  if (!user) {
    return null
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <WelcomeMessage />
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </button>
      </div>
      
      {/* Student-specific UI: Classrooms */}
      {userRole === 'student' && (
        <div className="mb-8">
          <StudentClassrooms />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Left column - Today's Schedule */}
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold tracking-tight mb-4">Today's Schedule</h3>
              <UpcomingLessons />
            </div>
          </div>
        </div>
        
        {/* Right column - Rooms */}
        <div>
          <div className="rounded-lg border bg-card text-card-foreground shadow mb-6">
            <div className="p-6">
              <Link href="/classroom">
              <h3 className="text-lg font-semibold tracking-tight mb-4">Rooms</h3>
              <Rooms />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Three boxes in a row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Learning Progress */}
        <div className="rounded-lg border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold tracking-tight mb-4">Learning Progress</h3>
            <LearningProgress />
          </div>
        </div>
        
        {/* Weekly Goals */}
        <div className="rounded-lg border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold tracking-tight mb-4">Weekly Goals</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Complete 5 lessons</span>
                <span className="font-medium">3/5</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Practice 30 minutes daily</span>
                <span className="font-medium">4/7 days</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '57%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="rounded-lg border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold tracking-tight mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/lessons" className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-primary/5 transition-colors">
                <BookOpen className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm">Start Lesson</span>
              </Link>
              <Link href="/dashboard/video-sessions" className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-primary/5 transition-colors">   
                <Video className="h-6 w-6 text-primary mb-2" /> 
                <span className="text-sm">Join Session</span> 
              </Link>
              <button 
                onClick={() => setIsVoiceAssistantOpen(true)}
                className="flex flex-col items-center justify-center p-4 rounded-lg border bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-colors"
              >
                <Mic className="h-6 w-6 mb-2" />
                <span className="text-sm">Ask AI</span>
              </button>
              <Link href="/dashboard/progress" className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-primary/5 transition-colors">
                <BarChart className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm">View Progress</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommended Resources - Using the same width as Today's Schedule (2/3 width) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold tracking-tight mb-4">Recommended Resources</h3>
              <RecommendedResources />
            </div>
          </div>
        </div>
      </div>

      {/* Voice Assistant Widget */}
      <VoiceAssistantWidget 
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
      />
      
      {/* Optional floating button for quick access */}
      <button
        onClick={() => setIsVoiceAssistantOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      >
        <Mic size={24} />
      </button>
    </div>
  )
}