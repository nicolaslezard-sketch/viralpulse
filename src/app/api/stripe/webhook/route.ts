import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function safeSetPlanByUserId(userId: string, data: any) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data,
    });
  } catch (e) {
    console.error("Stripe webhook: user not found for id", userId);
  }
}

async function safeSetPlanByCustomerId(customerId: string, data: any) {
  try {
    await prisma.user.update({
      where: { stripeCustomerId: customerId },
      data,
    });
  } catch (e) {
    console.error("Stripe webhook: user not found for customer", customerId);
  }
}

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
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    /* ============================================
       CHECKOUT COMPLETED (SETUP o SUBSCRIPTION)
    ============================================ */
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const mode = session.mode; // "setup" | "subscription" | "payment"

      const userId =
        session.metadata?.userId ?? session.client_reference_id ?? null;

      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;

      /* ============================
         1️⃣ SETUP MODE → ADD CARD
      ============================ */
      if (mode === "setup") {
        // Guardar default payment method
        if (customerId && session.setup_intent) {
          const setupIntentId =
            typeof session.setup_intent === "string"
              ? session.setup_intent
              : session.setup_intent.id;

          const si = await stripe.setupIntents.retrieve(setupIntentId);

          const pmId =
            typeof si.payment_method === "string"
              ? si.payment_method
              : si.payment_method?.id;

          if (pmId) {
            await stripe.customers.update(customerId, {
              invoice_settings: {
                default_payment_method: pmId,
              },
            });
          }
        }

        // Guardamos customerId si el user aún no lo tenía
        if (userId && customerId) {
          await safeSetPlanByUserId(userId, {
            stripeCustomerId: customerId,
          });
        }

        return NextResponse.json({ received: true });
      }

      /* ============================
         2️⃣ SUBSCRIPTION → PRO
      ============================ */
      if (mode === "subscription") {
        if (!userId) return NextResponse.json({ received: true });

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        await safeSetPlanByUserId(userId, {
          plan: "pro",
          stripeCustomerId: customerId ?? undefined,
          stripeSubscriptionId: subscriptionId ?? undefined,
        });
      }
    }

    /* ============================================
       SUBSCRIPTION DELETED → DOWNGRADE
    ============================================ */
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;

      const customerId =
        typeof sub.customer === "string" ? sub.customer : sub.customer?.id;

      if (customerId) {
        await safeSetPlanByCustomerId(customerId, {
          plan: "free",
          stripeSubscriptionId: null,
        });
      }
    }

    /* ============================================
       SUBSCRIPTION UPDATED → REFORCE STATUS
    ============================================ */
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;

      const customerId =
        typeof sub.customer === "string" ? sub.customer : sub.customer?.id;

      const status = sub.status; // active, trialing, past_due, canceled, unpaid
      const isActive = status === "active" || status === "trialing";

      if (customerId) {
        await safeSetPlanByCustomerId(customerId, {
          plan: isActive ? "pro" : "free",
          stripeSubscriptionId: isActive ? sub.id : null,
        });
      }
    }
  } catch (e) {
    console.error("Stripe webhook handler error:", e);
    // Respondemos 200 igual para evitar reintentos infinitos
  }

  return NextResponse.json({ received: true });
}
