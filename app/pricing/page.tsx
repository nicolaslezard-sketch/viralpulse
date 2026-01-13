export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 text-white">
      {/* HERO */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-semibold">
          Simple pricing for serious creators
        </h1>
        <p className="mt-4 text-zinc-400">
          Start free. Upgrade only if you want to scale your content faster.
        </p>
      </div>

      {/* PLANS */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* FREE */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
          <h2 className="text-xl font-semibold">Free</h2>
          <p className="mt-2 text-zinc-400">
            For testing the waters
          </p>

          <div className="mt-6 text-3xl font-semibold">$0</div>

          <ul className="mt-6 space-y-3 text-sm text-zinc-300">
            <li>✔ 1 analysis per day</li>
            <li>✔ Up to 3-minute videos</li>
            <li>✔ All 18 insights (preview)</li>
            <li>✔ Limited copy actions</li>
          </ul>

          <button className="mt-8 w-full rounded-lg border border-zinc-700 px-4 py-3 text-sm hover:bg-zinc-900">
            Continue for free
          </button>
        </div>

        {/* PRO */}
        <div className="relative rounded-2xl border border-white bg-white p-8 text-black">
          <div className="absolute -top-3 right-6 rounded-full bg-black px-3 py-1 text-xs text-white">
            Recommended
          </div>

          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="mt-2 text-zinc-600">
            For creators who post consistently
          </p>

          <div className="mt-6 text-3xl font-semibold">
            $— <span className="text-base font-normal">/ month</span>
          </div>

          <ul className="mt-6 space-y-3 text-sm">
            <li>✔ Unlimited daily analysis</li>
            <li>✔ Videos up to 20 minutes</li>
            <li>✔ Full transcript</li>
            <li>✔ Full insights (no previews)</li>
            <li>✔ Advanced copy actions</li>
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
            className="mt-8 w-full rounded-lg bg-black px-4 py-3 text-sm text-white hover:bg-zinc-800"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* FOOTNOTE */}
      <p className="mt-12 text-center text-xs text-zinc-500">
        Cancel anytime. No hidden fees. Payments powered by Stripe.
      </p>
    </div>
  );
}
