import { NextResponse } from "next/server"
import type { NextRequest, NextResponse as NextResponseType } from "next/server"

type PublicRoute = `/${string}`

// Constants
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400"
} as const

const PUBLIC_ROUTES: PublicRoute[] = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password"
]

const isApiRoute = (pathname: string): boolean => pathname.startsWith("/api")
const isPublicRoute = (pathname: string): boolean => 
  PUBLIC_ROUTES.some(route => pathname.startsWith(route))
const isNextInternal = (pathname: string): boolean => pathname.startsWith("/_next")
const isProjectViewRoute = (pathname: string): boolean => 
  /^\/projects\/\d+$/.test(pathname)

const createCorsResponse = (): NextResponseType => {
  const response = new NextResponse(null, { status: 200 })
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

export function middleware(request: NextRequest): NextResponseType {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get("session_token")?.value

  // Handle CORS for API routes
  if (isApiRoute(pathname)) {
    if (request.method === "OPTIONS") {
      return createCorsResponse()
    }

    const response = NextResponse.next()
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  // Skip auth checks for public routes and Next.js internal routes
  if (isPublicRoute(pathname) || isNextInternal(pathname)) {
    // Redirect to home if user is already authenticated
    if (sessionToken) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // Allow public access to project view pages for GET requests
  if (isProjectViewRoute(pathname) && request.method === "GET") {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!sessionToken) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
