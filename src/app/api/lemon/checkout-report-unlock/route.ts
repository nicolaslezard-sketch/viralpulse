import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { createLemonCheckout } from "@/lib/lemon";

const ONE_REPORT_VARIANT = process.env.LEMON_VARIANT_ONE_REPORT;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!ONE_REPORT_VARIANT) {
      return NextResponse.json(
        { error: "Missing LEMON_VARIANT_ONE_REPORT env" },
        { status: 500 },
      );
    }

    const body = (await req.json().catch(() => ({}))) as {
      reportId?: string;
    };

    const reportId = body.reportId;

    if (!reportId) {
      return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
    }

    const report = await prisma.analysisReport.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        userId: true,
        status: true,
        oneShotUnlocked: true,
        freeFullPreview: true,
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (report.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (report.status !== "done") {
      return NextResponse.json(
        { error: "Report is not ready yet" },
        { status: 400 },
      );
    }

    if (report.oneShotUnlocked || report.freeFullPreview) {
      return NextResponse.json(
        { error: "This report is already unlocked" },
        { status: 400 },
      );
    }

    const redirectUrl = new URL(`/report/${reportId}`, req.url).toString();

    const url = await createLemonCheckout({
      variantId: ONE_REPORT_VARIANT,
      userId: session.user.id,
      email: session.user.email ?? undefined,
      redirectUrl,
      customData: {
        checkoutType: "report_unlock",
        reportId,
      },
    });

    return NextResponse.json({ url });
  } catch (err) {
    console.error("/api/lemon/checkout-report-unlock failed", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
