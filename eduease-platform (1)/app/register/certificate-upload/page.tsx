"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

export default function CertificateUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    
    setIsUploading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      // Add userId from sessionStorage
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        formData.append("userId", userId);
      }
      
      const response = await fetch("/api/certificate", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }
      
      toast({
        title: "Certificate uploaded successfully",
        description: "Your certificate has been uploaded and will be verified soon.",
      });
      
      // Redirect to dashboard or confirmation page
      router.push("/dashboard");
    } catch (error) {
      console.error("Upload error:", error);
      setError(error instanceof Error ? error.message : "Failed to upload certificate");
      
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Disability Certificate Upload</h1>
          <p className="text-sm text-muted-foreground">
            Please upload a government-verified disability certificate (PDF or Image)
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Certificate</label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Accepted formats: PDF, JPG, JPEG, PNG (Max size: 5MB)
            </p>
          </div>
          
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              <span className="font-medium">Upload failed.</span> {error}
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Certificate"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}