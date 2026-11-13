import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { relative, resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const testBuild = process.argv.includes("--test-build");
if (testBuild && process.argv.includes("--normal-build")) {
  console.error("Choose a test-build check or a normal-build check, not both.");
  process.exit(1);
}
const directory = resolve(root, testBuild ? ".next-e2e/static" : ".next/static");
const forbidden = [
  "SUPABASE_SERVICE_ROLE_KEY", "RESEND_API_KEY", "NOTIFICATION_TO_EMAIL", "NOTIFICATION_FROM_EMAIL",
  "fixture-service-role", "re_fixture_only",
];
if (process.argv.includes("--normal-build")) forbidden.push("fixture-anon", "http://127.0.0.1:4319");
const matches = [];
let checked = 0;
async function inspect(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const file = resolve(path, entry.name);
    if (entry.isDirectory()) await inspect(file);
    else if (/\.(?:js|map)$/.test(entry.name)) {
      checked += 1;
      const source = await readFile(file, "utf8");
      if (forbidden.some((marker) => source.includes(marker))) matches.push(relative(root, file));
    }
  }
}
try {
  await inspect(directory);
  if (!checked) throw new Error("No client JavaScript found. Run the production build first.");
  if (matches.length) throw new Error(`Server-only or fixture secret markers found in: ${matches.join(", ")}`);
  console.log(`Client bundle check passed (${checked} files; no server-only or fixture secret markers).`);
} catch (error) {
  console.error(error instanceof Error ? error.message : "Client bundle check failed.");
  process.exitCode = 1;
}
