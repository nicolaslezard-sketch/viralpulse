import { stripe } from "@/lib/stripe";

/**
 * TODO: reemplazar con tu DB real.
 * Por ahora: pasás stripeCustomerId desde tu "user" real.
 */
export async function getOrCreateCustomer(params: {
  email: string;
  name?: string | null;
  existingCustomerId?: string | null;
}) {
  if (params.existingCustomerId) return params.existingCustomerId;

  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name ?? undefined,
  });

  return customer.id;
}
