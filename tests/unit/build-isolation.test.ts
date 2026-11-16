import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

describe("local fixture build isolation", () => {
  it("keeps the normal production output at the standard directory", async () => {
    vi.stubEnv("AGENTCOACH_TEST_BUILD", undefined);
    const { default: config } = await import("../../next.config");
    expect(config.distDir).toBe(".next");
  });

  it("isolates only an explicitly enabled fixture build", async () => {
    vi.stubEnv("AGENTCOACH_TEST_BUILD", "1");
    const { default: config } = await import("../../next.config");
    expect(config.distDir).toBe(".next-e2e");
  });

  it("does not change normal output for an arbitrary flag value", async () => {
    vi.stubEnv("AGENTCOACH_TEST_BUILD", "true");
    const { default: config } = await import("../../next.config");
    expect(config.distDir).toBe(".next");
  });
});

describe("public release revision", () => {
  it("reports the platform commit on the two public release check paths", async () => {
    const revision = "0123456789abcdef0123456789abcdef01234567";
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", revision);
    const { default: config } = await import("../../next.config");
    const routes = (await config.headers!()).filter(({ headers }) =>
      headers.some(({ key }) => key === "X-AgentCoach-Revision"));
    expect(routes).toEqual(["/", "/recipes"].map((source) => ({
      source, headers: [{ key: "X-AgentCoach-Revision", value: revision }],
    })));
  });

  it.each([undefined, "unknown", "abc", "a".repeat(40) + "\n"])("omits invalid or missing revisions (%s)", async (revision) => {
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", revision);
    const { default: config } = await import("../../next.config");
    expect(JSON.stringify(await config.headers!())).not.toContain("X-AgentCoach-Revision");
  });
});
