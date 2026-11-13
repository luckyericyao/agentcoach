# Local Intake Hardening

Scope: the current checkout only. No push, merge, hosted migration, actual
account use, provider changes, production credentials, or legal text.

Follow-up: the [admission verification record](local-admission-verification-2026-11-07.md)
adds native multi-connection evidence, bounded waits, and the third migration.
Use the current README for the rollout order.

## Assessment

The existing product direction is sound: the homepage leads to inspectable,
portable sample recipes, and requests retain recipe context. The previous
[local product iteration](local-product-iteration-2026-11-07.md) also isolated
fixture builds from ordinary builds. More catalog features are lower priority
than preventing public intake from outrunning its storage and permission checks.

The existing rate limit was per-process and trusted forwarded IPs. A process
restart or another app instance did not share that state. The previous HTTP
fixtures also did not execute the real database migration or enforce privileges.

## Goal 1: Prove The Storage Contract

First because changes to intake must preserve existing leads and deny public
access before adding more behavior. Acceptance:

- [x] Run the migration on a fresh PostgreSQL database and the previous README
  schema; reapplying the fresh migration works and the legacy lead is retained.
- [x] Anonymous and ordinary authenticated roles cannot select, insert, update,
  or delete leads, even after a legacy anonymous policy existed.
- [x] The service role can store and update notifications; duplicate IDs fail.

PGlite is an exact-version dev dependency, not a production database change. The
checks run PostgreSQL in process and do not use credentials, a port, or a hosted
service. They do not verify the roles configured in an actual Supabase project.

## Goal 2: Share The Admission Limit

Next because more than one app instance can receive requests. Acceptance:

- [x] A service-role-only admission function checks a rolling three-per-email
  hourly limit and thirty-per-minute site limit before inserting a new lead.
  Existing rows provide the counters; no IP or new personal data is persisted.
- [x] Quota reads and insertion run under one transaction lock with fresh
  snapshots. The local SQL test checks that the lock is held and released on
  rollback, and rejects non-READ-COMMITTED calls instead of silently miscounting.
- [x] Existing IDs are returned before counting new submissions. Payload changes
  on a reused ID still produce 409, and saved/notification outcomes remain
  distinct. Expired windows reopen without a scheduled cleanup process.
- [x] Missing migration or provider failures return a safe 503 without direct
  insert fallback. A quota rejection returns 429 and a bounded `Retry-After`,
  with no persisted row or notification for that attempt.
- [x] Verify desktop/mobile form behavior plus the complete local regression,
  normal production build, and dependency/client bundle checks.

The function is a storage ceiling for upgraded app instances, not a complete
spam or denial-of-service defense. Older app instances and maintenance inserts
do not use the function. It does not verify email ownership. Embedded PostgreSQL
uses a single connection, so the local test does not certify hosted concurrency.

## Verification

`PLAYWRIGHT_BROWSERS_PATH=0 npm run verify` passed: lint, 85 unit/integration
checks across eight files, full dependency audit (zero vulnerabilities), 55
production-browser checks, and the normal production build/client-bundle guard.
One mobile-only navigation test is intentionally skipped on desktop. The six
embedded SQL checks execute the migration files; the HTTP fixtures separately
exercise the app's provider contract. Desktop/mobile quota checks confirm that
429 preserves input, does not show a receipt, and allows an unchanged retry
with the same request ID after the fixture quota is cleared.

Changes are limited to the admission migration, existing lead handler, test
fixtures and regression tests, one test-only dependency, and documentation.
No runtime dependency, page, auth behavior, or notification provider changed.
Existing working-tree edits remain intact. No commit, push, merge, or hosted
change was performed.

## Owner Acceptance Before Release

1. Apply both migrations in order to an approved staging database before
   enabling the updated app. Review index creation timing. Confirm the server
   role can call `accept_lead_v1` and public roles cannot call it or read leads.
2. From separate app instances using that database, use synthetic requests to
   verify the shared quota under concurrent arrivals and an identical retry at
   quota. No excess saved rows and no notifications for rejected admissions.
3. Verify actual mailbox receipt, real account sign-in/out, and trusted edge
   limits. Confirm company/contact identity, data handling and retention, privacy
   materials, and explicit release authorization. No fake provider, expert,
   privacy, or compliance result substitutes for these checks.

The prior app can still use the existing table during a rollback; that version
does not enforce the new shared admission limit. Do not drop or rewrite stored
lead data as an automatic rollback step.
