import { setTimeout as delay } from "node:timers/promises";

const [originArg, expected, mode, ...extra] = process.argv.slice(2);

function readOrigin(value) {
  const url = URL.parse(value ?? "");
  if (!url || url.pathname !== "/" || url.username || url.password || url.search || url.hash) return null;
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  return url.protocol === "https:" || (url.protocol === "http:" && loopback) ? url.origin : null;
}

const origin = readOrigin(originArg);
if (!origin || !expected || !/^[a-f0-9]{40}$/.test(expected) || (mode !== undefined && mode !== "--catalog") || extra.length) {
  console.error("Usage: npm run check:release -- <https-origin> <full-git-sha> [--catalog]");
  process.exit(1);
}

const targets = [{ path: "/" }, { path: "/recipes" }];
if (mode === "--catalog") {
  const { agentRecipes } = await import("../src/lib/recipes-data.ts");
  const { recipeShareImagePath } = await import("../src/lib/recipe-share-image.ts");
  for (const { slug } of agentRecipes) {
    const samplePath = `/recipes/samples/${encodeURIComponent(slug)}`;
    targets.push({
      path: samplePath,
      type: "application/json",
      disposition: `attachment; filename="agentcoach-${slug}-sample-v1.json"`,
    }, {
      path: `${samplePath}/brief`,
      type: "text/markdown",
      disposition: `attachment; filename="agentcoach-${slug}-sample-v1.md"`,
    }, { path: recipeShareImagePath(slug), type: "image/png" });
  }
}

async function requestHeaders(path) {
  const request = (timeout) => fetch(new URL(path, origin), {
    redirect: "manual",
    signal: AbortSignal.timeout(timeout),
  });
  try {
    return await request(8_000);
  } catch {
    console.warn(`WARN ${path}: no HTTP response; retrying once.`);
    await delay(250);
    return request(4_000).catch(() => null);
  }
}

for (const { path, type, disposition } of targets) {
  const response = await requestHeaders(path);
  if (!response) {
    console.error(`FAIL ${path}: no HTTP response after two attempts.`);
    process.exitCode = 1;
    continue;
  }

  // This command verifies headers, not the body; the browser tests check the files.
  await response.body?.cancel().catch(() => {});
  const actual = response.headers.get("x-agentcoach-revision");
  if (response.status !== 200 || actual !== expected) {
    const reported = actual && /^[a-f0-9]{40}$/.test(actual) ? actual : "unavailable";
    console.error(`FAIL ${path}: HTTP ${response.status}, expected ${expected}, revision ${reported}.`);
    process.exitCode = 1;
    continue;
  }

  const mediaType = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (type && mediaType !== type) {
    console.error(`FAIL ${path}: expected Content-Type ${type}.`);
    process.exitCode = 1;
    continue;
  }
  if (disposition && response.headers.get("content-disposition") !== disposition) {
    console.error(`FAIL ${path}: expected the catalog attachment filename.`);
    process.exitCode = 1;
    continue;
  }
  console.log(`PASS ${path}: HTTP 200, revision ${actual}.`);
}
