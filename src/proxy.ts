import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";
import { NextResponse, NextRequest, NextFetchEvent } from 'next/server';

// Initialize Arcjet with key from environment variables
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    // Protect against common attacks e.g. SQL injection, XSS, CSRF
    shield({ mode: "LIVE" }),
    // Bot detection to block automated crawlers/scrapers, but allow search engines
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Allow Google, Bing, etc.
        "CATEGORY:PREVIEW", // Allow Vercel preview environments
        "CATEGORY:MONITOR", // Allow uptime monitoring services
      ],
    }),
    // Rate limiting based on client IP
    tokenBucket({
      mode: "LIVE",
      refillRate: 15, // Refill 15 tokens
      interval: 10,   // Every 10 seconds
      capacity: 35,   // Maximum of 35 requests bucket size
    }),
  ],
});

const isPublicRoute = createRouteMatcher([
  "/", // Landing page
  "/jobs", // Jobs search page
  "/api/jobs(.*)", // Jobs APIs (search and seeding)
]);

// Initialize Clerk middleware handler
const clerkHandler = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If signed in and trying to access the landing page,
  // send them to the dashboard.
  if (userId && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect everything except public routes.
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

// Explicit default export function for Next.js Middleware loader compatibility
export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Run Arcjet protection checks first (using default IP tracking, consuming 1 token from bucket)
  const decision = await aj.protect(req, { requested: 1 });

  // If Arcjet denies the request, return an appropriate block response
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
    if (decision.reason.isBot()) {
      return new NextResponse("Bot Access Denied", { status: 403 });
    }
    return new NextResponse("Access Denied", { status: 403 });
  }

  // Delegate to Clerk handler if request is allowed by Arcjet
  return clerkHandler(req, ev);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Always run for Clerk-specific frontend API routes
    '/__clerk/:path*',
  ],
};