// components/teacher-classroom-code-banner.tsx
"use client"

import { useState } from "react"
import { 
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Copy, School, CheckCircle, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import ClassroomInvitation from "./classroom-invitation"

interface ClassroomCodeBannerProps {
  classroom: {
    id: string
    name: string
    code: string
    subject: string
    students: number
    color?: string
  }
  onDismiss: () => void
}

export default function ClassroomCodeBanner({ 
  classroom,
  onDismiss
}: ClassroomCodeBannerProps) {
  const [codeCopied, setCodeCopied] = useState(false)
  const [showInvitation, setShowInvitation] = useState(false)

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(classroom.code)
    setCodeCopied(true)
    
    toast({
      title: "Code copied!",
      description: "Classroom code copied to clipboard"
    })
    
    // Reset after 2 seconds
    setTimeout(() => setCodeCopied(false), 2000)
  }

  return (
    <>
      <Alert className="mb-6 border-primary/50 bg-primary/5">
        <School className="h-4 w-4" />
        <AlertTitle className="flex items-center justify-between">
          <span>Classroom Created: {classroom.name}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2">
          <div>
            <p className="text-sm mb-1">
              Share this code with your students to join the classroom:
            </p>
            <div className="font-mono text-lg font-bold tracking-wide">
              {classroom.code}
            </div>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button 
              size="sm" 
              variant="outline"
              onClick={copyCodeToClipboard}
              className="h-8"
            >
              {codeCopied ? (
                <CheckCircle className="h-4 w-4 mr-1.5" />
              ) : (
                <Copy className="h-4 w-4 mr-1.5" />
              )}
              {codeCopied ? "Copied!" : "Copy Code"}
            </Button>
            <Button 
              size="sm"
              className="h-8"
              onClick={() => setShowInvitation(true)}
            >
              <School className="h-4 w-4 mr-1.5" />
              Invitation
            </Button>
          </div>
        </AlertDescription>
      </Alert>
      
      {/* Invitation Dialog */}
      <Dialog open={showInvitation} onOpenChange={setShowInvitation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Classroom Invitation</DialogTitle>
            <DialogDescription>
              Students can use this information to join your classroom
            </DialogDescription>
          </DialogHeader>
          
          <ClassroomInvitation
            classroomName={classroom.name}
            classroomCode={classroom.code}
            classroomSubject={classroom.subject}
            studentCount={classroom.students}
            classroomColor={classroom.color}
          />
          
          <DialogFooter>
            <Button onClick={() => setShowInvitation(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}