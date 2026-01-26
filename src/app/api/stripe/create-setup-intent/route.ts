import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const email = session.user.email;

  // 1️⃣ Buscar usuario
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  let customerId = user?.stripeCustomerId;

  // 2️⃣ Crear customer si no existe
  if (!customerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: { userId },
    });

    customerId = customer.id;

    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }

  // 3️⃣ Crear SetupIntent
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    usage: "off_session",
  });

  return NextResponse.json({
    clientSecret: setupIntent.client_secret,
  });
}
