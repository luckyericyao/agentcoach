type LeadPayload = Record<string, string>;

type LeadInsertResult =
  | { ok: true }
  | { ok: false; reason: "missing-config" | "request-failed" };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export async function insertLead(table: string, payload: LeadPayload): Promise<LeadInsertResult> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { ok: false, reason: "missing-config" };
  }

  try {
    const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { ok: false, reason: "request-failed" };
    }

    return { ok: true };
  } catch {
    return { ok: false, reason: "request-failed" };
  }
}
