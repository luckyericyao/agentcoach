import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { sendLeadNotification } from "@/lib/email/send-lead-notification";
import { validateLead, type NotificationStatus, type ValidatedLead } from "@/lib/leads/schema";
import { assertSameOrigin, createRateLimiter, readJsonBody, RequestError } from "@/lib/server/requests";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
const rateLimit = createRateLimiter();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type StoredLead = ValidatedLead & {
  id: string;
  created_at: string;
  notification_status: NotificationStatus;
};

type LeadAdmission =
  | { outcome: "inserted" | "replayed"; lead: StoredLead; retry_after: null }
  | { outcome: "rate-limited"; lead: null; retry_after: number };

function json(body: object, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function limited(retryAfter: number) {
  return json({ ok: false, code: "rate-limited", message: "Too many submissions. Please try again later." },
    429, { "Retry-After": String(retryAfter) });
}

function received(notification: NotificationStatus, trackingFailed = false) {
  const complete = notification === "sent" && !trackingFailed;
  return json({
    ok: true,
    notification,
    warning: complete ? undefined : "Your request is saved. Team email notification is delayed; you do not need to resubmit.",
  }, complete ? 200 : 202);
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const clientKey = (request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") || "unknown").slice(0, 128);
    const limit = rateLimit(clientKey);
    if (!limit.allowed) return limited(limit.retryAfter);

    const parsed = validateLead(await readJsonBody(request));
    if (!parsed.ok) throw new RequestError(400, "validation", parsed.message);

    const suppliedId = request.headers.get("idempotency-key");
    if (suppliedId && !uuidPattern.test(suppliedId)) {
      throw new RequestError(400, "validation", "Please reload the form and try again.");
    }
    const id = suppliedId || randomUUID();
    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      return json({ ok: false, code: "missing-config", message: "We cannot accept requests right now. Please try again later." }, 503);
    }

    const result = await supabase.rpc("accept_lead_v1", { p_id: id, p_payload: parsed.lead }).single();
    if (result.error?.code === "55P03") {
      return json({ ok: false, code: "intake-busy", message: "We cannot accept requests right now. Please try again shortly." },
        503, { "Retry-After": "2" });
    }
    const admission = result.data as LeadAdmission | null;
    if (result.error || !admission) throw new Error("lead-admission-failed");
    if (admission.outcome === "rate-limited") {
      if (!Number.isInteger(admission.retry_after) || admission.retry_after < 1 || admission.retry_after > 3600) {
        throw new Error("invalid-lead-retry-after");
      }
      return limited(admission.retry_after);
    }

    const stored = admission.lead;
    if (!stored || stored.id !== id.toLowerCase() ||
      (admission.outcome !== "inserted" && admission.outcome !== "replayed")) throw new Error("invalid-lead-admission");
    const duplicate = admission.outcome === "replayed";
    if (duplicate && !Object.entries(parsed.lead).every(([key, value]) => stored[key as keyof ValidatedLead] === value)) {
      throw new RequestError(409, "validation", "This request has already been used. Please reload the form for a new request.");
    }

    if (stored.notification_status === "sent") return received("sent");

    // Resend deduplicates for 24 hours. Older ambiguous attempts need owner review.
    if (duplicate && (!Number.isFinite(Date.parse(stored.created_at)) ||
      Date.now() - Date.parse(stored.created_at) >= 23 * 60 * 60 * 1000)) {
      return received(stored.notification_status || "pending");
    }

    let notification: NotificationStatus = "failed";
    let notificationId: string | null = null;
    try {
      const result = await sendLeadNotification(stored);
      notification = result.ok ? "sent" : result.reason === "missing-config" ? "not-configured" : "failed";
      if (result.ok) notificationId = result.id;
    } catch {
      // The lead is already saved; a mail outage must not turn it into a failed submission.
    }

    try {
      const tracked = await supabase.from("leads")
        .update({ notification_status: notification, notification_id: notificationId })
        .eq("id", id).neq("notification_status", "sent");
      if (tracked.error) return received(notification, true);
    } catch {
      return received(notification, true);
    }
    return received(notification);
  } catch (error) {
    if (error instanceof RequestError) {
      return json({ ok: false, code: error.code, message: error.message }, error.status);
    }
    return json({ ok: false, code: "request-failed", message: "We could not confirm your submission. Please try again." }, 503);
  }
}
