import { expect, test } from "@playwright/test";
import { industries } from "../../src/lib/industries-data";
import { publicSiteOrigin } from "../../src/lib/public-site";
import { agentRecipes } from "../../src/lib/recipes-data";

test("public discovery lists canonical pages and preserves private noindex headers", async ({ page, request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(robots.headers()["content-type"]).toContain("text/plain");
  expect((await robots.text()).split(/\r?\n/)).toContain(`Sitemap: ${publicSiteOrigin}/sitemap.xml`);

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()["content-type"]).toContain("xml");
  const urls = await page.evaluate((source) => {
    const xml = new DOMParser().parseFromString(source, "application/xml");
    return Array.from(xml.getElementsByTagNameNS("http://www.sitemaps.org/schemas/sitemap/0.9", "loc"))
      .map((node) => node.textContent);
  }, await sitemap.text());
  const paths = ["/", "/recipes", ...industries.map(({ slug }) => `/industries/${slug}`)];
  expect(urls).toEqual(paths.map((path) => new URL(path, publicSiteOrigin).href));

  const canonical = page.locator('link[rel="canonical"]');
  for (const path of paths) {
    expect((await page.goto(path))?.status()).toBe(200);
    await expect(canonical).toHaveJSProperty("href", new URL(path, publicSiteOrigin).href);
  }
  await page.goto("/recipes?q=meeting&industry=biotech-pharma&recipe=biotech-bd-meeting-prep-agent");
  await expect(canonical).toHaveJSProperty("href", `${publicSiteOrigin}/recipes`);
  await expect(page.getByRole("dialog", { name: "Biotech BD Meeting Prep Agent" })).toBeVisible();

  for (const path of ["/login", "/account", "/auth/callback", "/api/leads"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.headers()["x-robots-tag"], path).toBe("noindex, nofollow");
  }
});

test("recipe share crawlers receive sample metadata without visitor filters", async ({ page, request }) => {
  const scenarios = [
    ...agentRecipes.map(({ slug, name, shortDescription }) => ({
      query: `recipe=${slug}&q=not-part-of-the-share&industry=biotech-pharma`,
      title: `${name} | AgentCoach`,
      description: `Illustrative sample, not a live agent. ${shortDescription}`,
      path: `/recipes?recipe=${slug}`,
    })),
    ...["q=not-part-of-the-share", "recipe=unknown", `recipe=${agentRecipes[0].slug}&recipe=${agentRecipes[0].slug}`]
      .map((query) => ({
        query,
        title: "Agent Recipes | AgentCoach",
        description: "Browse reusable expert workflows that combine instruction, workflow, evaluation, risk boundaries, and deployment logic.",
        path: "/recipes",
      })),
  ];

  for (const { query, title, description, path } of scenarios) {
    const response = await request.get(`/recipes?${query}`, { headers: { "User-Agent": "Slackbot-LinkExpanding 1.0" } });
    expect(response.status()).toBe(200);
    const metadata = await page.evaluate((html) => {
      const { head } = new DOMParser().parseFromString(html, "text/html");
      const og = (name: string) => head.querySelector(`meta[property="og:${name}"]`)?.getAttribute("content");
      return {
        title: og("title"),
        description: og("description"),
        url: og("url"),
        canonical: head.querySelector('link[rel="canonical"]')?.getAttribute("href"),
      };
    }, await response.text());
    expect(metadata, query).toEqual({
      title, description, url: new URL(path, publicSiteOrigin).href, canonical: `${publicSiteOrigin}/recipes`,
    });
  }
});
