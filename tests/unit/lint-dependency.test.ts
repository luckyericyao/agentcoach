import { resolve } from "node:path";
import { ESLint } from "eslint";
import { expect, it } from "vitest";

it("retains TypeScript ESLint default-project glob matching after the scoped dependency repair", async () => {
  const eslint = new ESLint({
    cwd: process.cwd(),
    overrideConfig: [{
      files: ["**/*.mjs"],
      languageOptions: { parserOptions: {
        tsconfigRootDir: process.cwd(),
        projectService: { allowDefaultProject: ["*.mjs"] },
      } },
    }],
  });
  const [allowed] = await eslint.lintText("export const probe = 1;", { filePath: resolve("eslint.config.mjs") });
  expect(allowed.fatalErrorCount).toBe(0);
  const [outside] = await eslint.lintText("export const probe = 1;", { filePath: resolve("tests/fixtures/outside-project.mjs") });
  expect(outside.fatalErrorCount).toBe(1);
  expect(outside.messages[0].message).toContain("not found by the project service");
}, 15_000);
