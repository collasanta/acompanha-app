import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/p/(.*)',
  '/d/(.*)',
  '/api/wh/dietautomation/(.*)'
])

const isIgnoredRoute = createRouteMatcher([
  '/api/manifest',
  '/api/notifications/track-open',
  '/~offline',
  '/api/wh/dietautomation',
  '/api/wh/dietautomation/(.*)'
])

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req) || isIgnoredRoute(req)) {
    return // Do nothing for public and ignored routes
  }
  
  // Protect all other routes
  auth().protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}