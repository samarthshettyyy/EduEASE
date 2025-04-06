import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Video, User } from "lucide-react"

export default function VideoSessionsPage() {
  const upcomingSessions = [
    {
      id: 1,
      title: "Math Support Session",
      teacher: "Ms. Johnson",
      date: "Today",
      time: "3:30 PM - 4:00 PM",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Reading Comprehension",
      teacher: "Mr. Davis",
      date: "Tomorrow",
      time: "2:15 PM - 2:45 PM",
      status: "upcoming",
    },
    {
      id: 3,
      title: "Science Project Discussion",
      teacher: "Dr. Martinez",
      date: "Friday, Apr 8",
      time: "1:00 PM - 1:30 PM",
      status: "upcoming",
    },
  ]

  const pastSessions = [
    {
      id: 4,
      title: "Weekly Progress Review",
      teacher: "Ms. Johnson",
      date: "Monday, Apr 4",
      time: "3:30 PM - 4:00 PM",
      status: "completed",
    },
    {
      id: 5,
      title: "Math Problem Solving",
      teacher: "Mr. Wilson",
      date: "Friday, Apr 1",
      time: "2:00 PM - 2:30 PM",
      status: "completed",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Video Sessions</h2>
        <p className="text-muted-foreground">Schedule and join 1-on-1 video sessions with your teachers</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Upcoming Sessions</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                      <Video className="h-5 w-5" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{session.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center">
                      <User className="mr-1 h-4 w-4" />
                      {session.teacher}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {session.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {session.time}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">{session.date === "Today" ? "Join Session" : "Add to Calendar"}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Past Sessions</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-muted p-1.5 text-muted-foreground">
                      <Video className="h-5 w-5" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{session.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center">
                      <User className="mr-1 h-4 w-4" />
                      {session.teacher}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {session.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {session.time}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Recording
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule a New Session</CardTitle>
          <CardDescription>Book a 1-on-1 video session with a teacher for personalized support</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">Calendar scheduling interface will be displayed here</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Schedule Session</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

