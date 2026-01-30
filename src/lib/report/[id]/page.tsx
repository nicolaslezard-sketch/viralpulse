import { notFound } from "next/navigation";
import ResultsView from "@/components/ResultsView";
import UpgradeButton from "@/components/UpgradeButton";

type PageProps = {
  params: { id: string };
};

export default async function ReportPage({ params }: PageProps) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/report/${params.id}`,
    {
      cache: "no-store",
      credentials: "include",
    }
  );

  if (!res.ok) return notFound();

  const data = await res.json();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* ================= REPORT ================= */}
        <ResultsView
          report={data.report}
          transcript={data.transcript}
          isPro={data.isPro}
          mode="full"
          reportId={data.id}
        />

        {/* ================= FINAL CTA (FREE ONLY) ================= */}
        {!data.isPro && (
          <div className="mt-20 rounded-3xl border border-white/10 bg-zinc-950 p-10 text-center">
            <h3 className="text-2xl font-bold">
              Unlock the full viral analysis
            </h3>

            <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-400">
              Get access to all 18 insights, full transcript, advanced hooks,
              remix strategies and long-form analysis.
            </p>

            <div className="mt-8 flex justify-center">
              <UpgradeButton
                plan="pro"
                label="Unlock full report"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
