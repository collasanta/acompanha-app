import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes:["/", "/p/(.*)"],
    ignoredRoutes:["/api/manifest", "/api/notifications/all", "/~offline"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};