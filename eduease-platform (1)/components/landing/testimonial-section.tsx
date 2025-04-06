export function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "EduEase has transformed my child's learning experience. The dyslexia-friendly features have boosted their confidence and reading skills.",
      author: "Parent of a 10-year-old with dyslexia",
      role: "Parent",
    },
    {
      quote:
        "The predictable routine and visual schedules have helped my student with autism stay engaged and reduce anxiety during learning sessions.",
      author: "Special Education Teacher",
      role: "Educator",
    },
    {
      quote:
        "As someone with dyslexia, I wish I had access to this platform when I was in school. The text-to-speech and visual tools make learning so much more accessible.",
      author: "Adult with dyslexia",
      role: "User",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="testimonials">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from parents, educators, and students who have experienced the benefits of our inclusive learning
              platform.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm">
              <p className="text-muted-foreground">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

