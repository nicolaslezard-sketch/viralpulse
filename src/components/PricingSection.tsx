"use client";

import Link from "next/link";
import UpgradeButton from "@/components/UpgradeButton";

type PlanCardProps = {
  title: string;
  subtitle: string;
  price: string;
  highlight?: boolean;
  badge?: string;
  light?: boolean;
  promo?: string;
  children: React.ReactNode;
};

function PlanCard({
  title,
  subtitle,
  price,
  highlight,
  badge,
  light,
  promo,
  children,
}: PlanCardProps) {
  return (
    <div
      className={[
        "relative flex h-full flex-col rounded-2xl p-8 backdrop-blur",
        light
          ? "border border-white bg-white text-black"
          : highlight
            ? "border border-indigo-500/50 bg-indigo-500/15 shadow-2xl shadow-indigo-950/40"
            : "border border-white/10 bg-black/30 text-white",
      ].join(" ")}
    >
      {badge && (
        <div className="absolute -top-3 right-6 rounded-full bg-indigo-500 px-3 py-1 text-xs font-medium text-white">
          {badge}
        </div>
      )}

      <h3 className="text-xl font-semibold">{title}</h3>

      <p className={light ? "mt-2 text-zinc-600" : "mt-2 text-zinc-400"}>
        {subtitle}
      </p>

      <div className="mt-6 text-3xl font-semibold">{price}</div>

      {promo && (
        <div
          className={[
            "mt-3 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold",
            light
              ? "bg-black/5 text-zinc-700"
              : "bg-indigo-500/20 text-indigo-200",
          ].join(" ")}
        >
          {promo}
        </div>
      )}

      <ul
        className={[
          "mt-6 flex-1 space-y-3 text-sm",
          light ? "text-zinc-700" : "text-zinc-300",
        ].join(" ")}
      >
        {children}
      </ul>
    </div>
  );
}

export default function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24 text-white">
      <div className="mb-16 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
          Pricing
        </p>

        <h2 className="text-4xl font-semibold">
          Start free. Upgrade when ViralPulse becomes part of your workflow.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
          Analyze hooks, spoken content, transcripts and rewrites before you
          publish. Free is enough to test the workflow. Paid plans unlock the
          full report, full rewrite and higher upload limits.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <PlanCard
          title="Free"
          subtitle="Test the workflow before paying"
          price="$0"
        >
          <li>✔ 3 analyses per day</li>
          <li>✔ Audio + video upload</li>
          <li>✔ Up to 5 min per file</li>
          <li>✔ Up to 80 MB per file</li>
          <li>✔ Viral score included</li>
          <li>✔ Strategy preview</li>
          <li>✔ AI rewrite preview</li>
          <li>✔ Transcript preview</li>
          <li className="text-zinc-500">✖ Full report locked</li>
          <li className="text-zinc-500">✖ Full AI rewrite locked</li>
          <li className="text-zinc-500">✖ Full transcript locked</li>
          <li className="text-zinc-500">✖ Performance analytics locked</li>

          <Link
            href="/"
            className="mt-6 block w-full rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-semibold hover:bg-white/5"
          >
            Start free
          </Link>

          <p className="mt-2 text-center text-xs text-zinc-500">
            No credit card required.
          </p>
        </PlanCard>

        <PlanCard
          title="Creator"
          subtitle="For creators who publish every week"
          price="$7.99 / month"
          promo="Lower launch pricing"
          highlight
          badge="Best starting point"
        >
          <li>✔ Full viral report</li>
          <li>✔ Full strategy insights</li>
          <li>✔ Full AI rewrite</li>
          <li>✔ Full transcript</li>
          <li>✔ Analysis history</li>
          <li>✔ Performance timeline</li>
          <li>✔ Score timeline and trends</li>
          <li>✔ Audio + video upload</li>
          <li className="pt-2">
            🧾 Up to <span className="font-medium">120 minutes / month</span>
          </li>
          <li>
            🧾 Up to <span className="font-medium">10 min per file</span>
          </li>
          <li>
            🧾 Up to <span className="font-medium">200 MB per file</span>
          </li>
          <li className="text-zinc-500">✖ Priority processing not included</li>
          <li className="text-zinc-500">✖ Faster turnaround not included</li>

          <UpgradeButton
            plan="plus"
            label="Upgrade to Creator"
            className="mt-6"
          />

          <p className="mt-2 text-center text-xs text-zinc-300">
            Cancel anytime. Built for regular creators.
          </p>
        </PlanCard>

        <PlanCard
          title="Pro"
          subtitle="For heavy creators, agencies and larger uploads"
          price="$19.99 / month"
          light
        >
          <li>✔ Everything in Creator</li>
          <li>✔ Priority processing</li>
          <li>✔ Faster turnaround</li>
          <li>✔ Audio + video upload</li>
          <li>✔ Better fit for client workflows</li>
          <li className="pt-2">
            🧾 Up to <span className="font-medium">400 minutes / month</span>
          </li>
          <li>
            🧾 Up to <span className="font-medium">20 min per file</span>
          </li>
          <li>
            🧾 Up to <span className="font-medium">400 MB per file</span>
          </li>

          <UpgradeButton
            plan="pro"
            label="Upgrade to Pro"
            variant="dark"
            className="mt-6"
          />

          <p className="mt-2 text-center text-xs text-zinc-600">
            Cancel anytime. No hidden fees.
          </p>
        </PlanCard>
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5 text-center">
        <p className="text-sm font-medium text-indigo-100">
          Coming next: one-time credit packs for users who prefer not to
          subscribe.
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          Subscriptions are handled securely by Lemon Squeezy. You’re only
          charged if you upgrade.
        </p>
      </div>
    </section>
  );
}
