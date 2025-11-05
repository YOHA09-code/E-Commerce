import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: any) {
    const token = (req as any).nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin routes
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Vendor routes
    if (pathname.startsWith("/vendor")) {
      if (token?.role !== "VENDOR" && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Protected customer routes
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/checkout")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }: any) => {
        // Allow access to public routes
        const publicRoutes = [
          "/",
          "/products",
          "/categories",
          "/auth/signin",
          "/auth/signup",
          "/auth/error",
          "/api/auth",
          "/_next",
          "/favicon.ico",
        ];

        if (
          publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
        ) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/vendor/:path*",
    "/dashboard/:path*",
    "/checkout/:path*",
  ],
};
