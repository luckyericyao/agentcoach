import { expect, test } from "@playwright/test";

test("public pages set browser protections without hiding the catalog from indexing", async ({ request }) => {
  for (const path of ["/", "/recipes", "/become-a-client", "/become-a-coach"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["x-frame-options"]).toBe("DENY");
    expect(response.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(response.headers()["permissions-policy"]).toBe("camera=(), microphone=(), geolocation=()");
    expect(response.headers()["x-robots-tag"]).toBeUndefined();
  }
});

test("account, auth, and API responses do not advertise indexing or send referrers", async ({ request, page }) => {
  for (const path of ["/account", "/login", "/auth/callback", "/api/leads"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    expect(response.headers()["referrer-policy"]).toBe("no-referrer");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  }
  await page.goto("/login");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
});

test("homepage leads to samples and separates planned enterprise capabilities", async ({ page }, testInfo) => {
  await page.goto("/");
  const hero = page.locator("#hero");
  await expect(hero.getByRole("heading", { level: 1 })).toHaveText("Train the world's AI agents.");
  await expect(hero.getByRole("link", { name: "Explore Recipes", exact: true })).toHaveAttribute("href", "/recipes");
  await expect(hero.getByText("Enterprise-ready", { exact: true })).toHaveCount(0);
  await expect(hero.getByText("Human review", { exact: true })).toBeVisible();
  const enterprise = page.locator("#enterprise");
  await expect(enterprise).toContainText("Planned capabilities, not a live deployment service.");
  await expect(enterprise).toContainText("role-based access, and internal integrations are not available yet.");
  await expect(enterprise.getByRole("link", { name: "Discuss a private workflow", exact: true }))
    .toHaveAttribute("href", "/become-a-client#client-access");
  await hero.getByRole("link", { name: "Explore Recipes", exact: true }).click();
  await expect(page).toHaveURL(/\/recipes$/);
  await expect(page.getByRole("status")).toHaveText("6 sample recipes");
  await page.screenshot({ path: testInfo.outputPath("catalog-entry.png") });
});

test("contact forms describe the data boundary before any personal workflow details", async ({ page }, testInfo) => {
  for (const kind of ["client", "coach"]) {
    await page.goto(`/become-a-${kind}`);
    const form = page.locator("form");
    await expect(form).toHaveAccessibleDescription(/Do not include patient records, financial account details, passwords, or confidential documents/);
    const notice = form.getByText(/Describe the workflow at a high level/);
    await expect(notice).toBeVisible();
    await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute("required", "");
    if (kind === "coach") {
      await expect(page.getByText(/Publishing, rankings, paid access/)).toBeVisible();
    } else {
      await expect(page.getByText(/It does not provision a private agent/)).toBeVisible();
    }
    await notice.scrollIntoViewIfNeeded();
    await expect(form).toHaveCSS("opacity", "1");
    await expect(page.locator("section").filter({ has: form })).toHaveCSS("opacity", "1");
    await page.screenshot({ path: testInfo.outputPath(`${kind}-data-boundary.png`) });
  }
});
