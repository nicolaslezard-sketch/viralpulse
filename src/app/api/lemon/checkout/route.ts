import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createLemonCheckout } from "@/lib/lemon";

const VARIANTS = {
  plus: process.env.LEMON_VARIANT_PLUS,
  pro: process.env.LEMON_VARIANT_PRO,
} as const;

type Plan = keyof typeof VARIANTS;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as { plan?: string };
    const plan = body.plan as Plan | undefined;

    if (!plan || !(plan in VARIANTS)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const variantId = VARIANTS[plan];
    if (!variantId) {
      return NextResponse.json(
        { error: `Missing Lemon variant env for plan: ${plan}` },
        { status: 500 }
      );
    }

    const url = await createLemonCheckout({
      variantId,
      userId: session.user.id,
      email: session.user.email ?? undefined,
    });

    return NextResponse.json({ url });
  } catch (err: unknown) {
    console.error("/api/lemon/checkout failed", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
