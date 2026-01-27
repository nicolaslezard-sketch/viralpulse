"use client";

export default function GoProButton() {
  async function handleClick() {
    const res = await fetch("/api/stripe/setup-checkout", {
      method: "POST",
    });

    const data = await res.json();

    if (data?.url) {
      window.location.href = data.url;
    }
  }

  return (
    <button
      onClick={handleClick}
      className="mt-8 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
    >
      Upgrade to Pro
    </button>
  );
}
