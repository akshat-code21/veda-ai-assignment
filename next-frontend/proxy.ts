import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authPages = ["/login", "/register"]
  const dashboardPages = ["/assignments"]

  const isAuthPage = authPages.some((p) => pathname.startsWith(p))
  const isDashboardPage = dashboardPages.some((p) => pathname.startsWith(p))
  const isRoot = pathname === "/"

  if (isRoot) {
    return NextResponse.redirect(new URL("/assignments", request.url))
  }

  if (isDashboardPage) {
    const sessionToken = request.cookies.get("better-auth.session_token")?.value
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  if (isAuthPage) {
    const sessionToken = request.cookies.get("better-auth.session_token")?.value
    if (sessionToken) {
      return NextResponse.redirect(new URL("/assignments", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
}
