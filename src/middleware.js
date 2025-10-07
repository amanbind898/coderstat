import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/profile-tracker(.*)',
  '/question-tracker(.*)',
  '/event-tracker(.*)',
  '/settings(.*)',
  '/upload'
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const url = req.nextUrl

  // Redirect unauthenticated users trying to access protected routes
  if (!userId && isProtectedRoute(req)) {
    // Store the original URL they were trying to access
    return redirectToSignIn({ 
      returnBackUrl: url.pathname 
    }) 
  }

  if (url.pathname.startsWith('/upload')) {
    const role = sessionClaims?.publicMetadata?.role
    console.log('Middleware: Role from sessionClaims:', role)

    const hasUploadPermission = Array.isArray(role)
      ? role.includes('org:admin')
      : role === 'org:admin'

    if (!hasUploadPermission) {
      return Response.redirect(new URL('/unauthorized', req.url), 302)
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
