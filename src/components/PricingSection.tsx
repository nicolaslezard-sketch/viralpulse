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
  children: React.ReactNode;
};

function PlanCard({
  title,
  subtitle,
  price,
  highlight,
  badge,
  light,
  children,
}: PlanCardProps) {
  return (
    <div
      className={[
        "relative rounded-2xl p-8 backdrop-blur",
        light
          ? "bg-white text-black border border-white"
          : highlight
            ? "border border-indigo-500/40 bg-indigo-500/10"
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

      <ul
        className={[
          "mt-6 space-y-3 text-sm",
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
      {/* HERO */}
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-semibold">
          Simple pricing for serious creators
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-zinc-400">
          Start free. Upgrade only when you need higher limits and full
          insights.
        </p>
      </div>

      {/* PLANS */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* FREE */}
        <PlanCard title="Free" subtitle="Try the workflow risk-free" price="$0">
          <li>✔ 3 analysis per day</li>
          <li>✔ Up to 5 minutes per audio</li>
          <li>✔ Preview viral insights</li>
          <li className="text-zinc-500">✖ No transcript</li>
          <li className="text-zinc-500">✖ No analysis history</li>

          <Link
            href="/"
            className="mt-6 block w-full rounded-xl border border-white/15 px-4 py-3 text-center text-sm hover:bg-white/5"
          >
            Start free
          </Link>

          <p className="mt-2 text-center text-xs text-zinc-500">
            No credit card required.
          </p>
        </PlanCard>

        {/* PLUS */}
        <PlanCard
          title="Plus"
          subtitle="For consistent weekly creators"
          price="$9.99 / month"
          highlight
          badge="Most popular"
        >
          <li>✔ Full viral report (all sections)</li>
          <li>✔ Transcript included</li>
          <li>✔ Copy full report</li>
          <li>✔ Analysis history</li>
          <li className="pt-2">
            🧾 Up to <span className="font-medium">120 minutes / month</span>
          </li>
          <li>
            🧾 Up to <span className="font-medium">10 min per audio</span>
          </li>

          <UpgradeButton plan="plus" label="Upgrade to Plus" className="mt-6" />

          <p className="mt-2 text-center text-xs text-zinc-300">
            Secure checkout. Cancel anytime.
          </p>
        </PlanCard>

        {/* PRO */}
        <PlanCard
          title="Pro"
          subtitle="For daily creators & long-form content"
          price="$19.99 / month"
          light
        >
          <li>✔ Everything in Plus</li>
          <li>✔ Priority processing</li>
          <li>✔ Faster turnaround</li>
          <li className="pt-2">
            🧾 Up to <span className="font-medium">400 minutes / month</span>
          </li>
          <li>
            🧾 Up to <span className="font-medium">20 min per audio</span>
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

      {/* FOOTNOTE */}
      <p className="mt-14 text-center text-xs text-zinc-500">
        Payments are securely handled by Lemon. You’re only charged if you
        upgrade.
      </p>
    </section>
  );
}
