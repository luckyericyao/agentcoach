export type LeadType = "waitlist" | "client" | "coach";

export const leadFieldLimits = {
  email: 254,
  name: 180,
  company: 180,
  role: 180,
  industry: 180,
  expertise_area: 240,
  linkedin_or_website: 400,
  improvement_goal: 1500,
  recipe_interest: 1500,
  team_size: 120,
  message: 2000,
} as const;

export type LeadField = keyof typeof leadFieldLimits;
export type LeadPayload = { lead_type: LeadType; email: string; source?: string } &
  Partial<Record<Exclude<LeadField, "email">, string>>;
export type ValidatedLead = { lead_type: LeadType; email: string; source: string } &
  Record<Exclude<LeadField, "email">, string | null>;

export type NotificationStatus = "pending" | "sent" | "failed" | "not-configured";

const sources: Record<LeadType, string> = {
  waitlist: "homepage",
  client: "become-a-client",
  coach: "become-a-coach",
};

const fieldLabels: Record<LeadField, string> = {
  email: "Email",
  name: "Name",
  company: "Company",
  role: "Role",
  industry: "Industry",
  expertise_area: "Area of expertise",
  linkedin_or_website: "LinkedIn or website",
  improvement_goal: "What you want to improve",
  recipe_interest: "Agent Recipe idea",
  team_size: "Team size",
  message: "Notes",
};

export function isValidEmail(value: string) {
  return value.length <= leadFieldLimits.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateLead(body: unknown):
  | { ok: true; lead: ValidatedLead }
  | { ok: false; message: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, message: "Please submit a valid lead form." };
  }

  const payload = body as Record<string, unknown>;
  const leadType = payload.lead_type;
  if (leadType !== "waitlist" && leadType !== "client" && leadType !== "coach") {
    return { ok: false, message: "Please choose a valid lead type." };
  }

  const values = {} as Record<LeadField, string | null>;
  for (const [field, limit] of Object.entries(leadFieldLimits)) {
    const key = field as LeadField;
    const value = key === "message" ? payload.message ?? payload.notes : payload[key];
    if (value !== undefined && value !== null && typeof value !== "string") {
      return { ok: false, message: `${fieldLabels[key]} must be text.` };
    }
    const text = typeof value === "string" ? value.trim() : "";
    if (text.length > limit || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)) {
      return { ok: false, message: `${fieldLabels[key]} is too long or contains invalid characters.` };
    }
    values[key] = text || null;
  }

  if (!values.email || !isValidEmail(values.email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  const required: LeadField[] = leadType === "client"
    ? ["name", "industry", "improvement_goal"]
    : leadType === "coach" ? ["name", "expertise_area", "recipe_interest"] : [];

  for (const field of required) {
    if (!values[field]) {
      return { ok: false, message: `${fieldLabels[field]} is required.` };
    }
  }

  if (values.linkedin_or_website) {
    try {
      const url = new URL(values.linkedin_or_website);
      if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) {
        throw new Error("invalid-url");
      }
    } catch {
      return { ok: false, message: "Please enter a website URL starting with https:// or http://." };
    }
  }

  return {
    ok: true,
    lead: { ...values, lead_type: leadType, email: values.email.toLowerCase(), source: sources[leadType] },
  };
}
