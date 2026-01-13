"use client";

export default function UpgradeButton({
  label = "Upgrade to Pro",
}: {
  label?: string;
}) {
  async function goPro() {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
    });

    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
    }
  }

  return (
    <button
      onClick={goPro}
      className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800 transition"
    >
      {label}
    </button>
  );
}
