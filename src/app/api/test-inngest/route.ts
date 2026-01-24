import { NextResponse } from "next/server";
import { inngest } from "@/lib/inngest/client";

export const runtime = "nodejs";

export async function GET() {
  await inngest.send({
    name: "test.event",
    data: {
      hello: "world",
      at: new Date().toISOString(),
    },
  });

  return NextResponse.json({ ok: true });
}
