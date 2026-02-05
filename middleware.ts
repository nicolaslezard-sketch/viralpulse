import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    const maintenance = process.env.MAINTENANCE_MODE === "true";
    const { pathname } = req.nextUrl;

    // 🚧 Maintenance mode (público)
    if (maintenance) {
      if (
        pathname === "/maintenance" ||
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico"
      ) {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL("/maintenance", req.url));
    }

    // ✅ Todo OK
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // 🔒 Solo protegemos rutas privadas
        return !!token;
      },
    },
    pages: {
      signIn: "/api/auth/signin",
    },
  },
);

// 🎯 SOLO rutas privadas pasan por auth
export const config = {
  matcher: ["/dashboard/:path*", "/report/:path*", "/analyze/:path*"],
};
