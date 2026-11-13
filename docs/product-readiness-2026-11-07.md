# Product Readiness Review

Date: 2026-11-07. Scope: this checkout only; no push, release, credentials, or live provider changes.

## Assessment

The previous reliability pass is intact: 55 tests, lint, and the production build
pass before this round. The current dark identity and industry organization can
stay. The largest product gap is that visitors cannot inspect the recipe systems
advertised by the site: catalog cards end at "Detail page coming soon", despite
existing input/tool/evaluation data. The homepage also calls its now-functional
waitlist a static form.

Next work should connect discovery, inspection, and a specific access request.
Sample content must remain explicitly illustrative and unverified. Real coach
credentials, rankings, live execution, pricing, and enterprise capabilities cannot
be represented as completed without the corresponding product and evidence.

## Goals And Acceptance

- [x] Inspectable recipe previews. First because inspection is the product's
  value demonstration. All six samples expose instruction, workflow, input
  template, output format, tools, evaluation, risk boundary, and deployment plans.
  Homepage previews work too. Native modal behavior supports keyboard focus,
  Escape, and focus restoration. Catalog search/filters/reset work, preserve URL
  state across refresh/back, and explain empty results without fake verification.
- [x] Recipe-to-client handoff. Next because an interested visitor should not
  have to re-enter which workflow they want. A known recipe pre-fills editable
  industry/goal fields and its visible context is included in the existing lead
  payload. Invalid/duplicate query values fall back to a normal request. No new
  database columns or public execution endpoints are needed.
- [x] Production regression coverage. Before calling the experience ready,
  browser tests must run the optimized app, using isolated local fixtures and
  dummy keys only. Desktop/mobile previews, filtering/history, request handoff,
  and all existing lead/auth journeys pass; lint/build stay green. Automation is
  repository code only and is not run on a remote service in this round.
- [x] Compatible development-dependency repair. Remaining audit findings are
  confined to the ESLint/minimatch chain. Accept a supported upstream update or
  a tightly scoped, tested repair; do not force-downgrade Next's lint config.
  Record the final full audit and checks, including any unresolved limitations.

## Dependency Result

The nested minimatch dependency used by `@typescript-eslint/typescript-estree`
is pinned to 11.0.1 with a scoped npm override. Runtime dependencies and Next's
16.4.5 lint configuration are unchanged. The consumed API is minimatch's named
matching function with `dot: true`. A regression test exercises the real ESLint
project-service allowlist path, including an allowed and a rejected file.
The full audit reports zero vulnerabilities and 64 unit/integration checks pass.

## Product Results

The six samples now contain all eight modules, including explicit instructions,
workflow steps, and output-format contracts. One native dialog component serves
both the homepage and catalog. It keeps focus within the preview, closes on Escape
or the close button, and returns focus to its trigger. All content remains marked
as an unverified sample; there is no new detail page or live agent execution.

Search, industry, maturity, featured, and verified filters are URL-backed, with
an explicit empty state and reset. Controls update immediately while the Next.js
URL transition settles, then reconcile back/forward changes. Filtered results are
also server-rendered for the initial request.

A known recipe link pre-fills the client's editable industry and goal, shows its
name in the form, and includes that name in the existing `recipe_interest` field.
Unknown or repeated recipe values fall back to the general form. The shared form
labels were separated from their controls so pre-filled textarea content cannot
become part of a label lookup. Homepage access copy now reflects the actual form.

These paths pass 12 production-browser checks across desktop and mobile.

## Final Verification

`PLAYWRIGHT_BROWSERS_PATH=0 npm run verify` exits successfully. It runs:

- ESLint against the repository.
- 64 unit/integration tests, including the typed-lint compatibility check.
- Full `npm audit`: zero vulnerabilities, including development dependencies.
- 33 production-build browser journeys across desktop and mobile. One additional
  mobile-menu test is deliberately skipped on desktop.
- A normal production rebuild after the fixture-configured browser run.
- The client-bundle guard in normal-build mode: 20 JavaScript files pass, with
  no private configuration names, fixture secret markers, or public fixture
  provider markers in the resulting client assets.

Desktop/mobile catalog, preview, and request screenshots were inspected. Native
dialog screenshots use the viewport so the top-layer geometry is represented
correctly. All existing lead/auth journeys continue to pass against `next start`.
The tests use local provider fixtures only; no live account or delivery is implied.

Implementation areas changed this round:

- `src/lib/recipes-data.ts` and `recipe-catalog.ts`: eight-module samples and
  bounded, allowlisted URL filtering/search.
- `src/components/recipes/RecipePreview.tsx` and `RecipeCatalog.tsx`: a shared
  native preview dialog, working catalog controls, reset, and empty states.
- `src/components/landing/LandingPage.tsx` and `src/lib/landing-data.ts`:
  inspectable featured samples and corrected early-access copy.
- `/recipes`, `/become-a-client`, and `ClientLeadForm`: request-aware rendering,
  known-recipe prefill, a direct form anchor, and visible/persisted recipe intent.
- `LeadFormShell` and global styles: independent control labels, dialog backdrop,
  stable scroll geometry, and background-scroll locking.
- `scripts/`, Playwright configuration, and new unit/browser tests: repeatable
  local production verification and fixture-build restoration.
- `package.json`, the lockfile, README, and this review: a scoped development
  dependency repair and setup/acceptance documentation.

The work remains uncommitted in the existing working tree. No push, merge, remote
PR action, production configuration change, or live database change was made.

## Owner-Dependent Work

Real provider login/delivery, applying SQL/RLS in the intended Supabase project,
company identity and privacy/data-retention decisions, and any external release
remain owner tasks. This round does not change notification providers, create
fake industry-professional profiles, or claim that sample recipes are validated
or executable. Ranking, payments, publishing, and full workspaces remain deferred.
