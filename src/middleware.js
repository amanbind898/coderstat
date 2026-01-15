import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = [
  '/profile-tracker',
  '/question-tracker',
  '/event-tracker',
  '/settings',
  '/upload',
];

// Routes that require admin role
const adminRoutes = ['/upload'];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isProtectedRoute = protectedRoutes.some(route =>
    nextUrl.pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some(route =>
    nextUrl.pathname.startsWith(route)
  );

  // Redirect unauthenticated users to sign-in
  if (isProtectedRoute && !session) {
    const signInUrl = new URL('/sign-in', nextUrl.origin);
    signInUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check admin access for admin routes
  if (isAdminRoute && session) {
    const userRole = session.user?.role;
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
