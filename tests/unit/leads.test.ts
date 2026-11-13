import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { createProviderServer } from "../fixtures/provider-server.mts";
import { POST } from "@/app/api/leads/route";
import { validateLead, type LeadPayload } from "@/lib/leads/schema";
import { readJsonBody, assertSameOrigin, createRateLimiter } from "@/lib/server/requests";
import { submitLead } from "@/lib/lead-submission";

const fixture = createProviderServer();
let providerUrl = "";
let client = 0;
const waitlist: LeadPayload = { lead_type: "waitlist", email: "test@example.test" };

beforeAll(async () => {
  await new Promise<void>((resolve) => fixture.server.listen(0, "127.0.0.1", resolve));
  const address = fixture.server.address();
  if (!address || typeof address === "string") throw new Error("fixture-listen-failed");
  providerUrl = `http://127.0.0.1:${address.port}`;
});
beforeEach(() => {
  fixture.reset();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", providerUrl);
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "fixture-service-role");
  vi.stubEnv("RESEND_API_KEY", "re_fixture_only");
  vi.stubEnv("RESEND_BASE_URL", `${providerUrl}/resend`);
  vi.stubEnv("NOTIFICATION_FROM_EMAIL", "sender@example.test");
  vi.stubEnv("NOTIFICATION_TO_EMAIL", "owner@example.test");
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
afterAll(async () => { fixture.server.closeAllConnections(); await new Promise<void>((resolve) => fixture.server.close(() => resolve())); });

function request(payload: unknown = waitlist, id = randomUUID(), headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost/api/leads", { method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": id, "x-forwarded-for": `fixture-${client++}`, ...headers },
    body: JSON.stringify(payload) });
}

describe("lead validation", () => {
  it("normalizes addresses and derives source instead of trusting a submitted source", () => {
    const result = validateLead({ ...waitlist, email: "  USER@EXAMPLE.TEST ", source: "spoofed", secret: "ignored" });
    expect(result.ok && result.lead.email).toBe("user@example.test");
    expect(result.ok && result.lead.source).toBe("homepage");
    expect(result.ok && result.lead).not.toHaveProperty("secret");
  });
  it.each([null, [], "text", { ...waitlist, lead_type: "admin" }, { ...waitlist, email: "bad" },
    { ...waitlist, email: "a".repeat(260) + "@example.test" }, { ...waitlist, name: 123 },
    { ...waitlist, name: "x".repeat(181) }, { ...waitlist, message: "x".repeat(2001) },
    { ...waitlist, lead_type: "client" }, { ...waitlist, lead_type: "coach" },
    { ...waitlist, linkedin_or_website: "javascript:alert(1)" }, { ...waitlist, name: "a\u0000b" },
  ])("rejects malformed or incomplete payload %j", (payload) => expect(validateLead(payload).ok).toBe(false));
});

describe("request guards", () => {
  it("rejects non-JSON and malformed JSON", async () => {
    await expect(readJsonBody(new Request("http://localhost", { method: "POST", body: "x" }))).rejects.toMatchObject({ status: 415 });
    await expect(readJsonBody(new Request("http://localhost", { method: "POST", headers: { "content-type": "application/json" }, body: "{" }))).rejects.toMatchObject({ status: 400 });
  });
  it("bounds actual streamed UTF-8 bytes even without Content-Length", async () => {
    const body = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('"' + "界".repeat(6000) + '"')); controller.close(); } });
    const req = new Request("http://localhost", { method: "POST", headers: { "content-type": "application/json" }, body, duplex: "half" } as RequestInit);
    await expect(readJsonBody(req)).rejects.toMatchObject({ status: 413 });
  });
  it("times out a stalled body without waiting for its cancellation promise", async () => {
    vi.useFakeTimers();
    try {
      const cancel = vi.fn(() => new Promise<void>(() => {}));
      const body = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('{"email":')); }, cancel });
      const request = new Request("http://localhost", { method: "POST", headers: { "content-type": "application/json" }, body, duplex: "half" } as RequestInit);
      const check = expect(readJsonBody(request, 16_384, 25)).rejects.toMatchObject({ status: 408, code: "request-timeout" });
      await vi.advanceTimersByTimeAsync(25);
      await check;
      expect(cancel).toHaveBeenCalledOnce();
      expect(request.body?.locked).toBe(false);
    } finally { vi.useRealTimers(); }
  });
  it("rejects oversized bodies even if cancellation is stalled", async () => {
    const cancel = vi.fn(() => new Promise<void>(() => {}));
    const body = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(21)); }, cancel });
    const request = new Request("http://localhost", { method: "POST", headers: { "content-type": "application/json" }, body, duplex: "half" } as RequestInit);
    await expect(readJsonBody(request, 20)).rejects.toMatchObject({ status: 413 });
    expect(cancel).toHaveBeenCalledOnce();
    expect(request.body?.locked).toBe(false);
  });
  it("rejects a cross-site submission", () => {
    expect(() => assertSameOrigin(new Request("http://localhost", { headers: { origin: "https://other.example" } }))).toThrow();
  });
  it("uses the browser-facing host when the framework has an internal request URL", () => {
    expect(() => assertSameOrigin(new Request("http://localhost/api/leads", {
      headers: { host: "127.0.0.1:3100", origin: "http://127.0.0.1:3100", "sec-fetch-site": "same-origin" },
    }))).not.toThrow();
  });
  it("expires buckets and bounds the number of stored client keys", () => {
    const limit = createRateLimiter(2, 1000, 1);
    expect(limit("a", 0).allowed).toBe(true);
    expect(limit("a", 1).allowed).toBe(true);
    expect(limit("a", 2)).toEqual({ allowed: false, retryAfter: 1 });
    expect(limit("b", 3).allowed).toBe(false);
    expect(limit("b", 1001).allowed).toBe(true);
  });
});

describe("lead API using local HTTP providers", () => {
  it.each([
    waitlist,
    { ...waitlist, lead_type: "client", name: "Client", industry: "Biotech", improvement_goal: "Meeting prep" },
    { ...waitlist, lead_type: "coach", name: "Coach", expertise_area: "Biotech", recipe_interest: "BD review" },
  ] as LeadPayload[])("saves and notifies for $lead_type", async (payload) => {
    const response = await POST(request(payload));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, notification: "sent" });
    expect(fixture.state.leads.size).toBe(1);
    expect([...fixture.state.leads.values()][0]).toMatchObject({ notification_status: "sent", notification_id: "mail-1" });
    expect([...fixture.state.notifications.values()][0].text).toContain("Timestamp:");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it("rejects invalid input before contacting a provider", async () => {
    expect((await POST(request({ ...waitlist, email: "bad" }))).status).toBe(400);
    expect(fixture.state.leads.size).toBe(0);
  });
  it("rejects cross-site requests and malformed request IDs", async () => {
    expect((await POST(request(waitlist, randomUUID(), { origin: "https://other.example" }))).status).toBe(403);
    expect((await POST(request(waitlist, "bad-id" as ReturnType<typeof randomUUID>))).status).toBe(400);
  });
  it("handles missing configuration and database failure without internal details", async () => {
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    const missing = await POST(request());
    expect(missing.status).toBe(503);
    expect(await missing.text()).not.toContain("SUPABASE");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "fixture-service-role");
    fixture.state.databaseFailure = true;
    const failed = await POST(request());
    expect(failed.status).toBe(503);
    expect(await failed.text()).not.toContain("fixture database outage");
    expect(fixture.state.notifications.size).toBe(0);
  });
  it("fails closed without a direct insert when the database migration is missing", async () => {
    fixture.state.intakeFunctionMissing = true;
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toMatch(/PGRST202|accept_lead_v1|fixture RPC/);
    expect(fixture.state.leads.size).toBe(0);
    expect(fixture.state.mailAttempts).toHaveLength(0);
  });
  it("returns a retryable 503 without saving or notifying on database lock timeout", async () => {
    const id = randomUUID();
    fixture.state.intakeLockTimeout = true;
    const blocked = await POST(request(waitlist, id));
    expect(blocked.status).toBe(503);
    expect(blocked.headers.get("retry-after")).toBe("2");
    expect(await blocked.json()).toEqual({ ok: false, code: "intake-busy", message: "We cannot accept requests right now. Please try again shortly." });
    expect(fixture.state.leads.size).toBe(0);
    expect(fixture.state.mailAttempts).toHaveLength(0);
    fixture.state.intakeLockTimeout = false;
    expect((await POST(request(waitlist, id))).status).toBe(200);
    expect(fixture.state.leads.size).toBe(1);
  });
  it("uses the database Retry-After without saving or notifying a rejected lead", async () => {
    fixture.state.intakeRetryAfter = 175;
    const response = await POST(request());
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("175");
    expect(await response.json()).toMatchObject({ ok: false, code: "rate-limited" });
    expect(fixture.state.leads.size).toBe(0);
    expect(fixture.state.mailAttempts).toHaveLength(0);
  });
  it("still acknowledges saved replays while new database admissions are limited", async () => {
    const id = randomUUID();
    expect((await POST(request(waitlist, id))).status).toBe(200);
    fixture.state.intakeRetryAfter = 60;
    expect((await POST(request(waitlist, id))).status).toBe(200);
    expect((await POST(request({ ...waitlist, email: "changed@example.test" }, id))).status).toBe(409);
    expect((await POST(request())).status).toBe(429);
    expect(fixture.state.leads.size).toBe(1);
    expect(fixture.state.mailAttempts).toEqual([`lead/${id}`]);
  });
  it.each(["mailFailure", "trackingFailure"] as const)("preserves saved success during %s", async (failure) => {
    fixture.state[failure] = true;
    const response = await POST(request());
    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({ ok: true, warning: expect.stringContaining("request is saved") });
    expect(fixture.state.leads.size).toBe(1);
  });
  it("reports missing email configuration as partial success", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const response = await POST(request());
    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({ ok: true, notification: "not-configured" });
  });
  it("deduplicates the saved lead and notification on retry", async () => {
    const id = randomUUID();
    await POST(request(waitlist, id));
    expect((await POST(request(waitlist, id))).status).toBe(200);
    expect(fixture.state.leads.size).toBe(1);
    expect(fixture.state.mailAttempts).toEqual([`lead/${id}`]);
  });
  it("retries a failed notification using the same provider key", async () => {
    const id = randomUUID();
    fixture.state.mailFailure = true;
    await POST(request(waitlist, id));
    fixture.state.mailFailure = false;
    const response = await POST(request(waitlist, id));
    expect(response.status).toBe(200);
    expect(fixture.state.leads.size).toBe(1);
    expect(fixture.state.mailAttempts).toEqual([`lead/${id}`, `lead/${id}`]);
  });
  it("rejects request ID reuse with changed contact information", async () => {
    const id = randomUUID();
    await POST(request(waitlist, id));
    const response = await POST(request({ ...waitlist, email: "different@example.test" }, id));
    expect(response.status).toBe(409);
    expect(fixture.state.leads.size).toBe(1);
    expect(await response.text()).not.toContain(waitlist.email);
  });
  it("does not resend an ambiguous notification after the provider deduplication window", async () => {
    const id = randomUUID();
    fixture.state.mailFailure = true;
    await POST(request(waitlist, id));
    fixture.state.leads.get(id)!.created_at = "2020-01-01T00:00:00Z";
    fixture.state.mailFailure = false;
    expect((await POST(request(waitlist, id))).status).toBe(202);
    expect(fixture.state.mailAttempts).toHaveLength(1);
  });
  it("returns Retry-After when one client exceeds the limit", async () => {
    const ip = `limited-${client++}`;
    for (let i = 0; i < 5; i++) await POST(request(waitlist, randomUUID(), { "x-forwarded-for": ip }));
    const response = await POST(request(waitlist, randomUUID(), { "x-forwarded-for": ip }));
    expect(response.status).toBe(429);
    expect(Number(response.headers.get("retry-after"))).toBeGreaterThan(0);
  });
});

describe("browser submission response handling", () => {
  it("does not accept an HTML or malformed successful response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>error</html>", { status: 200 })));
    expect((await submitLead(waitlist, randomUUID())).ok).toBe(false);
  });
  it("preserves partial success warnings and the request ID", async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ ok: true, notification: "failed", warning: "Saved; mail delayed." }, { status: 202 }));
    vi.stubGlobal("fetch", fetcher);
    const id = randomUUID();
    expect(await submitLead(waitlist, id)).toMatchObject({ ok: true, warning: "Saved; mail delayed." });
    expect(fetcher.mock.calls[0][1].headers["Idempotency-Key"]).toBe(id);
  });
});
