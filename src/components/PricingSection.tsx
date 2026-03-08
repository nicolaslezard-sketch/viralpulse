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
        "relative rounded-2xl p-8 backdrop-blur",
        light
          ? "border border-white bg-white text-black"
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

      {promo && (
        <div
          className={[
            "mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold",
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
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-semibold">
          Simple pricing for serious creators
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
          Start free, then unlock deeper strategy, rewrite, transcript and
          analytics when you’re ready to optimize seriously.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <PlanCard
          title="Free"
          subtitle="Try the workflow before you upgrade"
          price="$0"
        >
          <li>✔ 3 analyses per day</li>
          <li>✔ Audio + video upload</li>
          <li>✔ Up to 5 min per file</li>
          <li>✔ Up to 80 MB per file</li>
          <li>✔ Viral score included</li>
          <li>✔ Preview strategy insights</li>
          <li>✔ Preview AI rewrite</li>
          <li>✔ Preview transcript</li>
          <li className="text-zinc-500">✖ Full report locked</li>
          <li className="text-zinc-500">✖ Full AI rewrite locked</li>
          <li className="text-zinc-500">✖ Full transcript locked</li>
          <li className="text-zinc-500">✖ Performance analytics locked</li>

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

        <PlanCard
          title="Plus"
          subtitle="For creators who publish every week"
          price="$14.99 / month"
          promo="50% off your first month"
          highlight
          badge="Most popular"
        >
          <li>✔ Full viral report</li>
          <li>✔ Full strategy insights</li>
          <li>✔ Full AI rewrite</li>
          <li>✔ Full transcript</li>
          <li>✔ Analysis history</li>
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
          <li className="text-zinc-500">
            ✖ Performance analytics not included
          </li>
          <li className="text-zinc-500">✖ Priority processing not included</li>

          <UpgradeButton plan="plus" label="Upgrade to Plus" className="mt-6" />

          <p className="mt-2 text-center text-xs text-zinc-300">
            Secure checkout. Cancel anytime.
          </p>
        </PlanCard>

        <PlanCard
          title="Pro"
          subtitle="For daily creators and heavier content workflows"
          price="$29.99 / month"
          light
        >
          <li>✔ Everything in Plus</li>
          <li>✔ Performance analytics</li>
          <li>✔ Score timeline and trends</li>
          <li>✔ Priority processing</li>
          <li>✔ Faster turnaround</li>
          <li>✔ Audio + video upload</li>
          <li className="pt-2">
            🧾 Up to <span className="font-medium">400 minutes / month</span>
          </li>
          <li>
            🧾 Up to <span className="font-medium">20 min per file</span>
          </li>
          <li>
            🧾 Up to <span className="font-medium">200 MB per file</span>
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

      <p className="mt-14 text-center text-xs text-zinc-500">
        Payments are securely handled by Lemon. You’re only charged if you
        upgrade.
      </p>
    </section>
  );
}
