import { expect, test } from "@playwright/test";
import { randomUUID } from "node:crypto";

const providers = "http://127.0.0.1:4319";
const biotech = "Biotech BD Meeting Prep Agent";
const finance = "Finance Earnings Call Analyst";

test.beforeEach(async ({ request, context }) => {
  await request.post(`${providers}/__control`, { data: { reset: true } });
  await context.setExtraHTTPHeaders({ "x-forwarded-for": `recipe-test-${randomUUID()}` });
});

test("catalog filters survive reload and back/forward, and reset recovers empty results", async ({ page }, testInfo) => {
  await page.goto("/recipes");
  await expect(page.getByRole("status")).toHaveText("6 sample recipes");
  await page.getByLabel("Industry", { exact: true }).selectOption("finance-market-research");
  await page.getByLabel("Maturity", { exact: true }).selectOption("preview");
  await page.getByLabel("Featured", { exact: true }).check();
  await page.getByLabel("Search recipes", { exact: true }).fill("earnings call");
  await expect(page.getByRole("status")).toHaveText("1 sample recipe");
  await expect(page).toHaveURL(/q=earnings\+call/);
  await page.reload();
  await expect(page.getByLabel("Search recipes", { exact: true })).toHaveValue("earnings call");
  await expect(page.getByLabel("Industry", { exact: true })).toHaveValue("finance-market-research");
  await expect(page.getByLabel("Featured", { exact: true })).toBeChecked();
  await page.goBack();
  await expect(page.getByLabel("Featured", { exact: true })).not.toBeChecked();
  await expect(page.getByLabel("Search recipes", { exact: true })).toHaveValue("");
  await page.goForward();
  await expect(page.getByLabel("Search recipes", { exact: true })).toHaveValue("earnings call");
  await page.getByLabel("Verified", { exact: true }).check();
  await expect(page.getByRole("heading", { name: "No verified recipes available yet.", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Clear all filters", exact: true }).click();
  await expect(page).toHaveURL(/\/recipes$/);
  await expect(page.getByRole("status")).toHaveText("6 sample recipes");
  await expect(page.locator("article")).toHaveCount(6);
  await page.getByLabel("Search recipes", { exact: true }).fill("no matching sample");
  await expect(page.getByRole("heading", { name: "No matching sample recipes.", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Reset filters", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("6 sample recipes");
  await expect(page.getByRole("button", { name: "Reset filters", exact: true })).toBeDisabled();
  await page.screenshot({ path: testInfo.outputPath("catalog.png"), fullPage: true });
});

test("recipe preview has all eight modules, traps keyboard focus, and restores its trigger", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/recipes");
  const trigger = page.getByRole("button", { name: `Preview ${biotech}`, exact: true });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: biotech, exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("[data-recipe-module]")).toHaveCount(8);
  await expect(dialog.locator('[data-recipe-module="workflow"] li')).toHaveCount(6);
  await expect(dialog.getByText("Unverified sample", { exact: true })).toBeVisible();
  await expect(dialog.getByText("Human review required", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close recipe preview", exact: true })).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("recipe-preview.png") });
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("link", { name: "Request this workflow", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close recipe preview", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await page.getByRole("button", { name: `Preview ${finance}`, exact: true }).click();
  const next = page.getByRole("dialog", { name: finance, exact: true });
  await expect(next).toBeVisible();
  await expect(next.locator('[data-recipe-module="risk"]')).toContainText("No financial advice");
  await next.getByRole("button", { name: "Close recipe preview", exact: true }).click();
  await expect(next).toBeHidden();
  expect(errors).toEqual([]);
});

test("homepage featured samples open the same complete preview", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: `Preview ${biotech}`, exact: true }).click();
  const dialog = page.getByRole("dialog", { name: biotech, exact: true });
  await expect(dialog.locator("[data-recipe-module]")).toHaveCount(8);
  await dialog.getByRole("button", { name: "Close recipe preview", exact: true }).click();
  await expect(page.getByRole("button", { name: `Preview ${biotech}`, exact: true })).toBeFocused();
});

test("selected recipe reaches an editable client request and is saved with its context", async ({ page, request }, testInfo) => {
  await page.goto("/recipes?industry=biotech-pharma");
  await page.getByRole("button", { name: `Preview ${biotech}`, exact: true }).click();
  await page.getByRole("dialog", { name: biotech, exact: true })
    .getByRole("link", { name: "Request this workflow", exact: true }).click();
  await expect(page).toHaveURL(/\/become-a-client\?recipe=biotech-bd-meeting-prep-agent#client-access$/);
  await expect(page.locator("form")).toContainText("Selected sample recipe");
  await expect(page.locator("form")).toContainText(biotech);
  await expect(page.getByLabel("Industry", { exact: true })).toHaveValue("Biotech & Pharma");
  const goal = page.getByLabel("What do you want to improve?", { exact: true });
  await expect(goal).toHaveValue(`I would like to adapt the ${biotech} workflow for my team.`);
  await page.getByLabel("Name", { exact: true }).fill("Local Recipe Reviewer");
  await page.getByLabel("Email", { exact: true }).fill("recipe-interest@example.test");
  await goal.fill("Prepare repeatable partner review briefs.");
  await page.getByRole("button", { name: "Request Client Access", exact: true }).click();
  await expect(page.getByRole("button", { name: "Received", exact: true })).toBeDisabled();
  const state = await (await request.get(`${providers}/__state`)).json();
  expect(state.leads).toHaveLength(1);
  expect(state.leads[0]).toMatchObject({ lead_type: "client", industry: "Biotech & Pharma", recipe_interest: biotech,
    improvement_goal: "Prepare repeatable partner review briefs.", source: "become-a-client" });
  await page.screenshot({ path: testInfo.outputPath("recipe-request.png") });
});

test("invalid and duplicate recipe query values fall back to the general form", async ({ page }) => {
  for (const query of ["recipe=unknown", "recipe=biotech-bd-meeting-prep-agent&recipe=finance-earnings-call-analyst"]) {
    await page.goto(`/become-a-client?${query}#client-access`);
    await expect(page.getByLabel("Industry", { exact: true })).toHaveValue("");
    await expect(page.getByLabel("What do you want to improve?", { exact: true })).toHaveValue("");
    await expect(page.getByText("Selected sample recipe", { exact: true })).toHaveCount(0);
  }
});

test("a filtered URL is rendered by the production server before JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: "http://127.0.0.1:3100" });
  try {
    const page = await context.newPage();
    await page.goto("/recipes?industry=finance-market-research");
    await expect(page.locator("article")).toHaveCount(1);
    await expect(page.locator("article").getByRole("heading", { name: finance, exact: true })).toBeVisible();
    await expect(page.getByLabel("Industry", { exact: true })).toHaveValue("finance-market-research");
  } finally { await context.close(); }
});
