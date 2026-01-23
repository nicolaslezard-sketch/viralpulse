import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


async function getUserFromSession() {
  // TODO: integrar Auth real
  return {
    id: "user_test_123", // 🔥 IMPORTANTE
    email: "test@example.com",
    name: "Test User",
    stripeCustomerId: null as string | null,
  };
}

export async function POST() {
  const sessionAuth = await getServerSession(authOptions);

  if (!sessionAuth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = sessionAuth.user.id;

  // aseguramos user en DB
  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: sessionAuth.user.email,
      plan: "free",
    },
  });

  let customerId = user.stripeCustomerId;

  // 🔑 crear customer solo si no existe
  if (!customerId) {
    const customer = await stripe.customers.create({
  email: user.email ?? undefined,
});

    customerId = customer.id;

    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }

  const priceId = process.env.STRIPE_PRO_PRICE_ID!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],

    // 🔑 clave para el webhook
    metadata: {
      userId,
    },

    success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pricing`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
