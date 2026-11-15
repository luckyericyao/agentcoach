import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cwd = fileURLToPath(new URL("../", import.meta.url));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const env = { ...process.env, AGENTCOACH_TEST_BUILD: "1" };
for (const script of ["build", "check:client-bundle"]) {
  const args = ["run", script, ...(script === "check:client-bundle" ? ["--", "--test-build"] : [])];
  const result = spawnSync(npm, args, { cwd, stdio: "inherit", env, shell: process.platform === "win32" });
  if (result.error || result.status !== 0) process.exit(result.status || 1);
}
const server = spawn(npm, ["run", "start", "--", "--hostname", "127.0.0.1", "--port", "3100"],
  { cwd, stdio: "inherit", env, shell: process.platform === "win32" });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.kill(signal));
server.on("error", () => { process.exitCode = 1; });
server.on("exit", (code) => { process.exitCode = code ?? 0; });
