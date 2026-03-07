export async function ackMessage(leaseId: string) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const queueId = process.env.CLOUDFLARE_QUEUE_ID;
  const token = process.env.CLOUDFLARE_QUEUE_CONSUMER_TOKEN;

  if (!accountId) throw new Error("Missing CLOUDFLARE_ACCOUNT_ID");
  if (!queueId) throw new Error("Missing CLOUDFLARE_QUEUE_ID");
  if (!token) throw new Error("Missing CLOUDFLARE_QUEUE_CONSUMER_TOKEN");

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/queues/${queueId}/messages/ack`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        acks: [{ lease_id: leaseId }],
      }),
    },
  );

  const data = (await res.json().catch(() => null)) as {
    success?: boolean;
  } | null;

  if (!res.ok || !data?.success) {
    throw new Error(`Ack failed: ${JSON.stringify(data)}`);
  }
}
