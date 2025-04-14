"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, X } from "lucide-react"

interface ChatRoomProps {
  onClose: () => void
}

interface Message {
  id: number
  content: string
  senderName: string
  createdAt: string
}

export function ChatRoom({ onClose }: ChatRoomProps) {
  const params = useParams();
  const classroomId = params?.id;
  console.warn(classroomId);
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchMessages = async () => {
    const res = await fetch(`/api/messages?classroomId=${classroomId}`)
    const data = await res.json()
    setMessages(data)
  }

  useEffect(() => {
    if (classroomId) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 5000)
      return () => clearInterval(interval)
    }
  }, [classroomId])

  const handleSend = async () => {
    if (!newMessage.trim()) return

    const userId = user.id // get from login session
    if (!userId) return alert("Please log in")

    await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        classroomId: Number(classroomId),
        userId: Number(userId),
        content: newMessage,
      }),
    })

    setNewMessage("")
    fetchMessages()
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

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
        <div ref={scrollRef} className="h-60 overflow-y-auto border rounded-md p-2 mb-2">
          <div className="space-y-2">
            {messages.map((msg) => {
              const date = new Date(msg.createdAt);
              const formattedDate = date.toUTCString().split(",")[1].split("GMT")[0];
              
              return (
                <div key={msg.id} className={`p-2 rounded-md ${msg.senderName === user.name ? "bg-primary/10" : "bg-muted"}`}>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium">{msg.senderName}</p>
                    <p className="text-[10px] text-muted-foreground">{formattedDate}</p>
                  </div>
                  <p className="text-sm">{msg.content}</p>
                </div>
              );
            })}

          </div>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button size="sm" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChatRoom