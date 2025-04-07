import {
  BookOpen,
  Users,
  Globe,
  Camera,
  Puzzle,
  CuboidIcon as Cube,
  MessageSquare,
  Video,
  BarChart,
  Calendar,
  Mic,
  HandIcon as Hands,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function FeatureSection() {
  const featureCategories = [
    {
      id: "accessibility",
      name: "Accessibility",
      description: "Features designed to make learning accessible for all students",
      features: [
        {
          icon: BookOpen,
          title: "Text-to-Speech Engine",
          description: "Reads out books with dyslexic-friendly fonts and word-highlighting with audio sync.",
          color: "bg-blue-500/10 text-blue-500",
        },
        {
          icon: Hands,
          title: "Audio to Sign Language",
          description: "Uses avatar for sign language rendering and converts spoken content during lessons or calls.",
          color: "bg-purple-500/10 text-purple-500",
        },
        {
          icon: Mic,
          title: "Voice Command Navigation",
          description: "Students can use voice to turn pages, ask for help, and play/pause lessons.",
          color: "bg-indigo-500/10 text-indigo-500",
        },
        {
          icon: Globe,
          title: "Multilingual Learning",
          description: "Translate lessons to user's language with real-time subtitle translation in voice/video calls.",
          color: "bg-green-500/10 text-green-500",
        },
      ],
    },
    {
      id: "interactive",
      name: "Interactive Learning",
      description: "Interactive tools that make learning engaging and effective",
      features: [
        {
          icon: Puzzle,
          title: "Visual & Multisensory Tools",
          description: "Visual storytelling, pictograms, animations, drag-and-drop puzzles, flashcards, and quizzes.",
          color: "bg-amber-500/10 text-amber-500",
        },
        {
          icon: Cube,
          title: "3D Learning Models",
          description: "Interactive science/math models using Three.js that students can zoom, rotate, and explore.",
          color: "bg-red-500/10 text-red-500",
        },
        {
          icon: MessageSquare,
          title: "AI Assistant Chatbot",
          description: "Voice & text based assistant that can answer doubts, explain concepts, and provide support.",
          color: "bg-teal-500/10 text-teal-500",
        },
        {
          icon: Video,
          title: "1-on-1 Video Sessions",
          description: "Secure calls with teachers via WebRTC with weekly schedules and emotional support sessions.",
          color: "bg-cyan-500/10 text-cyan-500",
        },
      ],
    },
    {
      id: "support",
      name: "Learning Support",
      description: "Tools to support students with diverse learning needs",
      features: [
        {
          icon: Camera,
          title: "Emotion Detection",
          description: "Recognizes stress, confusion, or boredom via webcam and triggers appropriate responses.",
          color: "bg-pink-500/10 text-pink-500",
        },
        {
          icon: Users,
          title: "Grade-Based Room Assignment",
          description: "Students placed in virtual rooms based on grade with collaborative tasks and teacher guidance.",
          color: "bg-orange-500/10 text-orange-500",
        },
        {
          icon: BarChart,
          title: "Progress Tracker Dashboard",
          description: "Tracks learning milestones, emotional state patterns, and teacher feedback.",
          color: "bg-violet-500/10 text-violet-500",
        },
        {
          icon: Calendar,
          title: "Routine Schedule for Autism",
          description: "Visual daily timetable with predictable structure and transition notifications.",
          color: "bg-emerald-500/10 text-emerald-500",
        },
      ],
    },
  ]

  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-muted/50 relative" id="features">
      <div className="absolute inset-0 bg-grid-black/5 bg-[center_top_-1px] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold bg-background shadow-sm">
            <span className="text-primary">Powered by AI</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Inclusive Learning Features</h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-xl/relaxed">
              Our platform is designed with accessibility at its core, providing tools and features to support diverse
              learning needs.
            </p>
          </div>
        </div>

        <Tabs defaultValue="accessibility" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-lg">
              {featureCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {featureCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-8">
              <p className="text-center text-muted-foreground max-w-2xl mx-auto">
                {category.description}
              </p>
              <div className="mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {category.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-col space-y-3 rounded-xl border bg-card p-6 shadow transition-all hover:shadow-lg"
                  >
                    <div className={`rounded-full ${feature.color} p-3 w-12 h-12 flex items-center justify-center`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground flex-1">{feature.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-16 flex flex-col items-center space-y-8">
          <h3 className="text-2xl font-bold">Why Choose EduEase?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            <div className="flex flex-col items-center text-center space-y-2 p-4">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold">Research-Backed Methods</h4>
              <p className="text-sm text-muted-foreground">Developed with educational psychologists and specialists</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 p-4">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold">Personalized Learning</h4>
              <p className="text-sm text-muted-foreground">Adapts to each student's unique learning style and pace</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 p-4">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold">Expert Support</h4>
              <p className="text-sm text-muted-foreground">Access to trained teachers specializing in diverse learning needs</p>
            </div>
          </div>
          
          <Button size="lg" className="mt-4">
            Get Started for Free
          </Button>
        </div>
      </div>
    </section>
  )
}