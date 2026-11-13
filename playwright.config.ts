import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3100", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { browserName: "chromium", viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { browserName: "chromium", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: [
    { command: "node tests/fixtures/provider-server.mts", url: "http://127.0.0.1:4319/health", reuseExistingServer: false },
    {
      command: "node scripts/start-test-app.mjs",
      url: "http://127.0.0.1:3100", reuseExistingServer: false, timeout: 120_000,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:4319", NEXT_PUBLIC_SUPABASE_ANON_KEY: "fixture-anon",
        SUPABASE_SERVICE_ROLE_KEY: "fixture-service-role", RESEND_API_KEY: "re_fixture_only",
        RESEND_BASE_URL: "http://127.0.0.1:4319/resend",
        NOTIFICATION_FROM_EMAIL: "sender@example.test", NOTIFICATION_TO_EMAIL: "owner@example.test",
      },
    },
  ],
});
