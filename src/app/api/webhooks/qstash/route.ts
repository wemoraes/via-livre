import { NextRequest, NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import type { NotificationJob } from "@/lib/qstash";
import { resend } from "@/lib/email";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("upstash-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const isValid = await receiver.verify({ signature: sig, body }).catch(() => false);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const job: NotificationJob = JSON.parse(body);

  try {
    await processJob(job);
  } catch (e) {
    console.error("[qstash] job processing error", job.type, e);
    return NextResponse.json({ error: "Processing error" }, { status: 500 });
  }

  return NextResponse.json({ processed: true });
}

async function processJob(job: NotificationJob) {
  switch (job.type) {
    case "lesson.booked":
    case "lesson.confirmed":
    case "lesson.cancelled":
    case "lesson.completed":
    case "document.submitted":
    case "document.reviewed":
    case "document.expiring":
      // Email sending — templates built in Epic 9
      console.log(`[qstash] job received: ${job.type}`, job.payload);
      break;

    case "aprovometro.recalculate":
      // Handled in Epic 7 when Aprovômetro lib is built
      console.log("[qstash] aprovometro recalculate", job.payload);
      break;
  }
}

// Keep resend import available for Epic 9 template wiring
void resend;
