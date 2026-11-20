import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { expect, test, type Locator } from "@playwright/test";
import type { RecipeWorkedExample } from "../../src/lib/recipe-examples";
import { agentRecipes } from "../../src/lib/recipes-data";
import { createRecipeSample, recipeSampleFilename } from "../../src/lib/recipe-sample";
import { fixtureReleaseRevision } from "../fixtures/release-revision";

const recipe = "biotech-bd-meeting-prep-agent";

test("the release check requires the exact deployed revision", async ({ request, baseURL }) => {
  const check = (sha: string, ...flags: string[]) => spawnSync(process.execPath, ["scripts/check-release.mjs", baseURL!, sha, ...flags], {
    encoding: "utf8", timeout: 15_000,
  });
  const matching = check(fixtureReleaseRevision);
  expect(matching.status).toBe(0);
  expect(matching.stdout).toContain(`PASS /recipes: HTTP 200, revision ${fixtureReleaseRevision}.`);
  const fullCatalog = check(fixtureReleaseRevision, "--catalog");
  expect(fullCatalog.status, fullCatalog.stderr).toBe(0);
  expect(fullCatalog.stdout.split("\n").filter((line) => line.startsWith("PASS "))).toHaveLength(2 + 2 * agentRecipes.length);
  const mismatching = check("f".repeat(40));
  expect(mismatching.status).toBe(1);
  expect(mismatching.stderr).toContain("FAIL /recipes: HTTP 200");
  for (const path of ["/login", "/account"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.headers()["x-agentcoach-revision"], path).toBeUndefined();
  }
});

test("public sample URLs return only the published JSON attachments", async ({ request }) => {
  for (const recipe of agentRecipes) {
    const response = await request.get(`/recipes/samples/${recipe.slug}?q=not-part-of-the-export`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(response.headers()["content-disposition"]).toBe(`attachment; filename="${recipeSampleFilename(recipe)}"`);
    expect(response.headers()["x-robots-tag"]).toBe("noindex");
    expect(response.headers()["set-cookie"]).toBeUndefined();
    expect(await response.json()).toEqual(createRecipeSample(recipe));
  }
  expect((await request.get("/recipes/samples/unknown-sample")).status()).toBe(404);
});

async function expectPainted(target: Locator) {
  await expect(target).toBeVisible();
  expect(await target.evaluate((element) => {
    for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
      if (getComputedStyle(ancestor).opacity === "0") return false;
    }
    return true;
  })).toBe(true);
}

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

test("the worked meeting brief is keyboard-readable and matches the public download", async ({ page }, testInfo) => {
  await page.goto(`/recipes?recipe=${recipe}`);
  const dialog = page.getByRole("dialog", { name: "Biotech BD Meeting Prep Agent" });
  const toggle = dialog.locator("summary");
  const heading = dialog.getByRole("heading", { name: "Partnering meeting brief" });
  await expect(dialog.getByRole("button", { name: "Close recipe preview" })).toBeFocused();
  await expect(heading).toBeHidden();
  await page.keyboard.press("Shift+Tab");
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(heading).toBeVisible();
  await expect(dialog.getByText("Synthetic data", { exact: true })).toBeVisible();
  await expect(dialog.getByText("Working hypothesis", { exact: true })).toBeVisible();
  await expect(dialog.getByText("Open question", { exact: true })).toBeVisible();
  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await heading.scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("worked-example.png") });

  const downloadEvent = page.waitForEvent("download");
  await dialog.getByRole("link", { name: "Download sample JSON" }).click();
  const download = await downloadEvent;
  const { workedExample } = JSON.parse(await readFile((await download.path())!, "utf8")) as {
    workedExample: RecipeWorkedExample;
  };
  expect(workedExample.kind).toBe("synthetic");
  await expect(heading).toHaveText(workedExample.title);
  await expect(dialog.getByText(workedExample.scenario, { exact: true })).toBeVisible();
  for (const { excerpt } of workedExample.sources) {
    await expect(dialog.getByText(excerpt, { exact: true })).toBeVisible();
  }
  for (const { text } of workedExample.output.findings) {
    await expect(dialog.getByText(text, { exact: true })).toBeVisible();
  }
  await expect(dialog.getByText(workedExample.output.handoff, { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("each industry opens its matching recipe and preserves navigation context", async ({ page }) => {
  for (const { slug, name, industrySlug } of agentRecipes) {
    const industryPath = `/industries/${industrySlug}`;
    await page.goto(industryPath);
    await page.getByRole("link", { name: "See sample recipes", exact: true }).click();
    await expect(page).toHaveURL(/#recipe-previews$/);
    const link = page.locator("#recipe-previews").getByRole("link", { name: `Preview ${name}`, exact: true });
    await link.click();
    const dialog = page.getByRole("dialog", { name, exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("[data-recipe-module]")).toHaveCount(8);
    expect(Object.fromEntries(new URL(page.url()).searchParams)).toEqual({ industry: industrySlug, recipe: slug });
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(`/recipes?industry=${industrySlug}`);
    await expect(page.getByLabel("Industry", { exact: true })).toHaveValue(industrySlug);
    await page.goBack();
    await expect(page).toHaveURL(`${industryPath}#recipe-previews`);
  }
});

test("catalog GET filters work when JavaScript is enabled but app scripts fail", async ({ page }) => {
  let blockedScripts = 0;
  await page.route("**/_next/static/**", (route) => {
    if (route.request().resourceType() !== "script") return route.continue();
    blockedScripts += 1;
    return route.abort();
  });
  await page.goto("/recipes");
  expect(blockedScripts).toBeGreaterThan(0);

  const search = page.getByRole("search", { name: "Recipe filters" });
  const results = page.getByRole("region", { name: "Recipe results" });
  await search.getByLabel("Industry", { exact: true }).selectOption("finance-market-research");
  await expect(results.getByRole("status")).toHaveText("6 sample recipes");
  const submitted = page.waitForRequest((request) => request.isNavigationRequest() &&
    new URL(request.url()).searchParams.get("industry") === "finance-market-research");
  await search.getByRole("button", { name: "Show results", exact: true }).press("Enter");
  expect((await submitted).method()).toBe("GET");
  await expect(page).toHaveURL((url) => url.hash === "#recipe-results");
  await expect(results.getByRole("status")).toHaveText("1 sample recipe");
  await expect(page.getByRole("heading", { name: "Finance Earnings Call Analyst", exact: true })).toBeVisible();
  await search.getByRole("button", { name: "Reset filters", exact: true }).click();
  await expect(page).toHaveURL((url) => !url.searchParams.size && url.hash === "#recipe-results");
  await expect(results.getByRole("status")).toHaveText("6 sample recipes");
});

test.describe("public first render without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the homepage, industry links and catalog are painted and navigable", async ({ page }, testInfo) => {
    await page.goto("/");
    const hero = page.locator("#hero");
    await expectPainted(hero.getByRole("heading", { level: 1 }));
    await expectPainted(hero.getByRole("link", { name: "Explore Recipes", exact: true }));
    await expectPainted(page.getByRole("link", { name: "AgentCoach home", exact: true }));
    await page.screenshot({ path: testInfo.outputPath("first-render.png") });

    const industry = page.locator('#channels a[href="/industries/biotech-pharma"]');
    await expectPainted(industry);
    await industry.click();
    await expect(page).toHaveURL(/\/industries\/biotech-pharma$/);
    await expectPainted(page.getByRole("heading", { name: "Biotech BD Meeting Prep Agent", exact: true }));

    if (testInfo.project.name === "mobile") {
      const menu = page.getByRole("navigation", { name: "Mobile navigation", exact: true });
      await expect(menu).toBeHidden();
      const trigger = page.locator('summary[aria-label="Navigation menu"]');
      await trigger.focus();
      await page.keyboard.press("Enter");
      const link = menu.getByRole("link", { name: "Agent Recipes", exact: true });
      await expectPainted(link);
      await link.click();
    } else {
      await page.getByRole("navigation", { name: "Main navigation", exact: true })
        .getByRole("link", { name: "Agent Recipes", exact: true }).click();
    }
    await expect(page).toHaveURL(/\/recipes$/);
    await expectPainted(page.getByRole("heading", { name: "Biotech BD Meeting Prep Agent", exact: true }));
  });

  test("native search submits catalog filters and clears empty results", async ({ page }) => {
    await page.goto("/recipes");
    const search = page.getByRole("search", { name: "Recipe filters" });
    await search.getByLabel("Search recipes", { exact: true }).fill("earnings call");
    await search.getByLabel("Industry", { exact: true }).selectOption("finance-market-research");
    await search.getByLabel("Maturity", { exact: true }).selectOption("preview");
    await search.getByLabel("Featured", { exact: true }).check();
    const submission = page.waitForRequest((request) => request.isNavigationRequest() &&
      new URL(request.url()).searchParams.get("q") === "earnings call");
    await search.getByRole("button", { name: "Show results", exact: true }).click();
    expect((await submission).method()).toBe("GET");
    await expect(page.getByRole("status")).toHaveText("1 sample recipe");
    await expect(page.getByRole("heading", { name: "Finance Earnings Call Analyst", exact: true })).toBeVisible();
    await expect(search.getByLabel("Featured", { exact: true })).toBeChecked();
    await search.getByLabel("Verified", { exact: true }).check();
    await search.getByRole("button", { name: "Show results", exact: true }).click();
    await expect(page.getByRole("heading", { name: "No verified recipes available yet.", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Clear all filters", exact: true }).click();
    await expect(page).toHaveURL((url) => url.pathname === "/recipes" && url.searchParams.size === 0);
    await expect(page.getByRole("status")).toHaveText("6 sample recipes");
    await expect(search.getByRole("button", { name: "Reset filters", exact: true })).toBeDisabled();
  });

  test("empty results links recover matches while preserving the other filters", async ({ page }) => {
    await page.goto("/recipes?q=earnings&industry=biotech-pharma&featured=1");
    await expect(page.getByRole("status")).toHaveText("0 sample recipes");
    await expect(page.getByRole("link", { name: /Include non-featured samples/ })).toHaveCount(0);
    await page.getByRole("link", { name: "Any industry (1)", exact: true }).press("Enter");
    await expect(page.getByRole("status")).toHaveText("1 sample recipe");
    await expect(page.getByRole("heading", { name: "Finance Earnings Call Analyst", exact: true })).toBeVisible();
    expect(Object.fromEntries(new URL(page.url()).searchParams)).toEqual({ q: "earnings", featured: "1" });
    await page.goBack();
    await page.getByRole("link", { name: "Clear search (1)", exact: true }).click();
    await expect(page.getByRole("status")).toHaveText("1 sample recipe");
    await expect(page.getByRole("heading", { name: "Biotech BD Meeting Prep Agent", exact: true })).toBeVisible();
    expect(Object.fromEntries(new URL(page.url()).searchParams)).toEqual({ industry: "biotech-pharma", featured: "1" });
  });

  test("native recipe links open a readable sample and return to the filtered results", async ({ page }) => {
    const name = "Biotech BD Meeting Prep Agent";
    const previewLink = page.getByRole("link", { name: `Preview ${name}`, exact: true });
    const preview = page.getByRole("article", { name, exact: true });

    await page.goto("/recipes?q=meeting&industry=biotech-pharma&featured=1");
    await previewLink.press("Enter");
    await expect(page).toHaveURL((url) => url.searchParams.get("recipe") === recipe && url.hash === "#recipe-preview");
    await expect(preview.getByRole("heading", { name, exact: true })).toBeInViewport();
    await expect(preview.locator("[data-recipe-module]")).toHaveCount(8);
    await expect(preview.getByText("Human review required", { exact: true })).toBeVisible();
    await expect(preview.getByRole("button", { name: "Copy recipe link" })).toHaveCount(0);
    await preview.locator("summary").press("Enter");
    await expect(preview.getByRole("heading", { name: "Partnering meeting brief" })).toBeVisible();

    const downloaded = page.waitForEvent("download");
    const downloadLink = preview.getByRole("link", { name: "Download sample JSON" });
    await expect(downloadLink).toHaveAttribute("href", `/recipes/samples/${recipe}`);
    await downloadLink.click();
    const download = await downloaded;
    expect(download.suggestedFilename()).toBe(`agentcoach-${recipe}-sample-v1.json`);
    expect(Object.keys(JSON.parse(await readFile((await download.path())!, "utf8")).modules)).toHaveLength(8);

    await preview.getByRole("link", { name: "Back to results" }).click();
    await expect(page).toHaveURL((url) => url.hash === "#recipe-results" && !url.searchParams.has("recipe"));
    expect(Object.fromEntries(new URL(page.url()).searchParams)).toEqual({
      q: "meeting", industry: "biotech-pharma", featured: "1",
    });
    await expect(page.getByRole("status")).toHaveText("1 sample recipe");
    await expect(preview).toHaveCount(0);

    for (const path of ["/", "/industries/biotech-pharma"]) {
      await page.goto(path);
      await previewLink.click();
      await expect(preview.getByRole("heading", { name, exact: true })).toBeInViewport();
    }
    await page.goto(`/recipes?recipe=${recipe}`);
    await expect(preview).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
