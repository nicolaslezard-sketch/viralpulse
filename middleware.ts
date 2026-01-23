import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // Reglas:
  // - /report y /billing: requieren login (FREE puede entrar)
  // - /history: PRO only
  const AUTH_ROUTES = ["/report", "/billing", "/history"];
  const PRO_ONLY_ROUTES = ["/history"];

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isProOnly = PRO_ONLY_ROUTES.some((r) => pathname.startsWith(r));

  if (isAuthRoute && !token) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  if (isProOnly && token?.plan !== "pro") {
    return NextResponse.redirect(new URL("/pricing", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/history/:path*", "/billing/:path*", "/report/:path*"],
};
