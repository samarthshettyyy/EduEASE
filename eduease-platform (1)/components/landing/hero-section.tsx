import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-background to-primary/5">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-6 relative z-10">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold bg-background shadow-sm mb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary mr-1">
                <BookOpen className="h-3 w-3 text-white" />
              </span>
              <span className="text-primary">Inclusive Education Platform</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Learning Made <span className="text-primary">Accessible</span> for Everyone
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                EduEase is an AI-powered platform designed to provide an adaptive and accessible learning experience for
                students with dyslexia and autism.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <Link href="/register" className="inline-flex">
                <Button size="lg" className="font-medium h-12 px-6 rounded-lg shadow-lg shadow-primary/20">
                  Start Learning Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features" className="inline-flex">
                <Button size="lg" variant="outline" className="font-medium h-12 px-6 rounded-lg">
                  Explore Features
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex -space-x-2">
                <img
                  alt="Avatar"
                  className="rounded-full border-2 border-background h-8 w-8 object-cover"
                  src="/placeholder-avatar-1.jpg"
                />
                <img
                  alt="Avatar"
                  className="rounded-full border-2 border-background h-8 w-8 object-cover"
                  src="/placeholder-avatar-2.jpg"
                />
                <img
                  alt="Avatar"
                  className="rounded-full border-2 border-background h-8 w-8 object-cover"
                  src="/placeholder-avatar-3.jpg"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">500+</span> students learning today
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="absolute right-0 top-1/2 -z-10 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border">
              <img
                alt="EduEase Platform Preview"
                className="aspect-video w-full object-cover object-center"
                height="310"
                src="./bg.avif?height=310&width=550"
                width="550"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="rounded-lg bg-background/90 backdrop-blur-sm p-4 shadow-lg border">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Live Tutoring Available Now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}