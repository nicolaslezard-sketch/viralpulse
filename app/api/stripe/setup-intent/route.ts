import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getOrCreateCustomer } from "@/lib/billing";

/**
 * En producción, sacás email/name/customerId desde tu sesión (NextAuth/Auth.js)
 * Por ahora lo dejo como ejemplo: reemplazá getUserFromSession().
 */
async function getUserFromSession() {
  // TODO: integrar Auth
  return {
    email: "test@example.com",
    name: "Test User",
    stripeCustomerId: null as string | null,
  };
}

export async function POST() {
  const user = await getUserFromSession();
  const customerId = await getOrCreateCustomer({
    email: user.email,
    name: user.name,
    existingCustomerId: user.stripeCustomerId,
  });

  // SetupIntent para guardar tarjeta sin cobrar :contentReference[oaicite:6]{index=6}
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ["card"],
    usage: "off_session",
  });

  // TODO: persistir customerId en tu DB (user.stripeCustomerId = customerId)

  return NextResponse.json({
    customerId,
    clientSecret: setupIntent.client_secret,
  });
}
