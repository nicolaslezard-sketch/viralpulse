import { NextResponse } from "next/server";
import { inngest } from "@/lib/inngest/client";

export const runtime = "nodejs";

export async function POST() {
  await inngest.send({
    name: "test/event",
    data: { hello: "world" },
  });

  return NextResponse.json({ sent: true });
}
