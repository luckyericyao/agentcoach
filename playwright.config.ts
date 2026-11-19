import { defineConfig } from "@playwright/test";
import { fixtureReleaseRevision } from "./tests/fixtures/release-revision";

const publicPreview = process.env.AGENTCOACH_TEST_PUBLIC_PREVIEW === "1";

function fixtureCommand(script: string) {
  // Replace the POSIX shell so fixtures can observe Playwright as their parent.
  return `${process.platform === "win32" ? "" : "exec "}node ${script}`;
}

export default defineConfig({
  testDir: "./tests/e2e",
  ...(publicPreview ? { testMatch: "**/public-preview.spec.ts" } : { testIgnore: "**/public-preview.spec.ts" }),
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3100", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { browserName: "chromium", viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { browserName: "chromium", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: [
    { command: fixtureCommand("tests/fixtures/provider-server.mts"), url: "http://127.0.0.1:4319/health", reuseExistingServer: false },
    {
      command: fixtureCommand("scripts/start-test-app.mjs"),
      url: "http://127.0.0.1:3100", reuseExistingServer: false, timeout: 120_000,
      env: {
        VERCEL_GIT_COMMIT_SHA: fixtureReleaseRevision,
        AGENTCOACH_EARLY_ACCESS: publicPreview ? "" : "1",
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:4319", NEXT_PUBLIC_SUPABASE_ANON_KEY: "fixture-anon",
        SUPABASE_SERVICE_ROLE_KEY: "fixture-service-role", RESEND_API_KEY: "re_fixture_only",
        RESEND_BASE_URL: "http://127.0.0.1:4319/resend",
        NOTIFICATION_FROM_EMAIL: "sender@example.test", NOTIFICATION_TO_EMAIL: "owner@example.test",
      },
    },
  ],
});
