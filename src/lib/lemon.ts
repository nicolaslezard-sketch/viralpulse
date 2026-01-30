const LEMON_API_KEY = process.env.LEMON_API_KEY!;
const LEMON_STORE_ID = process.env.LEMON_STORE_ID!;
const LEMON_API_URL = "https://api.lemonsqueezy.com/v1";

export async function createLemonCheckout({
  variantId,
  userId,
  email,
}: {
  variantId: string;
  userId: string;
  email?: string;
}) {
  const res = await fetch(`${LEMON_API_URL}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LEMON_API_KEY}`,
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email,
            custom: {
              userId,
            },
          },
        },
        relationships: {
          store: {
            data: { type: "stores", id: LEMON_STORE_ID },
          },
          variant: {
            data: { type: "variants", id: variantId },
          },
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Lemon checkout failed: ${err}`);
  }

  const json = await res.json();
  return json.data.attributes.url as string;
}
