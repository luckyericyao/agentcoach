import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cwd = fileURLToPath(new URL("../", import.meta.url));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
function run(args, env = process.env) {
  const result = spawnSync(npm, args, { cwd, stdio: "inherit", env, shell: process.platform === "win32" });
  return !result.error && result.status === 0;
}

let passed = true;
for (const args of [["run", "lint"], ["test"]]) {
  if (!run(args)) { passed = false; break; }
}
if (passed) {
  // Independently check the ordinary production build after the isolated fixture run.
  try {
    passed = run(["run", "test:e2e"], { ...process.env, AGENTCOACH_TEST_PUBLIC_PREVIEW: "" });
    const previewPassed = run(["run", "test:e2e", "--", "--output=test-results/public-preview"], {
      ...process.env, AGENTCOACH_TEST_PUBLIC_PREVIEW: "1",
    });
    passed = passed && previewPassed;
  }
  finally {
    const built = run(["run", "build"]);
    const checked = built && run(["run", "check:client-bundle", "--", "--normal-build"]);
    // Registry failures must not prevent us from collecting local check results.
    const audited = run(["audit"]);
    passed = passed && checked && audited;
  }
}
process.exitCode = passed ? 0 : 1;
