
"use client";

export default function PricingClient() {
  async function handleUpgrade() {
    const res = await fetch("/api/stripe/setup-checkout", {
      method: "POST",
    });
    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div className="relative rounded-2xl border border-white bg-white p-8 text-black">
      <div className="absolute -top-3 right-6 rounded-full bg-black px-3 py-1 text-xs text-white">
        Recommended
      </div>

      <h2 className="text-xl font-semibold">Pro</h2>
      <p className="mt-2 text-zinc-600">
        For creators who post consistently
      </p>

      <div className="mt-6 text-3xl font-semibold">
        $15 <span className="text-base font-normal">/ month</span>
      </div>

      <ul className="mt-6 space-y-3 text-sm">
        <li>✔ Unlimited daily analysis</li>
        <li>✔ Videos up to 20 minutes</li>
        <li>✔ Full transcript</li>
        <li>✔ Full insights (no previews)</li>
        <li>✔ Advanced copy actions</li>
      </ul>

      <button
        onClick={handleUpgrade}
        className="mt-8 w-full rounded-lg bg-black px-4 py-3 text-sm text-white hover:bg-zinc-800"
      >
        Upgrade to Pro
      </button>
    </div>
  );
}
