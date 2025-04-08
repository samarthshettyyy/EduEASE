// app/components/DocumentList.tsx
"use client"

import { useState } from "react";
import { BookOpen, MoreVertical, Eye, Download, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Document {
  id: number | string;
  name: string;
  uploadedBy: string;
  uploadDate: string;
  viewed?: boolean;
  completed?: boolean;
  fileUrl?: string;
}

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  userRole: string;
  onSelectDocument: (documentId: number | string) => void;
  onMarkAsCompleted?: (documentId: number | string) => void;
}

export default function DocumentList({
  documents,
  isLoading,
  userRole,
  onSelectDocument,
  onMarkAsCompleted
}: DocumentListProps) {
  const [hoveredDocId, setHoveredDocId] = useState<number | string | null>(null);

  // Handle marking a document as completed
  const handleMarkAsCompleted = async (documentId: number | string) => {
    if (onMarkAsCompleted) {
      onMarkAsCompleted(documentId);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classroom Documents</CardTitle>
          <CardDescription>Loading available documents...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classroom Documents</CardTitle>
          <CardDescription>Documents shared for this classroom</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No documents available yet</p>
          </div>
        </CardContent>
      </Card>
    );
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
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/40 transition-colors"
              onMouseEnter={() => setHoveredDocId(doc.id)}
              onMouseLeave={() => setHoveredDocId(null)}
            >
              <div 
                className="flex items-center gap-3 flex-1 cursor-pointer"
                onClick={() => onSelectDocument(doc.id)}
              >
                <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">Uploaded by {doc.uploadedBy} on {doc.uploadDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {userRole === "student" && (
                  <>
                    {doc.completed ? (
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : doc.viewed ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        <Eye className="h-3 w-3 mr-1" />
                        Viewed
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                        <Clock className="h-3 w-3 mr-1" />
                        New
                      </Badge>
                    )}
                  </>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onSelectDocument(doc.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    
                    {doc.fileUrl && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(doc.fileUrl, '_blank');
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                    )}
                    
                    {userRole === "student" && !doc.completed && (
                      <DropdownMenuItem onClick={() => handleMarkAsCompleted(doc.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${hoveredDocId === doc.id ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                  onClick={() => onSelectDocument(doc.id)}
                >
                  Open
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}