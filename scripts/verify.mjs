import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cwd = fileURLToPath(new URL("../", import.meta.url));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
function run(args) {
  const result = spawnSync(npm, args, { cwd, stdio: "inherit", env: process.env, shell: process.platform === "win32" });
  return !result.error && result.status === 0;
}

let passed = true;
for (const args of [["run", "lint"], ["test"], ["audit"]]) {
  if (!run(args)) { passed = false; break; }
}
if (passed) {
  // Independently check the ordinary production build after the isolated fixture run.
  try { passed = run(["run", "test:e2e"]); }
  finally {
    const built = run(["run", "build"]);
    const checked = built && run(["run", "check:client-bundle", "--", "--normal-build"]);
    passed = passed && checked;
  }
}
process.exitCode = passed ? 0 : 1;
