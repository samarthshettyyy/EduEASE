// app/student/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  BookOpen, 
  PlusCircle, 
  MessageSquare, 
  LogOut, 
  Users, 
  Calendar, 
  Video, 
  School,
  Plus,
  Bell,
  Clock,
  BookOpenCheck,
  Trophy,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function StudentDashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  
  // Simulated student data
  const [studentData, setStudentData] = useState({
    name: "Alex Miller",
    avatar: "/avatars/student1.png",
    grade: "Grade 5",
    needs: "Dyslexia",
    recentAchievements: [
      { id: 1, title: "Completed Math Quiz", date: "Today", points: 50 },
      { id: 2, title: "Read 5 Chapters", date: "Yesterday", points: 75 }
    ]
  })
  
  // Simulated classroom data
  const [classrooms, setClassrooms] = useState([
    {
      id: "c1",
      name: "Grade 5 Mathematics",
      subject: "Mathematics",
      teacher: "Ms. Johnson",
      progress: 75,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      lastActive: "Today",
      upcomingTask: "Fractions Quiz"
    },
    {
      id: "c3",
      name: "Science Explorer",
      subject: "Science",
      teacher: "Mr. Rodriguez",
      progress: 82,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      lastActive: "2 days ago",
      upcomingTask: "Cell Structure Report"
    }
  ])
  
  // Simulated upcoming assignments
  const [assignments, setAssignments] = useState([
    {
      id: "a1",
      title: "Fractions Quiz",
      dueDate: "Tomorrow, 3:00 PM",
      classroom: "Grade 5 Mathematics",
      priority: "high"
    },
    {
      id: "a2",
      title: "Cell Structure Report",
      dueDate: "April 15, 11:59 PM",
      classroom: "Science Explorer",
      priority: "medium"
    },
    {
      id: "a3",
      title: "Reading Comprehension",
      dueDate: "April 18, 3:00 PM",
      classroom: "Reading & Comprehension",
      priority: "low"
    }
  ])

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
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-r-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {studentData.name}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="relative mr-4">
              <Bell className="h-6 w-6 text-gray-500 hover:text-primary cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
            </div>
            <Avatar className="h-10 w-10 border-2 border-primary/30">
              <AvatarFallback>
                {studentData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
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
      
      {/* Join Classroom Button */}
      <div className="mb-8">
        <Link href="/student/join-classroom">
          <Button className="gap-2">
            <School className="h-4 w-4" />
            Join a Classroom
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - First 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Classrooms */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>My Classrooms</CardTitle>
                <Link href="/student/classrooms">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <CardDescription>Your enrolled learning spaces</CardDescription>
            </CardHeader>
            <CardContent className="pb-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classrooms.map(classroom => (
                  <Link href={`/student/classrooms/${classroom.id}`} key={classroom.id}>
                    <div className="border rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={classroom.color}>{classroom.subject}</Badge>
                        <p className="text-xs text-muted-foreground">
                          Last active: {classroom.lastActive}
                        </p>
                      </div>
                      <h3 className="font-semibold text-base mb-1">{classroom.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">Teacher: {classroom.teacher}</p>
                      
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{classroom.progress}%</span>
                        </div>
                        <Progress value={classroom.progress} className="h-1.5" />
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>Next: {classroom.upcomingTask}</span>
                        </div>
                        <span className="text-primary font-medium">Enter →</span>
                      </div>
                    </div>
                  </Link>
                ))}
                
                <Link href="/student/join-classroom">
                  <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center h-[172px] hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                    <div className="rounded-full bg-primary/10 p-2 mb-2">
                      <School className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Join a New Classroom</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter a code from your teacher
                    </p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Upcoming Assignments */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Assignments</CardTitle>
              <CardDescription>Tasks and homework due soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map(assignment => (
                  <div 
                    key={assignment.id}
                    className={`border rounded-lg p-3 ${
                      assignment.priority === 'high' 
                        ? 'border-l-4 border-l-red-500' 
                        : assignment.priority === 'medium'
                        ? 'border-l-4 border-l-amber-500'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">{assignment.classroom}</p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className={`text-xs ${
                          assignment.priority === 'high' ? 'text-red-600 font-medium' : ''
                        }`}>
                          {assignment.dueDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs">Start Working</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Assignments
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Sidebar - Last column */}
        <div className="space-y-6">
          {/* Student Profile */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Your learning profile and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarFallback className="text-lg">
                    {studentData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg">{studentData.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{studentData.grade}</Badge>
                  <Badge variant="outline">{studentData.needs}</Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-muted/30 p-3 rounded-md">
                  <h4 className="text-sm font-medium flex items-center">
                    <BookOpenCheck className="h-4 w-4 mr-1.5 text-primary" />
                    Learning Preferences
                  </h4>
                  <ul className="mt-2 text-sm">
                    <li className="flex items-center text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                      Visual learning materials
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                      Dyslexia-friendly fonts
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                      Text-to-speech enabled
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Update Profile
              </Button>
            </CardFooter>
          </Card>
          
          {/* Recent Achievements */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                Recent Achievements
              </CardTitle>
              <CardDescription>Your learning milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.recentAchievements.map(achievement => (
                  <div key={achievement.id} className="border-l-4 border-amber-300 pl-3 py-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{achievement.date}</span>
                      <span className="font-medium text-amber-600">+{achievement.points} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Achievements
              </Button>
            </CardFooter>
          </Card>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-auto py-3 justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="text-sm">Materials</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto py-3 justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="text-sm">Sessions</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto py-3 justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="text-sm">Messages</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto py-3 justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="text-sm">Calendar</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}