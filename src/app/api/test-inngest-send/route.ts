import { NextResponse } from "next/server";
import { inngest } from "@/lib/inngest/client";

export const runtime = "nodejs";

export async function POST() {
  await inngest.send({
    name: "report/analyze",
    data: {
      reportId: "TEST_ID",
    },
  });

  return NextResponse.json({ ok: true });
}
