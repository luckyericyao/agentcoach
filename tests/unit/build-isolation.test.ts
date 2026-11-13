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
