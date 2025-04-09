"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, X } from "lucide-react"

interface ChatRoomProps {
  onClose: () => void
}

export function ChatRoom({ onClose }: ChatRoomProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Class Chat</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-60 overflow-y-auto border rounded-md p-2 mb-2">
          <div className="space-y-2">
            <div className="bg-muted p-2 rounded-md">
              <p className="text-xs font-medium">Teacher</p>
              <p className="text-sm">Remember to complete the worksheet by Friday!</p>
            </div>
            <div className="bg-primary/10 p-2 rounded-md">
              <p className="text-xs font-medium">Alex</p>
              <p className="text-sm">Can we review the cell membrane again?</p>
            </div>
            <div className="bg-muted p-2 rounded-md">
              <p className="text-xs font-medium">Teacher</p>
              <p className="text-sm">Sure, let's go over it in tomorrow's class.</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChatRoom