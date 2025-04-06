import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, Video, FileText, Clock, CheckCircle } from "lucide-react"

export default function LessonsPage() {
  const subjects = [
    {
      id: "math",
      name: "Mathematics",
      description: "Numbers, operations, and problem-solving",
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      id: "reading",
      name: "Reading & Language",
      description: "Comprehension, vocabulary, and writing",
      icon: <FileText className="h-5 w-5" />,
      color: "bg-green-500/10 text-green-500",
    },
    {
      id: "science",
      name: "Science",
      description: "Natural world, experiments, and discoveries",
      icon: <Video className="h-5 w-5" />,
      color: "bg-purple-500/10 text-purple-500",
    },
  ]

  const lessons = {
    math: [
      {
        id: 1,
        title: "Understanding Fractions",
        description: "Learn about numerators, denominators, and equivalent fractions",
        duration: "30 min",
        completed: true,
      },
      {
        id: 2,
        title: "Addition and Subtraction",
        description: "Practice adding and subtracting numbers",
        duration: "25 min",
        completed: false,
      },
      {
        id: 3,
        title: "Multiplication Tables",
        description: "Memorize multiplication facts through interactive games",
        duration: "20 min",
        completed: false,
      },
    ],
    reading: [
      {
        id: 1,
        title: "Reading Comprehension",
        description: "Practice understanding and analyzing text",
        duration: "35 min",
        completed: true,
      },
      {
        id: 2,
        title: "Vocabulary Building",
        description: "Learn new words and their meanings",
        duration: "25 min",
        completed: true,
      },
      {
        id: 3,
        title: "Story Elements",
        description: "Identify characters, setting, plot, and theme",
        duration: "30 min",
        completed: false,
      },
    ],
    science: [
      {
        id: 1,
        title: "The Solar System",
        description: "Learn about planets, stars, and space",
        duration: "40 min",
        completed: false,
      },
      {
        id: 2,
        title: "Plant Life Cycles",
        description: "Understand how plants grow and reproduce",
        duration: "30 min",
        completed: false,
      },
      {
        id: 3,
        title: "States of Matter",
        description: "Explore solids, liquids, and gases",
        duration: "25 min",
        completed: false,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Lessons</h2>
        <p className="text-muted-foreground">Browse and access your personalized learning materials</p>
      </div>

      <Tabs defaultValue="math" className="space-y-4">
        <TabsList>
          {subjects.map((subject) => (
            <TabsTrigger key={subject.id} value={subject.id}>
              {subject.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {subjects.map((subject) => (
          <TabsContent key={subject.id} value={subject.id} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lessons[subject.id as keyof typeof lessons].map((lesson) => (
                <Card key={lesson.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className={`rounded-full p-1.5 ${subject.color}`}>{subject.icon}</div>
                      {lesson.completed && (
                        <div className="flex items-center text-sm text-green-500">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Completed
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    <CardDescription>{lesson.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {lesson.duration}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant={lesson.completed ? "outline" : "default"}>
                      {lesson.completed ? "Review Lesson" : "Start Lesson"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

