// app/components/document-upload.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, X, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentService } from "@/app/services/documentService";

interface DocumentUploadProps {
  teacherId: string;
  classrooms: Array<{
    id: string;
    name: string;
  }>;
  onSuccess?: () => void;
}

export function DocumentUpload({ teacherId, classrooms, onSuccess }: DocumentUploadProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // Auto-fill title with file name (without extension)
      const fileName = e.target.files[0].name;
      const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      if (!title) {
        setTitle(fileNameWithoutExt);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError("Please provide a title for the document");
      return;
    }
    
    if (!classroomId) {
      setError("Please select a classroom");
      return;
    }
    
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    
    setError(null);
    setIsUploading(true);
    
    try {
      const documentService = new DocumentService();
      const document = await documentService.uploadDocument({
        title,
        description,
        file,
        teacherId,
        classroomId
      });
      
      if (document) {
        setSuccess(true);
        setTimeout(() => {
          resetForm();
          if (onSuccess) {
            onSuccess();
          }
        }, 2000);
      } else {
        setError("Failed to upload document. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  // Reset form state
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setClassroomId("");
    setFile(null);
    setSuccess(false);
    setError(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <FileUp className="h-5 w-5 mr-2 text-primary" />
          Upload Learning Material
        </CardTitle>
        <CardDescription>
          Share learning materials with your students. Files will be available in their classroom view.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* File Upload Area */}
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            {file ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary mr-2" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove File
                </Button>
              </div>
            ) : (
              <Label 
                htmlFor="file-upload" 
                className="cursor-pointer block p-8 text-center"
              >
                <FileUp className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <span className="block font-medium mb-1">
                  Click to upload a file
                </span>
                <span className="text-sm text-muted-foreground block">
                  Support for documents, presentations, PDFs, and videos
                </span>
                <Input 
                  id="file-upload"
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.mp4,.mov,.mp3,.wav"
                />
              </Label>
            )}
          </div>

          {/* Document Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                placeholder="Enter document title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe this learning material..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classroom">Classroom</Label>
              <Select 
                value={classroomId} 
                onValueChange={setClassroomId}
              >
                <SelectTrigger id="classroom">
                  <SelectValue placeholder="Select a classroom" />
                </SelectTrigger>
                <SelectContent>
                  {classrooms.map((classroom) => (
                    <SelectItem key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm">Document successfully uploaded and shared with students!</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
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
            disabled={isUploading || !file || !title || !classroomId}
            className="w-full sm:w-auto"
          >
            {isUploading ? (
              <>Uploading...</>
            ) : (
              <>Upload & Share with Students</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}