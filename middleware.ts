import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // 🔒 Rutas PRO (ajustá si querés)
  const PRO_ROUTES = ["/history", "/billing", "/report"];

  const isProRoute = PRO_ROUTES.some((r) =>
    pathname.startsWith(r)
  );

  if (isProRoute) {
    // No logueado
    if (!token) {
      return NextResponse.redirect(
        new URL("/api/auth/signin", req.url)
      );
    }

    // No PRO
    if (token.plan !== "pro") {
      return NextResponse.redirect(
        new URL("/pricing", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/history/:path*",
    "/billing/:path*",
    "/report/:path*",
  ],
};
