import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getOrCreateCustomer } from "@/lib/billing";

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
  const user = await getUserFromSession();

  const customerId = await getOrCreateCustomer({
    email: user.email,
    name: user.name,
    existingCustomerId: user.stripeCustomerId,
  });

  const priceId = process.env.STRIPE_PRO_PRICE_ID!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],

    // 🔑 CLAVE PARA EL WEBHOOK
    metadata: {
      userId: user.id,
    },

    success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pricing`,
    allow_promotion_codes: false,
  });

  return NextResponse.json({ url: session.url });
}
