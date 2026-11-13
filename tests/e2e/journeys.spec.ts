import { expect, test } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { request as httpRequest } from "node:http";

const providers = "http://127.0.0.1:4319";
test.beforeEach(async ({ request, context }) => {
  await request.post(`${providers}/__control`, { data: { reset: true } });
  await context.setExtraHTTPHeaders({ "x-forwarded-for": `local-test-${randomUUID()}` });
});

test("required routes and internal links render without overflow", async ({ page, request }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const links = new Set<string>();
  for (const path of ["/", "/become-a-client", "/become-a-coach", "/recipes", "/login"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.locator("#main-content")).toHaveCount(1);
    if (path !== "/recipes") await expect(page.locator("form")).toHaveAttribute("method", "post");
    (await page.locator("a[href]").evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")!)))
      .filter((href) => href.startsWith("/")).forEach((href) => links.add(href));
    if (path === "/" || path === "/login") {
      await expect(page.locator("header")).toHaveCSS("opacity", "1");
      await expect(path === "/" ? page.locator("h1") : page.locator("form")).toHaveCSS("opacity", "1");
      await page.screenshot({ path: testInfo.outputPath(`${path === "/" ? "home" : "login"}.png`) });
    }
  }
  for (const href of links) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
    const hash = href.split("#")[1];
    if (hash) expect(await response.text(), href).toContain(`id="${hash}"`);
  }
  expect(errors).toEqual([]);
});

test("waitlist saves once and locks after success", async ({ page, request }) => {
  await page.goto("/");
  await page.getByLabel("Email address", { exact: true }).fill("waitlist@example.test");
  await page.getByRole("button", { name: "Request Access", exact: true }).click();
  await expect(page.locator("#waitlist-feedback")).toContainText("You're on the list.");
  await expect(page.getByRole("button", { name: "Received", exact: true })).toBeDisabled();
  await expect(page.getByLabel("Email address", { exact: true })).toBeDisabled();
  await expect(page.locator("#waitlist-feedback")).toBeFocused();
  const state = await (await request.get(`${providers}/__state`)).json();
  expect(state.leads).toHaveLength(1);
  expect(state.notifications).toHaveLength(1);
  expect(state.leads[0]).toMatchObject({ lead_type: "waitlist", source: "homepage", notification_status: "sent" });
});

test("rapid repeated submit events create a single request", async ({ page, request }) => {
  await page.goto("/");
  await page.getByLabel("Email address", { exact: true }).fill("double@example.test");
  await page.locator("form").evaluate((form: HTMLFormElement) => { form.requestSubmit(); form.requestSubmit(); });
  await expect(page.locator("#waitlist-feedback")).toContainText("You're on the list.");
  const state = await (await request.get(`${providers}/__state`)).json();
  expect(state.leads).toHaveLength(1);
  expect(state.mailAttempts).toHaveLength(1);
});

test("notification outage still confirms the saved request", async ({ page, request }) => {
  await request.post(`${providers}/__control`, { data: { mailFailure: true } });
  await page.goto("/");
  await page.getByLabel("Email address", { exact: true }).fill("saved@example.test");
  await page.getByRole("button", { name: "Request Access", exact: true }).click();
  await expect(page.locator("#waitlist-feedback")).toContainText("Team email notification is delayed");
  await expect(page.getByRole("button", { name: "Received", exact: true })).toBeDisabled();
  const state = await (await request.get(`${providers}/__state`)).json();
  expect(state.leads).toHaveLength(1);
  expect(state.leads[0].notification_status).toBe("failed");
});

test("database outage retains input and retries with the same request ID", async ({ page, request }) => {
  await request.post(`${providers}/__control`, { data: { databaseFailure: true } });
  const ids: string[] = [];
  page.on("request", (req) => { if (req.url().endsWith("/api/leads")) ids.push(req.headers()["idempotency-key"]); });
  await page.goto("/");
  const input = page.getByLabel("Email address", { exact: true });
  await input.fill("retry@example.test");
  await page.getByRole("button", { name: "Request Access", exact: true }).click();
  await expect(page.locator("#waitlist-feedback").getByRole("alert")).toContainText("We could not confirm");
  await expect(input).toHaveValue("retry@example.test");
  await request.post(`${providers}/__control`, { data: { databaseFailure: false } });
  await page.getByRole("button", { name: "Request Access", exact: true }).click();
  await expect(page.locator("#waitlist-feedback")).toContainText("You're on the list.");
  expect(ids).toHaveLength(2);
  expect(ids[0]).toBe(ids[1]);
});

test("shared intake quota preserves the form without showing a false receipt", async ({ page, request }) => {
  await request.post(`${providers}/__control`, { data: { intakeRetryAfter: 120 } });
  await page.goto("/");
  const email = page.getByLabel("Email address", { exact: true });
  const submit = page.getByRole("button", { name: "Request Access", exact: true });
  await email.fill("quota-browser@example.test");
  const rejected = page.waitForResponse((response) => response.url().endsWith("/api/leads") && response.request().method() === "POST");
  await submit.click();
  const response = await rejected;
  expect(response.status()).toBe(429);
  expect(response.headers()["retry-after"]).toBe("120");
  await expect(page.locator("#waitlist-feedback").getByRole("alert")).toContainText("Too many submissions");
  await expect(page.getByRole("button", { name: "Received", exact: true })).toHaveCount(0);
  await expect(email).toHaveValue("quota-browser@example.test");
  await expect(submit).toBeEnabled();
  const state = await (await request.get(`${providers}/__state`)).json();
  expect(state.leads).toHaveLength(0);
  expect(state.mailAttempts).toHaveLength(0);

  await request.post(`${providers}/__control`, { data: { intakeRetryAfter: null } });
  const saved = page.waitForResponse((next) => next.url().endsWith("/api/leads") && next.request().method() === "POST");
  await submit.click();
  expect((await saved).request().headers()["idempotency-key"]).toBe(response.request().headers()["idempotency-key"]);
  await expect(page.getByRole("button", { name: "Received", exact: true })).toBeDisabled();
});

test("the production lead route rejects a stalled chunked body before storage", async ({ request, baseURL }) => {
  const result = await new Promise<{ status: number | undefined; body: unknown }>((resolve, reject) => {
    const transport = httpRequest(new URL("/api/leads", baseURL), {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": randomUUID() },
    }, (response) => {
      let text = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => { text += chunk; });
      response.on("error", reject);
      response.on("end", () => {
        transport.destroy();
        try { resolve({ status: response.statusCode, body: JSON.parse(text) }); }
        catch (error) { reject(error); }
      });
    });
    transport.on("error", reject);
    transport.setTimeout(10_000, () => transport.destroy(new Error("No response to stalled request")));
    transport.write('{"lead_type":"waitlist",');
  });
  expect(result).toMatchObject({ status: 408, body: { ok: false, code: "request-timeout" } });
  const state = await (await request.get(`${providers}/__state`)).json();
  expect(state.leads).toHaveLength(0);
  expect(state.mailAttempts).toHaveLength(0);
});

for (const leadType of ["client", "coach"] as const) {
  test(`${leadType} contact journey saves required and optional fields`, async ({ page, request }, testInfo) => {
    await page.goto(`/become-a-${leadType}`);
    await page.getByLabel("Name", { exact: true }).fill("Local Test Professional");
    await page.getByLabel("Email", { exact: true }).fill(`${leadType}@example.test`);
    if (leadType === "client") {
      await page.getByLabel("Company", { exact: true }).fill("Local Test Team");
      await page.getByLabel("Industry", { exact: true }).fill("Biotech");
      await page.getByLabel("What do you want to improve?", { exact: true }).fill("Repeatable meeting preparation");
    } else {
      await page.getByLabel("LinkedIn or website", { exact: true }).fill("https://example.test/profile");
      await page.getByLabel("Area of expertise", { exact: true }).fill("Biotech");
      await page.getByLabel("What kind of Agent Recipe do you want to build?", { exact: true }).fill("BD meeting preparation");
    }
    await page.getByLabel("Optional notes", { exact: true }).fill("Local test only");
    await page.getByRole("button", { name: leadType === "client" ? "Request Client Access" : "Apply as a Coach", exact: true }).click();
    await expect(page.getByRole("button", { name: "Received", exact: true })).toBeDisabled();
    await expect(page.getByLabel("Email", { exact: true })).toBeDisabled();
    const state = await (await request.get(`${providers}/__state`)).json();
    expect(state.leads[0]).toMatchObject({ lead_type: leadType, message: "Local test only" });
    expect(state.notifications).toHaveLength(1);
    await page.locator("form").screenshot({ path: testInfo.outputPath(`${leadType}-form.png`) });
  });
}

test("account requires server identity, signs in, survives refresh, and handles sign-out failure", async ({ page, context, request }, testInfo) => {
  await page.goto("/account");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("local-coach@example.test", { exact: true })).toHaveCount(0);
  await page.getByLabel("Email", { exact: true }).fill("local-coach@example.test");
  await page.getByRole("button", { name: "Send Magic Link", exact: true }).click();
  await expect(page.locator("#login-feedback").getByRole("status")).toContainText("Check your email");
  await expect(page.getByLabel("Email", { exact: true })).toBeDisabled();
  await page.goto("/auth/callback?code=fixture-code&next=https://other.example");
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByRole("heading", { name: "local-coach@example.test", exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("account.png") });
  const cookie = (await context.cookies()).find((item) => item.name === "sb-127-auth-token");
  expect(cookie).toBeDefined();
  const session = JSON.parse(Buffer.from(cookie!.value.replace(/^base64-/, ""), "base64url").toString());
  session.expires_at = Math.floor(Date.now() / 1000) - 60;
  session.user.email = "forged@example.test";
  await context.addCookies([{ ...cookie!, value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}` }]);
  const refresh = await page.reload();
  expect(refresh?.headers()["cache-control"]).toContain("no-store");
  await expect(page.getByRole("heading", { name: "local-coach@example.test", exact: true })).toBeVisible();
  await expect(page.getByText("forged@example.test", { exact: true })).toHaveCount(0);
  const refreshedState = await (await request.get(`${providers}/__state`)).json();
  expect(refreshedState.refreshRequests).toBeGreaterThan(0);
  await request.post(`${providers}/__control`, { data: { signOutFailure: true } });
  await page.getByRole("button", { name: "Sign Out", exact: true }).click();
  await expect(page).toHaveURL(/\/login\?notice=signed-out-locally$/);
  await expect(page.locator("#login-feedback")).toContainText("Signed out on this browser");
  await page.goto("/account");
  await expect(page).toHaveURL(/\/login$/);
  await request.post(`${providers}/__control`, { data: { signOutFailure: false } });
  await page.getByLabel("Email", { exact: true }).fill("local-coach@example.test");
  await page.getByRole("button", { name: "Send Magic Link", exact: true }).click();
  await expect(page.locator("#login-feedback")).toContainText("Check your email");
  await page.goto("/auth/callback?code=fixture-code");
  await expect(page.getByRole("heading", { name: "local-coach@example.test", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Sign Out", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/account");
  await expect(page).toHaveURL(/\/login$/);
});

test("invalid magic link shows a recoverable error", async ({ page }) => {
  await page.goto("/auth/callback?token_hash=expired&type=email");
  await page.getByRole("button", { name: "Confirm sign-in", exact: true }).click();
  await expect(page).toHaveURL(/\/login\?error=invalid-link$/);
  await expect(page.locator("#login-feedback").getByRole("alert")).toContainText("invalid or has expired");
  await expect(page.getByRole("button", { name: "Send Magic Link", exact: true })).toBeEnabled();
});

test("navigation works by keyboard on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open navigation", exact: true });
  await toggle.click();
  const menu = page.getByRole("navigation", { name: "Mobile navigation", exact: true });
  await expect(menu.getByRole("link", { name: "Login", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Enter");
  await menu.getByRole("link", { name: "Login", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("reduced motion stops the orbital network", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const orbit = page.locator("#hero svg");
  const read = () => orbit.locator("g, circle").evaluateAll((elements) => elements.map((element) => element.getAttribute("style")));
  const first = await read();
  await page.waitForTimeout(800);
  expect(await read()).toEqual(first);
  expect(errors).toEqual([]);
});
