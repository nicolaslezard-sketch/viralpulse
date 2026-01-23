import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { analyzeReport } from "@/lib/inngest/functions/analyzeReport";
import { ping } from "@/lib/inngest/functions/ping";

export const runtime = "nodejs";

export const { GET, POST } = serve({
  client: inngest,
  functions: [analyzeReport, ping], // 👈 IMPORTANTE
});
