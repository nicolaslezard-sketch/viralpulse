import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const WEBHOOK_SECRET = process.env.LEMON_WEBHOOK_SECRET!;
const VARIANT_PRO = process.env.LEMON_VARIANT_PRO;

/* =========================
   Types mínimos necesarios
========================= */
type LemonWebhookEvent = {
  meta?: {
    event_name?: string;
    custom_data?: {
      userId?: string;
      reportId?: string;
      checkoutType?: string;
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
          reportId?: string;
          checkoutType?: string;
        };
      };
    };
    relationships?: {
      customer?: {
        data?: { id: string };
      };
      variant?: {
        data?: { id: string };
      };
    };
  };
};

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

  const signature = req.headers.get("x-signature");

  if (!signature || !verifySignature(rawBody, signature)) {
    console.log("🔴 INVALID SIGNATURE");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: LemonWebhookEvent;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    console.log("🔴 INVALID JSON");
    return NextResponse.json({ ok: true });
  }

  const eventName = payload.meta?.event_name ?? null;

  const customFromMeta = payload.meta?.custom_data ?? null;
  const customFromCheckout =
    payload.data?.attributes?.checkout_data?.custom ?? null;

  const userId = customFromMeta?.userId ?? customFromCheckout?.userId ?? null;
  const reportId =
    customFromMeta?.reportId ?? customFromCheckout?.reportId ?? null;
  const checkoutType =
    customFromMeta?.checkoutType ?? customFromCheckout?.checkoutType ?? null;

  console.log("🟠 CUSTOM META:", customFromMeta);
  console.log("🟠 CUSTOM CHECKOUT:", customFromCheckout);
  console.log("🟠 USER ID:", userId);
  console.log("🟠 REPORT ID:", reportId);
  console.log("🟠 CHECKOUT TYPE:", checkoutType);
  console.log("🟢 EVENT NAME:", eventName);

  /* =========================
     One-shot report unlock
  ========================= */
  if (eventName === "order_created" && checkoutType === "report_unlock") {
    if (!userId || !reportId) {
      console.log("⚠️ REPORT UNLOCK WITHOUT USER/REPORT – IGNORED");
      return NextResponse.json({ ok: true });
    }

    const report = await prisma.analysisReport.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        userId: true,
        oneShotUnlocked: true,
      },
    });

    if (!report || report.userId !== userId) {
      console.log("⚠️ REPORT UNLOCK INVALID OWNERSHIP – IGNORED");
      return NextResponse.json({ ok: true });
    }

    if (!report.oneShotUnlocked) {
      await prisma.analysisReport.update({
        where: { id: reportId },
        data: {
          oneShotUnlocked: true,
          lemonOrderId: payload.data?.id ?? null,
        },
      });

      console.log("✅ REPORT ONE-SHOT UNLOCKED:", reportId);
    }

    return NextResponse.json({ ok: true });
  }

  if (!userId) {
    console.log("⚠️ WEBHOOK SIN USER ID – IGNORADO");
    return NextResponse.json({ ok: true });
  }

  /* =========================
     Subscription created / updated
  ========================= */
  if (
    eventName === "subscription_created" ||
    eventName === "subscription_updated"
  ) {
    const status = payload.data?.attributes?.status ?? null;
    const renewsAt = payload.data?.attributes?.renews_at ?? null;

    const variantId = payload.data?.relationships?.variant?.data?.id ?? null;

    if (!variantId) {
      console.log("⚠️ VARIANT ID MISSING – NO ACTION");
      return NextResponse.json({ ok: true });
    }

    const normalizedVariantId = String(variantId);

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: normalizedVariantId === VARIANT_PRO ? "pro" : "plus",
        lemonSubscriptionId: payload.data?.id ?? null,
        lemonCustomerId:
          payload.data?.relationships?.customer?.data?.id ?? null,
        lemonVariantId: normalizedVariantId,
        subscriptionStatus: status,
        currentPeriodEnd: renewsAt ? new Date(renewsAt) : null,
      },
    });

    console.log("✅ USER UPDATED:", userId);
  }

  /* =========================
     Subscription cancelled
  ========================= */
  if (eventName === "subscription_cancelled") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: "cancelled",
      },
    });

    console.log("⚠️ SUBSCRIPTION CANCELLED:", userId);
  }

  /* =========================
     Subscription expired
  ========================= */
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
