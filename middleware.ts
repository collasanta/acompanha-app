import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes:["/", "/p/(.*)", "/d/(.*)"],
    ignoredRoutes:["/api/manifest", "/api/notifications/track-open", "/~offline"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};