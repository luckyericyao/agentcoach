import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const name = "Biotech BD Meeting Prep Agent";
const slug = "biotech-bd-meeting-prep-agent";

test("known permalink survives refresh and closing preserves filters with a focus destination", async ({ page }) => {
  await page.goto(`/recipes?industry=biotech-pharma&recipe=${slug}`);
  const dialog = page.getByRole("dialog", { name, exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("[data-recipe-module]")).toHaveCount(8);
  await page.reload();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close recipe preview", exact: true }).click();
  await expect(page).toHaveURL(/\/recipes\?industry=biotech-pharma$/);
  await expect(dialog).toBeHidden();
  await expect(page.getByLabel("Industry", { exact: true })).toHaveValue("biotech-pharma");
  await expect(page.getByLabel("Search recipes", { exact: true })).toBeFocused();
});

test("preview history opens and closes without losing catalog state or keyboard focus", async ({ page }) => {
  await page.goto("/recipes?industry=biotech-pharma&q=meeting");
  const trigger = page.getByRole("button", { name: `Preview ${name}`, exact: true });
  const dialog = page.getByRole("dialog", { name, exact: true });
  for (let cycle = 0; cycle < 5; cycle += 1) {
    await trigger.click();
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`recipe=${slug}$`));
    await page.goBack();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await page.goForward();
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(page).not.toHaveURL(/recipe=/);
    const url = new URL(page.url());
    expect(url.pathname).toBe("/recipes");
    expect(Object.fromEntries(url.searchParams)).toEqual({ q: "meeting", industry: "biotech-pharma" });
    await expect(page.getByLabel("Search recipes", { exact: true })).toHaveValue("meeting");
    await expect(page.getByLabel("Industry", { exact: true })).toHaveValue("biotech-pharma");
  }
});

test("invalid or repeated preview slugs never open an unrelated sample", async ({ page }) => {
  for (const query of ["recipe=unknown", "recipe=", `recipe=${slug}&recipe=${slug}`]) {
    await page.goto(`/recipes?${query}`);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator("article")).toHaveCount(6);
  }
});

test("homepage and catalog copy a recipe-only link and download a complete public sample", async ({ page, context }, testInfo) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  for (const path of ["/", "/recipes?q=meeting&industry=biotech-pharma"]) {
    await page.goto(path);
    await page.getByRole("button", { name: `Preview ${name}`, exact: true }).click();
    const dialog = page.getByRole("dialog", { name, exact: true });
    await dialog.getByRole("button", { name: "Copy recipe link", exact: true }).click();
    await expect(dialog.getByRole("status")).toHaveText("Recipe link copied.");
    expect(await page.evaluate(() => navigator.clipboard.readText()))
      .toBe(`http://127.0.0.1:3100/recipes?recipe=${slug}`);
    const downloadEvent = page.waitForEvent("download");
    await dialog.getByRole("link", { name: "Download sample JSON", exact: true }).click();
    const download = await downloadEvent;
    expect(download.suggestedFilename()).toBe(`agentcoach-${slug}-sample-v1.json`);
    const sample = JSON.parse(await readFile((await download.path())!, "utf8"));
    expect(sample.name).toBe(name);
    expect(sample.sourcePath).toBe(`/recipes?recipe=${slug}`);
    expect(sample.review).toMatchObject({ status: "unverified", humanReviewRequired: true, executionAvailable: false });
    expect(Object.keys(sample.modules)).toHaveLength(8);
    expect(sample.modules.riskBoundary).toContain("expert review");
    expect(sample.modules.deploymentOption).toMatchObject({ status: "proposed", runtimeConnected: false });
    expect(JSON.stringify(sample)).not.toContain("q=meeting");
    expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    if (path === "/") await page.screenshot({ path: testInfo.outputPath("sample-sharing.png") });
  }
});

test("blocked clipboard exposes a selectable link inside the accessible preview", async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
      writeText: async () => { throw new Error("fixture-denied"); },
    } });
  });
  await page.goto("/recipes");
  const trigger = page.getByRole("button", { name: `Preview ${name}`, exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name, exact: true });
  await dialog.getByRole("button", { name: "Copy recipe link", exact: true }).click();
  const input = dialog.getByRole("textbox", { name: "Recipe link", exact: true });
  await expect(input).toHaveValue(`http://127.0.0.1:3100/recipes?recipe=${slug}`);
  await expect(input).toHaveAttribute("readonly", "");
  await expect(input).toBeFocused();
  await expect(dialog.getByRole("status")).toContainText("Clipboard unavailable.");
  await page.screenshot({ path: testInfo.outputPath("manual-share-link.png") });
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});
