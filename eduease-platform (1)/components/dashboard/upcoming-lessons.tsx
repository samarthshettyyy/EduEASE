import { Button } from "@/components/ui/button"
import { Clock, Video, BookOpen } from "lucide-react"

export function UpcomingLessons() {
  const lessons = [
    {
      id: 1,
      title: "Mathematics: Fractions",
      time: "10:30 AM - 11:15 AM",
      type: "video",
      teacher: "Ms. Johnson",
    },
    {
      id: 2,
      title: "Reading Comprehension",
      time: "1:00 PM - 1:45 PM",
      type: "lesson",
      teacher: "Mr. Davis",
    },
    {
      id: 3,
      title: "Science: Solar System",
      time: "3:15 PM - 4:00 PM",
      type: "video",
      teacher: "Dr. Martinez",
    },
  ]

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <div key={lesson.id} className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-primary/10 p-2">
              {lesson.type === "video" ? (
                <Video className="h-5 w-5 text-primary" />
              ) : (
                <BookOpen className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <h4 className="font-medium">{lesson.title}</h4>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {lesson.time} • {lesson.teacher}
              </div>
            </div>
          </div>
          <Button size="sm">{lesson.type === "video" ? "Join" : "Start"}</Button>
        </div>
      ))}
    </div>
  )
}

