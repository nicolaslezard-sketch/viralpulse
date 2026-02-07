import NextAuth, { type NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import type { User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { UserPlan } from "@/lib/types";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    /**
     * 🔐 Se ejecuta al loguear
     * Garantiza que el user exista en DB
     */
    async signIn({ user }: { user: User }) {
      if (!user.email) return false;

      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          plan: "free",
        },
      });

      return true;
    },

    /**
     * 🔑 JWT = SOURCE OF TRUTH para plan
     */
    async jwt({ token, user }: { token: JWT; user?: User }) {
      // Login inicial
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, plan: true },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.plan = dbUser.plan as UserPlan;
          token.planCheckedAt = Date.now();
        }

        return token;
      }

      // Requests normales: refresco con TTL
      const TTL_MS = 60_000;
      const last = token.planCheckedAt;

      if (token.id && (!last || Date.now() - last > TTL_MS)) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { plan: true },
        });

        if (dbUser) {
          token.plan = dbUser.plan as UserPlan;
          token.planCheckedAt = Date.now();
        }
      }

      return token;
    },

    /**
     * 🧠 Session = lo que usa el frontend
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = token.plan as UserPlan;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
