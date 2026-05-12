import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { EscrowStatus, LessonStatus } from "@prisma/client";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const { lessonId } = pi.metadata;
        if (lessonId) {
          await prisma.lesson.update({
            where: { id: lessonId },
            data: {
              escrowStatus: EscrowStatus.HELD,
              status: LessonStatus.CONFIRMED,
              stripePaymentIntentId: pi.id,
            },
          });
        }
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const { lessonId } = pi.metadata;
        if (lessonId) {
          await prisma.lesson.update({
            where: { id: lessonId },
            data: { status: LessonStatus.CANCELLED, cancelReason: "Pagamento falhou" },
          });
        }
        break;
      }
    }
  } catch (e) {
    console.error("[stripe-webhook] processing error", event.type, e);
    return NextResponse.json({ error: "Processing error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
