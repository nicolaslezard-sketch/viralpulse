export type QueueMessage<T = unknown> = {
  lease_id: string;
  id: string;
  body: T;
};

type PullMessagesResponse<T = unknown> = {
  success: boolean;
  result?: {
    messages: QueueMessage<T>[];
  };
};

export async function pullMessages<T = unknown>() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const queueId = process.env.CLOUDFLARE_QUEUE_ID;
  const token = process.env.CLOUDFLARE_QUEUE_CONSUMER_TOKEN;

  if (!accountId) throw new Error("Missing CLOUDFLARE_ACCOUNT_ID");
  if (!queueId) throw new Error("Missing CLOUDFLARE_QUEUE_ID");
  if (!token) throw new Error("Missing CLOUDFLARE_QUEUE_CONSUMER_TOKEN");

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/queues/${queueId}/messages/pull`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        visibility_timeout_ms: 300000,
        batch_size: 1,
      }),
    },
  );

  const data = (await res.json()) as PullMessagesResponse<T>;

  if (!res.ok || !data.success) {
    throw new Error(`Pull failed: ${JSON.stringify(data)}`);
  }

  return data.result?.messages ?? [];
}
