"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/clientBaseUrl";
import { withRetry } from "@/lib/retry";
import ResultsView from "@/components/ResultsView";
import { useUserPlan } from "@/lib/useUserPlan";
import type { FullReport } from "@/lib/report/types";

type ReportResponse = {
  id: string;
  report: FullReport | null;
  viralScore?: number | null;
  transcript: string | null;
  isPro: boolean;
};

export default function ReportClient({ reportId }: { reportId: string }) {
  const { plan, isLoading } = useUserPlan();

  const [data, setData] = useState<ReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    withRetry(() => fetch(apiUrl(`/api/report/${reportId}`)), {
      retries: 2,
      baseDelayMs: 600,
    })
      .then((r) => r.json())
      .then((d: ReportResponse) => {
        if ("error" in d) {
          throw new Error(String((d as any).error));
        }
        setData(d);
      })
      .catch((e: Error) => setError(e.message));
  }, [reportId]);

  if (error) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (!data || isLoading || !data.report) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center text-zinc-400">
        Loading report…
      </div>
    );
  }
  console.log(data.report);
  const isPaid = plan !== "free";

  return (
    <ResultsView
      report={data.report}
      viralScore={data.viralScore ?? null}
      transcript={isPaid ? data.transcript : null}
      isPro={isPaid}
      mode={isPaid ? "full" : "preview"}
    />
  );
}
