"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileUp, X, FileText, ChevronLeft, Users, Settings, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function DocumentUploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [showStudentSelector, setShowStudentSelector] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      setSelectedFiles([...selectedFiles, ...fileArray])
    }
  }
  
  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)
  }
  
  const toggleStudent = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }
  
  const handleUpload = () => {
    if (selectedFiles.length === 0) return
    
    setUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploadSuccess(true)
          toast({
            title: "Upload complete",
            description: "Your documents have been successfully uploaded with accessibility features.",
          })
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link 
          href="/teacher/documents" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Documents
        </Link>
        <h1 className="text-3xl font-bold">Upload Learning Materials</h1>
        <p className="text-muted-foreground mt-1">Add accessible documents with specialized features for students with diverse learning needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>Add learning materials with accessibility features</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  multiple 
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc,.txt,.rtf"
                />
                <FileUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Drag and drop your files here</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Or click to browse. Supports PDF, DOCX, TXT (max 10MB per file)
                </p>
                <Button variant="outline" className="mx-auto">
                  Select Files
                </Button>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Selected Files ({selectedFiles.length})</h3>
                  <div className="border rounded-lg overflow-hidden">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border-b last:border-b-0">
                        <div className="flex items-center">
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="rounded-full h-6 w-6 flex items-center justify-center hover:bg-gray-100"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {uploading && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {uploadSuccess && (
                <div className="mt-6 bg-green-50 border border-green-100 rounded-lg p-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium text-green-800">Upload Complete!</p>
                    <p className="text-sm text-green-700">Your documents have been successfully uploaded with accessibility features.</p>
                  </div>
                </div>
              )}
              
              {/* Document Metadata Section */}
              {selectedFiles.length > 0 && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Document Information</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="document-title">Document Title</Label>
                      <Input id="document-title" placeholder="Enter a descriptive title for your document" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="document-description">Description</Label>
                      <Textarea 
                        id="document-description" 
                        placeholder="Provide a brief description of the document's content"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="document-subject">Subject</Label>
                        <Select defaultValue="mathematics">
                          <SelectTrigger id="document-subject">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mathematics">Mathematics</SelectItem>
                            <SelectItem value="english">Reading & Language</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="social">Social Studies</SelectItem>
                            <SelectItem value="art">Art & Creativity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="document-tags">Tags</Label>
                        <Input id="document-tags" placeholder="e.g. fractions, practice, grade5" />
                        <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Difficulty Level</Label>
                      <RadioGroup defaultValue="medium" className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="easy" id="easy" />
                          <Label htmlFor="easy">Easy</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">Medium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hard" id="hard" />
                          <Label htmlFor="hard">Hard</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Student Selector (conditionally shown) */}
              {showStudentSelector && (
                <div className="mt-6 border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Select Students</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowStudentSelector(false)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Close
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    {availableStudents.map(student => (
                      <div 
                        key={student.id}
                        className={`flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/20 ${
                          selectedStudents.includes(student.id) ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <Checkbox 
                            id={`student-${student.id}`} 
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() => toggleStudent(student.id)}
                            className="mr-3"
                          />
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarFallback className="text-xs">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Label 
                              htmlFor={`student-${student.id}`}
                              className="font-medium text-sm cursor-pointer"
                            >
                              {student.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">{student.grade}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {student.needs}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (selectedStudents.length === availableStudents.length) {
                          setSelectedStudents([]);
                        } else {
                          setSelectedStudents(availableStudents.map(s => s.id));
                        }
                      }}
                    >
                      {selectedStudents.length === availableStudents.length 
                        ? "Unselect All" 
                        : "Select All"
                      }
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => setShowStudentSelector(false)}
                    >
                      Apply ({selectedStudents.length} selected)
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedFiles([])}>
                Clear All
              </Button>
              <Button onClick={handleUpload} disabled={selectedFiles.length === 0 || uploading}>
                {uploading ? "Uploading..." : "Upload Documents"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Settings Panel */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Accessibility Options
              </CardTitle>
              <CardDescription>Configure support features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Accessibility Features</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="tts" defaultChecked />
                    <Label htmlFor="tts" className="text-sm font-normal">Text-to-Speech</Label>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dyslexic-font" defaultChecked />
                    <Label htmlFor="dyslexic-font" className="text-sm font-normal">Dyslexic-Friendly Font</Label>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="visual-aids" defaultChecked />
                    <Label htmlFor="visual-aids" className="text-sm font-normal">Visual Aids</Label>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="highlighting" />
                    <Label htmlFor="highlighting" className="text-sm font-normal">Text Highlighting</Label>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-3">Text-to-Speech Options</h3>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="voice-type" className="text-xs">Voice Type</Label>
                    <Select defaultValue="default">
                      <SelectTrigger id="voice-type">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default Voice</SelectItem>
                        <SelectItem value="female">Female Voice</SelectItem>
                        <SelectItem value="male">Male Voice</SelectItem>
                        <SelectItem value="child">Child Voice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="voice-speed" className="text-xs">Reading Speed</Label>
                    <Select defaultValue="normal">
                      <SelectTrigger id="voice-speed">
                        <SelectValue placeholder="Select speed" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="fast">Fast</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="highlight-mode" className="text-xs">Highlight Mode</Label>
                    <Select defaultValue="sentence">
                      <SelectTrigger id="highlight-mode">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="word">Word by Word</SelectItem>
                        <SelectItem value="sentence">Sentence by Sentence</SelectItem>
                        <SelectItem value="paragraph">Paragraph</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-3">Assign To</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="classroom" className="text-xs">Classroom</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="classroom">
                        <SelectValue placeholder="Select classroom" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classrooms</SelectItem>
                        <SelectItem value="c1">Grade 5 Mathematics</SelectItem>
                        <SelectItem value="c2">Reading & Comprehension</SelectItem>
                        <SelectItem value="c3">Science Explorer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-students" defaultChecked />
                      <Label htmlFor="notify-students" className="text-sm font-normal">Notify Students</Label>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => setShowStudentSelector(true)}
                  >
                    <Users className="h-3.5 w-3.5 mr-1.5" />
                    Select Specific Students ({selectedStudents.length})
                  </Button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800 mb-1">Document Accessibility</h4>
                    <p className="text-xs text-amber-700">
                      The system will automatically process your documents to add accessibility features based on the selected options.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Publication Card */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Publication Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label htmlFor="document-publish" className="text-sm">Publish Immediately</Label>
                  <p className="text-xs text-muted-foreground">Make available now</p>
                </div>
                <Switch id="document-publish" defaultChecked />
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="schedule-date" className="text-sm">Schedule Publication</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input id="schedule-date" type="date" disabled />
                  <Input id="schedule-time" type="time" disabled />
                </div>
                <p className="text-xs text-muted-foreground">Set future availability date</p>
              </div>
              
              <div className="pt-3 border-t mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="document-assignment" className="text-sm">Assign as Homework</Label>
                    <p className="text-xs text-muted-foreground">Create assignment for students</p>
                  </div>
                  <Switch id="document-assignment" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}