import { expect, test } from "@playwright/test";

const recipe = "biotech-bd-meeting-prep-agent";

test("public preview exposes the catalog and no personal-data forms", async ({ page }, testInfo) => {
  for (const path of ["/", "/become-a-client", `/become-a-client?recipe=${recipe}`, "/become-a-coach", "/login", "/account"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("form, input[type=email], textarea")).toHaveCount(0);
    await expect(page.locator('a[href="/login"], a[href="/account"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), path).toBe(true);
  }
  await expect(page.getByRole("heading", { name: "Sign-in is not open yet." })).toBeVisible();

  await page.goto("/");
  const library = page.locator("#waitlist");
  await expect(library.getByText("Early access requests are not open yet.", { exact: false })).toBeAttached();
  await library.getByRole("link", { name: "Explore Recipes", exact: true }).click();
  await expect(page).toHaveURL(/\/recipes$/);
  await page.goto(`/recipes?recipe=${recipe}`);
  const dialog = page.getByRole("dialog", { name: "Biotech BD Meeting Prep Agent" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("[data-recipe-module]")).toHaveCount(8);
  await expect(dialog.getByRole("link", { name: "Request this workflow" })).toHaveCount(0);
  const download = page.waitForEvent("download");
  await dialog.getByRole("link", { name: "Download sample JSON" }).click();
  expect((await download).suggestedFilename()).toBe(`agentcoach-${recipe}-sample-v1.json`);
  await page.screenshot({ path: testInfo.outputPath("catalog-only.png") });
});

test("production preview rejects intake and email credential work before reaching configured fixtures", async ({ request, baseURL }) => {
  const fixture = "http://127.0.0.1:4319";
  await request.post(`${fixture}/__control`, { data: { reset: true } });
  const readState = async () => (await (await request.get(`${fixture}/__state`)).json());
  const before = await readState();
  const intake = await request.post("/api/leads", {
    data: { lead_type: "waitlist", email: "no-collection@example.test" },
  });
  expect(intake.status()).toBe(503);
  expect(await intake.json()).toMatchObject({ code: "early-access-closed" });
  expect(intake.headers()["cache-control"]).toContain("no-store");
  for (const url of ["/auth/callback?token_hash=fixture-token-hash&type=email", "/auth/callback?code=fixture-code"]) {
    const callback = await request.get(url, { maxRedirects: 0 });
    expect(callback.headers().location).toBe("/login");
    expect(callback.headers()["set-cookie"]).toBeUndefined();
  }
  const confirmation = await request.post("/auth/callback", { headers: { origin: baseURL! }, maxRedirects: 0 });
  expect(confirmation.headers().location).toBe("/login");
  expect(await readState()).toEqual(before);
});
