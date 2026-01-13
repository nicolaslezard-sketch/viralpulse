import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// ⚠️ TEMPORAL — luego se conecta a auth real
async function getUserFromSession() {
  return {
    email: "test@example.com",
    name: "Test User",
    stripeCustomerId: null as string | null,
  };
}

async function getOrCreateCustomer(user: {
  email: string;
  name: string;
  stripeCustomerId: string | null;
}) {
  if (user.stripeCustomerId) return user.stripeCustomerId;

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
  });

  // TODO: guardar customer.id en DB
  return customer.id;
}

export async function POST() {
  try {
    const user = await getUserFromSession();

    const customerId = await getOrCreateCustomer(user);

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 }
    );
  }
}
