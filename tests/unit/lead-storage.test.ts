import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import { describe, expect, it } from "vitest";

const storageMigration = readFileSync(new URL("../../supabase/migrations/202611060001_leads.sql", import.meta.url), "utf8");
const admissionMigration = readFileSync(new URL("../../supabase/migrations/202611070001_lead_admission.sql", import.meta.url), "utf8");
const lockTimeoutMigration = readFileSync(new URL("../../supabase/migrations/202611070002_lead_lock_timeout.sql", import.meta.url), "utf8");
const preflightSql = readFileSync(new URL("../../supabase/checks/lead-intake-preflight.sql", import.meta.url), "utf8");
const fixtureId = "33333333-3333-4333-8333-333333333333";

async function withDatabase(check: (db: PGlite) => Promise<void>) {
  const db = await PGlite.create();
  try {
    await db.exec("create role anon; create role authenticated; create role service_role bypassrls;");
    await check(db);
  } finally {
    await db.close();
  }
}

async function asRole(db: PGlite, role: "anon" | "authenticated" | "service_role", check: () => Promise<void>) {
  await db.exec(`set role ${role}`);
  try { await check(); }
  finally { await db.exec("reset role"); }
}

async function expectPrivateLeads(db: PGlite) {
  const catalog = await db.query("select relrowsecurity from pg_class where oid = 'public.leads'::regclass");
  expect(catalog.rows).toEqual([{ relrowsecurity: true }]);
  for (const role of ["anon", "authenticated"] as const) {
    await asRole(db, role, async () => {
      for (const statement of ["select * from public.leads", "insert into public.leads (lead_type, email) values ('waitlist', 'blocked@example.test')",
        "update public.leads set email = 'blocked@example.test'", "delete from public.leads"]) {
        await expect(db.query(statement)).rejects.toMatchObject({ code: "42501" });
      }
    });
  }
}

describe("lead storage migration on local PostgreSQL", () => {
  it("creates a private table, supports the service role, and prevents duplicate IDs", async () => {
    await withDatabase(async (db) => {
      await db.exec(storageMigration);
      await db.exec(storageMigration);
      await expectPrivateLeads(db);
      await asRole(db, "service_role", async () => {
        const insert = "insert into public.leads (id, lead_type, email) values ($1, 'waitlist', 'local@example.test') returning notification_status";
        expect((await db.query(insert, [fixtureId])).rows).toEqual([{ notification_status: "pending" }]);
        await expect(db.query(insert, [fixtureId])).rejects.toMatchObject({ code: "23505" });
        await db.query("update public.leads set notification_status = 'sent', notification_id = 'local-mail' where id = $1", [fixtureId]);
        expect((await db.query("select notification_status, notification_id from public.leads where id = $1", [fixtureId])).rows)
          .toEqual([{ notification_status: "sent", notification_id: "local-mail" }]);
      });
    });
  }, 20_000);

  it("upgrades the previous README table and revokes legacy public access without losing records", async () => {
    await withDatabase(async (db) => {
      await db.exec(`
        create table public.leads (
          id uuid primary key default gen_random_uuid(),
          lead_type text not null check (lead_type in ('waitlist', 'client', 'coach')),
          name text, email text not null, company text, role text, industry text,
          expertise_area text, linkedin_or_website text, improvement_goal text,
          recipe_interest text, team_size text, message text, source text,
          created_at timestamptz default now()
        );
        alter table public.leads enable row level security;
        grant select, insert, update, delete on public.leads to public, anon, authenticated;
        create policy legacy_anon_insert on public.leads for insert to anon with check (true);
      `);
      await asRole(db, "anon", async () => {
        await db.query("insert into public.leads (id, lead_type, email, message) values ($1, 'waitlist', 'legacy@example.test', 'keep this record')", [fixtureId]);
      });
      await db.exec(storageMigration);
      await db.exec(admissionMigration);
      await db.exec(lockTimeoutMigration);
      await expectPrivateLeads(db);
      await asRole(db, "service_role", async () => {
        expect((await db.query("select email, message, notification_status, notification_id from public.leads where id = $1", [fixtureId])).rows)
          .toEqual([{ email: "legacy@example.test", message: "keep this record", notification_status: "pending", notification_id: null }]);
        expect(await admit(db, "legacy@example.test", fixtureId)).toMatchObject({ outcome: "replayed", lead: { id: fixtureId } });
      });
    });
  }, 20_000);
});

async function withAdmission(check: (db: PGlite) => Promise<void>) {
  await withDatabase(async (db) => {
    await db.exec(storageMigration);
    await db.exec(admissionMigration);
    await db.exec(lockTimeoutMigration);
    await check(db);
  });
}

async function admit(db: PGlite, email: string, id = randomUUID(), extra: Record<string, unknown> = {}) {
  const { rows } = await db.query<{ outcome: string; lead: Record<string, unknown> | null; retry_after: number | null }>(
    "select * from public.accept_lead_v1($1::uuid, $2::jsonb)",
    [id, JSON.stringify({ lead_type: "waitlist", source: "homepage", ...extra, email })],
  );
  expect(rows).toHaveLength(1);
  return rows[0];
}

describe("shared lead admission on local PostgreSQL", () => {
  it("allows only the service role and does not accept caller-controlled storage metadata", async () => {
    await withAdmission(async (db) => {
      await db.exec(admissionMigration);
      await db.exec(lockTimeoutMigration);
      for (const role of ["anon", "authenticated"] as const) {
        await asRole(db, role, async () => {
          await expect(admit(db, "denied@example.test")).rejects.toMatchObject({ code: "42501" });
        });
      }
      await asRole(db, "service_role", async () => {
        const result = await admit(db, "  LOCAL@EXAMPLE.TEST ", fixtureId, {
          id: randomUUID(), created_at: "2000-01-01T00:00:00Z", notification_status: "sent", notification_id: "forged",
        });
        expect(result).toMatchObject({ outcome: "inserted", retry_after: null,
          lead: { id: fixtureId, email: "local@example.test", notification_status: "pending", notification_id: null } });
        expect(new Date(String(result.lead?.created_at)).getTime()).toBeGreaterThan(Date.now() - 60_000);
      });
    });
  }, 20_000);

  it("limits new IDs per normalized email across lead types, while preserving replays and expiry", async () => {
    await withAdmission(async (db) => {
      const email = "quota@example.test";
      await asRole(db, "service_role", async () => {
        expect((await admit(db, email, fixtureId)).outcome).toBe("inserted");
        expect((await admit(db, ` ${email.toUpperCase()} `, randomUUID(), { lead_type: "client" })).outcome).toBe("inserted");
        expect((await admit(db, email, randomUUID(), { lead_type: "coach" })).outcome).toBe("inserted");
        const rejected = await admit(db, email);
        expect(rejected).toMatchObject({ outcome: "rate-limited", lead: null });
        expect(rejected.retry_after).toBeGreaterThan(3500);
        expect(rejected.retry_after).toBeLessThanOrEqual(3600);
        expect(await admit(db, email, fixtureId)).toMatchObject({ outcome: "replayed", lead: { id: fixtureId } });
        expect((await admit(db, "other@example.test")).outcome).toBe("inserted");
        expect((await db.query("select count(*)::int as total from public.leads")).rows).toEqual([{ total: 4 }]);
        await db.query("update public.leads set created_at = clock_timestamp() - interval '61 minutes' where id = $1", [fixtureId]);
        expect((await admit(db, email)).outcome).toBe("inserted");
      });
    });
  }, 20_000);

  it("bounds total intake across distinct emails and allows new requests after the rolling window", async () => {
    await withAdmission(async (db) => {
      await asRole(db, "service_role", async () => {
        expect((await admit(db, "quota-0@example.test", fixtureId)).outcome).toBe("inserted");
        for (let i = 1; i < 30; i += 1) {
          expect((await admit(db, `quota-${i}@example.test`)).outcome).toBe("inserted");
        }
        const rejected = await admit(db, "overflow@example.test");
        expect(rejected).toMatchObject({ outcome: "rate-limited", lead: null });
        expect(rejected.retry_after).toBeGreaterThan(0);
        expect(rejected.retry_after).toBeLessThanOrEqual(60);
        expect((await admit(db, "quota-0@example.test", fixtureId)).outcome).toBe("replayed");
        expect((await db.query("select count(*)::int as total from public.leads")).rows).toEqual([{ total: 30 }]);
        await db.query("update public.leads set created_at = clock_timestamp() - interval '61 seconds' where id = $1", [fixtureId]);
        expect((await admit(db, "overflow@example.test")).outcome).toBe("inserted");
      });
    });
  }, 20_000);

  it("rolls back admission together with its row and rejects incompatible isolation", async () => {
    await withAdmission(async (db) => {
      await asRole(db, "service_role", async () => {
        await db.exec("begin isolation level repeatable read");
        try { await expect(admit(db, "rollback@example.test", fixtureId)).rejects.toMatchObject({ code: "0A000" }); }
        finally { await db.exec("rollback"); }
        await db.exec("begin");
        const locks = "select count(*)::int as total from pg_locks where locktype = 'advisory' and granted and pid = pg_backend_pid()";
        try {
          expect((await admit(db, "rollback@example.test", fixtureId)).outcome).toBe("inserted");
          expect((await db.query(locks)).rows).toEqual([{ total: 1 }]);
        }
        finally { await db.exec("rollback"); }
        expect((await db.query(locks)).rows).toEqual([{ total: 0 }]);
        expect((await db.query("select count(*)::int as total from public.leads")).rows).toEqual([{ total: 0 }]);
        expect((await admit(db, "rollback@example.test", fixtureId)).outcome).toBe("inserted");
      });
    });
  }, 20_000);
});

async function preflight(db: PGlite) {
  await db.exec("begin read only");
  try {
    const { rows } = await db.query<{ check_name: string; passed: boolean }>(preflightSql);
    expect(rows).toHaveLength(8);
    return Object.fromEntries(rows.map(({ check_name, passed }) => [check_name, passed]));
  } finally { await db.exec("rollback"); }
}

describe("read-only lead intake preflight", () => {
  it("flags missing migrations and passes only after the timeout migration is applied", async () => {
    await withDatabase(async (db) => {
      expect(await preflight(db)).toMatchObject({ leads_columns: false, admission_function: false, service_role_access: false });
      await db.exec(storageMigration);
      expect(await preflight(db)).toMatchObject({ leads_columns: true, admission_function: false, quota_indexes: false });
      await db.exec(admissionMigration);
      expect(await preflight(db)).toMatchObject({ leads_rls: true, quota_indexes: true, admission_function: false });
      await db.exec(lockTimeoutMigration);
      expect(await preflight(db)).toEqual({
        admission_function: true, anon_blocked: true, authenticated_blocked: true, lead_id_primary_key: true,
        leads_columns: true, leads_rls: true, quota_indexes: true, service_role_access: true,
      });
    });
  }, 20_000);

  it("detects column grants, function grants, missing indexes and lost RLS without returning row contents", async () => {
    await withAdmission(async (db) => {
      await db.query("insert into public.leads (lead_type, email) values ('waitlist', 'private-marker@example.test')");
      await db.exec(`
        grant select(email) on public.leads to anon;
        grant execute on function public.accept_lead_v1(uuid, jsonb) to authenticated;
        alter table public.leads disable row level security;
        drop index public.leads_intake_email_recent_idx;
        revoke update on public.leads from service_role;
      `);
      const checks = await preflight(db);
      expect(checks).toMatchObject({ anon_blocked: false, authenticated_blocked: false, leads_rls: false,
        quota_indexes: false, service_role_access: false });
      expect(JSON.stringify(checks)).not.toContain("private-marker");
    });
  }, 20_000);
});
