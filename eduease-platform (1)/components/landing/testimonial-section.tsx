"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

export function TestimonialSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  
  const testimonials = [
    {
      quote:
        "EduEase has transformed my child's learning experience. The dyslexia-friendly features have boosted their confidence and reading skills. Before using this platform, my son struggled with reading assignments, but now he actively enjoys his lessons.",
      author: "Sarah Johnson",
      role: "Parent of a 10-year-old with dyslexia",
      image: "/placeholder-avatar-1.jpg",
      initials: "SJ",
      rating: 5,
    },
    {
      quote:
        "The predictable routine and visual schedules have helped my student with autism stay engaged and reduce anxiety during learning sessions. The platform's structure provides the consistency these students need while still allowing for personalized learning paths.",
      author: "Michael Rodriguez",
      role: "Special Education Teacher",
      image: "/placeholder-avatar-2.jpg", 
      initials: "MR",
      rating: 5,
    },
    {
      quote:
        "As someone with dyslexia, I wish I had access to this platform when I was in school. The text-to-speech and visual tools make learning so much more accessible. The 3D models help me understand complex concepts that traditional textbooks never could.",
      author: "Emma Thompson",
      role: "Adult with dyslexia",
      image: "/placeholder-avatar-3.jpg",
      initials: "ET",
      rating: 5,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="w-full py-20 md:py-32 bg-primary/5" id="testimonials">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold bg-background shadow-sm">
            <span className="text-primary">Testimonials</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Hear from parents, educators, and students who have experienced the benefits of our inclusive learning
              platform.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="relative">
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden md:block">
              <Button variant="ghost" size="icon" onClick={prevTestimonial} className="rounded-full">
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous testimonial</span>
              </Button>
            </div>
            
            <Card className="overflow-hidden border-none bg-background shadow-xl">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="bg-primary/10 p-8 md:p-12 flex items-center justify-center">
                    <div className="text-center">
                      <div className="flex justify-center mb-6">
                        <Avatar className="h-24 w-24 border-4 border-background">
                          <AvatarImage src={testimonials[currentTestimonial].image} alt={testimonials[currentTestimonial].author} />
                          <AvatarFallback className="text-lg">{testimonials[currentTestimonial].initials}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">{testimonials[currentTestimonial].author}</h3>
                        <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                      </div>
                      <div className="flex justify-center mt-4">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="h-5 w-5 fill-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center relative">
                    <Quote className="h-12 w-12 text-primary/20 absolute top-6 left-6 md:top-8 md:left-8" />
                    <blockquote className="mt-6 text-lg relative z-10">
                      "{testimonials[currentTestimonial].quote}"
                    </blockquote>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden md:block">
              <Button variant="ghost" size="icon" onClick={nextTestimonial} className="rounded-full">
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next testimonial</span>
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === currentTestimonial ? "bg-primary" : "bg-primary/20"
                }`}
                onClick={() => setCurrentTestimonial(i)}
              >
                <span className="sr-only">View testimonial {i + 1}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center md:hidden">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={prevTestimonial}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={nextTestimonial}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}