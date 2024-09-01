import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/", "/p/(.*)", "/d/(.*)", "/api/wh/dietautomation/(.*)"],
    ignoredRoutes: ["/api/manifest", "/api/notifications/track-open", "/~offline", "/api/wh/dietautomation", "/api/wh/dietautomation/(.*)"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};