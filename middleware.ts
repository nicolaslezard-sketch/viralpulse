import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 👤 Emails permitidos (opcional, lo dejamos como está)
const ALLOWED_EMAILS = new Set([
  "nicolaslezard@gmail.com",
]);

export default withAuth(
  function middleware(req: NextRequest) {
    const maintenance = process.env.MAINTENANCE_MODE === "true";

    // 🚧 MODO MANTENIMIENTO
    if (maintenance) {
      // Permitimos la página de mantenimiento y assets
      const { pathname } = req.nextUrl;

      if (
        pathname === "/maintenance" ||
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico"
      ) {
        return NextResponse.next();
      }

      return NextResponse.redirect(
        new URL("/maintenance", req.url)
      );
    }

    // ✅ Si no hay maintenance, seguimos normal
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // 1️⃣ Debe estar logueado
        if (!token) return false;

        const email =
          typeof (token as any).email === "string"
            ? (token as any).email.toLowerCase()
            : undefined;

        // 2️⃣ Allowlist (opcional, lo dejaste abierto)
        if (email && ALLOWED_EMAILS.has(email)) return true;

        // Público logueado
        return true;
      },
    },
    pages: {
      signIn: "/api/auth/signin",
    },
  }
);

// 🔒 Solo protegemos rutas privadas
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/report/:path*",
    "/analyze/:path*",
  ],
};
