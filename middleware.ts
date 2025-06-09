// my-recipe-planner-v2/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/']); // Only the homepage is public

export default clerkMiddleware((authObject, req) => { // <-- Renamed 'auth' to 'authObject' for clarity
  if (!isPublicRoute(req)) {
    // The 'authObject' here is the actual AuthObject provided by Clerk's middleware.
    // You call .protect() directly on it.
    authObject.protect(); // <-- Direct call, no await or function call
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};