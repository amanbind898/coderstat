// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/question-tracker(.*)',
  '/profile-tracker(.*)',
  '/settings(.*)',
]);

export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl;

  if (isProtectedRoute(pathname)) {
    auth().protect(); // ✅ This is correct
  }
});

export const config = {
  matcher: [
    '/((?!_next|.*\\..*|favicon.ico).*)', // Matches all routes except static files
    '/(api|trpc)(.*)',                    // Includes API and TRPC routes
  ],
};
