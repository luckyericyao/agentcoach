"use client";

export type LeadType = "waitlist" | "client" | "coach";

export type LeadSubmissionPayload = {
  lead_type: LeadType;
  email: string;
  name?: string;
  company?: string;
  role?: string;
  industry?: string;
  expertise_area?: string;
  linkedin_or_website?: string;
  improvement_goal?: string;
  recipe_interest?: string;
  team_size?: string;
  message?: string;
  source?: string;
};

export type LeadSubmissionResult =
  | { ok: true; notification?: "sent" | "failed" | "not-configured" }
  | { ok: false; reason: "missing-config" | "validation" | "rate-limited" | "request-failed"; message: string };

export async function submitLead(payload: LeadSubmissionPayload): Promise<LeadSubmissionResult> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => ({}))) as {
      code?: string;
      message?: string;
      notification?: "sent" | "failed" | "not-configured";
    };

    if (!response.ok) {
      return {
        ok: false,
        reason:
          data.code === "missing-config" ||
          data.code === "validation" ||
          data.code === "rate-limited"
            ? data.code
            : "request-failed",
        message: data.message ?? "Something went wrong. Please try again.",
      };
    }

    return { ok: true, notification: data.notification };
  } catch {
    return {
      ok: false,
      reason: "request-failed",
      message: "Something went wrong. Please try again.",
    };
  }
}
