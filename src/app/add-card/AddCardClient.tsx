"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function AddCardClient() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/stripe/create-setup-intent", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch(() => setError("Failed to initialize payment."));
  }, []);

  if (!clientSecret) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center text-white">
        <p className="text-zinc-400">Preparing secure payment…</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {/* TRUST BANNER */}
      <div className="mx-auto max-w-md px-6 pt-20 text-white">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
          <p className="text-sm font-medium text-white">
            You won’t be charged unless you upgrade to Pro.
          </p>
          <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
            Adding a card doesn’t start a subscription. We only charge you if you
            explicitly confirm an upgrade.
          </p>
        </div>
      </div>

      <AddCardForm
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
        success={success}
        setSuccess={setSuccess}
      />
    </Elements>
  );
}

/* =========================
   INNER FORM
========================= */

function AddCardForm({
  loading,
  setLoading,
  error,
  setError,
  success,
  setSuccess,
}: any) {
  const stripe = useStripe();
  const elements = useElements();

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!stripe || !elements) return;

  setLoading(true);
  setError(null);

  const { error } = await stripe.confirmSetup({
    elements,
    redirect: "if_required",
  });

  if (error) {
    setError(error.message ?? "Card verification failed.");
    setLoading(false);
    return;
  }

  // ✅ SetupIntent completado correctamente
  setSuccess(true);
  setLoading(false);

  // fallback seguro
  const returnTo =
    sessionStorage.getItem("vp_return_to") || "/dashboard";

  sessionStorage.removeItem("vp_return_to");
  sessionStorage.setItem("vp_post_card", "1");

  // UX suave
  setTimeout(() => {
    window.location.assign(returnTo);
  }, 700);
}

  return (
    <div className="mx-auto max-w-md px-6 py-24 text-white">
      <h1 className="text-2xl font-semibold">Add a payment method</h1>

      <p className="mt-3 text-zinc-400">
        Add a card to enable Plus or Pro analyses. You won’t be charged unless you
        upgrade.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur"
      >
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#fff",
                "::placeholder": { color: "#a1a1aa" },
              },
            },
          }}
        />

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {success && (
          <p className="mt-4 text-sm text-green-400">
            Card added successfully. Redirecting you back… 🎉
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-60"
        >
          {loading ? "Saving card…" : "Save card"}
        </button>

        <p className="mt-2 text-xs text-zinc-400 text-center">
          No charge today. Your card is securely stored by Stripe.
        </p>
      </form>

      <p className="mt-6 text-[11px] leading-relaxed text-zinc-500 text-center">
        We can’t see or store your full card number. You’re not starting a
        subscription and can upgrade anytime.
      </p>
    </div>
  );
}
