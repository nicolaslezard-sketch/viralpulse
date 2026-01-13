"use client";

import { useEffect, useState } from "react";
import ResultsView from "@/components/ResultsView";

export default function ReportClient({ id }: { id: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`report:${id}`);
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, [id]);

  if (!data) {
    return <p className="p-6">Report not found.</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">
          Analysis complete
        </h1>
        <p className="text-zinc-600">
          Your content is ready to be published smarter.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() =>
              navigator.clipboard.writeText(data.raw)
            }
            className="rounded-lg bg-black px-4 py-2 text-white text-sm hover:bg-zinc-800"
          >
            Copy full report
          </button>

          {/* FUTURO: gating Pro */}
          {/* <button className="rounded-lg border px-4 py-2 text-sm">
            Upgrade to Pro
          </button> */}
        </div>
      </div>

      {/* MAIN REPORT */}
      <ResultsView data={data} />

      {/* TRANSCRIPT (PRO ONLY – preparado) */}
      {data.transcript && (
        <div className="rounded-xl border bg-zinc-50 p-5">
          <details>
            <summary className="cursor-pointer font-medium">
              View full transcript
            </summary>
            <pre className="mt-4 whitespace-pre-wrap text-sm text-zinc-700">
              {data.transcript}
            </pre>
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  data.transcript
                )
              }
              className="mt-4 rounded-lg border px-3 py-1 text-sm hover:bg-zinc-100"
            >
              Copy transcript
            </button>
          </details>
        </div>
      )}
    </div>
  );
}
