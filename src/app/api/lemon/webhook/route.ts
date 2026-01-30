import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const WEBHOOK_SECRET = process.env.LEMON_WEBHOOK_SECRET!;

function verifySignature(rawBody: string, signature: string) {
  const hmac = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature));
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");

  if (!signature || !verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const eventName = event.meta?.event_name;
  const data = event.data;

  const custom = data.attributes?.checkout_data?.custom;
  const userId = custom?.userId;

  // Webhooks sin userId no nos interesan
  if (!userId) {
    return NextResponse.json({ ok: true });
  }

  /**
   * SUBSCRIPTION CREATED / UPDATED
   * Activa o mantiene el plan
   */
  if (eventName === "subscription_created" || eventName === "subscription_updated") {
    const variantId = data.relationships.variant.data.id;
    const status = data.attributes.status;
    const renewsAt = data.attributes.renews_at;

    await prisma.user.update({
      where: { id: userId },
      data: {
  plan: variantId === process.env.LEMON_VARIANT_PRO ? "pro" : "plus",
  lemonSubscriptionId: data.id,
  lemonCustomerId: data.relationships.customer.data.id,
  lemonVariantId: variantId,
  subscriptionStatus: status,
  currentPeriodEnd: renewsAt ? new Date(renewsAt) : null,
},

    });
  }

  /**
   * SUBSCRIPTION CANCELLED
   * NO se baja el plan, solo marcamos estado
   */
  if (eventName === "subscription_cancelled") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: "cancelled",
      },
    });
  }

  /**
   * SUBSCRIPTION EXPIRED
   * Acá sí se pierde el acceso
   */
  if (eventName === "subscription_expired") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: "free",
        subscriptionStatus: "expired",
        lemonSubscriptionId: null,
        lemonVariantId: null,
        currentPeriodEnd: null,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
