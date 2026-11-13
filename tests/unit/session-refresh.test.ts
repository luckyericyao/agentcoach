import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock("@supabase/ssr", () => ({ createServerClient: mocks.create }));
import { proxy } from "@/proxy";

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.test");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "fixture-anon");
});
afterEach(() => vi.unstubAllEnvs());

it("preserves refreshed cookies and cache headers in the response", async () => {
  mocks.create.mockImplementation((_url, _key, options) => ({ auth: { getClaims: async () => {
    options.cookies.setAll([{ name: "sb-session", value: "refreshed", options: { path: "/" } }],
      { "Pragma": "no-cache", "Expires": "0" });
    return { data: { claims: {} }, error: null };
  } } }));
  const request = new NextRequest("http://localhost/account", { headers: { cookie: "sb-session=old" } });
  const response = await proxy(request);
  expect(request.cookies.get("sb-session")?.value).toBe("refreshed");
  expect(response.cookies.get("sb-session")?.value).toBe("refreshed");
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  expect(response.headers.get("pragma")).toBe("no-cache");
  expect(response.headers.get("expires")).toBe("0");
});

it("does not crash a request without configuration", async () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
  expect((await proxy(new NextRequest("http://localhost/account"))).status).toBe(200);
  expect(mocks.create).not.toHaveBeenCalled();
});
