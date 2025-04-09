"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Video, X } from "lucide-react"

interface VideoCallProps {
  onClose: () => void
}

export function VideoCall({ onClose }: VideoCallProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">1-on-1 Video Call</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-2">
          <Video className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm">
            <Mic className="h-4 w-4 mr-1" />
            Mute
          </Button>
          <Button variant="outline" size="sm">
            <Video className="h-4 w-4 mr-1" />
            Camera
          </Button>
          <Button variant="destructive" size="sm">
            End Call
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default VideoCall