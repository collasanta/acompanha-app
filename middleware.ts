import { authMiddleware } from "@clerk/nextjs";
// import createMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';

export default authMiddleware({
    publicRoutes: ["/", "/p/(.*)", "/d/(.*)", "/api/wh/dietautomation/(.*)"],
    ignoredRoutes: ["/api/manifest", "/api/notifications/track-open", "/~offline", "/api/wh/dietautomation", "/api/wh/dietautomation/(.*)"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};