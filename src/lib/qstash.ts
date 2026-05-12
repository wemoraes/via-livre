import { Client } from "@upstash/qstash";

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export type NotificationJobType =
  | "lesson.booked"
  | "lesson.confirmed"
  | "lesson.cancelled"
  | "lesson.completed"
  | "document.submitted"
  | "document.reviewed"
  | "document.expiring"
  | "aprovometro.recalculate";

export interface NotificationJob {
  type: NotificationJobType;
  payload: Record<string, unknown>;
  idempotencyKey: string;
}

export async function enqueueNotificationJob(job: NotificationJob): Promise<void> {
  const baseUrl = process.env.AUTH_URL ?? "http://localhost:3000";
  await qstash.publishJSON({
    url: `${baseUrl}/api/webhooks/qstash`,
    body: job,
    deduplicationId: job.idempotencyKey,
    retries: 3,
  });
}
