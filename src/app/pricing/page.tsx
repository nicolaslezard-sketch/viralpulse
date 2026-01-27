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
          Start free. Add a card only to unlock higher limits — you won’t be
          charged unless you upgrade.
        </p>
      </div>

      {/* PLANS */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* FREE */}
        <div className="rounded-2xl border border-white/10 bg-black/30 p-8 backdrop-blur">
          <h2 className="text-xl font-semibold">Free</h2>
          <p className="mt-2 text-zinc-400">
            Try ViralPulse and test the workflow
          </p>

          <div className="mt-6 text-3xl font-semibold">$0</div>

          <ul className="mt-6 space-y-3 text-sm text-zinc-300">
            <li>✔ Limited daily analyses</li>
            <li>✔ Up to 3 minutes per audio</li>
            <li>✔ Preview insights</li>
            <li>✔ Card required (anti-abuse)</li>
          </ul>

          <a
            href="/"
            className="mt-8 block w-full rounded-xl border border-white/15 px-4 py-3 text-center text-sm hover:bg-white/5"
          >
            Start free
          </a>

          <p className="mt-2 text-xs text-zinc-500 text-center">
            No charge unless you upgrade.
          </p>
        </div>

        {/* PLUS */}
        <div className="relative rounded-2xl border border-indigo-500/35 bg-indigo-500/10 p-8 backdrop-blur">
          <div className="absolute -top-3 right-6 rounded-full bg-indigo-500 px-3 py-1 text-xs text-white">
            Most popular
          </div>

          <h2 className="text-xl font-semibold">Plus</h2>
          <p className="mt-2 text-zinc-300">
            For consistent weekly creators
          </p>

          <div className="mt-6 text-3xl font-semibold">
            $9.99 <span className="text-base font-normal">/ month</span>
          </div>

          <ul className="mt-6 space-y-3 text-sm text-zinc-200">
            <li>✔ Up to 120 minutes / month</li>
            <li>✔ Audio up to 10 minutes</li>
            <li>✔ Full insights & transcript</li>
            <li>✔ Faster processing</li>
          </ul>

          <a
            href="/add-card"
            className="mt-8 block w-full rounded-xl bg-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white hover:brightness-110"
          >
            Upgrade to Plus
          </a>

          <p className="mt-2 text-xs text-zinc-300 text-center">
            You won’t be charged unless you confirm an upgrade.
          </p>
        </div>

        {/* PRO */}
        <div className="rounded-2xl border border-white bg-white p-8 text-black">
          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="mt-2 text-zinc-600">
            For daily creators and long-form content
          </p>

          <div className="mt-6 text-3xl font-semibold">
            $19.99 <span className="text-base font-normal">/ month</span>
          </div>

          <ul className="mt-6 space-y-3 text-sm">
            <li>✔ Up to 400 minutes / month</li>
            <li>✔ Audio up to 20 minutes</li>
            <li>✔ Priority processing</li>
            <li>✔ Advanced insights & tools</li>
          </ul>

          <button
            onClick={() =>
              fetch("/api/stripe/setup-checkout", { method: "POST" }).then(
                async (r) => {
                  const d = await r.json();
                  if (d?.url) window.location.href = d.url;
                }
              )
            }
            className="mt-8 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Upgrade to Pro
          </button>

          <p className="mt-2 text-xs text-zinc-600 text-center">
            Cancel anytime. No hidden fees.
          </p>
        </div>
      </div>

      {/* FOOTNOTE */}
      <p className="mt-14 text-center text-xs text-zinc-500">
        Adding a card doesn’t start a subscription. Payments are securely handled
        by Stripe.
      </p>
    </div>
  );
}
