"use client";

export default function PricingPage() {
  async function upgrade(plan: "plus" | "pro") {
    const res = await fetch("/api/lemon/checkout", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-24 text-white">
      {/* HERO */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-semibold">
          Simple pricing for serious creators
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-zinc-400">
          Start free. Upgrade only if you need higher limits.
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
            <li>✔ Up to 5 minutes per audio</li>
            <li>✔ Preview insights</li>
          </ul>

          <a
            href="/"
            className="mt-8 block w-full rounded-xl border border-white/15 px-4 py-3 text-center text-sm hover:bg-white/5"
          >
            Start free
          </a>

          <p className="mt-2 text-xs text-zinc-500 text-center">
            No credit card required.
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
            <li>✔ 120 minutes / month</li>
            <li>✔ Audio up to 10 minutes</li>
            <li>✔ Full report & transcript</li>
            <li>✔ Faster processing</li>
          </ul>

          <button
            onClick={() => upgrade("plus")}
            className="mt-8 block w-full rounded-xl bg-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white hover:brightness-110"
          >
            Upgrade to Plus
          </button>

          <p className="mt-2 text-xs text-zinc-300 text-center">
            Secure checkout powered by Lemon.
          </p>
        </div>

        {/* PRO */}
        <div className="rounded-2xl border border-white bg-white p-8 text-black">
          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="mt-2 text-zinc-600">
            For daily creators & long-form content
          </p>

          <div className="mt-6 text-3xl font-semibold">
            $19.99 <span className="text-base font-normal">/ month</span>
          </div>

          <ul className="mt-6 space-y-3 text-sm">
            <li>✔ 400 minutes / month</li>
            <li>✔ Audio up to 20 minutes</li>
            <li>✔ Priority processing</li>
            <li>✔ Advanced insights</li>
          </ul>

          <button
            onClick={() => upgrade("pro")}
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
        Payments are securely handled by Lemon. You’re only charged if you upgrade.
      </p>
    </div>
  );
}
