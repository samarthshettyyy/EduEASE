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
} from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: BookOpen,
      title: "Text-to-Speech Engine",
      description: "Reads out books with dyslexic-friendly fonts and word-highlighting with audio sync.",
    },
    {
      icon: Users,
      title: "Grade-Based Room Assignment",
      description: "Students placed in virtual rooms based on grade with collaborative tasks and teacher guidance.",
    },
    {
      icon: Globe,
      title: "Multilingual Learning",
      description: "Translate lessons to user's language with real-time subtitle translation in voice/video calls.",
    },
    {
      icon: Camera,
      title: "Emotion Detection",
      description: "Recognizes stress, confusion, or boredom via webcam and triggers appropriate responses.",
    },
    {
      icon: Puzzle,
      title: "Visual & Multisensory Tools",
      description: "Visual storytelling, pictograms, animations, drag-and-drop puzzles, flashcards, and quizzes.",
    },
    {
      icon: Cube,
      title: "3D Learning Models",
      description: "Interactive science/math models using Three.js that students can zoom, rotate, and explore.",
    },
    {
      icon: Hands,
      title: "Audio to Sign Language",
      description: "Uses avatar for sign language rendering and converts spoken content during lessons or calls.",
    },
    {
      icon: Mic,
      title: "Voice Command Navigation",
      description: "Students can use voice to turn pages, ask for help, and play/pause lessons.",
    },
    {
      icon: MessageSquare,
      title: "AI Assistant Chatbot",
      description: "Voice & text based assistant that can answer doubts, explain concepts, and provide support.",
    },
    {
      icon: Video,
      title: "1-on-1 Video Sessions",
      description: "Secure calls with teachers via WebRTC with weekly schedules and emotional support sessions.",
    },
    {
      icon: BarChart,
      title: "Progress Tracker Dashboard",
      description: "Tracks learning milestones, emotional state patterns, and teacher feedback.",
    },
    {
      icon: Calendar,
      title: "Routine Schedule for Autism",
      description: "Visual daily timetable with predictable structure and transition notifications.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Inclusive Learning Features</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform is designed with accessibility at its core, providing tools and features to support diverse
              learning needs.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 rounded-lg border p-4 transition-all hover:bg-accent"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

