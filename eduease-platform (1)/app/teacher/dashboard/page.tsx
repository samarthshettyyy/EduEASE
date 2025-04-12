// app/teacher/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
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
import ClassroomCodeBanner from "@/components/teacher-classroom-code-banner"
import { useClassroomStore } from "@/lib/store/classroom-store"
import { toast } from "@/components/ui/use-toast"

export default function TeacherDashboardPage() {
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false)
  const router = useRouter()
  
  // Get classrooms from the store
  
  // State for recently created classroom banner
  const [recentClassroom, setRecentClassroom] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [error, setError] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  
  const user = JSON.parse(localStorage.getItem("user"));
  const teacherId = user.id; // Get teacher_id from the user object in localStorage

  useEffect(() => {
    const fetchClassrooms = async () => {
      if (!teacherId) {
        setError("Teacher ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/teacher/classrooms?teacher_id=${teacherId}`);
        if (!response.ok) {
          console.warn("Here");
          throw new Error("Failed to fetch classrooms.");
        }

        const data = await response.json();
        setClassrooms(data.classrooms);
      } catch (err) {
        console.error("Error fetching classrooms:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassrooms();
  }, [teacherId]);

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
  if (error) return <div>Error: {error}</div>;
  
  // Check if a classroom was just created by looking at session storage
  // useEffect(() => {
  //   const justCreatedClassroom = sessionStorage.getItem('justCreatedClassroom')
    
  //   if (justCreatedClassroom) {
  //     try {
  //       const classroomData = JSON.parse(justCreatedClassroom)
  //       setRecentClassroom(classroomData)
        
  //       // Clear from session storage so it doesn't show on refresh
  //       sessionStorage.removeItem('justCreatedClassroom')
  //     } catch (error) {
  //       console.error('Error parsing classroom data:', error)
  //     }
  //   }
  // }, [])

  // Function to handle logout
  const handleLogout = async () => {
    localStorage.removeItem('user')
    router.push("/login")
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
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

      {/* Recently created classroom banner */}
      {recentClassroom && (
        <ClassroomCodeBanner 
          classroom={recentClassroom} 
          onDismiss={() => setRecentClassroom(null)} 
        />
      )}
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-primary mb-1">Total Students</p>
                <h3 className="text-2xl font-bold">56</h3>
                <p className="text-xs text-muted-foreground mt-1">Across {classrooms.length} classrooms</p>
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
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {classrooms.length > 0 ? (
                    classrooms.slice(0, 4).map(classroom => (
                      <Link href={`/teacher/courses/${classroom.id}`} key={classroom.id}>
                        <div className="border rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all cursor-pointer">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline">{classroom.subject}</Badge>
                            <div className="flex items-center text-muted-foreground text-sm">
                              <Users className="h-4 w-4 mr-1" />
                              {classroom.students}
                            </div>
                          </div>
                          <h3 className="font-semibold text-base mb-1">{classroom.name}</h3>
                          <h4 className="text-gray-400 mb-1">{classroom.description}</h4>
                          <div className="flex justify-between text-sm mt-3">
                            <span className="text-muted-foreground">
                              {classroom.code && (
                                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                                  Code: {classroom.code}
                                </span>
                              )}
                            </span>
                            <span className="text-primary font-medium">Manage →</span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-2 border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                      <School className="h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="font-medium">No Classrooms Yet</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">
                        Create your first classroom to get started
                      </p>
                      <Link href="/teacher/classrooms/create">
                        <Button size="sm" className="gap-1">
                          <Plus className="h-4 w-4" />
                          Create Classroom
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  {classrooms.length > 0 && (
                    <Link href="/teacher/classrooms/create">
                      <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center h-[114px] hover:border-primary transition-all cursor-pointer">
                        <PlusCircle className="h-6 w-6 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Create New Classroom</p>
                      </div>
                    </Link>
                  )}
                </div>
              )}
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
                <div className="border-l-4 border-primary p-3 rounded-lg bg-primary/5">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">Alex Miller</h4>
                    <Badge variant="outline" className="text-xs font-normal">
                      Mathematics
                    </Badge>
                  </div>
                  <p className="text-sm mt-1 text-muted-foreground">Struggling with fractions</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">Today</span>
                    <Link href={`/teacher/students/s1`}>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="border-l-4 border-primary p-3 rounded-lg bg-primary/5">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">Emma Lewis</h4>
                    <Badge variant="outline" className="text-xs font-normal">
                      Reading
                    </Badge>
                  </div>
                  <p className="text-sm mt-1 text-muted-foreground">Missing last 2 assignments</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">Yesterday</span>
                    <Link href={`/teacher/students/s2`}>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="border-l-4 border-primary p-3 rounded-lg bg-primary/5">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">Noah Wilson</h4>
                    <Badge variant="outline" className="text-xs font-normal">
                      Science
                    </Badge>
                  </div>
                  <p className="text-sm mt-1 text-muted-foreground">Excellent progress in science project</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">Apr 6</span>
                    <Link href={`/teacher/students/s7`}>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
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