# AgentCoach Engineering Review

Date: 2026-11-06. Scope: local repository work only; no push or deployment.

Follow-up: the [2026-11-07 product review](product-readiness-2026-11-07.md) records
the working recipe previews, request handoff, production-browser checks, and the
subsequent repair of the development audit findings noted below.

## Assessment

The visual direction and industry/recipe content are established. The useful next
step is to make the existing lead and account journeys dependable before expanding
the catalog or building a dashboard. The current product is an early-access shell;
rankings, recipe execution, publishing, licensing, and enterprise deployment remain
future capabilities rather than working product features.

Baseline: lint and production build pass. Runtime dependency audit reports six
affected packages, including one critical and four high findings. The application
uses Next.js 16.2.7. Live provider configuration has not been verified.

## Goals And Acceptance

- [x] Repair known dependency vulnerabilities within the existing stack. First
  because the current Next.js release has published security fixes. Acceptance:
  production dependency audit has no high/critical findings, lint/build pass, and
  the lockfile records the repaired versions.
- [x] Make lead capture reliable. Before adding acquisition features, a submitted
  lead must not disappear or be duplicated by a retry. Acceptance: bounded JSON
  requests; server validation matches the forms; same request ID cannot create
  duplicate leads; persisted success is distinguished from notification failure;
  no internal errors or secrets reach the browser; forms lock after success;
  regression tests cover validation, provider failures, and retries.
- [x] Complete the authentication foundation. Accounts need verified server
  identity before storing any private work. Acceptance: cookie-based Supabase
  sessions, explicit login callback, session refresh, server-verified account
  access, safe failed-link recovery, and sign-out error handling. Local tests use
  fixtures, never real user accounts or production providers.
- [x] Finish mobile navigation and accessible feedback. Existing mobile navigation
  hides product links without a replacement. Acceptance: mobile menu exposes the
  primary routes, Escape closes it, keyboard focus remains visible, form outcomes
  are announced, long account emails wrap, and reduced-motion preferences stop
  decorative looping animation. Verify desktop and mobile in a real browser.

## Results

Next.js and its lint configuration are now 16.4.5; the App Router, React, Tailwind,
and Framer Motion remain in place. The [upstream security advisory](https://github.com/advisories/GHSA-2464-fhr4-w9xw)
documents one of the repaired runtime risks. Production dependency audit now
reports zero vulnerabilities. Eight moderate development-tool findings remain in
the TypeScript ESLint/minimatch dependency chain; the audit's force recommendation
would downgrade the Next lint configuration to 15.x and was not applied.

Validation:

- 55 unit/integration checks pass, including actual local HTTP traffic through
  the Supabase and Resend SDKs to fixture providers.
- 21 Chromium browser journeys pass across 1440x900 desktop and 390x844 mobile.
  One mobile-menu test is intentionally skipped in the desktop project.
- Browser coverage includes all three lead forms, rapid duplicate events,
  database retry IDs, delayed notifications, PKCE login, expired-cookie refresh,
  ignored forged cookie-user metadata, sign-out failure, invalid magic links,
  internal links, keyboard menu behavior, feedback focus, and reduced motion.
- Desktop/mobile screenshots were visually inspected. Browser tests wait for
  entrance animations before capturing the hero and login page.
- Lint, production build, and whitespace checks pass.

The browser suite found and fixed a framework-internal versus browser-facing
host mismatch in same-origin validation. Auth redirects now use fixed relative
locations so reverse-proxy hostnames cannot send visitors to the wrong origin.
It also caught a reduced-motion hydration mismatch and the Supabase SDK's local
cookie removal after failed remote sign-out; both flows now have consistent UI.

Implementation areas:

- `src/app/api/leads`, `src/lib/leads`, `src/lib/server`, and the email helper:
  bounded/validated input, persisted request IDs and notification outcomes.
- Existing lead forms and `useLeadSubmission`: shared submission logic,
  duplicate guards, locked success states, and accessible feedback.
- `src/lib/supabase`, `src/proxy.ts`, `/auth/callback`, `/account`, and auth
  components: cookie sessions and independently verified server identity.
- Landing navigation/motion, global focus styles, and main-content targets:
  complete mobile navigation and reduced-motion support.
- Supabase migration, `.env.example`, README, Vitest/Playwright fixtures/config,
  and lockfile: reproducible local setup and verification. Next.js also generated
  its current `AGENTS.md` guidance and `next-env.d.ts` references.

All work is local on `codex/product-site-foundation`. No commit, push, remote PR
change, production environment change, or database migration has been performed
in this round. Screenshots/traces and the installed test browser are ignored
repository-local artifacts.

## Deliberately Deferred

Recipe ranking, payments, publishing, saved recipes, workspace roles, and industry
expansion should follow a validated acquisition/authentication flow. Sample recipes
must stay clearly labeled as previews until a working recipe product exists.

## Owner-Dependent Launch Work

Eric must configure the actual Supabase project/schema and Auth redirects, verify
the Resend sender and receiving mailbox, provide the company's real identity and
privacy/data-retention decisions, and authorize any public release. Real lead
storage, mailbox delivery, and real-account sign-in cannot be certified by local
mocked tests. No legal text or company identity is supplied by this change.
