// app/teacher/documents/upload/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Classroom {
  id: number;
  name: string;
}

export default function UploadDocumentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Fetch current teacher's ID and classrooms
    const fetchTeacherData = async () => {
      try {
        // Get current user session
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to access this page.",
          });
          router.push("/login");
          return;
        }
        
        const userData = await response.json();
        
        if (userData.role !== 'teacher') {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Only teachers can upload documents.",
          });
          router.push("/dashboard");
          return;
        }
        
        setTeacherId(userData.id);
        
        // Get teacher's classrooms
        const classroomsResponse = await fetch(`/api/teacher/classrooms`);
        if (!classroomsResponse.ok) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load classrooms.",
          });
          return;
        }
        
        const classroomsData = await classroomsResponse.json();
        setClassrooms(classroomsData.classrooms || []);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeacherData();
  }, [router, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Auto-populate title with file name (without extension)
      if (!title) {
        const fileName = file.name;
        const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        setTitle(fileNameWithoutExt);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !title || !selectedClassroomId) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a file, title, and select a classroom.",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('classroomId', String(selectedClassroomId));
      
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error uploading document');
      }
      
      toast({
        title: "Upload Successful",
        description: "The document has been shared with your students.",
      });
      
      // Delay navigation to allow toast to be seen
      setTimeout(() => {
        router.push(`/teacher/classrooms/${selectedClassroomId}`);
      }, 1500);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="gap-1 mb-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold flex items-center">
          <BookOpen className="h-6 w-6 mr-2 text-primary" />
          Upload Learning Material
        </h1>
        <p className="text-muted-foreground mt-1">
          Share documents, presentations, and other learning materials with your students
        </p>
      </div>

      <div className="bg-card border shadow rounded-lg">
        <form onSubmit={handleUpload}>
          <div className="p-6 space-y-4">
            {/* File Upload Area */}
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-primary mr-2" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedFile(null)}
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <div>
                  <label 
                    htmlFor="file-upload" 
                    className="cursor-pointer block p-8 text-center"
                  >
                    <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <span className="block font-medium mb-1">
                      Click to upload a file
                    </span>
                    <span className="text-sm text-muted-foreground block">
                      Support for documents, presentations, PDFs, and videos
                    </span>
                    <input 
                      id="file-upload"
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.mp4,.mov,.mp3,.wav"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Document Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Document Title</label>
                <input
                  id="title"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Enter document title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
                <textarea
                  id="description"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Briefly describe this learning material..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="classroom" className="text-sm font-medium">Classroom</label>
                <select
                  id="classroom"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={selectedClassroomId || ""}
                  onChange={(e) => setSelectedClassroomId(Number(e.target.value))}
                >
                  <option value="">Select a classroom</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 p-6 bg-muted/20 border-t justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isUploading || !selectedFile || !title || !selectedClassroomId}
            >
              {isUploading ? (
                <>Uploading...</>
              ) : (
                <>Upload & Share with Students</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}