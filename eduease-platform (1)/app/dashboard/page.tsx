"use client"

import { useState } from "react"
import { WelcomeMessage } from "@/components/dashboard/welcome-message"
import { LearningProgress } from "@/components/dashboard/learning-progress"
import { UpcomingLessons } from "@/components/dashboard/upcoming-lessons"
import { RecommendedResources } from "@/components/dashboard/recommended-resources"
import { Rooms } from "@/components/dashboard/rooms"
import { VoiceAssistantWidget } from "@/components/voice-assistant-widget"
import Link from "next/link"
import { BookOpen, Video, MessageSquare, BarChart, Mic } from "lucide-react"

export default function DashboardPage() {
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false)

  return (
    <div className="space-y-6 p-6">
      <WelcomeMessage />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold tracking-tight mb-4">Today's Schedule</h3>
              <UpcomingLessons />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold tracking-tight mb-4">Learning Progress</h3>
                <LearningProgress />
              </div>
            </div>
            
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
          </div>
        </div>
        
        <div className="space-y-6">
          {/* New Rooms section */}
          <div className="rounded-lg border bg-card text-card-foreground shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold tracking-tight mb-4">Rooms</h3>
              <Rooms />
            </div>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold tracking-tight mb-4">Recommended Resources</h3>
              <RecommendedResources />
            </div>
          </div>
          
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