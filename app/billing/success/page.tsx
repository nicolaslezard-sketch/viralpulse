export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center text-white">
      <h1 className="text-3xl font-semibold">✅ Payment successful</h1>

      <p className="mt-4 text-zinc-400">
        Your Pro subscription is now active.
      </p>

      {params.session_id && (
        <p className="mt-6 text-xs text-zinc-500 break-all">
          Session ID: {params.session_id}
        </p>
      )}

      <a
        href="/"
        className="mt-10 inline-block rounded-lg bg-white px-6 py-3 text-sm text-black"
      >
        Go to dashboard
      </a>
    </div>
  );
}
