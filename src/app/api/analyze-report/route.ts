import { NextResponse } from "next/server";
import { runAnalysis } from "@/lib/analysis/runAnalysis";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { reportId } = await req.json();

    if (!reportId) {
      return NextResponse.json(
        { error: "Missing reportId" },
        { status: 400 }
      );
    }

    await runAnalysis({ reportId });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("analyze-report error", err);
    return NextResponse.json(
      { error: "Analyze report failed" },
      { status: 500 }
    );
  }
}
