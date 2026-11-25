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
  for (const { slug, name } of agentRecipes) {
    const samplePath = `/recipes/samples/${encodeURIComponent(slug)}`;
    targets.push({
      path: samplePath,
      type: "application/json",
      disposition: `attachment; filename="agentcoach-${slug}-sample-v1.json"`,
      sample: { slug, name },
    }, {
      path: `${samplePath}/brief`,
      type: "text/markdown",
      disposition: `attachment; filename="agentcoach-${slug}-sample-v1.md"`,
      sample: { slug, name },
    }, { path: recipeShareImagePath(slug), type: "image/png" });
  }
}

const attachmentLimit = 64 * 1024;
const moduleKeys = [
  "systemInstruction", "workflow", "inputTemplate", "outputFormat",
  "requiredTools", "evaluationCriteria", "riskBoundary", "deploymentOption",
];

async function readAttachment(response) {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let size = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return text + decoder.decode();
      size += value.byteLength;
      if (size > attachmentLimit) return null;
      text += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}

function matchesSampleJson(text, { slug, name }) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return false;
  }
  return data?.kind === "agentcoach.sample-recipe"
    && data.schemaVersion === 1 && data.slug === slug && data.name === name
    && data.review?.status === "unverified" && data.review.humanReviewRequired === true
    && data.review.executionAvailable === false
    && data.modules && moduleKeys.every((key) => Object.hasOwn(data.modules, key))
    && data.modules.deploymentOption?.status === "proposed"
    && data.modules.deploymentOption.runtimeConnected === false;
}

function matchesSampleBrief(text, { name }) {
  const lines = text.split(/\r?\n/);
  return lines[0] === `# ${name}`
    && lines.some((line) => line.startsWith("> **Unverified sample.** ") && line.includes("human review"))
    && lines.includes("## Risk boundary")
    && lines.some((line) => line.startsWith("**Proposed only.** "));
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

async function checkResponse(response, { type, disposition, sample }) {
  const actual = response.headers.get("x-agentcoach-revision");
  if (response.status !== 200 || actual !== expected) {
    const reported = actual && /^[a-f0-9]{40}$/.test(actual) ? actual : "unavailable";
    return `HTTP ${response.status}, expected ${expected}, revision ${reported}.`;
  }

  const mediaType = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (type && mediaType !== type) return `expected Content-Type ${type}.`;
  if (disposition && response.headers.get("content-disposition") !== disposition) {
    return "expected the catalog attachment filename.";
  }
  if (!sample) return null;

  let text;
  try {
    text = await readAttachment(response);
  } catch {
    return "could not read the UTF-8 attachment body.";
  }
  if (text === null) return "attachment exceeds 64 KiB.";
  const matches = type === "application/json" ? matchesSampleJson(text, sample) : matchesSampleBrief(text, sample);
  return matches ? null : "attachment body does not match the public sample contract.";
}

for (const target of targets) {
  const response = await requestHeaders(target.path);
  const failure = response ? await checkResponse(response, target) : "no HTTP response after two attempts.";
  await response?.body?.cancel().catch(() => {});
  if (failure) {
    console.error(`FAIL ${target.path}: ${failure}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS ${target.path}: HTTP 200, revision ${expected}.`);
  }
}
