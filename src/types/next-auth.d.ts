import { DefaultSession } from "next-auth";
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
  interface JWT {
    id: string;
    plan: UserPlan;
  }
}
