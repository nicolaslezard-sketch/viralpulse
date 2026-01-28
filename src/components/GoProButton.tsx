"use client";

import { useRouter } from "next/navigation";

export default function GoProButton() {
  const router = useRouter();

  function handleClick() {
    router.push("/add-card");
  }

  return (
    <button
      onClick={handleClick}
      className="mt-8 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-900 transition"
    >
      Upgrade to Pro
    </button>
  );
}
