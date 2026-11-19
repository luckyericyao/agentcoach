import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { fixtureIsOrphaned, watchFixtureParent } from "../tests/fixtures/parent-lifetime.mts";

const cwd = fileURLToPath(new URL("../", import.meta.url));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const env = { ...process.env, AGENTCOACH_TEST_BUILD: "1" };
for (const script of ["build", "check:client-bundle"]) {
  if (fixtureIsOrphaned()) process.exit(0);
  const args = ["run", script, ...(script === "check:client-bundle" ? ["--", "--test-build"] : [])];
  const result = spawnSync(npm, args, { cwd, stdio: "inherit", env, shell: process.platform === "win32" });
  if (result.error || result.status !== 0) process.exit(result.status || 1);
}
if (fixtureIsOrphaned()) process.exit(0);

const next = createRequire(import.meta.url).resolve("next/dist/bin/next");
const server = spawn(process.execPath, [next, "start", "--hostname", "127.0.0.1", "--port", "3100"],
  { cwd, stdio: "inherit", env });
watchFixtureParent(() => {
  server.kill("SIGTERM");
  const timeout = setTimeout(() => server.kill("SIGKILL"), 2000);
  timeout.unref();
  server.once("exit", () => clearTimeout(timeout));
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.kill(signal));
server.on("error", () => { process.exitCode = 1; });
server.on("exit", (code) => { process.exitCode = code ?? 0; });
