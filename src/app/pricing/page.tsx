"use client";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24 text-white">
      {/* HERO */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-semibold">
          Simple pricing for serious creators
        </h1>
        <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
          Start free. You’ll only be charged if you decide to upgrade.
        </p>
      </div>

      {/* PLANS */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* FREE */}
        <div className="rounded-2xl border border-white/10 bg-black/30 p-8 backdrop-blur">
          <h2 className="text-xl font-semibold">Free</h2>
          <p className="mt-2 text-zinc-400">
            Try ViralPulse at your own pace
          </p>

          <div className="mt-6 text-3xl font-semibold">$0</div>

          <ul className="mt-6 space-y-3 text-sm text-zinc-300">
            <li>✔ 1 analysis per day</li>
            <li>✔ Up to 3 minutes per audio</li>
            <li>✔ Core insights preview</li>
            <li>✔ No card required</li>
          </ul>

          <button className="mt-8 w-full rounded-xl border border-white/15 px-4 py-3 text-sm hover:bg-white/5">
            Continue for free
          </button>

          <p className="mt-2 text-xs text-zinc-500 text-center">
            No credit card required.
          </p>
        </div>

        {/* PLUS */}
        <div className="relative rounded-2xl border border-indigo-500/40 bg-indigo-500/10 p-8 backdrop-blur">
          <div className="absolute -top-3 right-6 rounded-full bg-indigo-500 px-3 py-1 text-xs text-white">
            Most popular
          </div>

          <h2 className="text-xl font-semibold">Plus</h2>
          <p className="mt-2 text-zinc-300">
            For creators who publish consistently
          </p>

          <div className="mt-6 text-3xl font-semibold">
            $9.99 <span className="text-base font-normal">/ month</span>
          </div>

          <ul className="mt-6 space-y-3 text-sm text-zinc-200">
            <li>✔ Up to 10 minutes per audio</li>
            <li>✔ Monthly analysis minutes</li>
            <li>✔ Faster processing</li>
            <li>✔ All core insights</li>
          </ul>

          <a
            href="/add-card"
            className="mt-8 block w-full rounded-xl bg-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white hover:brightness-110"
          >
            Upgrade to Plus
          </a>

          <p className="mt-2 text-xs text-zinc-300 text-center">
            You won’t be charged unless you upgrade.
          </p>
        </div>

        {/* PRO */}
        <div className="rounded-2xl border border-white bg-white p-8 text-black">
          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="mt-2 text-zinc-600">
            For serious creators and teams
          </p>

          <div className="mt-6 text-3xl font-semibold">
            $19.99 <span className="text-base font-normal">/ month</span>
          </div>

          <ul className="mt-6 space-y-3 text-sm">
            <li>✔ Up to 20 minutes per audio</li>
            <li>✔ Higher monthly limits</li>
            <li>✔ Priority analysis</li>
            <li>✔ Early access to new features</li>
          </ul>

          <button
            onClick={() =>
              fetch("/api/stripe/setup-checkout", {
                method: "POST",
              }).then(async (r) => {
                const d = await r.json();
                if (d?.url) window.location.href = d.url;
              })
            }
            className="mt-8 w-full rounded-xl bg-black px-4 py-3 text-sm text-white hover:bg-zinc-800"
          >
            Go Pro
          </button>

          <p className="mt-2 text-xs text-zinc-600 text-center">
            Card required. No charges unless you upgrade.
          </p>
        </div>
      </div>

      {/* FOOTNOTE */}
      <p className="mt-14 text-center text-xs text-zinc-500">
        Adding a card doesn’t start a subscription. Payments securely handled by Stripe.
      </p>
    </div>
  );
}
