import { expect, test } from "@playwright/test";

const providers = "http://127.0.0.1:4319";
const link = "/auth/callback?token_hash=fixture-token-hash&type=email";

test.use({ javaScriptEnabled: false });

test("email scans do not spend the token and native confirmation signs in once", async ({ page, context, request, baseURL }, testInfo) => {
  await request.post(`${providers}/__control`, { data: { reset: true } });
  const count = async () => (await (await request.get(`${providers}/__state`)).json()).verificationRequests;
  const head = await request.head(link);
  expect(head.status()).toBe(204);
  expect(head.headers()["set-cookie"]).toBeUndefined();
  const scanned = await request.get(link);
  expect(scanned.status()).toBe(200);
  expect(scanned.url()).toMatch(/\/login\?confirm=[0-9a-f-]+$/);
  expect(await scanned.text()).not.toContain("fixture-token-hash");
  expect(await count()).toBe(0);

  await page.goto(link);
  await expect(page.getByRole("heading", { name: "Confirm your sign-in.", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/login\?confirm=[0-9a-f-]+$/);
  expect(await page.content()).not.toContain("fixture-token-hash");
  const pending = (await context.cookies()).find(({ name }) => name === "agentcoach_email_confirmation");
  expect(pending).toMatchObject({ path: "/auth/callback", httpOnly: true, sameSite: "Lax" });
  const action = await page.locator("form").getAttribute("action");
  await page.screenshot({ path: testInfo.outputPath("email-confirmation.png") });
  await page.getByRole("button", { name: "Confirm sign-in", exact: true }).click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByRole("heading", { name: "local-coach@example.test", exact: true })).toBeVisible();
  expect((await context.cookies()).some(({ name }) => name === "agentcoach_email_confirmation")).toBe(false);
  expect(await count()).toBe(1);

  const replay = await context.request.post(action!, { maxRedirects: 0, headers: { origin: baseURL! } });
  expect(replay.headers().location).toBe("/login?error=invalid-link");
  expect(await count()).toBe(1);
});
