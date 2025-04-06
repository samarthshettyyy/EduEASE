import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, ChevronRight, Clock, Settings, Volume2 } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">AdaptLearn</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-lg font-medium text-primary">
              Home
            </Link>
            <Link href="/courses" className="text-lg font-medium text-muted-foreground hover:text-primary">
              My Courses
            </Link>
            <Link href="/calendar" className="text-lg font-medium text-muted-foreground hover:text-primary">
              Calendar
            </Link>
            <Link href="/messages" className="text-lg font-medium text-muted-foreground hover:text-primary">
              Messages
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" aria-label="Accessibility Settings">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Text to Speech">
              <Volume2 className="h-5 w-5" />
            </Button>
            <div className="relative h-8 w-8 rounded-full bg-muted">
              <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">JS</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container">
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, Jamie!</h1>
            <p className="text-muted-foreground">Here's what you need to focus on today.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Daily Progress</CardTitle>
                <CardDescription>You're making great progress!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Math</span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Reading</span>
                      <span className="text-sm text-muted-foreground">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Science</span>
                      <span className="text-sm text-muted-foreground">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" size="sm">
                  View detailed progress
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Today's Schedule</CardTitle>
                <CardDescription>Your upcoming learning sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Math: Fractions</p>
                      <p className="text-xs text-muted-foreground">10:00 AM - 10:45 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Reading: Comprehension</p>
                      <p className="text-xs text-muted-foreground">11:15 AM - 12:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Science: Plants</p>
                      <p className="text-xs text-muted-foreground">2:00 PM - 2:45 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" size="sm">
                  View full schedule
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Assignments Due</CardTitle>
                <CardDescription>Tasks that need your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Math Worksheet</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Due Today</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Start
                    </Button>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Reading Quiz</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Due Tomorrow</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Start
                    </Button>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Science Project</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Due in 3 days</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Start
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" size="sm">
                  View all assignments
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-8">
            <div className="mt-8">
              <h2 className="text-2xl font-bold tracking-tight mb-4">Joined Classrooms</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {joinedClassrooms.map((classroom, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{classroom.name}</CardTitle>
                      <CardDescription>{classroom.subject}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Instructor: {classroom.teacher}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full" size="sm">
                        View Classroom
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
            <br></br>
            <Tabs defaultValue="recommended">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Learning Resources</h2>
                <TabsList>
                  <TabsTrigger value="recommended">Recommended</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="recommended" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {recommendedResources.map((resource, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>{resource.subject}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" className="w-full" size="sm">
                          <span>Open Resource</span>
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="favorites" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Favorites content would go here */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Multiplication Games</CardTitle>
                      <CardDescription>Math</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Interactive games to help practice multiplication tables.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full" size="sm">
                        <span>Open Resource</span>
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="recent" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Recent content would go here */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Story Builder</CardTitle>
                      <CardDescription>Reading</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Create your own stories with visual prompts and vocabulary help.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full" size="sm">
                        <span>Open Resource</span>
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Accessibility Settings</CardTitle>
                <CardDescription>Customize your learning experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <h3 className="font-medium">Text Options</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        Larger Text
                      </Button>
                      <Button variant="outline" size="sm">
                        Dyslexia Font
                      </Button>
                      <Button variant="outline" size="sm">
                        Line Spacing
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Color Themes</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        High Contrast
                      </Button>
                      <Button variant="outline" size="sm">
                        Dark Mode
                      </Button>
                      <Button variant="outline" size="sm">
                        Pastel
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Reading Aids</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        Text to Speech
                      </Button>
                      <Button variant="outline" size="sm">
                        Reading Mask
                      </Button>
                      <Button variant="outline" size="sm">
                        Focus Mode
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  View all accessibility options
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

// Sample data
const joinedClassrooms = [
  { name: "Algebra Basics", subject: "Math", teacher: "Ms. Carter" },
  { name: "Plant Biology", subject: "Science", teacher: "Mr. Green" },
  { name: "Short Stories", subject: "Reading", teacher: "Mrs. Bell" },
];

const recommendedResources = [
  {
    title: "Math Visualizer",
    subject: "Math",
    description: "Interactive tool that helps visualize math concepts with adjustable speed and complexity.",
  },
  {
    title: "Reading Assistant",
    subject: "Reading",
    description: "Text-to-speech tool with highlighting to improve reading comprehension.",
  },
  {
    title: "Science Explorer",
    subject: "Science",
    description: "Visual science experiments and simulations with step-by-step guidance.",
  },
]

