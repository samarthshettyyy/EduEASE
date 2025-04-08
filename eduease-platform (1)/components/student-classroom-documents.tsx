// app/components/student-classroom-documents.tsx
"use client";

import { useEffect, useState } from "react";
import { FileIcon, CheckCircle, Eye, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DocumentService, Document } from "@/app/services/documentService";
import { createClient } from "@/lib/supabase/client";

interface StudentClassroomDocumentsProps {
  studentId: string;
  classroomId: string;
  classroomName: string;
}

export function StudentClassroomDocuments({
  studentId,
  classroomId,
  classroomName,
}: StudentClassroomDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documentService = new DocumentService();
        const docs = await documentService.getStudentDocuments(studentId, classroomId);
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [studentId, classroomId]);

  const markAsViewed = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from("student_documents")
        .update({ viewed: true })
        .eq("document_id", documentId)
        .eq("student_id", studentId);

      if (error) {
        console.error("Error marking document as viewed:", error);
        return;
      }

      // Update local state
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId ? { ...doc, viewed: true } : doc
        )
      );
    } catch (error) {
      console.error("Error marking document as viewed:", error);
    }
  };

  const markAsCompleted = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from("student_documents")
        .update({ completed: true, viewed: true })
        .eq("document_id", documentId)
        .eq("student_id", studentId);

      if (error) {
        console.error("Error marking document as completed:", error);
        return;
      }

      // Update local state
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId ? { ...doc, viewed: true, completed: true } : doc
        )
      );
    } catch (error) {
      console.error("Error marking document as completed:", error);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word") || fileType.includes("document")) return "📝";
    if (fileType.includes("presentation") || fileType.includes("powerpoint"))
      return "📊";
    if (fileType.includes("spreadsheet") || fileType.includes("excel"))
      return "📈";
    if (fileType.includes("video")) return "🎬";
    if (fileType.includes("audio")) return "🎵";
    return "📁";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Learning Materials</CardTitle>
          <CardDescription>
            Materials shared by your teacher
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileIcon className="h-5 w-5 mr-2 text-primary" />
          Learning Materials
        </CardTitle>
        <CardDescription>
          Materials shared by your teacher for {classroomName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No learning materials have been shared yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="border rounded-lg p-4 hover:border-primary transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start">
                    <div className="mr-3 text-2xl">
                      {getFileIcon(doc.fileType)}
                    </div>
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      {doc.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
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
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-muted-foreground mt-3">
                  <span>{formatFileSize(doc.fileSize)}</span>
                  <span>
                    {new Date(doc.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => !doc.viewed && markAsViewed(doc.id)}
                  >
                    <Button size="sm" variant="default">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </a>

                  <a
                    href={doc.fileUrl}
                    download
                    onClick={() => !doc.viewed && markAsViewed(doc.id)}
                  >
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </a>

                  {!doc.completed && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-200 text-green-600 hover:bg-green-50"
                      onClick={() => markAsCompleted(doc.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}