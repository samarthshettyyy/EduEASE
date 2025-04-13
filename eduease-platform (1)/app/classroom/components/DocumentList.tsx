"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, CheckCircle, Clock, Eye, Loader, Upload } from "lucide-react"

interface Document {
  id: number
  name: string
  uploadedBy: string
  uploadDate: string
  viewed: boolean
  completed: boolean
  fileUrl?: string
}

interface DocumentListProps {
  documents: Document[]
  isLoading: boolean
  userRole: string
  onSelectDocument: (id: number) => void
  onMarkAsCompleted: (id: number) => void
}

export function DocumentList({ 
  documents, 
  isLoading, 
  userRole, 
  onSelectDocument, 
  onMarkAsCompleted 
}: DocumentListProps) {
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This would be implemented in the parent component and passed down as a prop
    console.log("File upload - would be handled by parent component")
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Classroom Documents</CardTitle>
        <CardDescription>
          {userRole === "teacher" 
            ? "Documents you've shared with students" 
            : "Learning materials shared by your teacher"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
              >
                <div 
                  className="flex items-center gap-3 flex-1"
                  onClick={() => onSelectDocument(doc.id)}
                >
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {userRole === "student" && (
                    <>
                      {doc.completed ? (
                        <div className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </div>
                      ) : doc.viewed ? (
                        <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          Viewed
                        </div>
                      ) : (
                        <div className="px-2 py-1 bg-amber-50 text-amber-600 text-xs rounded-full flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          New
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onSelectDocument(doc.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>

                    {userRole === "student" && !doc.completed && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsCompleted(doc.id);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No documents available yet</p>
            {userRole === "teacher" && (
              <div className="mt-4">
                <div className="relative inline-block">
                  <input
                    type="file"
                    id="file-upload-empty"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.txt,.docx"
                    onChange={(e) => handleFileUpload(e)}
                  />
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Your First Document
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DocumentList