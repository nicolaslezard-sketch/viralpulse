import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import type { UserPlan } from "@/lib/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: UserPlan;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    plan?: UserPlan;
    planCheckedAt?: number;
  }
}
