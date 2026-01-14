import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    /**
     * ✅ ALTA DE PLAN (SOURCE OF TRUTH)
     */
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId =
        session.metadata?.userId ?? session.client_reference_id;

      if (!userId) break;

      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (!customerId || !subscriptionId) break;

      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: "pro",
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
        },
      });

      break;
    }

    /**
     * ✅ BAJA DE PLAN (SOURCE OF TRUTH)
     */
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;

      const customerId =
        typeof sub.customer === "string"
          ? sub.customer
          : sub.customer?.id;

      if (!customerId) break;

      await prisma.user.update({
        where: { stripeCustomerId: customerId },
        data: {
          plan: "free",
          stripeSubscriptionId: null,
        },
      });

      break;
    }

    /**
     * 🔁 RENOVACIÓN OK (opcional, seguro)
     */
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;

      const customerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id;

      if (!customerId) break;

      await prisma.user.update({
        where: { stripeCustomerId: customerId },
        data: {
          plan: "pro",
        },
      });

      break;
    }
  }

  return NextResponse.json({ received: true });
}
