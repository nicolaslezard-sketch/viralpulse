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
    fetch("/api/stripe/create-setup-intent", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch(() => {
        setError("Failed to initialize payment.");
      });
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

    const result = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message ?? "Card verification failed.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24 text-white">
      <h1 className="text-2xl font-semibold">Add a payment method</h1>

      <p className="mt-3 text-zinc-400">
        This card will be used to process your analyses.
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

        {error && (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}

        {success && (
          <p className="mt-4 text-sm text-green-400">
            Card added successfully. You can continue 🎉
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-60"
        >
          {loading ? "Saving card…" : "Save card"}
        </button>
      </form>
    </div>
  );
}
