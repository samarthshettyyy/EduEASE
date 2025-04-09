"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ChevronLeft, 
  School, 
  BookOpen, 
  Users, 
  Calendar, 
  Clock, 
  Settings,
  Palette,
  Plus,
  User,
  X
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

// Import context or state management (add this)
import { useClassroomStore } from "@/lib/store/classroom-store"

export default function CreateClassroomPage() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [classroomColor, setClassroomColor] = useState("blue")
  
  // Add this - Access the global classroom store
  const addClassroom = useClassroomStore((state) => state.addClassroom)
  
  // Form state
  const [classroomName, setClassroomName] = useState("")
  const [subject, setSubject] = useState("mathematics")
  const [grade, setGrade] = useState("5")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  
  // Sample data for available students
  const availableStudents = [
    { id: "s1", name: "Alex Miller", grade: "Grade 5", needs: "Dyslexia" },
    { id: "s2", name: "Emma Lewis", grade: "Grade 5", needs: "ADHD" },
    { id: "s3", name: "Jason Thomas", grade: "Grade 5", needs: "Dyslexia" },
    { id: "s4", name: "Sarah Kim", grade: "Grade 5", needs: "Autism" },
    { id: "s5", name: "Michael Roberts", grade: "Grade 5", needs: "Dyslexia" },
    { id: "s6", name: "Olivia Parker", grade: "Grade 5", needs: "None" },
    { id: "s7", name: "Noah Wilson", grade: "Grade 5", needs: "ADHD" },
    { id: "s8", name: "Sophia Chen", grade: "Grade 5", needs: "Autism" },
  ]
  
  const toggleStudent = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }
  
  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!classroomName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Classroom name is required",
      })
      return
    }
    
    setIsCreating(true)
    
    // Generate a unique ID for the new classroom
    const id = `c${Date.now()}`
    
    // Create the new classroom object
    const newClassroom = {
      id,
      name: classroomName,
      subject,
      students: selectedStudents.length,
      color: `bg-${classroomColor}-100 text-${classroomColor}-800 border-${classroomColor}-200`,
      lastActive: "Just now",
      progress: 0,
      resources: 0,
      meetings: 0,
      status: "active"
    }
    
    // Add new classroom to store
    addClassroom(newClassroom)
    
    // Simulate API call and database update
    setTimeout(() => {
      setIsCreating(false)
      toast({
        title: "Classroom created successfully",
        description: "Your new classroom has been created and students have been notified.",
      })
      router.push("/teacher/classrooms")
    }, 1500)
  }
  
  const colorOptions = [
    { id: "blue", name: "Blue", bg: "bg-blue-100", text: "text-blue-800", demo: "border-blue-200" },
    { id: "green", name: "Green", bg: "bg-green-100", text: "text-green-800", demo: "border-green-200" },
    { id: "purple", name: "Purple", bg: "bg-purple-100", text: "text-purple-800", demo: "border-purple-200" },
    { id: "amber", name: "Amber", bg: "bg-amber-100", text: "text-amber-800", demo: "border-amber-200" },
    { id: "pink", name: "Pink", bg: "bg-pink-100", text: "text-pink-800", demo: "border-pink-200" },
    { id: "indigo", name: "Indigo", bg: "bg-indigo-100", text: "text-indigo-800", demo: "border-indigo-200" },
  ]
  
  const getCurrentColorClasses = () => {
    const color = colorOptions.find(c => c.id === classroomColor)
    return color ? `${color.bg} ${color.text} ${color.demo}` : "bg-blue-100 text-blue-800 border-blue-200"
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <Link 
          href="/teacher/classrooms" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Classrooms
        </Link>
        <h1 className="text-3xl font-bold">Create New Classroom</h1>
        <p className="text-muted-foreground mt-1">Set up a virtual learning space for your students</p>
      </div>
      
      <form onSubmit={handleCreateClassroom}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Classroom Details */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <School className="h-5 w-5 mr-2 text-primary" />
                  Classroom Details
                </CardTitle>
                <CardDescription>Basic information about your new classroom</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Classroom Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Grade 5 Mathematics" 
                    required 
                    value={classroomName}
                    onChange={(e) => setClassroomName(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select 
                      value={subject} 
                      onValueChange={(value) => setSubject(value)}
                    >
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="english">Reading & Language</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="social">Social Studies</SelectItem>
                        <SelectItem value="art">Art & Creativity</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade Level</Label>
                    <Select 
                      value={grade} 
                      onValueChange={(value) => setGrade(value)}
                    >
                      <SelectTrigger id="grade">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="k">Kindergarten</SelectItem>
                        <SelectItem value="1">Grade 1</SelectItem>
                        <SelectItem value="2">Grade 2</SelectItem>
                        <SelectItem value="3">Grade 3</SelectItem>
                        <SelectItem value="4">Grade 4</SelectItem>
                        <SelectItem value="5">Grade 5</SelectItem>
                        <SelectItem value="6">Grade 6</SelectItem>
                        <SelectItem value="7">Grade 7</SelectItem>
                        <SelectItem value="8">Grade 8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Provide a brief description about this classroom and its learning goals"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Classroom Color</Label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {colorOptions.map(color => (
                      <div 
                        key={color.id}
                        className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center ${color.bg} border-2 ${classroomColor === color.id ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
                        onClick={() => setClassroomColor(color.id)}
                        title={color.name}
                      >
                        {classroomColor === color.id && (
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Badge className={getCurrentColorClasses()}>Sample Tag</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input 
                      type="date" 
                      id="start-date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date (Optional)</Label>
                    <Input 
                      type="date" 
                      id="end-date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Settings Panel */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Classroom Settings
                </CardTitle>
                <CardDescription>Configure accessibility options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Text-to-Speech</Label>
                      <p className="text-xs text-muted-foreground">Enable for all resources</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Dyslexic Font</Label>
                      <p className="text-xs text-muted-foreground">Use dyslexia-friendly fonts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Visual Aids</Label>
                      <p className="text-xs text-muted-foreground">Add visual supports</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Auto Recording</Label>
                      <p className="text-xs text-muted-foreground">Record all sessions</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <Label className="font-medium">Schedule</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="space-y-1">
                      <Label htmlFor="schedule-day" className="text-xs">Day</Label>
                      <Select defaultValue="monday">
                        <SelectTrigger id="schedule-day" className="h-8">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="schedule-time" className="text-xs">Time</Label>
                      <Select defaultValue="1000">
                        <SelectTrigger id="schedule-time" className="h-8">
                          <SelectValue placeholder="Time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0900">9:00 AM</SelectItem>
                          <SelectItem value="1000">10:00 AM</SelectItem>
                          <SelectItem value="1100">11:00 AM</SelectItem>
                          <SelectItem value="1300">1:00 PM</SelectItem>
                          <SelectItem value="1400">2:00 PM</SelectItem>
                          <SelectItem value="1500">3:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Student Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Assign Students
            </CardTitle>
            <CardDescription>Select students to add to this classroom</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left column - Available students */}
              <div className="flex-1">
                <div className="p-3 bg-muted/50 rounded-lg mb-3">
                  <Label>Available Students ({availableStudents.length})</Label>
                  <Input 
                    placeholder="Search students..." 
                    className="mt-2"
                  />
                </div>
                <div className="h-[300px] overflow-y-auto border rounded-lg">
                  {availableStudents.map(student => (
                    <div 
                      key={student.id}
                      className={`flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/30 cursor-pointer ${selectedStudents.includes(student.id) ? 'bg-primary/5' : ''}`}
                      onClick={() => toggleStudent(student.id)}
                    >
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarFallback className="text-xs">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.grade}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 text-xs font-normal">
                          {student.needs}
                        </Badge>
                        {selectedStudents.includes(student.id) ? (
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <X className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right column - Selected students */}
              <div className="flex-1">
                <div className="p-3 bg-muted/50 rounded-lg mb-3">
                  <Label>Selected Students ({selectedStudents.length})</Label>
                </div>
                {selectedStudents.length > 0 ? (
                  <div className="h-[300px] overflow-y-auto border rounded-lg">
                    {selectedStudents.map(id => {
                      const student = availableStudents.find(s => s.id === id)!
                      return (
                        <div 
                          key={student.id}
                          className="flex items-center justify-between p-3 border-b last:border-b-0"
                        >
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarFallback className="text-xs">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.grade}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2 text-xs font-normal">
                              {student.needs}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => toggleStudent(student.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="h-[300px] border rounded-lg flex flex-col items-center justify-center text-center p-6">
                    <Users className="h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="font-medium">No Students Selected</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click on students from the list to add them to this classroom
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isCreating || !classroomName.trim()}
          >
            {isCreating ? "Creating..." : "Create Classroom"}
          </Button>
        </div>
      </form>
    </div>
  )
}