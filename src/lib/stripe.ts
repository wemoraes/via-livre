import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
  typescript: true,
});

export async function createStripeConnectedAccount(
  email: string,
  instructorId: string,
): Promise<string> {
  const account = await stripe.accounts.create({
    type: "express",
    email,
    metadata: { instructorId },
    capabilities: {
      transfers: { requested: true },
    },
    settings: {
      payouts: { schedule: { interval: "manual" } },
    },
  });
  return account.id;
}

export async function createStripeOnboardingLink(
  stripeAccountId: string,
  baseUrl: string,
): Promise<string> {
  const link = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${baseUrl}/instructor/onboarding/stripe/refresh`,
    return_url: `${baseUrl}/instructor/onboarding/stripe/return`,
    type: "account_onboarding",
  });
  return link.url;
}

export async function createPaymentIntent({
  amountCents,
  stripeAccountId,
  lessonId,
  studentId,
  instructorId,
}: {
  amountCents: number;
  stripeAccountId: string;
  lessonId: string;
  studentId: string;
  instructorId: string;
}): Promise<Stripe.PaymentIntent> {
  // Platform fee: 15% of lesson price
  const platformFee = Math.round(amountCents * 0.15);

  return stripe.paymentIntents.create({
    amount: amountCents,
    currency: "brl",
    application_fee_amount: platformFee,
    transfer_data: { destination: stripeAccountId },
    metadata: { lessonId, studentId, instructorId },
    payment_method_types: ["card"],
  });
}

export async function transferToInstructor({
  amountCents,
  stripeAccountId,
  lessonId,
}: {
  amountCents: number;
  stripeAccountId: string;
  lessonId: string;
}): Promise<Stripe.Transfer> {
  return stripe.transfers.create({
    amount: amountCents,
    currency: "brl",
    destination: stripeAccountId,
    metadata: { lessonId },
  });
}

export async function refundPaymentIntent(
  paymentIntentId: string,
): Promise<Stripe.Refund> {
  return stripe.refunds.create({ payment_intent: paymentIntentId });
}
