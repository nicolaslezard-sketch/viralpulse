type PublishAnalysisJobInput = {
  reportId: string;
  userId: string;
  mediaKey: string;
  mimeType: string;
  sourceType: "audio" | "video";
};

export async function publishAnalysisJob(input: PublishAnalysisJobInput) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const queueId = process.env.CLOUDFLARE_QUEUE_ID;
  const token = process.env.CLOUDFLARE_QUEUE_PRODUCER_TOKEN;

  if (!accountId) {
    throw new Error("Missing CLOUDFLARE_ACCOUNT_ID");
  }

  if (!queueId) {
    throw new Error("Missing CLOUDFLARE_QUEUE_ID");
  }

  if (!token) {
    throw new Error("Missing CLOUDFLARE_QUEUE_PRODUCER_TOKEN");
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/queues/${queueId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: input,
      }),
    },
  );

  const data = (await res.json().catch(() => null)) as {
    success?: boolean;
    errors?: unknown;
  } | null;

  if (!res.ok || !data?.success) {
    throw new Error(`Queue publish failed: ${JSON.stringify(data)}`);
  }
}
