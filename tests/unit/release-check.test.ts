import { execFile } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import { promisify } from "node:util";
import { expect, it } from "vitest";
import { agentRecipes } from "@/lib/recipes-data";

const exec = promisify(execFile);

it("fails a catalog check for a broken asset even if both HTML pages serve the expected revision", async () => {
  const revision = "a".repeat(40);
  const broken = `/recipes/share-image/${agentRecipes[0].slug}`;
  const methods = new Set<string>();
  const server = createServer((request, response) => {
    if (request.method) methods.add(request.method);
    const path = request.url ?? "";
    const sample = path.startsWith("/recipes/samples/");
    const image = path.startsWith("/recipes/share-image/");
    response.setHeader("X-AgentCoach-Revision", revision);
    response.setHeader("Content-Type", sample ? "application/json" : image && path !== broken ? "image/png" : "text/html");
    if (sample) response.setHeader("Content-Disposition", `attachment; filename="agentcoach-${path.split("/").at(-1)}-sample-v1.json"`);
    response.end();
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  try {
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Fixture did not bind to TCP");
    const args = ["scripts/check-release.mjs", `http://127.0.0.1:${address.port}`, revision];
    await expect(exec(process.execPath, args, { timeout: 8000 })).resolves.toMatchObject({
      stdout: expect.stringContaining(`PASS /recipes: HTTP 200, revision ${revision}.`),
    });
    await expect(exec(process.execPath, [...args, "--catalog"], { timeout: 8000 })).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining(`FAIL ${broken}: expected Content-Type image/png.`),
    });
    expect([...methods]).toEqual(["GET"]);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
