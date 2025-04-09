"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot } from "lucide-react"

export function TelegramBot() {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Telegram Bot</CardTitle>
        <CardDescription>Get updates and homework reminders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">AdaptLearn Bot</p>
            <p className="text-xs text-muted-foreground">Connect to receive notifications</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          Connect to Telegram
        </Button>
      </CardFooter>
    </Card>
  )
}

export default TelegramBot