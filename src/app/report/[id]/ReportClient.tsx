"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/clientBaseUrl";
import { withRetry } from "@/lib/retry";
import ResultsView from "@/components/ResultsView";

export default function ReportClient({ reportId }: { reportId: string }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    withRetry(() => fetch(apiUrl(`/api/report/${reportId}`)), { retries: 2, baseDelayMs: 600 })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => {
        setError(e.message);
      });
  }, [reportId]);

  if (error) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center text-zinc-400">
        Loading report…
      </div>
    );
  }

  return (
    <ResultsView
      report={data.report}
      transcript={data.transcript}
      isPro={data.isPro}
      mode="full"
      reportId={reportId}
    />
  );
}
