import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Paths that require authentication
const protectedPaths = [
  "/dashboard",
  "/settings",
  "/teacher/dashboard",
  "/admin/dashboard",
]

// Paths that should redirect to dashboard if logged in
const authPaths = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value
  const path = request.nextUrl.pathname

  // Check if path is protected and user is not logged in
  if (
    protectedPaths.some((protectedPath) => path.startsWith(protectedPath)) &&
    !sessionCookie
  ) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", path)
    return NextResponse.redirect(url)
  }

  // Check if user is logged in and trying to access auth pages
  if (
    authPaths.some((authPath) => path.startsWith(authPath)) &&
    sessionCookie
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [...protectedPaths, ...authPaths],
}