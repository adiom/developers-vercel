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

const PUBLIC_ROUTES: PublicRoute[] = ["/", "/platform", "/services", "/agents", "/privacy", "/robots.txt", "/sitemap.xml", "/auth/login", "/auth/register"]

const isApiRoute = (pathname: string): boolean => pathname.startsWith("/api")
const isPublicRoute = (pathname: string): boolean =>
  PUBLIC_ROUTES.includes(pathname as PublicRoute) || pathname.startsWith("/api/chat") || pathname.startsWith("/api/leads") || /^\/agents\/[a-z-]+$/.test(pathname)
const isNextInternal = (pathname: string): boolean => pathname.startsWith("/_next")

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

  if (isNextInternal(pathname) || isPublicRoute(pathname) || isApiRoute(pathname)) {
    if ((pathname === "/auth/login" || pathname === "/auth/register") && !pathname.startsWith("/workspace")) {
      return NextResponse.redirect(new URL(pathname.replace("/auth/", "/workspace/"), request.url))
    }
    return NextResponse.next()
  }

  if (pathname === "/workspace/login" || pathname === "/workspace/register") {
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = pathname.endsWith("/login") ? "/auth/login" : "/auth/register"
    return NextResponse.rewrite(rewriteUrl)
  }

  const workspacePath = pathname === "/workspace" || pathname.startsWith("/workspace/")
  if (!workspacePath) {
    const destination = new URL(`/workspace${pathname === "/" ? "" : pathname}`, request.url)
    destination.search = request.nextUrl.search
    return NextResponse.redirect(destination)
  }

  if (!sessionToken) {
    const loginUrl = new URL("/workspace/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const internalPath = pathname === "/workspace" || pathname === "/workspace/" ? "/dashboard" : pathname.replace(/^\/workspace/, "")
  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname = internalPath || "/dashboard"
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-canfly-workspace", "1")
  return NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } })
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
