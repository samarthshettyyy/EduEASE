"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Hand } from "lucide-react"

export function SignLanguageConverter() {
  const [isActive, setIsActive] = useState(false)

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Sign Language Converter</CardTitle>
          <Switch checked={isActive} onCheckedChange={setIsActive} aria-label="Toggle sign language converter" />
        </div>
        <CardDescription>Converts audio to sign language</CardDescription>
      </CardHeader>
      {isActive && (
        <CardContent className="flex justify-center">
          <div className="relative h-40 w-40 bg-muted rounded-lg flex items-center justify-center">
            <Hand className="h-20 w-20 text-muted-foreground" />
            <div className="absolute bottom-2 left-2 right-2 bg-background/80 rounded p-1">
              <p className="text-xs text-center">Sign language avatar active</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default SignLanguageConverter