import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ✅ Emails permitidos para testear en producción
const ALLOWED_EMAILS = new Set([
  "nicolaslezard@gmail.com",
]);

export default withAuth(
  function middleware(req: NextRequest) {
    // Si llega hasta acá, el usuario está autenticado y autorizado
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // 1) Debe estar logueado
        if (!token) return false;

        // 2) Si querés modo "solo allowlist" en prod, se activa acá:
        //    - Permitimos siempre a tu mail (y podés agregar más)
        //    - Para el resto, dejamos pasar igual (por ahora) si está logueado
        //
        // 👉 Si querés cerrar el acceso para el público, cambiá la línea final
        //    por: return !!email && ALLOWED_EMAILS.has(email);
        const email =
          typeof (token as any).email === "string"
            ? (token as any).email.toLowerCase()
            : undefined;

        if (email && ALLOWED_EMAILS.has(email)) return true;

        // Público logueado: permitido (comportamiento actual)
        return true;
      },
    },
    pages: {
      signIn: "/api/auth/signin",
    },
  }
);

// Solo proteger rutas sensibles
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/report/:path*",
    "/analyze/:path*",
    "/add-card/:path*",
  ],
};
