// app/components/MarkDocumentModal.tsx
"use client"

import { useState } from "react"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface MarkDocumentModalProps {
  documentId: string | number
  documentName: string
  isOpen: boolean
  onClose: () => void
  onMarkAsCompleted: (documentId: string | number, feedback?: string, comprehension?: string) => void
}

export default function MarkDocumentModal({
  documentId,
  documentName,
  isOpen,
  onClose,
  onMarkAsCompleted,
}: MarkDocumentModalProps) {
  const [feedback, setFeedback] = useState("")
  const [comprehension, setComprehension] = useState("good")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onMarkAsCompleted(documentId, feedback, comprehension)
      onClose()
    } catch (error) {
      console.error("Error marking document as completed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mark Document as Completed</DialogTitle>
          <DialogDescription>
            Share your understanding of "{documentName}" to help your teacher improve future materials.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>How well did you understand this material?</Label>
            <RadioGroup
              value={comprehension}
              onValueChange={setComprehension}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="excellent" />
                <Label htmlFor="excellent" className="font-normal">
                  Excellent - I understood everything
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="good" />
                <Label htmlFor="good" className="font-normal">
                  Good - I understood most of it
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fair" id="fair" />
                <Label htmlFor="fair" className="font-normal">
                  Fair - I understood some parts
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="poor" />
                <Label htmlFor="poor" className="font-normal">
                  Poor - I had difficulty understanding
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback (optional)</Label>
            <Textarea
              id="feedback"
              placeholder="Share your thoughts about this document..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Mark as Completed"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}