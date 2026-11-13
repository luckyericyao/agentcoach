# Local Admission Verification

Scope: the current AgentCoach checkout. No hosted access or migration, real
account activity, production settings, provider changes, publication, or push.

## Assessment

Recipe discovery and the request flow are sufficient for early feedback. Keep
the product scope and complete evidence for intake reliability before adding
marketplace features. The previous SQL tests proved migrations and permissions
on an embedded single connection, not how the quota behaves during contention.
The API bounded input size but not the time spent waiting on an unfinished body.

## Goal 1: Verify Real Concurrency

First because the shared quota depends on independent transactions seeing fresh
state after the lock. Acceptance: observe a waiting session, exercise commit and
rollback, verify one saved row for eight concurrent uses of one ID, and verify
30 admissions from 40 requests across eight independent connections.

- [x] Run the actual migrations against a native PostgreSQL 18.6 process.
- [x] Both commit and rollback visibility cases pass.
- [x] The same-ID burst and shared site quota pass.

The optional `npm run test:postgres` runner is isolated in an ignored directory.
It uses a new authenticated loopback cluster with generated test credentials,
checks its data directory before executing SQL, and removes its own data after
shutdown. It does not accept or use a hosted database URL.

## Goal 2: Bound Stalled Waits

Next because a request can otherwise wait before quota admission, or pile up
behind a held database lock. Acceptance: a real chunked HTTP request receives
408 after the five-second body-read deadline without writing or notifying; a
contended PostgreSQL lock times out, and an unchanged retry can succeed.

- [x] Native lock timeout returns `55P03` without persisting a row.
- [x] The API maps that outcome to 503 with `Retry-After: 2` and no notification.
- [x] Production-mode HTTP checks confirm 408 on a stalled chunked body.
- [x] Oversized and timed-out bodies do not wait for an unresponsive stream
  cancellation hook. The reader is released.

The new migration sets a per-lock deadline; it does not bound total request time
or replace edge abuse controls. The previous migration files are preserved.

## Goal 3: Make Staging Checks Repeatable

Before a real rollout, the owner needs to distinguish a missing migration from a
permission error without selecting or changing lead data. Acceptance: the read-only
preflight returns eight named booleans and flags missing migrations, a missing quota
index, column or function grants, disabled RLS, and missing service-role privileges.

- [x] Embedded PostgreSQL tests verify the passing and failing scenarios.
- [x] Run the preflight as part of the native regression and finish full app verification.

## Final Verification

- `npm run test:postgres` passed all six scenarios, including the eight preflight
  booleans, using PostgreSQL 18.6 and eight independent application-role connections.
- `PLAYWRIGHT_BROWSERS_PATH=0 npm run verify` passed: lint, 90 unit/integration
  tests, 57 production-mode browser tests, normal build, and client-bundle checks.
  One mobile-only navigation test is intentionally skipped on desktop. The app's
  dependency audit found zero vulnerabilities.
- Normal build artifacts are separate from fixtures. The temporary database and
  fixture processes are stopped. Changes remain uncommitted in this checkout.

Changed areas: request body guard, lead API error handling, one additive SQL
migration, read-only SQL preflight, optional native test script, fixtures and
regression tests, and documentation. Existing pages, providers, migration files,
and other working-tree changes were preserved.

## Owner-Dependent Next Stage

On an approved staging project, apply all three migrations in order, then require
all eight preflight checks to pass. From separately running app instances, submit
synthetic requests via the real REST gateway and confirm the shared limits and
same-ID retry. Verify actual mail receipt and real sign-in/out separately. Local
PostgreSQL validates concurrency on this engine, not the hosted project's roles,
REST schema cache, network, or delivery. Public intake also needs the actual
company/contact details and reviewed privacy/retention decisions.
