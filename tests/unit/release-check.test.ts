import { execFile } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import { promisify } from "node:util";
import { expect, it } from "vitest";
import { agentRecipes } from "@/lib/recipes-data";

const exec = promisify(execFile);

it.each([
  { failure: "connection interruption", disconnects: 1, status: 200, wrongSha: false, attempts: 2, error: "" },
  { failure: "persistent connection interruption", disconnects: 2, status: 200, wrongSha: false, attempts: 2, error: "no HTTP response after two attempts" },
  { failure: "HTTP 503", disconnects: 0, status: 503, wrongSha: false, attempts: 1, error: "HTTP 503" },
  { failure: "wrong revision", disconnects: 0, status: 200, wrongSha: true, attempts: 1, error: `revision ${"b".repeat(40)}` },
])("checks the response contract after $failure", async ({ disconnects, status, wrongSha, attempts, error }) => {
  const revision = "a".repeat(40);
  let homeRequests = 0;
  const server = createServer((request, response) => {
    const home = request.url === "/";
    if (home && ++homeRequests <= disconnects) {
      response.destroy();
      return;
    }
    response.writeHead(home ? status : 200, { "X-AgentCoach-Revision": home && wrongSha ? "b".repeat(40) : revision });
    response.end();
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  try {
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Fixture did not bind to TCP");
    const args = ["scripts/check-release.mjs", `http://127.0.0.1:${address.port}`, revision];
    const check = exec(process.execPath, args, { timeout: 8000 });
    if (error) {
      await expect(check).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining(error) });
    } else {
      await expect(check).resolves.toMatchObject({
        stdout: expect.stringContaining(`PASS /: HTTP 200, revision ${revision}.`),
        stderr: expect.stringContaining("retrying once"),
      });
    }
    expect(homeRequests).toBe(attempts);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

it("fails a catalog check for a broken asset even if both HTML pages serve the expected revision", async () => {
  const revision = "a".repeat(40);
  const broken = `/recipes/share-image/${agentRecipes[0].slug}`;
  const wrongFilename = `/recipes/samples/${agentRecipes[0].slug}/brief`;
  const methods = new Set<string>();
  const server = createServer((request, response) => {
    if (request.method) methods.add(request.method);
    const path = request.url ?? "";
    const sample = path.startsWith("/recipes/samples/");
    const brief = sample && path.endsWith("/brief");
    const image = path.startsWith("/recipes/share-image/");
    response.setHeader("X-AgentCoach-Revision", revision);
    response.setHeader("Content-Type", brief ? "text/markdown" : sample ? "application/json" : image && path !== broken ? "image/png" : "text/html");
    if (sample) {
      const slug = path.split("/")[3];
      const extension = brief && path !== wrongFilename ? "md" : "json";
      response.setHeader("Content-Disposition", `attachment; filename="agentcoach-${slug}-sample-v1.${extension}"`);
    }
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
    const failedCheck = exec(process.execPath, [...args, "--catalog"], { timeout: 8000 });
    await expect(failedCheck).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining(`FAIL ${broken}: expected Content-Type image/png.`),
    });
    await expect(failedCheck).rejects.toMatchObject({
      stderr: expect.stringContaining(`FAIL ${wrongFilename}: expected the catalog attachment filename.`),
    });
    expect([...methods]).toEqual(["GET"]);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
