import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({ client: vi.fn(), exchange: vi.fn(), verify: vi.fn(), getUser: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: mocks.client }));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => { throw new Error(`redirect:${path}`); },
  useRouter: () => ({}),
}));

import { GET, HEAD, POST } from "@/app/auth/callback/route";
import AccountPage from "@/app/account/page";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { emailConfirmationCookie } from "@/lib/supabase/email-confirmation";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.client.mockResolvedValue({ auth: { exchangeCodeForSession: mocks.exchange, verifyOtp: mocks.verify, getUser: mocks.getUser } });
  mocks.exchange.mockResolvedValue({ error: null });
  mocks.verify.mockResolvedValue({ error: null });
  mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
});
afterEach(() => vi.unstubAllEnvs());

async function stageEmailLink() {
  const response = await GET(new NextRequest("http://localhost/auth/callback?token_hash=local-hash&type=email"));
  const url = new URL(response.headers.get("location")!, "http://localhost");
  return { response, action: `/auth/callback${url.search}`, cookie: response.headers.get("set-cookie")!.split(";")[0] };
}

function confirmationPost(action: string, cookie: string, headers: Record<string, string> = {}) {
  return POST(new NextRequest(`http://localhost${action}`, { method: "POST", headers: { cookie, ...headers } }));
}

describe("auth callback", () => {
  it.each(["", "?error=private-provider-error", "?token_hash=hash&type=recovery", "?code=code&token_hash=hash&type=email",
    "?code=one&code=two", "?token_hash=hash&type=email&type=email", "?token_hash=hash&token_hash=other&type=email",
    "?token_hash=hash%3Aother&type=email"])(
    "rejects invalid callback %s", async (query) => {
      const response = await GET(new NextRequest(`http://localhost/auth/callback${query}`));
      expect(response.headers.get("location")).toBe("/login?error=invalid-link");
      expect(mocks.client).not.toHaveBeenCalled();
    });
  it("exchanges a PKCE code and always returns to the account on this site", async () => {
    const response = await GET(new NextRequest("http://localhost/auth/callback?code=local-code&next=https://other.example"));
    expect(mocks.exchange).toHaveBeenCalledWith("local-code");
    expect(response.headers.get("location")).toBe("/account");
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
  });
  it("stages token-hash links without calling auth or echoing credentials in the redirect", async () => {
    const { response } = await stageEmailLink();
    expect(response.headers.get("location")).toMatch(/^\/login\?confirm=[0-9a-f-]+$/);
    expect(response.headers.get("location")).not.toContain("local-hash");
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.cookies.get(emailConfirmationCookie)).toMatchObject({ path: "/auth/callback", maxAge: 300,
      sameSite: "lax", httpOnly: true, secure: false });
    const scanned = HEAD();
    expect(scanned.status).toBe(204);
    expect(scanned.headers.has("set-cookie")).toBe(false);
    expect(mocks.client).not.toHaveBeenCalled();
  });
  it("marks the pending cookie Secure behind HTTPS ingress", async () => {
    const response = await GET(new NextRequest("http://localhost/auth/callback?token_hash=local-hash&type=email", {
      headers: { host: "agentcoach.example.test", "x-forwarded-proto": "https" },
    }));
    expect(response.cookies.get(emailConfirmationCookie)?.secure).toBe(true);
  });
  it.each([
    { origin: "http://localhost" },
    { origin: "null", "sec-fetch-site": "same-origin" },
  ] as Record<string, string>[])("consumes a matching pending token only after a same-origin POST", async (headers) => {
    const { action, cookie } = await stageEmailLink();
    const response = await confirmationPost(action, cookie, headers);
    expect(mocks.verify).toHaveBeenCalledExactlyOnceWith({ token_hash: "local-hash", type: "email" });
    expect(response.headers.get("location")).toBe("/account");
    expect(response.cookies.get(emailConfirmationCookie)).toMatchObject({
      path: "/auth/callback", maxAge: 0, expires: new Date(0),
    });
  });
  it.each([
    {}, { origin: "https://other.example", "sec-fetch-site": "same-origin" },
    { origin: "null", "sec-fetch-site": "same-site" },
    { origin: "http://localhost", "sec-fetch-site": "cross-site" },
  ] as Record<string, string>[])("rejects unverifiable origins before exchanging a token", async (headers) => {
    const { action, cookie } = await stageEmailLink();
    const response = await confirmationPost(action, cookie, headers);
    expect(response.status).toBe(403);
    expect(response.headers.has("set-cookie")).toBe(false);
    expect(mocks.client).not.toHaveBeenCalled();
  });
  it("rejects missing, duplicate, and stale challenges without clearing a newer pending link", async () => {
    const old = await stageEmailLink();
    const current = await stageEmailLink();
    const headers = { origin: "http://localhost" };
    for (const [action, cookie] of [[old.action, current.cookie], [current.action, ""],
      [`${current.action}&confirm=duplicate`, current.cookie]]) {
      const response = await confirmationPost(action, cookie, headers);
      expect(response.headers.get("location")).toBe("/login?error=invalid-link");
      expect(response.headers.has("set-cookie")).toBe(false);
    }
    expect(mocks.client).not.toHaveBeenCalled();
  });
  it("recovers from an expired link without exposing provider details", async () => {
    mocks.exchange.mockResolvedValue({ error: { message: "secret provider details" } });
    const response = await GET(new NextRequest("http://localhost/auth/callback?code=expired"));
    expect(response.headers.get("location")).toBe("/login?error=invalid-link");
  });
  it("expires the pending confirmation when the provider rejects the token", async () => {
    mocks.verify.mockResolvedValue({ error: { message: "private provider details" } });
    const { action, cookie } = await stageEmailLink();
    const response = await confirmationPost(action, cookie, { origin: "http://localhost" });
    expect(response.headers.get("location")).toBe("/login?error=invalid-link");
    expect(response.cookies.get(emailConfirmationCookie)?.expires).toEqual(new Date(0));
  });
  it.each(["missing", "outage"])("handles %s auth configuration", async (mode) => {
    if (mode === "missing") mocks.client.mockResolvedValue(null);
    else mocks.exchange.mockRejectedValue(new Error("private network failure"));
    const response = await GET(new NextRequest("http://localhost/auth/callback?code=local-code"));
    expect(response.headers.get("location")).toBe("/login?error=unavailable");
  });
});

describe("server account gate", () => {
  it("redirects when configuration is absent", async () => {
    mocks.client.mockResolvedValue(null);
    await expect(AccountPage()).rejects.toThrow("redirect:/login?error=unavailable");
  });
  it("redirects without a verified user", async () => {
    await expect(AccountPage()).rejects.toThrow("redirect:/login");
  });
  it("does not accept a user returned alongside an authentication error", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { email: "forged@example.test" } }, error: { message: "invalid token" } });
    await expect(AccountPage()).rejects.toThrow("redirect:/login");
  });
  it("handles auth service failure without rendering account contents", async () => {
    mocks.getUser.mockRejectedValue(new Error("private auth details"));
    await expect(AccountPage()).rejects.toThrow("redirect:/login?error=unavailable");
  });
  it("renders only a server-verified email", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { email: "verified@example.test" } }, error: null });
    const page = await AccountPage();
    expect(JSON.stringify(page)).toContain("verified@example.test");
    expect(mocks.getUser).toHaveBeenCalledOnce();
  });
});

describe("public Supabase configuration", () => {
  it.each(["", "javascript:alert(1)", "not a url", "https://user:password@example.test"])("rejects invalid URL %s", (url) => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", url);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "fixture-anon");
    expect(getSupabasePublicConfig()).toBeNull();
  });
});
