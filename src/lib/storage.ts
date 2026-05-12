import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "compliance-documents";

export async function getSignedUploadUrl(
  instructorId: string,
  documentType: string,
  ext: string,
): Promise<{ signedUrl: string; path: string }> {
  const path = `${instructorId}/${documentType}/${Date.now()}.${ext}`;
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);
  if (error) throw new Error(`Storage upload URL error: ${error.message}`);
  return { signedUrl: data.signedUrl, path };
}

export async function getSignedReadUrl(
  storagePath: string,
  expiresInSeconds = 900,
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds);
  if (error) throw new Error(`Storage read URL error: ${error.message}`);
  return data.signedUrl;
}
