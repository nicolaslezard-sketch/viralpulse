"use client";

import UpgradeButton from "@/components/UpgradeButton";

export default function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 pb-24">
      <h2 className="text-center text-4xl font-semibold">Pricing</h2>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* FREE */}
        <PlanCard title="Free" subtitle="Try the workflow risk-free" price="$0">
          <li>Limited daily analyses</li>
          <li>Up to 5 minutes per audio</li>
          <li>Preview insights</li>
        </PlanCard>

        {/* PLUS */}
        <PlanCard
          title="Plus"
          subtitle="For consistent weekly creators"
          price="$9.99 / month"
          highlight
          badge="Most popular"
        >
          <li>120 minutes / month</li>
          <li>Up to 10 minutes per audio</li>
          <li>Full transcript & insights</li>
          <li>Faster processing</li>
          <UpgradeButton plan="plus" label="Upgrade to Plus" className="mt-6" />
        </PlanCard>

        {/* PRO */}
        <PlanCard
          title="Pro"
          subtitle="For daily creators & long-form content"
          price="$19.99 / month"
          light
        >
          <li>400 minutes / month</li>
          <li>Up to 20 minutes per audio</li>
          <li>Priority processing</li>
          <li>Advanced tools</li>
          <UpgradeButton
            plan="pro"
            label="Upgrade to Pro"
            variant="dark"
            className="mt-6"
          />
        </PlanCard>
      </div>

      <p className="mt-6 text-center text-xs text-zinc-500">
        Secure payments handled by Lemon. You’re never charged unless you upgrade.
      </p>
    </section>
  );
}

function PlanCard({
  title,
  subtitle,
  price,
  children,
  highlight,
  light,
  badge,
}: {
  title: string;
  subtitle: string;
  price: string;
  children: React.ReactNode;
  highlight?: boolean;
  light?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={[
        "relative rounded-3xl p-7",
        light
          ? "bg-white text-black"
          : highlight
          ? "border border-indigo-400/30 bg-indigo-500/10"
          : "border border-white/10 bg-black/30",
      ].join(" ")}
    >
      {badge ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold text-white">
          {badge}
        </div>
      ) : null}

      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className={light ? "mt-2 text-black/70" : "mt-2 text-zinc-400"}>
        {subtitle}
      </p>

      <div className="mt-6 text-4xl font-extrabold">{price}</div>

      <ul className="mt-6 space-y-3 text-sm">{children}</ul>
    </div>
  );
}
