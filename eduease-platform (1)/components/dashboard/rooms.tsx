// components/dashboard/rooms.tsx
'use client'
import { useState } from "react"
import { DoorOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Rooms() {
  const [roomCode, setRoomCode] = useState("")
  
  const recentRooms = [
    { id: "r1", name: "Math Study Group", subject: "Mathematics" },
    { id: "r2", name: "Reading Club", subject: "Reading" },
    { id: "r3", name: "Science Lab", subject: "Science" }
  ]
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-2">
        <Input 
          placeholder="Enter room code..." 
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="flex-grow"
        />
        <Button size="sm">
          Join
        </Button>
      </div>
      
      <h4 className="text-sm font-medium mb-2">Recent Rooms</h4>
      
      <div className="space-y-3">
        {recentRooms.map((room) => (
          <div key={room.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-primary/5 transition-colors">
            <div className="flex items-center space-x-3">
              <DoorOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">{room.name}</p>
                <p className="text-xs text-muted-foreground">{room.subject}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Join</Button>
          </div>
        ))}
        
    
      </div>
    </div>
  )
}