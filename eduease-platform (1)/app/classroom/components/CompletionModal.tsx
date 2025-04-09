"use client"

import { Dispatch, SetStateAction } from "react"

interface Document {
  id: number
  name: string
  [key: string]: any
}

interface CompletionModalProps {
  showModal: boolean
  selectedDoc: Document | null
  comprehensionLevel: string
  feedback: string
  setShowModal: Dispatch<SetStateAction<boolean>>
  setSelectedDoc: Dispatch<SetStateAction<Document | null>>
  setComprehensionLevel: Dispatch<SetStateAction<string>>
  setFeedback: Dispatch<SetStateAction<string>>
  onSubmit: () => void
}

export function CompletionModal({
  showModal,
  selectedDoc,
  comprehensionLevel,
  feedback,
  setShowModal,
  setSelectedDoc,
  setComprehensionLevel,
  setFeedback,
  onSubmit
}: CompletionModalProps) {
  
  if (!showModal || !selectedDoc) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-bold mb-2">Mark "{selectedDoc.name}" as Completed</h3>
        <p className="text-sm text-gray-600 mb-4">
          Share your understanding of this material to help your teacher improve future content.
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">How well did you understand this material?</label>
          <select 
            className="w-full p-2 border rounded-md"
            value={comprehensionLevel}
            onChange={(e) => setComprehensionLevel(e.target.value)}
          >
            <option value="excellent">Excellent - I understood everything</option>
            <option value="good">Good - I understood most of it</option>
            <option value="fair">Fair - I understood some parts</option>
            <option value="poor">Poor - I had difficulty understanding</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Feedback (optional)</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Share your thoughts about this document..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 border rounded-md"
            onClick={() => {
              setShowModal(false)
              setSelectedDoc(null)
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={onSubmit}
          >
            Mark as Completed
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompletionModal