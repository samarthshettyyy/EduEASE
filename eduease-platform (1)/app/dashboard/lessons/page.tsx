import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, Video, FileText, Clock, CheckCircle, ArrowRight, Star, Sparkles } from "lucide-react"
import Link from "next/link"

export default function LessonsPage() {
  const subjects = [
    {
      id: "math",
      name: "Mathematics",
      description: "Numbers, operations, and problem-solving",
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-blue-500/10 text-blue-500 border-blue-200",
      bgColor: "from-blue-50 to-blue-100/30",
    },
    {
      id: "reading",
      name: "Reading & Language",
      description: "Comprehension, vocabulary, and writing",
      icon: <FileText className="h-5 w-5" />,
      color: "bg-green-500/10 text-green-500 border-green-200",
      bgColor: "from-green-50 to-green-100/30",
    },
    {
      id: "science",
      name: "Science",
      description: "Natural world, experiments, and discoveries",
      icon: <Video className="h-5 w-5" />,
      color: "bg-purple-500/10 text-purple-500 border-purple-200",
      bgColor: "from-purple-50 to-purple-100/30",
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
        recommended: true,
      },
      {
        id: 2,
        title: "Addition and Subtraction",
        description: "Practice adding and subtracting numbers",
        duration: "25 min",
        completed: false,
        recommended: false,
      },
      {
        id: 3,
        title: "Multiplication Tables",
        description: "Memorize multiplication facts through interactive games",
        duration: "20 min",
        completed: false,
        recommended: true,
      },
    ],
    reading: [
      {
        id: 1,
        title: "Reading Comprehension",
        description: "Practice understanding and analyzing text",
        duration: "35 min",
        completed: true,
        recommended: false,
      },
      {
        id: 2,
        title: "Vocabulary Building",
        description: "Learn new words and their meanings",
        duration: "25 min",
        completed: true,
        recommended: true,
      },
      {
        id: 3,
        title: "Story Elements",
        description: "Identify characters, setting, plot, and theme",
        duration: "30 min",
        completed: false,
        recommended: false,
      },
    ],
    science: [
      {
        id: 1,
        title: "The Solar System",
        description: "Learn about planets, stars, and space",
        duration: "40 min",
        completed: false,
        recommended: true,
      },
      {
        id: 2,
        title: "Plant Life Cycles",
        description: "Understand how plants grow and reproduce",
        duration: "30 min",
        completed: false,
        recommended: false,
      },
      {
        id: 3,
        title: "States of Matter",
        description: "Explore solids, liquids, and gases",
        duration: "25 min",
        completed: false,
        recommended: false,
      },
    ],
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-indigo-50/50 to-transparent min-h-screen">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Lessons</h2>
        <p className="text-muted-foreground">Browse and access your personalized learning materials</p>
      </div>

      <Tabs defaultValue="math" className="space-y-6">
        <div className="bg-white p-1.5 rounded-lg shadow-sm border border-blue-100 inline-block">
          <TabsList className="bg-transparent">
            {subjects.map((subject) => (
              <TabsTrigger 
                key={subject.id} 
                value={subject.id}
                className="data-[state=active]:shadow-sm data-[state=active]:bg-white"
              >
                <div className="flex items-center">
                  <div className={`rounded-full p-1.5 mr-2 ${subject.color}`}>{subject.icon}</div>
                  {subject.name}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {subjects.map((subject) => (
          <TabsContent key={subject.id} value={subject.id} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {lessons[subject.id as keyof typeof lessons].map((lesson) => (
                <Card 
                  key={lesson.id} 
                  className={`overflow-hidden hover:shadow-md transition-all duration-300 border-${subject.id === 'math' ? 'blue' : subject.id === 'reading' ? 'green' : 'purple'}-100`}
                >
                  <div className={`bg-gradient-to-r ${subject.bgColor} h-2`}></div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className={`rounded-full p-1.5 ${subject.color}`}>{subject.icon}</div>
                      <div className="flex gap-2">
                        {lesson.recommended && (
                          <div className="flex items-center text-sm text-amber-500">
                            <Star className="mr-1 h-4 w-4 fill-amber-500" />
                            <span className="font-medium">Recommended</span>
                          </div>
                        )}
                        {lesson.completed && (
                          <div className="flex items-center text-sm text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">{lesson.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{lesson.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {lesson.duration}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full ${lesson.completed ? 'bg-white hover:bg-gray-50' : ''}`} 
                      variant={lesson.completed ? "outline" : "default"}
                    >
                      <span>{lesson.completed ? "Review Lesson" : "Start Lesson"}</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
                <span>Want to explore more {subject.id === 'math' ? 'mathematics' : subject.id === 'reading' ? 'reading' : 'science'} lessons?</span>
              </div>
              <Link href={`/dashboard/browse/${subject.id}`}>
                <Button variant="outline" className="border-blue-100 hover:border-primary">
                  <span>Browse Library</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}