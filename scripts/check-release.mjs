const [originArg, expected, ...extra] = process.argv.slice(2);

function readOrigin(value) {
  const url = URL.parse(value ?? "");
  if (!url || url.pathname !== "/" || url.username || url.password || url.search || url.hash) return null;
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  return url.protocol === "https:" || (url.protocol === "http:" && loopback) ? url.origin : null;
}

const origin = readOrigin(originArg);
if (!origin || !expected || !/^[a-f0-9]{40}$/.test(expected) || extra.length) {
  console.error("Usage: npm run check:release -- <https-origin> <full-git-sha>");
  process.exit(1);
}

for (const path of ["/", "/recipes"]) {
  let response;
  try {
    response = await fetch(new URL(path, origin), {
      redirect: "manual",
      signal: AbortSignal.timeout(12_000),
    });
    await response.body?.cancel();
  } catch {
    console.error(`FAIL ${path}: request failed.`);
    process.exitCode = 1;
    continue;
  }

  const actual = response.headers.get("x-agentcoach-revision");
  if (response.status !== 200 || actual !== expected) {
    const reported = actual && /^[a-f0-9]{40}$/.test(actual) ? actual : "unavailable";
    console.error(`FAIL ${path}: HTTP ${response.status}, expected ${expected}, revision ${reported}.`);
    process.exitCode = 1;
  } else {
    console.log(`PASS ${path}: HTTP 200, revision ${actual}.`);
  }
}
