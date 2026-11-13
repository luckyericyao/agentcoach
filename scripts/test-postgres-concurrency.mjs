import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdtemp, readFile, realpath, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const tools = new URL("../node_modules/.cache/agentcoach-postgres/", import.meta.url);
const requireTool = createRequire(new URL("package.json", tools));
let runner;
try {
  runner = requireTool.resolve("embedded-postgres");
} catch {
  console.error("Install the optional local PostgreSQL runner as described in README.md.");
  process.exit(1);
}
if (process.getuid?.() === 0) throw new Error("Run the disposable database check as a non-root user.");

async function availablePort() {
  const socket = createServer();
  await new Promise((resolve, reject) => socket.once("error", reject).listen(0, "127.0.0.1", resolve));
  const { port } = socket.address();
  await new Promise((resolve, reject) => socket.close((error) => error ? reject(error) : resolve()));
  return port;
}

const { default: EmbeddedPostgres } = await import(pathToFileURL(runner).href);
const port = await availablePort();
const directory = await mkdtemp(fileURLToPath(new URL("run-", tools)));
const data = join(directory, "data");
// Keep the runner's generated password file inside the disposable workspace.
process.env.TMPDIR = process.env.TMP = process.env.TEMP = directory;
const cluster = new EmbeddedPostgres({
  databaseDir: data,
  port,
  user: `test_${randomBytes(8).toString("hex")}`,
  password: randomBytes(24).toString("hex"),
  authMethod: "scram-sha-256",
  autoRehydrateSymlinks: true,
  initdbFlags: ["--no-sync", "--locale=C", "--encoding=UTF8"],
  postgresFlags: ["-c", "listen_addresses=127.0.0.1", "-c", "unix_socket_directories=",
    "-c", "statement_timeout=10s", "-c", "idle_in_transaction_session_timeout=15s"],
  onLog: () => {},
});
const clients = [];
let started = false;

async function connect() {
  const client = cluster.getPgClient("postgres", "127.0.0.1");
  clients.push(client);
  await client.connect();
  return client;
}

async function admit(client, email, id = randomUUID()) {
  const { rows } = await client.query("select * from public.accept_lead_v1($1::uuid, $2::jsonb)",
    [id, { email, lead_type: "waitlist", source: "homepage" }]);
  assert.equal(rows.length, 1);
  return rows[0];
}

async function waitForAdvisoryLock(observer, pid) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const { rows: [row] } = await observer.query(
      "select exists (select 1 from pg_locks where locktype = 'advisory' and pid = $1 and not granted) as waiting", [pid]);
    if (row.waiting) return;
    await delay(10);
  }
  throw new Error("Expected a second PostgreSQL connection to wait on the admission lock.");
}

try {
  await cluster.initialise();
  await cluster.start();
  started = true;
  const admin = await connect();
  const { rows: [server] } = await admin.query("select current_setting('data_directory') as path, current_setting('server_version') as version");
  assert.equal(await realpath(server.path), await realpath(data), "Refusing to test against a database outside the disposable cluster");
  console.log(`Checking native PostgreSQL ${server.version} over independent local connections.`);

  await admin.query("create role anon; create role authenticated; create role service_role bypassrls;");
  for (const filename of ["202611060001_leads.sql", "202611070001_lead_admission.sql", "202611070002_lead_lock_timeout.sql"]) {
    await admin.query(await readFile(new URL(`../supabase/migrations/${filename}`, import.meta.url), "utf8"));
  }
  const { rows: checks } = await admin.query(await readFile(new URL("../supabase/checks/lead-intake-preflight.sql", import.meta.url), "utf8"));
  assert.equal(checks.length, 8);
  assert.deepEqual(checks.filter(({ passed }) => !passed), []);
  console.log("Pass: all eight schema and privilege preflight checks.");
  const workers = await Promise.all(Array.from({ length: 8 }, async () => {
    const client = await connect();
    await client.query("set role service_role");
    return client;
  }));
  const [holder, waiter] = workers;
  const { rows: [{ pid }] } = await waiter.query("select pg_backend_pid() as pid");
  const countRows = async () => (await admin.query("select count(*)::int as total from public.leads")).rows[0].total;

  for (const finish of ["commit", "rollback"]) {
    await admin.query("truncate public.leads");
    const email = "quota@example.test";
    await admit(holder, email);
    await admit(holder, email);
    await holder.query("begin");
    let pending;
    try {
      assert.equal((await admit(holder, email)).outcome, "inserted");
      pending = admit(waiter, ` ${email.toUpperCase()} `);
      void pending.catch(() => {});
      await waitForAdvisoryLock(admin, pid);
      await holder.query(finish);
      const result = await pending;
      assert.equal(result.outcome, finish === "commit" ? "rate-limited" : "inserted");
      if (finish === "commit") assert.ok(result.retry_after > 0 && result.retry_after <= 3600);
      assert.equal(await countRows(), 3);
    } finally {
      await holder.query("rollback");
      await pending?.catch(() => {});
    }
    console.log(`Pass: waiting admission sees the preceding transaction ${finish}.`);
  }

  await admin.query("truncate public.leads");
  const id = randomUUID();
  const duplicates = await Promise.all(workers.map((client) => admit(client, "duplicate@example.test", id)));
  assert.equal(duplicates.filter((result) => result.outcome === "inserted").length, 1);
  assert.equal(duplicates.filter((result) => result.outcome === "replayed" && result.lead.id === id).length, 7);
  assert.equal(await countRows(), 1);
  console.log("Pass: eight simultaneous submissions of one ID create one row.");

  await admin.query("truncate public.leads");
  const burst = (await Promise.all(workers.map(async (client, worker) => {
    const results = [];
    for (let index = worker; index < 40; index += workers.length) {
      results.push(await admit(client, `burst-${index}@example.test`));
    }
    return results;
  }))).flat();
  assert.equal(burst.filter((result) => result.outcome === "inserted").length, 30);
  assert.equal(burst.filter((result) => result.outcome === "rate-limited" && result.retry_after > 0 && result.retry_after <= 60).length, 10);
  assert.equal(await countRows(), 30);
  console.log("Pass: forty submissions across eight connections share the thirty-row site limit.");

  await admin.query("truncate public.leads");
  const retryId = randomUUID();
  await holder.query("begin");
  try {
    assert.equal((await admit(holder, "held@example.test")).outcome, "inserted");
    await assert.rejects(admit(waiter, "retry@example.test", retryId), { code: "55P03" });
    assert.equal(await countRows(), 0);
  } finally {
    await holder.query("rollback");
  }
  assert.equal((await admit(waiter, "retry@example.test", retryId)).outcome, "inserted");
  assert.equal(await countRows(), 1);
  console.log("Pass: lock timeout saves no row, and the same request succeeds after the lock clears.");
} finally {
  await Promise.allSettled(clients.map((client) => client.end()));
  if (started) await cluster.stop();
  await rm(directory, { recursive: true, force: true });
}
