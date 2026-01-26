import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ plan: "free", hasCard: false });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, stripeCustomerId: true, email: true },
  });

  const plan = user?.plan ?? "free";

  let hasCard = false;

  if (user?.stripeCustomerId) {
    const pms = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: "card",
      limit: 1,
    });

    hasCard = pms.data.length > 0;
  }

  return NextResponse.json({ plan, hasCard });
}
