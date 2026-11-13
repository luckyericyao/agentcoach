import { expect, test } from "@playwright/test";

test("320px reflow preserves page text, recipe controls, and the request handoff", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of ["/", "/recipes", "/become-a-client", "/become-a-coach"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), path).toBe(true);
    const clippedText = await page.locator("h1, h2, h3, button").evaluateAll((elements) => elements
      .filter((element) => element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 1)
      .map((element) => element.textContent?.trim()));
    expect(clippedText, path).toEqual([]);
    if (path === "/") {
      await expect(page.locator("h1")).toHaveCSS("opacity", "1");
      await page.screenshot({ path: testInfo.outputPath("320-home.png") });
    }
  }

  await page.goto("/recipes?recipe=biotech-bd-meeting-prep-agent");
  const dialog = page.getByRole("dialog", { name: "Biotech BD Meeting Prep Agent", exact: true });
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  for (const control of [dialog.getByRole("button", { name: "Close recipe preview", exact: true }),
    dialog.getByRole("button", { name: "Copy recipe link", exact: true }),
    dialog.getByRole("link", { name: "Download sample JSON", exact: true })]) {
    const bounds = await control.boundingBox();
    expect(bounds?.width).toBeGreaterThanOrEqual(44);
    expect(bounds?.height).toBeGreaterThanOrEqual(44);
  }
  await page.screenshot({ path: testInfo.outputPath("320-recipe-preview.png") });
  await dialog.getByRole("link", { name: "Request this workflow", exact: true }).click();
  await expect(page.getByLabel("Industry", { exact: true })).toHaveValue("Biotech & Pharma");
  await expect(page.locator("form")).toHaveAccessibleDescription(/Do not include patient records/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByLabel("Name", { exact: true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("320-request.png") });
});
