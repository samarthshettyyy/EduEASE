"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  Plus,
  BookOpen,
  Video,
  MessageSquare,
  BarChart,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  MoreHorizontal,
  Eye
} from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [viewType, setViewType] = useState("grid") // grid or table
  
  // Sample data for students
  const students = [
    {
      id: "s1",
      name: "Alex Miller",
      avatar: "/avatars/student1.png",
      grade: "Grade 5",
      needs: "Dyslexia",
      progress: 85,
      lastActive: "Today",
      supportLevel: "low",
      status: "active",
      assignments: { completed: 8, total: 10 },
      sessions: 5,
      notes: "Has difficulty with long reading passages. Prefers visual learning materials."
    },
    {
      id: "s2",
      name: "Emma Lewis",
      avatar: "/avatars/student2.png",
      grade: "Grade 5",
      needs: "ADHD",
      progress: 68,
      lastActive: "Yesterday",
      supportLevel: "medium",
      status: "active",
      assignments: { completed: 6, total: 10 },
      sessions: 3,
      notes: "Benefits from frequent breaks. Excels in interactive activities."
    },
    {
      id: "s3",
      name: "Jason Thomas",
      avatar: "/avatars/student3.png",
      grade: "Grade 5",
      needs: "Dyslexia",
      progress: 72,
      lastActive: "2 days ago",
      supportLevel: "medium",
      status: "active",
      assignments: { completed: 7, total: 10 },
      sessions: 4,
      notes: "Needs extra time for reading assignments. Works well with text-to-speech tools."
    },
    {
      id: "s4",
      name: "Sarah Kim",
      avatar: "/avatars/student4.png",
      grade: "Grade 5",
      needs: "Autism",
      progress: 90,
      lastActive: "Today",
      supportLevel: "low",
      status: "active",
      assignments: { completed: 9, total: 10 },
      sessions: 4,
      notes: "Thrives with consistent routines. Excels in mathematics and pattern recognition."
    },
    {
      id: "s5",
      name: "Michael Roberts",
      avatar: "/avatars/student5.png",
      grade: "Grade 5",
      needs: "Dyslexia",
      progress: 62,
      lastActive: "3 days ago",
      supportLevel: "high",
      status: "inactive",
      assignments: { completed: 5, total: 10 },
      sessions: 2,
      notes: "Struggling with recent materials. Needs additional support with reading comprehension."
    },
    {
      id: "s6",
      name: "Olivia Parker",
      avatar: "/avatars/student6.png",
      grade: "Grade 5",
      needs: "None",
      progress: 88,
      lastActive: "Today",
      supportLevel: "low",
      status: "active",
      assignments: { completed: 9, total: 10 },
      sessions: 5,
      notes: "Consistently performs well. Could benefit from more challenging materials."
    },
    {
      id: "s7",
      name: "Noah Wilson",
      avatar: "/avatars/student7.png",
      grade: "Grade 5",
      needs: "ADHD",
      progress: 75,
      lastActive: "Yesterday",
      supportLevel: "medium",
      status: "active",
      assignments: { completed: 7, total: 10 },
      sessions: 3,
      notes: "Visual timers help with task focus. Good verbal participation in class."
    },
    {
      id: "s8",
      name: "Sophia Chen",
      avatar: "/avatars/student8.png",
      grade: "Grade 5",
      needs: "Autism",
      progress: 80,
      lastActive: "Today",
      supportLevel: "low",
      status: "active",
      assignments: { completed: 8, total: 10 },
      sessions: 4,
      notes: "Responsive to structured learning approaches. Excels in organized environments."
    }
  ]
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.needs.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const toggleStudent = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }
  
  const toggleAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map(student => student.id))
    }
  }
  
  const getSupportLevelBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">High Support</Badge>
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium Support</Badge>
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Low Support</Badge>
      default:
        return null
    }
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link 
          href="/teacher/dashboard" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground mt-1">Manage and track your students' progress</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-1">
              <UserPlus className="h-4 w-4" />
              Add Student
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search students..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="k">Kindergarten</SelectItem>
              <SelectItem value="1">Grade 1</SelectItem>
              <SelectItem value="2">Grade 2</SelectItem>
              <SelectItem value="3">Grade 3</SelectItem>
              <SelectItem value="4">Grade 4</SelectItem>
              <SelectItem value="5">Grade 5</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Support Needs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Needs</SelectItem>
              <SelectItem value="dyslexia">Dyslexia</SelectItem>
              <SelectItem value="adhd">ADHD</SelectItem>
              <SelectItem value="autism">Autism</SelectItem>
              <SelectItem value="none">No Special Needs</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>View Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setViewType("grid")}
                className={viewType === "grid" ? "bg-muted cursor-pointer" : "cursor-pointer"}
              >
                Grid View
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setViewType("table")}
                className={viewType === "table" ? "bg-muted cursor-pointer" : "cursor-pointer"}
              >
                Table View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Sort by Name
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Sort by Progress
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Sort by Support Level
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Students</p>
                <h3 className="text-2xl font-bold">{students.length}</h3>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50/50 border-green-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-green-600">Average Progress</p>
                <h3 className="text-2xl font-bold">
                  {Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)}%
                </h3>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <BarChart className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50/50 border-red-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-red-600">High Support</p>
                <h3 className="text-2xl font-bold">
                  {students.filter(s => s.supportLevel === 'high').length}
                </h3>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-amber-600">Active Today</p>
                <h3 className="text-2xl font-bold">
                  {students.filter(s => s.lastActive === 'Today').length}
                </h3>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Students ({students.length})</TabsTrigger>
          <TabsTrigger value="high">High Support ({students.filter(s => s.supportLevel === 'high').length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({students.filter(s => s.status === 'inactive').length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-6">
          {viewType === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStudents.map(student => (
                <Card 
                  key={student.id} 
                  className={`overflow-hidden hover:shadow-md transition-all ${
                    student.status === 'inactive' ? 'opacity-70' : ''
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback>
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{student.name}</CardTitle>
                          <CardDescription>{student.grade}</CardDescription>
                        </div>
                      </div>
                      {getSupportLevelBadge(student.supportLevel)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Learning Progress</span>
                          <span>{student.progress}%</span>
                        </div>
                        <Progress value={student.progress} className="h-2" />
                      </div>
                      
                      <div className="text-sm">
                        <div className="flex items-center mt-2">
                          <Badge variant="outline" className="mr-2">
                            {student.needs}
                          </Badge>
                          <span className="text-muted-foreground text-xs">
                            Last active: {student.lastActive}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-muted/20 p-2 rounded-md">
                          <div className="text-muted-foreground text-xs">Assignments</div>
                          <div className="font-medium">{student.assignments.completed}/{student.assignments.total}</div>
                        </div>
                        <div className="bg-muted/20 p-2 rounded-md">
                          <div className="text-muted-foreground text-xs">Sessions</div>
                          <div className="font-medium">{student.sessions}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between bg-muted/30">
                    <Link href={`/teacher/students/${student.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View Profile
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Add Note
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Video className="h-4 w-4 mr-2" />
                          Schedule Session
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {student.status === 'active' ? (
                          <DropdownMenuItem className="text-amber-600">
                            <span className="h-4 w-4 mr-2">⏸️</span>
                            Mark as Inactive
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Active
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            // Table View
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2 h-4 w-4 rounded border-gray-300"
                          checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                          onChange={toggleAllStudents}
                        />
                        <span className="text-sm font-medium text-muted-foreground">Student</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Grade & Needs</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Progress</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Support Level</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Last Active</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Assignments</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr 
                      key={student.id} 
                      className={`border-b ${
                        student.status === 'inactive' ? 'bg-muted/20' : 
                        index % 2 === 1 ? 'bg-muted/10' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-3 h-4 w-4 rounded border-gray-300"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => toggleStudent(student.id)}
                          />
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarFallback className="text-xs">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{student.name}</div>
                            {student.status === 'inactive' && (
                              <Badge variant="outline" className="text-xs mt-1">Inactive</Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">{student.grade}</div>
                        <Badge variant="outline" className="mt-1 text-xs font-normal">
                          {student.needs}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Progress value={student.progress} className="h-2 w-24" />
                          <span className="text-sm">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getSupportLevelBadge(student.supportLevel)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {student.lastActive}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        <div className="font-medium">{student.assignments.completed}/{student.assignments.total}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/teacher/students/${student.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Video className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Add Note
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BookOpen className="h-4 w-4 mr-2" />
                                Assign Material
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {student.status === 'active' ? (
                                <DropdownMenuItem className="text-amber-600">
                                  <span className="h-4 w-4 mr-2">⏸️</span>
                                  Mark as Inactive
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as Active
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Bulk Actions */}
          {selectedStudents.length > 0 && (
            <div className="mt-4 p-4 bg-muted/20 rounded-lg border flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">{selectedStudents.length}</span> students selected
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Assign Task
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="high" className="pt-6">
          <div className="bg-red-50/50 border border-red-100 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <div className="bg-red-100 p-2 rounded-full mr-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">High Support Students</h3>
                <p className="text-muted-foreground mt-1">
                  These students require additional attention and support. Consider scheduling extra sessions or providing specialized materials.
                </p>
                <Button variant="outline" className="mt-4 border-red-200 text-red-700 hover:bg-red-50">
                  Schedule Support Sessions
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.filter(s => s.supportLevel === 'high').map(student => (
              <Card key={student.id} className="overflow-hidden border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback>
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{student.name}</CardTitle>
                        <CardDescription>{student.grade}</CardDescription>
                      </div>
                    </div>
                    {getSupportLevelBadge(student.supportLevel)}
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Learning Progress</span>
                        <span>{student.progress}%</span>
                      </div>
                      <Progress value={student.progress} className="h-2" />
                    </div>
                    
                    <div className="text-sm">
                      <div className="flex items-center mt-2">
                        <Badge variant="outline" className="mr-2">
                          {student.needs}
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                          Last active: {student.lastActive}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 p-3 rounded-md border border-red-100">
                      <h4 className="text-sm font-medium text-red-800 mb-1">Student Notes</h4>
                      <p className="text-xs text-red-700">{student.notes}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 flex justify-between bg-muted/30">
                  <Link href={`/teacher/students/${student.id}`}>
                    <Button size="sm">Schedule Support</Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="inactive" className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
            <h3 className="font-medium">Inactive Students</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Students who have been marked as inactive. You can reactivate them at any time.
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">No students found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find any students matching your search criteria.
          </p>
          <Button onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      )}
      
      {/* Student Details Sidebar - Could be implemented as a dialog or side panel */}
      
      {/* Pagination */}
      {filteredStudents.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{filteredStudents.length}</span> of <span className="font-medium">{students.length}</span> students
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-primary/10">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}