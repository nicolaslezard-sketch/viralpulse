import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getOrCreateUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const user = await getOrCreateUser();

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? "test@example.com",
        name: "Test User",
      });

      customerId = customer.id;

      // ✅ CLAVE: persistir customerId
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

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
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 }
    );
  }
}
