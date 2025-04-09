// components/classroom-invitation.tsx
"use client"

import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle, Download, Share2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ClassroomInvitationProps {
  classroomName: string
  classroomCode: string
  classroomSubject: string
  studentCount: number
  classroomColor?: string
  onClose?: () => void
}

export default function ClassroomInvitation({
  classroomName,
  classroomCode,
  classroomSubject,
  studentCount,
  classroomColor = "bg-blue-100 text-blue-800 border-blue-200",
  onClose
}: ClassroomInvitationProps) {
  const [codeCopied, setCodeCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(classroomCode)
    setCodeCopied(true)
    
    toast({
      title: "Code copied to clipboard",
      // components/classroom-invitation.tsx (continued)
      description: "You can now share this code with your students"
    })
    
    // Reset after 2 seconds
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const copyInvitationLinkToClipboard = () => {
    // Create a join link - in a real app, this would be your actual domain
    const joinLink = `https://eduease.com/join?code=${classroomCode}`
    navigator.clipboard.writeText(joinLink)
    setLinkCopied(true)
    
    toast({
      title: "Invitation link copied",
      description: "Link to join classroom has been copied to clipboard"
    })
    
    // Reset after 2 seconds
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const downloadInvitation = () => {
    // Create invitation text
    const invitationText = `
You're invited to join the "${classroomName}" classroom on EduEase!

Subject: ${classroomSubject}
Join Code: ${classroomCode}

To join:
1. Log into your EduEase student account
2. Click "Join a Classroom" on your dashboard
3. Enter the code: ${classroomCode}

Join link: https://eduease.com/join?code=${classroomCode}
    `.trim()
    
    // Create a blob and download
    const blob = new Blob([invitationText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${classroomName.replace(/\s+/g, '-')}-invitation.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Invitation downloaded",
      description: "You can share this file with your students"
    })
  }
  
  // Generate QR code URL (using a free QR code generator service)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://eduease.com/join?code=${classroomCode}`

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Classroom Invitation</CardTitle>
        <CardDescription>
          Share this information with your students to join
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center border-b pb-4">
          <h3 className="text-xl font-bold mb-1">{classroomName}</h3>
          <div className="flex items-center justify-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${classroomColor}`}>
              {classroomSubject}
            </span>
            <span className="text-sm text-muted-foreground">
              {studentCount} {studentCount === 1 ? 'student' : 'students'}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Classroom Code</label>
          <div className="flex items-center">
            <div className="flex-1 bg-muted p-2 text-center rounded-l-md font-mono tracking-widest text-lg font-bold">
              {classroomCode}
            </div>
            <Button 
              variant="secondary"
              className="rounded-l-none"
              size="sm"
              onClick={copyCodeToClipboard}
            >
              {codeCopied ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Students will need this code to join your classroom
          </p>
        </div>
        
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              className="w-[48%]"
              onClick={copyInvitationLinkToClipboard}
            >
              {linkCopied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
              Copy Link
            </Button>
            <Button 
              variant="outline" 
              className="w-[48%]"
              onClick={downloadInvitation}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
        
        {/* QR Code */}
        <div className="flex items-center justify-center pt-2">
          <div className="text-center">
            <p className="text-sm font-medium mb-2">QR Code</p>
            <div className="border p-2 inline-block bg-white">
              <img 
                src={qrCodeUrl}
                alt="Classroom Join QR Code"
                width={120}
                height={120}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Students can scan this to join
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        {onClose && (
          <Button onClick={onClose}>
            Done
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}