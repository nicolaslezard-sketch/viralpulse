import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const WEBHOOK_SECRET = process.env.LEMON_WEBHOOK_SECRET!;

/* =========================
   Helper: Signature verify
========================= */
function verifySignature(rawBody: string, signature: string) {
  const hmac = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature));
}

/* =========================
   Webhook handler
========================= */
export async function POST(req: Request) {
  const rawBody = await req.text();

  console.log("🟡 LEMON WEBHOOK HIT");
  console.log("🟡 RAW BODY:", rawBody);
  console.log("🟡 HEADERS:", Object.fromEntries(req.headers.entries()));

  const signature = req.headers.get("x-signature");

  // ⛔️ TEMP: desactivamos firma para debug
  /*
  if (!signature || !verifySignature(rawBody, signature)) {
    console.log("🔴 INVALID SIGNATURE");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  */

  const event = JSON.parse(rawBody);

  console.log("🟢 EVENT NAME:", event.meta?.event_name);
  console.log("🟢 EVENT DATA:", event.data);

  const custom = event.data?.attributes?.checkout_data?.custom;
  const userId = custom?.userId;

  console.log("🟠 CHECKOUT CUSTOM:", custom);
  console.log("🟠 USER ID:", userId);

  if (!userId) {
    console.log("⚠️ WEBHOOK SIN USER ID – IGNORADO");
    return NextResponse.json({ ok: true });
  }

  const eventName = event.meta?.event_name;
  const data = event.data;

  if (
    eventName === "subscription_created" ||
    eventName === "subscription_updated"
  ) {
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

    console.log("✅ USER UPDATED:", userId);
  }

  if (eventName === "subscription_cancelled") {
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: "cancelled" },
    });

    console.log("⚠️ SUBSCRIPTION CANCELLED:", userId);
  }

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

    console.log("❌ SUBSCRIPTION EXPIRED:", userId);
  }

  return NextResponse.json({ ok: true });
}
