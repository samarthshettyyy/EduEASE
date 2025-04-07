import { Button } from "@/components/ui/button"
import { Clock, Video, BookOpen, Calendar } from "lucide-react"

export function UpcomingLessons() {
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  
  const lessons = [
    {
      id: 1,
      title: "Mathematics: Fractions",
      time: "10:30 AM - 11:15 AM",
      type: "video",
      teacher: "Ms. Johnson",
      subject: "Mathematics",
      subjectColor: "bg-blue-100 text-blue-800",
      status: "upcoming", // upcoming, live, completed
    },
    {
      id: 2,
      title: "Reading Comprehension",
      time: "1:00 PM - 1:45 PM",
      type: "lesson",
      teacher: "Mr. Davis",
      subject: "Reading",
      subjectColor: "bg-green-100 text-green-800",
      status: "upcoming",
    },
    {
      id: 3,
      title: "Science: Solar System",
      time: "3:15 PM - 4:00 PM",
      type: "video",
      teacher: "Dr. Martinez",
      subject: "Science",
      subjectColor: "bg-purple-100 text-purple-800",
      status: "upcoming",
    },
  ]

  // Function to check if a lesson should be shown as "live" based on the current time
  // This is a simplified example - in a real app you'd use actual time comparison
  const getCurrentLesson = () => {
    const now = new Date()
    const hours = now.getHours()
    
    if (hours >= 10 && hours < 12) {
      lessons[0].status = "live"
    } else if (hours >= 13 && hours < 14) {
      lessons[1].status = "live"
    } else if (hours >= 15 && hours < 16) {
      lessons[2].status = "live"
    }
    
    if (hours >= 12) {
      lessons[0].status = "completed"
    }
    if (hours >= 14) {
      lessons[1].status = "completed"
    }
  }
  
  getCurrentLesson()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
          <span className="text-sm text-muted-foreground">{formattedDate}</span>
        </div>
      </div>
      
      {lessons.map((lesson) => (
        <div 
          key={lesson.id} 
          className={`flex items-center justify-between rounded-lg border p-4 ${
            lesson.status === "live" ? "border-primary bg-primary/5" : ""
          } ${
            lesson.status === "completed" ? "opacity-60" : ""
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`rounded-full ${lesson.status === "live" ? "bg-primary" : "bg-primary/10"} p-2`}>
              {lesson.type === "video" ? (
                <Video className={`h-5 w-5 ${lesson.status === "live" ? "text-white" : "text-primary"}`} />
              ) : (
                <BookOpen className={`h-5 w-5 ${lesson.status === "live" ? "text-white" : "text-primary"}`} />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">{lesson.title}</h4>
                {lesson.status === "live" && (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                    Live
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {lesson.time} • {lesson.teacher}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${lesson.subjectColor}`}>
              {lesson.subject}
            </span>
            <Button 
              size="sm" 
              variant={lesson.status === "live" ? "default" : lesson.status === "completed" ? "outline" : "secondary"}
              disabled={lesson.status === "completed"}
            >
              {lesson.status === "live" 
                ? "Join Now" 
                : lesson.status === "completed" 
                  ? "Completed" 
                  : lesson.type === "video" 
                    ? "Join" 
                    : "Start"
              }
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}