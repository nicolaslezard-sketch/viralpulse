import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId =
      session.metadata?.userId ??
      session.client_reference_id;

    if (!userId) {
      console.error("Missing userId in Stripe session");
      return NextResponse.json({ received: true });
    }

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;

    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: "pro",
        stripeCustomerId: customerId ?? undefined,
        stripeSubscriptionId: subscriptionId ?? undefined,
      },
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;

    const customerId =
      typeof sub.customer === "string"
        ? sub.customer
        : sub.customer?.id;

    if (customerId) {
      await prisma.user.update({
        where: { stripeCustomerId: customerId },
        data: {
          plan: "free",
          stripeSubscriptionId: null,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
