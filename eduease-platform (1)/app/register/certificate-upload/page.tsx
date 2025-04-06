"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"

export default function CertificateUploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a disability certificate file to upload.",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setUploadStatus("uploading")

    // Simulate upload process
    setTimeout(() => {
      setUploading(false)
      setUploadStatus("success")

      toast({
        title: "Certificate uploaded successfully",
        description: "Your certificate has been submitted for verification.",
      })

      // Simulate verification process
      setTimeout(() => {
        router.push("/register/assessment")
      }, 2000)
    }, 2000)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Disability Certificate Upload</CardTitle>
          <CardDescription>Please upload a government-verified disability certificate (PDF or Image)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="certificate">Certificate</Label>
            <div className="flex items-center gap-2">
              <Input
                id="certificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={uploading || uploadStatus === "success"}
              />
              {file && <FileText className="h-5 w-5 text-muted-foreground" />}
            </div>
            <p className="text-sm text-muted-foreground">Accepted formats: PDF, JPG, JPEG, PNG (Max size: 5MB)</p>
          </div>

          {uploadStatus === "success" && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span>Certificate uploaded successfully and pending verification</span>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span>Upload failed. Please try again.</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button onClick={handleUpload} disabled={!file || uploading || uploadStatus === "success"}>
            {uploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : uploadStatus === "success" ? (
              "Uploaded"
            ) : (
              "Upload Certificate"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

