import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Video, User, PlusCircle, Search, ArrowRight, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VideoSessionsPage() {
  const upcomingSessions = [
    {
      id: 1,
      title: "Math Support Session",
      teacher: "Ms. Johnson",
      date: "Today",
      time: "3:30 PM - 4:00 PM",
      status: "upcoming",
      subject: "Mathematics",
      urgent: true,
    },
    {
      id: 2,
      title: "Reading Comprehension",
      teacher: "Mr. Davis",
      date: "Tomorrow",
      time: "2:15 PM - 2:45 PM",
      status: "upcoming",
      subject: "English",
      urgent: false,
    },
    {
      id: 3,
      title: "Science Project Discussion",
      teacher: "Dr. Martinez",
      date: "Friday, Apr 8",
      time: "1:00 PM - 1:30 PM",
      status: "upcoming",
      subject: "Science",
      urgent: false,
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
      subject: "General",
      duration: "28 minutes",
    },
    {
      id: 5,
      title: "Math Problem Solving",
      teacher: "Mr. Wilson",
      date: "Friday, Apr 1",
      time: "2:00 PM - 2:30 PM",
      status: "completed",
      subject: "Mathematics",
      duration: "31 minutes",
    },
  ]

  const subjectColors = {
    Mathematics: "bg-blue-100 text-blue-800",
    English: "bg-green-100 text-green-800",
    Science: "bg-purple-100 text-purple-800",
    General: "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Video Sessions</h2>
          <p className="text-muted-foreground mt-1">Schedule and join 1-on-1 video sessions with your teachers</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search sessions..." 
              className="pl-9 w-full md:w-64" 
            />
          </div>
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Session
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Sessions</TabsTrigger>
          <TabsTrigger value="all">All Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingSessions.map((session) => (
              <Card key={session.id} className={`overflow-hidden transition-all duration-200 hover:shadow-md ${session.urgent ? 'border-l-4 border-l-red-500' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className={`${subjectColors[session.subject]} border-none`}>
                      {session.subject}
                    </Badge>
                    <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                      <Video className="h-5 w-5" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{session.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <User className="mr-1.5 h-4 w-4" />
                    {session.teacher}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      <span className={session.date === "Today" ? "font-medium text-primary" : ""}>
                        {session.date}
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4 text-primary" />
                      {session.time}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 pt-3">
                  <Button 
                    className="w-full gap-2" 
                    variant={session.date === "Today" ? "default" : "outline"}
                  >
                    {session.date === "Today" ? "Join Session Now" : "Add to Calendar"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastSessions.map((session) => (
              <Card key={session.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className={`${subjectColors[session.subject]} border-none`}>
                      {session.subject}
                    </Badge>
                    <div className="rounded-full bg-muted p-1.5 text-muted-foreground">
                      <Video className="h-5 w-5" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{session.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <User className="mr-1.5 h-4 w-4" />
                    {session.teacher}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {session.date}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      {session.time}
                      <span className="mx-2">•</span>
                      {session.duration}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 pt-3">
                  <Button variant="outline" className="w-full gap-2">
                    <Play className="h-4 w-4" />
                    Watch Recording
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="text-center py-8 text-muted-foreground">
            View all your sessions in calendar format
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-8 border-dashed bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            Schedule a New Session
          </CardTitle>
          <CardDescription>Book a 1-on-1 video session with a teacher for personalized support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 py-6">
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-100">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium">Select Date & Time</h3>
              <p className="text-sm text-muted-foreground mt-1">Choose when you'd like to meet</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-100">
              <User className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-medium">Choose a Teacher</h3>
              <p className="text-sm text-muted-foreground mt-1">Select from available educators</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-100">
              <Video className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-medium">Set Session Goals</h3>
              <p className="text-sm text-muted-foreground mt-1">Define what you want to achieve</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full gap-2">
            Schedule New Session
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}