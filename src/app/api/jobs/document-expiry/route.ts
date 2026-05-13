import { NextRequest, NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { processDocumentExpiryAlerts } from "@/actions/instructor";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

function isAuthorized(req: NextRequest, body: string): Promise<boolean> {
  const upstashSig = req.headers.get("upstash-signature");
  if (upstashSig) {
    return receiver.verify({ signature: upstashSig, body }).catch(() => false);
  }

  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (authHeader && cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return Promise.resolve(true);
  }

  // Legacy x-cron-secret header
  const legacySecret = req.headers.get("x-cron-secret");
  if (legacySecret && cronSecret && legacySecret === cronSecret) {
    return Promise.resolve(true);
  }

  return Promise.resolve(false);
}

export async function GET(req: NextRequest) {
  // Vercel Cron uses GET
  return handleJob(req, "");
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  return handleJob(req, body);
}

async function handleJob(req: NextRequest, body: string) {
  const ok = await isAuthorized(req, body);
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await processDocumentExpiryAlerts();
    return NextResponse.json({ processed: true });
  } catch (e) {
    console.error("[document-expiry] job error", e);
    return NextResponse.json({ error: "Processing error" }, { status: 500 });
  }
}
