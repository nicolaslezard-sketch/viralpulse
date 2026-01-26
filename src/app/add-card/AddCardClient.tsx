"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AddCardClient() {
  const searchParams = useSearchParams();
  const setupIntent = searchParams.get("setup_intent");

  useEffect(() => {
    if (setupIntent) {
      // lógica post-Stripe (si la tenés)
    }
  }, [setupIntent]);

  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center text-white">
      <h1 className="text-2xl font-semibold">Add a payment method</h1>

      <p className="mt-3 text-zinc-400">
        This card will be used to process your analyses.
      </p>

      {/* Stripe Elements / Card Form */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur">
        {/* tu form existente */}
      </div>
    </div>
  );
}
