import type React from "react" // Keep 'import type' if you *only* need it for types
import "@/app/globals.css"

export const metadata = {
  title: "AdaptLearn - Adaptive Learning Platform",
  description: "Personalized learning for students with diverse learning needs",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode // 'React.ReactNode' is a type, so 'import type' is fine for this
}) {
  // Use the shorthand fragment instead of <React.Fragment>
  return (
    <>
      {children}
    </>
  )
}