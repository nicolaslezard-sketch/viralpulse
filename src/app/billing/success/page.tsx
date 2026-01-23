import SuccessClient from "./SuccessClient";

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;

  return <SuccessClient sessionId={params.session_id} />;
}
