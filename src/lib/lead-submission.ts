import type { LeadPayload, NotificationStatus } from "./leads/schema";

export type LeadSubmissionResult =
  | { ok: true; notification: NotificationStatus; warning?: string }
  | { ok: false; reason: string; message: string };

export async function submitLead(payload: LeadPayload, requestId: string): Promise<LeadSubmissionResult> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": requestId },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(25_000),
    });
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("invalid-response");
    const result = data as Record<string, unknown>;
    if (response.ok && result.ok === true &&
      ["pending", "sent", "failed", "not-configured"].includes(String(result.notification))) {
      return {
        ok: true,
        notification: result.notification as NotificationStatus,
        warning: typeof result.warning === "string" ? result.warning : undefined,
      };
    }
    return {
      ok: false,
      reason: typeof result.code === "string" ? result.code : "request-failed",
      message: typeof result.message === "string" ? result.message : "We could not confirm your submission. Please try again.",
    };
  } catch {
    return { ok: false, reason: "request-failed", message: "We could not confirm your submission. Please retry; your request will not be duplicated." };
  }
}
