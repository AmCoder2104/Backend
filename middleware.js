import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request) {
  const path = request.nextUrl.pathname

  // Define paths that are protected (require authentication)
  const protectedPaths = ["/test", "/dashboard"]

  // Define paths that require specific roles
  const adminOnlyPaths = ["/dashboard/users"]
  const adminExaminerPaths = ["/dashboard/tests", "/dashboard/questions"]

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((protectedPath) => path.startsWith(protectedPath))
  const isAdminOnlyPath = adminOnlyPaths.some((adminPath) => path.startsWith(adminPath))
  const isAdminExaminerPath = adminExaminerPaths.some((adminExaminerPath) => path.startsWith(adminExaminerPath))

  if (isProtectedPath) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Redirect to login if not authenticated
    if (!token) {
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(request.url))
      return NextResponse.redirect(url)
    }

    // Check role-based access
    if (isAdminOnlyPath && token.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (isAdminExaminerPath && token.role !== "admin" && token.role !== "examiner") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // For dashboard access, require at least one of the valid roles
    if (
      path.startsWith("/dashboard") &&
      token.role !== "admin" &&
      token.role !== "examiner" &&
      token.role !== "candidate"
    ) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: ["/test/:path*", "/dashboard/:path*"],
}
