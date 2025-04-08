"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  BookOpen, 
  PlusCircle, 
  MessageSquare, 
  BarChart, 
  Mic, 
  LogOut, 
  Users, 
  FileUp, 
  Calendar, 
  Video, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  User,
  School,
  Plus,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { VoiceAssistantWidget } from "@/components/voice-assistant-widget"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function TeacherDashboardPage() {
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false)
  const router = useRouter()

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Call your logout API endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Redirect to login page after successful logout
        router.push('/login')
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Sample data for classrooms
  const classrooms = [
    {
      id: "c1",
      name: "Grade 5 Mathematics",
      subject: "Mathematics",
      students: 18,
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
      id: "c2",
      name: "Reading & Comprehension",
      subject: "English",
      students: 22,
      color: "bg-green-100 text-green-800 border-green-200"
    },
    {
      id: "c3",
      name: "Science Explorer",
      subject: "Science",
      students: 16,
      color: "bg-purple-100 text-purple-800 border-purple-200"
    }
  ]

  // Sample data for upcoming meetings
  const upcomingMeetings = [
    {
      id: "m1",
      title: "Math Support Session",
      time: "Today, 3:30 PM",
      duration: "30 min",
      students: ["Alex M.", "Sarah K.", "Jason T."],
      classroom: "Grade 5 Mathematics",
      urgent: true
    },
    {
      id: "m2",
      title: "Reading Assessment",
      time: "Tomorrow, 2:15 PM",
      duration: "45 min",
      students: ["Emma L.", "Michael R."],
      classroom: "Reading & Comprehension",
      urgent: false
    },
    {
      id: "m3",
      title: "Science Project Review",
      time: "Apr 10, 1:00 PM",
      duration: "40 min",
      students: ["Oliver P.", "Sofia C.", "Noah W.", "Ava R."],
      classroom: "Science Explorer",
      urgent: false
    }
  ]

  // Sample data for student alerts
  const studentAlerts = [
    {
      id: "a1",
      student: "Alex Miller",
      alert: "Struggling with fractions",
      priority: "high",
      date: "Today",
      subject: "Mathematics"
    },
    {
      id: "a2",
      student: "Emma Lewis",
      alert: "Missing last 2 assignments",
      priority: "medium",
      date: "Yesterday",
      subject: "Reading"
    },
    {
      id: "a3",
      student: "Noah Wilson",
      alert: "Excellent progress in science project",
      priority: "low",
      date: "Apr 6",
      subject: "Science"
    }
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Ms. Johnson</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="relative mr-4">
              <Bell className="h-6 w-6 text-gray-500 hover:text-primary cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </div>
            <Avatar className="h-10 w-10 border-2 border-primary/30">
              <AvatarImage src="/avatars/teacher-avatar.png" alt="Teacher" />
              <AvatarFallback>MJ</AvatarFallback>
            </Avatar>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-primary mb-1">Total Students</p>
                <h3 className="text-2xl font-bold">56</h3>
                <p className="text-xs text-muted-foreground mt-1">Across 3 classrooms</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-primary mb-1">Upcoming Sessions</p>
                <h3 className="text-2xl font-bold">8</h3>
                <p className="text-xs text-muted-foreground mt-1">This week</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-primary mb-1">Learning Resources</p>
                <h3 className="text-2xl font-bold">24</h3>
                <p className="text-xs text-muted-foreground mt-1">Active documents</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <FileUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-primary mb-1">Student Alerts</p>
                <h3 className="text-2xl font-bold">3</h3>
                <p className="text-xs text-muted-foreground mt-1">Requiring attention</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Classrooms Section */}
        <div className="md:col-span-2">
          <Card className="border bg-card text-card-foreground shadow">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center">
                  <School className="h-5 w-5 mr-2 text-primary" />
                  My Classrooms
                </CardTitle>
                <CardDescription>Manage your virtual classrooms</CardDescription>
              </div>
              <Link href="/teacher/classrooms/create">
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Create New
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {classrooms.map(classroom => (
                  <Link href={`/teacher/classrooms/${classroom.id}`} key={classroom.id}>
                    <div className="border rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline">{classroom.subject}</Badge>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Users className="h-4 w-4 mr-1" />
                          {classroom.students}
                        </div>
                      </div>
                      <h3 className="font-semibold text-base mb-1">{classroom.name}</h3>
                      <div className="flex justify-between text-sm mt-3">
                        <span className="text-muted-foreground">
                          5 learning modules
                        </span>
                        <span className="text-primary font-medium">Manage →</span>
                      </div>
                    </div>
                  </Link>
                ))}
                
                <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center hover:border-primary transition-all cursor-pointer h-[114px]">
                  <PlusCircle className="h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Create New Classroom</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/teacher/classrooms">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  View All Classrooms
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Student Alerts */}
        <div className="md:col-span-1">
          <Card className="border bg-card text-card-foreground shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                Student Alerts
              </CardTitle>
              <CardDescription>Recent notifications requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studentAlerts.map(alert => (
                  <div key={alert.id} className="border-l-4 border-primary p-3 rounded-lg bg-primary/5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{alert.student}</h4>
                      <Badge variant="outline" className="text-xs font-normal">
                        {alert.subject}
                      </Badge>
                    </div>
                    <p className="text-sm mt-1 text-muted-foreground">{alert.alert}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">{alert.date}</span>
                      <Link href={`/teacher/students/${alert.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/teacher/alerts">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  View All Alerts
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <Card className="mb-6 border bg-card text-card-foreground shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Upcoming Meetings
          </CardTitle>
          <CardDescription>Your scheduled video sessions with students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingMeetings.map(meeting => (
              <div 
                key={meeting.id} 
                className="border rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{meeting.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {meeting.classroom}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4 mr-1.5" />
                    {meeting.time} · {meeting.duration}
                  </div>
                  
                  <div className="flex items-start mt-3">
                    <div className="flex -space-x-2 mr-2">
                      {meeting.students.slice(0, 3).map((student, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs bg-primary text-white">
                            {student.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {meeting.students.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-white flex items-center justify-center text-xs">
                          +{meeting.students.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {meeting.students.length} student{meeting.students.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="bg-muted/20 p-3 border-t">
                  <Button 
                    className="w-full"
                    variant={meeting.time.includes('Today') ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {meeting.time.includes('Today') ? 'Join Now' : 'Schedule Reminder'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex flex-col sm:flex-row gap-3 justify-between">
            <Link href="/teacher/meetings">
              <Button variant="outline" size="sm" className="justify-center">
                View All Meetings
              </Button>
            </Link>
            <Link href="/teacher/meetings/schedule">
              <Button size="sm" className="justify-center gap-1">
                <PlusCircle className="h-4 w-4" />
                Schedule New Meeting
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      {/* Student Progress */}
      <Card className="mb-6 border bg-card text-card-foreground shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-primary" />
            Student Progress Overview
          </CardTitle>
          <CardDescription>Monitor learning outcomes across your classrooms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">Grade 5 Mathematics</h3>
                <span className="text-sm text-muted-foreground">Class Average: 78%</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Number Operations</span>
                    <span>82%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Fractions & Decimals</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Geometry</span>
                    <span>88%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">Reading & Comprehension</h3>
                <span className="text-sm text-muted-foreground">Class Average: 72%</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Reading Fluency</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Vocabulary</span>
                    <span>68%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Text Analysis</span>
                    <span>74%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '74%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/teacher/progress">
              <Button variant="outline" size="sm" className="w-full justify-center">
                Detailed Progress Reports
              </Button>
            </Link>
            <Link href="/teacher/assessments">
              <Button variant="outline" size="sm" className="w-full justify-center">
                Create Assessment
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      {/* Quick Actions */}
      // Update to app/teacher/dashboard/page.tsx Quick Actions section

// Replace the existing Quick Actions Card with this updated version
<Card className="border bg-card text-card-foreground shadow">
  <CardHeader className="pb-3">
    <CardTitle className="text-xl">Quick Actions</CardTitle>
    <CardDescription>Common tasks and shortcuts</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Link href="/teacher/documents/upload">
        <div className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-primary/5 hover:border-primary transition-colors h-32">
          <FileUp className="h-8 w-8 text-primary mb-2" />
          <span className="text-sm font-medium text-center">Upload Learning Materials</span>
        </div>
      </Link>
      
      <Link href="/teacher/meetings/create">
        <div className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-primary/5 hover:border-primary transition-colors h-32">  
          <Video className="h-8 w-8 text-primary mb-2" /> 
          <span className="text-sm font-medium text-center">Start Video Session</span> 
        </div>
      </Link>
      
      <button 
        onClick={() => setIsVoiceAssistantOpen(true)}
        className="flex flex-col items-center justify-center p-4 rounded-lg border bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-colors h-32"
      >
        <Mic className="h-8 w-8 mb-2" />
        <span className="text-sm font-medium text-center">Ask AI</span>
      </button>
      
      <Link href="/teacher/documents">
        <div className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-primary/5 hover:border-primary transition-colors h-32">
          <BookOpen className="h-8 w-8 text-primary mb-2" />
          <span className="text-sm font-medium text-center">View Learning Materials</span>
        </div>
      </Link>
    </div>
  </CardContent>
</Card>
      
      {/* AI Assistant floating button */}
      <button
        onClick={() => setIsVoiceAssistantOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      >
        <Mic size={24} />
      </button>
      
      {/* Voice Assistant Widget */}
      <VoiceAssistantWidget 
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
      />
    </div>
  )
}