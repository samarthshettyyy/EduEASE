"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  CheckCircle,
  Loader
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

interface Classroom {
  id: number | string;
  name: string;
  subject: string;
  students: number;
  color: string;
  lastActive?: string;
  progress?: number;
  resources?: number;
  meetings?: number;
  status?: string;
  code?: string;
  roomCode?: string;
  description?: string;
  grade?: string;
}

export default function TeacherClassroomsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState("grid"); // grid or table
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  
  // Initial data fetch
  useEffect(() => {
    const fetchClassrooms = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/classrooms');
        
        if (!response.ok) {
          throw new Error('Failed to fetch classrooms');
        }
        
        const data = await response.json();
        
        // Enhance the classroom data with defaults for missing fields
        const enhancedClassrooms = (data.classrooms || []).map(classroom => ({
          ...classroom,
          status: classroom.status || 'active',
          progress: classroom.progress || Math.floor(Math.random() * 60) + 40, // Random 40-100%
          resources: classroom.resources || Math.floor(Math.random() * 10) + 1, // Random 1-10
          meetings: classroom.meetings || Math.floor(Math.random() * 3), // Random 0-2
          lastActive: classroom.lastActive || 'Today',
          // Make sure roomCode is available as code for UI compatibility
          code: classroom.roomCode || classroom.code
        }));
        
        setClassrooms(enhancedClassrooms);
      } catch (error) {
        console.error("Error fetching classrooms:", error);
        toast({
          title: "Error",
          description: "Failed to load classrooms",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClassrooms();
    
    // Check for newly created classroom in session storage
    const checkForNewClassroom = () => {
      const justCreatedClassroom = sessionStorage.getItem('justCreatedClassroom');
      
      if (justCreatedClassroom) {
        try {
          const newClassroom = JSON.parse(justCreatedClassroom);
          setClassrooms(prev => {
            // Check if classroom already exists in the list
            if (!prev.some(c => c.id === newClassroom.id)) {
              return [...prev, newClassroom];
            }
            return prev;
          });
          
          // Clear from session storage
          sessionStorage.removeItem('justCreatedClassroom');
        } catch (error) {
          console.error('Error parsing new classroom data:', error);
        }
      }
    };
    
    checkForNewClassroom();
  }, []);
  
  // Apply filters to classrooms
  const filteredClassrooms = classrooms.filter(classroom => {
    // Apply search filter
    const nameMatch = classroom.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const subjectMatch = classroom.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || subjectMatch;
  
  
    
    // Apply status filter
    const matchesStatus = statusFilter === "all" || classroom.status === statusFilter;
    
    // Apply subject filter
    const matchesSubject = subjectFilter === "all" || 
      (classroom.subject && classroom.subject.toLowerCase() === subjectFilter);
    
    return matchesSearch && matchesStatus && matchesSubject;
  });
  
  // Handle status change
  const handleStatusChange = async (id: string | number, newStatus: string) => {
    try {
      // Update local state first for UI responsiveness
      setClassrooms(classrooms.map(classroom => 
        classroom.id === id ? { ...classroom, status: newStatus } : classroom
      ));
      
      // Backend update - in a real implementation, you'd have an API endpoint for this
      // const response = await fetch(`/api/classrooms/${id}/status`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ status: newStatus }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to update classroom status');
      // }
      
      toast({
        title: "Status updated",
        description: `Classroom status has been changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating classroom status:", error);
      toast({
        title: "Error",
        description: "Failed to update classroom status",
        variant: "destructive"
      });
      
      // Revert local state change on error
      fetchClassrooms();
    }
  };
  
  // Fetch classrooms function (for refreshing)
  const fetchClassrooms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/classrooms');
      
      if (!response.ok) {
        throw new Error('Failed to fetch classrooms');
      }
      
      const data = await response.json();
      setClassrooms(data.classrooms || []);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle classroom deletion
  const handleDeleteClassroom = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this classroom? This action cannot be undone.")) {
      try {
        // Remove from local state first for UI responsiveness
        setClassrooms(classrooms.filter(classroom => classroom.id !== id));
        
        // Backend deletion - in a real implementation, you'd have an API endpoint for this
        // const response = await fetch(`/api/classrooms/${id}`, {
        //   method: 'DELETE',
        // });
        
        // if (!response.ok) {
        //   throw new Error('Failed to delete classroom');
        // }
        
        toast({
          title: "Classroom deleted",
          description: "The classroom has been permanently removed",
        });
      } catch (error) {
        console.error("Error deleting classroom:", error);
        toast({
          title: "Error",
          description: "Failed to delete classroom",
          variant: "destructive"
        });
        
        // Revert local state change on error
        fetchClassrooms();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading classrooms...</p>
        </div>
      </div>
    );
  }

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
          <Select 
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
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
          
          <Select 
            value={subjectFilter}
            onValueChange={setSubjectFilter}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="social studies">Social Studies</SelectItem>
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
                  {classrooms.reduce((sum, c) => sum + (c.students || 0), 0)}
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
                  {classrooms.reduce((sum, c) => sum + (c.resources || 0), 0)}
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
                  {classrooms.reduce((sum, c) => sum + (c.meetings || 0), 0)}
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
                  <div className={`h-2 ${classroom.color ? classroom.color.split(" ")[0] : 'bg-blue-100'}`}></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge className={classroom.color || "bg-blue-100 text-blue-800 border-blue-200"}>
                        {classroom.subject || "General"}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        {classroom.students || 0}
                      </div>
                    </div>
                    <CardTitle className="mt-2">{classroom.name}</CardTitle>
                    <CardDescription>
                      Last active: {classroom.lastActive || 'Today'}
                      {(classroom.roomCode || classroom.code) && (
                        <div className="mt-1 font-mono text-xs bg-muted inline-block px-1.5 py-0.5 rounded">
                          Code: {classroom.roomCode || classroom.code}
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Overall Progress</span>
                          <span>{classroom.progress || 0}%</span>
                        </div>
                        <Progress value={classroom.progress || 0} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          <span>{classroom.resources || 0} Resources</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          <span>{classroom.meetings || 0} Meetings</span>
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
                          <DropdownMenuItem 
                            className="text-amber-600"
                            onClick={() => handleStatusChange(classroom.id, 'inactive')}
                          >
                            <span className="h-4 w-4 mr-2">⏸️</span>
                            Set as Inactive
                          </DropdownMenuItem>
                        ) : classroom.status === 'inactive' ? (
                          <DropdownMenuItem 
                            className="text-green-600"
                            onClick={() => handleStatusChange(classroom.id, 'active')}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Set as Active
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteClassroom(classroom.id)}
                        >
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
                          <div className="text-xs text-muted-foreground">
                            Last active: {classroom.lastActive || 'Today'}
                            {(classroom.roomCode || classroom.code) && (
                              <span className="ml-2 font-mono bg-muted px-1 py-0.5 rounded">
                                Code: {classroom.roomCode || classroom.code}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={classroom.color || "bg-blue-100 text-blue-800 border-blue-200"}>
                          {classroom.subject || "General"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center">
                          <Users className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          <span>{classroom.students || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={classroom.progress || 0} className="h-2 w-24" />
                          <span className="text-sm">{classroom.progress || 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">{classroom.resources || 0}</td>
                      <td className="px-4 py-3 text-center">{classroom.meetings || 0}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge 
                          variant="outline" 
                          className={`
                            ${classroom.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 
                              classroom.status === 'inactive' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                              'bg-gray-100 text-gray-800 border-gray-200'}
                          `}
                        >
                          {classroom.status ? classroom.status.charAt(0).toUpperCase() + classroom.status.slice(1) : 'Active'}
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
                                <DropdownMenuItem 
                                  className="text-amber-600"
                                  onClick={() => handleStatusChange(classroom.id, 'inactive')}
                                >
                                  <span className="h-4 w-4 mr-2">⏸️</span>
                                  Set as Inactive
                                </DropdownMenuItem>
                              ) : classroom.status === 'inactive' ? (
                                <DropdownMenuItem 
                                  className="text-green-600"
                                  onClick={() => handleStatusChange(classroom.id, 'active')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Set as Active
                                </DropdownMenuItem>
                              ) : null}
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteClassroom(classroom.id)}
                              >
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
      {filteredClassrooms.length === 0 && classrooms.length > 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg">
          <School className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">No classrooms found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find any classrooms matching your search criteria.
          </p>
          <Button onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setSubjectFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>
      )}
      
      {/* No Classrooms State */}
      {classrooms.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg">
          <School className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">No classrooms yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't created any classrooms yet. Create your first classroom to get started.
          </p>
          <Link href="/teacher/classrooms/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Classroom
            </Button>
          </Link>
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
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}