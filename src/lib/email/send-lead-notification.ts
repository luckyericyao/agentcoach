import "server-only";

import { Resend } from "resend";

export type LeadNotificationPayload = {
  lead_type: "waitlist" | "client" | "coach";
  name?: string | null;
  email: string;
  company?: string | null;
  role?: string | null;
  industry?: string | null;
  expertise_area?: string | null;
  linkedin_or_website?: string | null;
  improvement_goal?: string | null;
  recipe_interest?: string | null;
  team_size?: string | null;
  message?: string | null;
  source?: string | null;
  created_at?: string | null;
};

type SendLeadNotificationResult =
  | { ok: true }
  | { ok: false; reason: "missing-config" | "send-failed" };

const subjects = {
  waitlist: "New AgentCoach waitlist signup",
  client: "New AgentCoach client lead",
  coach: "New AgentCoach coach application",
};

function formatLine(label: string, value?: string | null) {
  return `${label}: ${value?.trim() || "-"}`;
}

export async function sendLeadNotification(
  lead: LeadNotificationPayload,
): Promise<SendLeadNotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_TO_EMAIL;
  const from = process.env.NOTIFICATION_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return { ok: false, reason: "missing-config" };
  }

  const resend = new Resend(apiKey);
  const submittedAt = lead.created_at ?? new Date().toISOString();
  const text = [
    "New AgentCoach lead received.",
    "",
    formatLine("Lead type", lead.lead_type),
    formatLine("Name", lead.name),
    formatLine("Email", lead.email),
    formatLine("Company", lead.company),
    formatLine("Role", lead.role),
    formatLine("Industry", lead.industry),
    formatLine("Expertise area", lead.expertise_area),
    formatLine("LinkedIn or website", lead.linkedin_or_website),
    formatLine("Improvement goal", lead.improvement_goal),
    formatLine("Recipe interest", lead.recipe_interest),
    formatLine("Team size", lead.team_size),
    formatLine("Message / notes", lead.message),
    formatLine("Submitted page/source", lead.source),
    formatLine("Timestamp", submittedAt),
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      subject: subjects[lead.lead_type],
      text,
    });

    if (error) {
      return { ok: false, reason: "send-failed" };
    }

    return { ok: true };
  } catch {
    return { ok: false, reason: "send-failed" };
  }
}
