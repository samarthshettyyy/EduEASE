"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  School, 
  Users, 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Edit,
  Trash,
  FileUp,
  MessageSquare,
  Video,
  Calendar,
  ChevronDown,
  BookOpen,
  CheckCircle
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function ClassroomsListPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewType, setViewType] = useState("grid") // grid or table
  
  // Sample data for classrooms
  const classrooms = [
    {
      id: "c1",
      name: "Grade 5 Mathematics",
      subject: "Mathematics",
      students: 18,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      lastActive: "Today",
      progress: 75,
      resources: 12,
      meetings: 3,
      status: "active"
    },
    {
      id: "c2",
      name: "Reading & Comprehension",
      subject: "English",
      students: 22,
      color: "bg-green-100 text-green-800 border-green-200",
      lastActive: "Yesterday",
      progress: 68,
      resources: 18,
      meetings: 2,
      status: "active"
    },
    {
      id: "c3",
      name: "Science Explorer",
      subject: "Science",
      students: 16,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      lastActive: "2 days ago",
      progress: 82,
      resources: 15,
      meetings: 1,
      status: "active"
    },
    {
      id: "c4",
      name: "Social Studies",
      subject: "Social Studies",
      students: 20,
      color: "bg-amber-100 text-amber-800 border-amber-200",
      lastActive: "1 week ago",
      progress: 45,
      resources: 8,
      meetings: 0,
      status: "inactive"
    },
    {
      id: "c5",
      name: "Art & Creativity",
      subject: "Art",
      students: 14,
      color: "bg-pink-100 text-pink-800 border-pink-200",
      lastActive: "3 days ago",
      progress: 60,
      resources: 10,
      meetings: 1,
      status: "active"
    },
    {
      id: "c6",
      name: "Physical Education",
      subject: "PE",
      students: 24,
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      lastActive: "4 days ago",
      progress: 50,
      resources: 6,
      meetings: 0,
      status: "archived"
    }
  ]
  
  const filteredClassrooms = classrooms.filter(classroom => 
    classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classroom.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Classrooms</h1>
          <p className="text-muted-foreground mt-1">Manage and organize your virtual learning spaces</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/teacher/classrooms/create">
            <Button className="w-full sm:w-auto gap-1">
              <Plus className="h-4 w-4" />
              Create Classroom
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search classrooms..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="social">Social Studies</SelectItem>
              <SelectItem value="art">Art</SelectItem>
              <SelectItem value="pe">PE</SelectItem>
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
                Sort by Recent Activity
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
                <p className="text-sm font-medium text-blue-600">Total Classrooms</p>
                <h3 className="text-2xl font-bold">{classrooms.length}</h3>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <School className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50/50 border-green-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-green-600">Active Students</p>
                <h3 className="text-2xl font-bold">
                  {classrooms.reduce((sum, c) => sum + c.students, 0)}
                </h3>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50/50 border-purple-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-purple-600">Learning Materials</p>
                <h3 className="text-2xl font-bold">
                  {classrooms.reduce((sum, c) => sum + c.resources, 0)}
                </h3>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-amber-600">Scheduled Meetings</p>
                <h3 className="text-2xl font-bold">
                  {classrooms.reduce((sum, c) => sum + c.meetings, 0)}
                </h3>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Classrooms ({classrooms.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({classrooms.filter(c => c.status === 'active').length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({classrooms.filter(c => c.status === 'inactive').length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({classrooms.filter(c => c.status === 'archived').length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-6">
          {viewType === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClassrooms.map(classroom => (
                <Card 
                  key={classroom.id} 
                  className={`overflow-hidden border hover:shadow-md transition-all ${
                    classroom.status === 'inactive' ? 'opacity-70' : 
                    classroom.status === 'archived' ? 'opacity-60 bg-gray-50' : ''
                  }`}
                >
                  <div className={`h-2 ${classroom.color.split(" ")[0]}`}></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge className={classroom.color}>
                        {classroom.subject}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        {classroom.students}
                      </div>
                    </div>
                    <CardTitle className="mt-2">{classroom.name}</CardTitle>
                    <CardDescription>Last active: {classroom.lastActive}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Overall Progress</span>
                          <span>{classroom.progress}%</span>
                        </div>
                        <Progress value={classroom.progress} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          <span>{classroom.resources} Resources</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          <span>{classroom.meetings} Meetings</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between bg-muted/30">
                    <Link href={`/teacher/classrooms/${classroom.id}`}>
                      <Button variant="outline" size="sm">
                        Manage Classroom
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
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Classroom
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileUp className="h-4 w-4 mr-2" />
                          Upload Materials
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Video className="h-4 w-4 mr-2" />
                          Start Meeting
                        </DropdownMenuItem>
                        {classroom.status === 'active' ? (
                          <DropdownMenuItem className="text-amber-600">
                            <span className="h-4 w-4 mr-2">⏸️</span>
                            Set as Inactive
                          </DropdownMenuItem>
                        ) : classroom.status === 'inactive' ? (
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Set as Active
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Classroom
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
              
              <Link href="/teacher/classrooms/create">
                <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center h-full hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">Create New Classroom</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Set up a new virtual learning space
                  </p>
                </div>
              </Link>
            </div>
          ) : (
            // Table View
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Classroom</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Subject</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">Students</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">Progress</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">Resources</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">Meetings</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClassrooms.map((classroom, index) => (
                    <tr 
                      key={classroom.id} 
                      className={`border-b ${
                        classroom.status === 'inactive' ? 'bg-muted/20' : 
                        classroom.status === 'archived' ? 'bg-muted/30' : 
                        index % 2 === 1 ? 'bg-muted/10' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <Link href={`/teacher/classrooms/${classroom.id}`} className="font-medium hover:text-primary">
                            {classroom.name}
                          </Link>
                          <div className="text-xs text-muted-foreground">Last active: {classroom.lastActive}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={classroom.color}>
                          {classroom.subject}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center">
                          <Users className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          <span>{classroom.students}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={classroom.progress} className="h-2 w-24" />
                          <span className="text-sm">{classroom.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">{classroom.resources}</td>
                      <td className="px-4 py-3 text-center">{classroom.meetings}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge 
                          variant="outline" 
                          className={`
                            ${classroom.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 
                              classroom.status === 'inactive' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                              'bg-gray-100 text-gray-800 border-gray-200'}
                          `}
                        >
                          {classroom.status.charAt(0).toUpperCase() + classroom.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/teacher/classrooms/${classroom.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/teacher/classrooms/${classroom.id}/documents`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileUp className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/teacher/classrooms/${classroom.id}/meetings`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Video className="h-4 w-4" />
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
                                <Users className="h-4 w-4 mr-2" />
                                Manage Students
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {classroom.status === 'active' ? (
                                <DropdownMenuItem className="text-amber-600">
                                  <span className="h-4 w-4 mr-2">⏸️</span>
                                  Set as Inactive
                                </DropdownMenuItem>
                              ) : classroom.status === 'inactive' ? (
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Set as Active
                                </DropdownMenuItem>
                              ) : null}
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="h-4 w-4 mr-2" />
                                Delete Classroom
                              </DropdownMenuItem>
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
        </TabsContent>
        
        <TabsContent value="active" className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
            <h3 className="font-medium">Filtered View: Active Classrooms</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Showing {classrooms.filter(c => c.status === 'active').length} active classrooms
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="inactive" className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
            <h3 className="font-medium">Filtered View: Inactive Classrooms</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Showing {classrooms.filter(c => c.status === 'inactive').length} inactive classrooms
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="archived" className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
            <h3 className="font-medium">Filtered View: Archived Classrooms</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Showing {classrooms.filter(c => c.status === 'archived').length} archived classrooms
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Empty State */}
      {filteredClassrooms.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg">
          <School className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">No classrooms found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find any classrooms matching your search criteria.
          </p>
          <Button onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      )}
      
      {/* Pagination */}
      {filteredClassrooms.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{filteredClassrooms.length}</span> of <span className="font-medium">{classrooms.length}</span> classrooms
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-primary/10">
              1
            </Button>
            <Button variant="outline" size="sm" className="w-8 h-8 p-0">
              2
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