import "server-only";

import { Resend } from "resend";
import type { ValidatedLead } from "@/lib/leads/schema";

export type LeadNotificationPayload = ValidatedLead & {
  id: string;
  created_at: string;
};

type SendLeadNotificationResult =
  | { ok: true; id: string }
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
  const text = [
    "New AgentCoach lead received.",
    "",
    formatLine("Lead ID", lead.id),
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
    formatLine("Timestamp", lead.created_at),
  ].join("\n");

  try {
    const options = {
      idempotencyKey: `lead/${lead.id}`,
      signal: AbortSignal.timeout(8_000),
    };
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: subjects[lead.lead_type],
      text,
    }, options);

    if (error || !data?.id) {
      return { ok: false, reason: "send-failed" };
    }

    return { ok: true, id: data.id };
  } catch {
    return { ok: false, reason: "send-failed" };
  }
}
