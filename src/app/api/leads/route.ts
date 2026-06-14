import { NextRequest, NextResponse } from "next/server";
import { sendLeadNotification } from "@/lib/email/send-lead-notification";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type LeadType = "waitlist" | "client" | "coach";

type LeadRecord = {
  lead_type: LeadType;
  email: string;
  name?: string | null;
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
};

const allowedLeadTypes = new Set<LeadType>(["waitlist", "client", "coach"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimitWindowMs = 60_000;
const rateLimitMaxRequests = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(request: NextRequest) {
  const key = getClientKey(request);
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return false;
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  return current.count > rateLimitMaxRequests;
}

function normalizeText(value: unknown, maxLength = 1_000) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function validationError(message: string) {
  return NextResponse.json({ ok: false, code: "validation", message }, { status: 400 });
}

function parseLeadPayload(body: unknown): LeadRecord | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Please submit a valid lead form." };
  }

  const payload = body as Record<string, unknown>;
  const leadType = normalizeText(payload.lead_type, 32) as LeadType | null;
  const email = normalizeText(payload.email, 320)?.toLowerCase();

  if (!leadType || !allowedLeadTypes.has(leadType)) {
    return { error: "Please choose a valid lead type." };
  }

  if (!email || !emailPattern.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  return {
    lead_type: leadType,
    email,
    name: normalizeText(payload.name, 180),
    company: normalizeText(payload.company, 180),
    role: normalizeText(payload.role, 180),
    industry: normalizeText(payload.industry, 180),
    expertise_area: normalizeText(payload.expertise_area, 240),
    linkedin_or_website: normalizeText(payload.linkedin_or_website, 400),
    improvement_goal: normalizeText(payload.improvement_goal, 1_500),
    recipe_interest: normalizeText(payload.recipe_interest, 1_500),
    team_size: normalizeText(payload.team_size, 120),
    message: normalizeText(payload.message ?? payload.notes, 2_000),
    source: normalizeText(payload.source, 180),
  };
}

export async function POST(request: NextRequest) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      {
        ok: false,
        code: "rate-limited",
        message: "Too many submissions. Please wait a minute and try again.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return validationError("Please submit a valid lead form.");
  }

  const lead = parseLeadPayload(body);
  if ("error" in lead) {
    return validationError(lead.error);
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        code: "missing-config",
        message:
          "Lead capture is not configured yet. Please set the Supabase server environment variables.",
      },
      { status: 503 },
    );
  }

  const { data, error } = await supabase
    .from("leads")
    .insert(lead)
    .select("id, created_at")
    .single();

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        code: "request-failed",
        message: "We could not save your submission. Please try again.",
      },
      { status: 500 },
    );
  }

  const notification = await sendLeadNotification({
    ...lead,
    created_at: typeof data?.created_at === "string" ? data.created_at : undefined,
  });

  if (!notification.ok) {
    return NextResponse.json(
      {
        ok: true,
        notification: notification.reason === "missing-config" ? "not-configured" : "failed",
        message:
          "We received your submission, but the notification email could not be sent.",
      },
      { status: 202 },
    );
  }

  return NextResponse.json({
    ok: true,
    notification: "sent",
    message: "Lead received.",
  });
}
