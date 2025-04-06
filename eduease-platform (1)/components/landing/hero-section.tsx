import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Learning Made Accessible for Everyone
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                EduEase is an AI-powered platform designed to provide an adaptive and accessible learning experience for
                students with dyslexia and autism.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" className="font-lexend">
                  Start Learning Today
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="font-lexend">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              alt="EduEase Platform Preview"
              className="aspect-video overflow-hidden rounded-xl object-cover object-center"
              height="310"
              src="./bg.avif?height=310&width=550"
              width="550"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

