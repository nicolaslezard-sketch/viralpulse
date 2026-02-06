import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/* =====================================================
   ENV
===================================================== */
const WEBHOOK_SECRET = process.env.LEMON_WEBHOOK_SECRET!;

/* =====================================================
   Types (mínimos, solo lo que usamos)
===================================================== */
type LemonWebhookEvent = {
  meta?: {
    event_name?: string;
    custom_data?: {
      userId?: string;
    };
  };
  data?: {
    id?: string;
    attributes?: {
      status?: string;
      renews_at?: string | null;
      checkout_data?: {
        custom?: {
          userId?: string;
        };
      };
    };
    relationships?: {
      variant?: {
        data?: {
          id?: string;
        };
      };
      customer?: {
        data?: {
          id?: string;
        };
      };
    };
  };
};

/* =====================================================
   Signature verification
===================================================== */
function verifySignature(rawBody: string, signature: string) {
  const hmac = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(hmac, "hex"),
    Buffer.from(signature, "hex"),
  );
}

/* =====================================================
   Webhook handler
===================================================== */
export async function POST(req: Request) {
  const rawBody = await req.text();

  console.log("🟡 LEMON WEBHOOK HIT");

  const signature = req.headers.get("x-signature");

  // 🔐 ACTIVAR ESTO CUANDO TERMINES DE DEBUGEAR
  /*
  if (!signature || !verifySignature(rawBody, signature)) {
    console.log("🔴 INVALID SIGNATURE");
    return NextResponse.json({ ok: true });
  }
  */

  let payload: LemonWebhookEvent;

  try {
    payload = JSON.parse(rawBody) as LemonWebhookEvent;
  } catch {
    console.log("🔴 INVALID JSON");
    return NextResponse.json({ ok: true });
  }

  const eventName = payload.meta?.event_name;

  /* ===============================
     Resolve userId (CLAVE)
  ================================ */
  const customFromMeta = payload.meta?.custom_data ?? null;
  const customFromCheckout =
    payload.data?.attributes?.checkout_data?.custom ?? null;

  const userId = customFromMeta?.userId ?? customFromCheckout?.userId ?? null;

  console.log("🟠 CUSTOM META:", customFromMeta);
  console.log("🟠 CUSTOM CHECKOUT:", customFromCheckout);
  console.log("🟠 USER ID:", userId);
  console.log("🟢 EVENT NAME:", eventName);

  if (!userId) {
    console.log("⚠️ WEBHOOK SIN USER ID – IGNORADO");
    return NextResponse.json({ ok: true });
  }

  /* ===============================
     Subscription created / updated
  ================================ */
  if (
    eventName === "subscription_created" ||
    eventName === "subscription_updated"
  ) {
    const variantId = payload.data?.relationships?.variant?.data?.id ?? null;

    const status = payload.data?.attributes?.status ?? null;

    const renewsAt = payload.data?.attributes?.renews_at ?? null;

    if (!variantId) {
      console.log("⚠️ VARIANT ID MISSING");
      return NextResponse.json({ ok: true });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: variantId === process.env.LEMON_VARIANT_PRO ? "pro" : "plus",
        lemonSubscriptionId: payload.data?.id ?? null,
        lemonCustomerId:
          payload.data?.relationships?.customer?.data?.id ?? null,
        lemonVariantId: variantId,
        subscriptionStatus: status,
        currentPeriodEnd: renewsAt ? new Date(renewsAt) : null,
      },
    });

    console.log("✅ USER UPDATED:", userId);
  }

  /* ===============================
     Subscription cancelled
  ================================ */
  if (eventName === "subscription_cancelled") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: "cancelled",
      },
    });

    console.log("⚠️ SUBSCRIPTION CANCELLED:", userId);
  }

  /* ===============================
     Subscription expired
  ================================ */
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
