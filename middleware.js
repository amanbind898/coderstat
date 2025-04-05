import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/question-tracker(.*)',
  '/profile-tracker(.*)',
])

export default clerkMiddleware(async (req) => {
  const { pathname } = req.nextUrl
  if (isProtectedRoute(pathname)) {
    await req.auth().protect()
  }
})

export const config = {
  matcher: [
    // Run for all routes except static files and Next internals
    '/((?!_next|.*\\..*|favicon.ico).*)',
    '/(api|trpc)(.*)',
  ],
}
