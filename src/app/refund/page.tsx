export default function RefundPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-white">
      <h1 className="text-3xl font-semibold">Refund Policy</h1>
      <p className="mt-2 text-sm text-zinc-400">Last updated: March 8, 2026</p>

      <section className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-300">
        <p>
          This Refund Policy explains when refunds may be issued for ViralPulse
          subscriptions.
        </p>

        <h2 className="text-lg font-semibold text-white">
          1. Subscription Refunds
        </h2>
        <p>
          If you believe you were charged in error or experienced a serious
          technical issue, you may request a refund within 7 days of the charge.
        </p>

        <h2 className="text-lg font-semibold text-white">
          2. Usage-Based Limitations
        </h2>
        <p>
          Refunds may be denied when substantial usage has already occurred,
          including completed analyses, generated transcripts, reports or AI
          rewrites.
        </p>

        <h2 className="text-lg font-semibold text-white">
          3. No Guaranteed Results
        </h2>
        <p>
          ViralPulse provides AI-generated analysis and recommendations. Results
          may vary and are not guaranteed. Dissatisfaction with output quality
          alone does not automatically qualify for a refund.
        </p>

        <h2 className="text-lg font-semibold text-white">
          4. Abuse Prevention
        </h2>
        <p>
          We reserve the right to deny refund requests in cases of abuse,
          repeated refund claims or violations of our Terms.
        </p>

        <h2 className="text-lg font-semibold text-white">5. Contact</h2>
        <p>
          To request a refund, contact us at support@viralpulse.studio with your
          account email and billing details.
        </p>
      </section>
    </main>
  );
}
