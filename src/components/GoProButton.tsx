"use client";

export default function GoProButton() {
  async function handleGoPro() {
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
  onClick={handleGoPro}
  className="
    cursor-pointer
    inline-flex w-full items-center justify-center
    rounded-2xl bg-white px-5 py-3
    text-sm font-semibold text-black
    transition hover:bg-zinc-200
  "
>
  Go Pro
</button>

  );
}
