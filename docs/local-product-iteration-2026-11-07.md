# Local Product Iteration

Date: 2026-11-07. Scope: this repository only. No push, merge, provider changes,
production environment changes, or fabricated identity/privacy policy.

## Assessment

The previous eight-module previews, URL-backed catalog filters, and recipe-aware
client request remain useful. Keep the dark visual identity, industry structure,
and existing pages. Do not expand into a dashboard or more industry pages yet.

Two gaps are worth addressing before expanding the product:

1. Capability claims are ahead of implementation. The hero's Enterprise-ready
   badge and enterprise conversion copy can imply a working deployment service,
   while the catalog correctly labels every entry as an unverified sample.
   Long application fields also do not warn against sending sensitive records.
2. A useful preview cannot be revisited by recipe-specific URL or taken away as
   a complete sample system. This limits the inspection-to-discussion workflow.

## Round 1: Trust Boundaries

- [x] Keep the requested hero headline/subheadline, direct the primary action to
  the catalog, and replace unsupported readiness badges with system properties.
- [x] Distinguish planned enterprise/private capabilities, publishing, rankings,
  and monetization from the current sample/request product. Keep the enterprise
  narrative and a working request link.
- [x] Both detailed forms explain what not to submit before the input fields.
  The notice is an operational data-minimization instruction, not an invented
  privacy policy, legal agreement, or security/compliance certification.
- [x] Verify basic response protections and no-index/no-referrer headers on
  account/auth/API paths against the running production build. Preserve existing
  no-index page metadata and server identity checks.

Round 1's eight production-browser checks passed across desktop and mobile.
The headers are basic browser response controls, not a full CSP, hosting/RLS
review, or compliance certification. No-index is not an access-control mechanism.

## Round 2: Portable Sample Recipes

- [x] A known recipe can be opened by catalog URL and survives refresh and
  browser history navigation. Invalid/duplicate slugs never open another recipe.
  Closing the preview preserves catalog filters and restores keyboard focus.
- [x] Explicit user actions copy a recipe-only link or download a versioned JSON
  sample with all eight modules, unverified status, human review requirement,
  risk boundary, and proposed-not-live deployment status.
- [x] Export only public catalog data. Do not include form contents, auth state,
  query searches, credentials, fake creators, live execution, or licensing claims.
- [x] Desktop/mobile browser regressions, unit tests, lint, production build,
  and client-bundle checks pass. Inspect screenshots of the changed surfaces.

Round 2: 22 catalog/sharing production-browser checks pass and 73 unit/integration
tests pass. Downloads and links contain public blueprint data only.

A full regression also exposed a queued native dialog `close` event racing a
forward navigation. Explicit user close actions are now handled synchronously;
history-driven closes cannot initiate another history traversal. The final suite
includes five back/forward/double-Escape cycles in each viewport. URL assertions
compare parsed query parameters rather than assuming parameter order.

## Round 3: Reflow And Final Regression

Why now: the new notices and preview actions must remain usable on narrower
phones, not just the existing 390px test viewport. Finish with the complete suite
before adding any more functionality.

- [x] At 320px, existing public pages have no horizontal document overflow or
  clipped headings/buttons. The preview fits and its three icon targets are at
  least 44px. The recipe-to-client form retains its context and data notice.
- [x] The full verification sequence passes, including existing lead/auth
  journeys, and restores the ordinary production build after fixture tests.
- [x] Inspect current-run desktop/mobile screenshots and record evidence limits.

## Round 4: Isolate Fixture Assets

The last normal-build guard caught fixture markers while another local test app
was listening on the test ports. Client assets changed under the running preview.
Do not certify whichever output happens to win a shared-directory race.

- [x] Test build/start and the fixture bundle guard use `.next-e2e`; ordinary
  builds keep `.next`. The test flag exists only in local child processes.
- [x] Generated fixture output is ignored by Git and ESLint. Real configuration
  tests cover the default, explicit test flag, and an unrelated flag value.
- [x] The complete verification sequence passes after isolation. Ordinary client
  assets pass the normal-build guard with the fixture directory still present.

## Results Before Build Isolation

`PLAYWRIGHT_BROWSERS_PATH=0 npm run verify` exits successfully:

- ESLint passes.
- 73 unit/integration tests pass across six files.
- Full dependency audit: zero vulnerabilities.
- 53 production-browser tests pass; one mobile-only navigation test is
  intentionally skipped on desktop.
- The ordinary production build is restored after fixture-backed tests.
- The normal-build client guard passes on 20 JavaScript files.

An earlier full run stopped because the local fixture health port was occupied.
It still restored the ordinary build. No unknown process was killed, and no
reuse/bypass was enabled. After confirming both test ports were free, the full
sequence passed. This was a local runner interruption, not an application pass.

Another earlier run reported the dialog-history defect and trace/fixture runner
failures. Those runs were not counted as passing. After the dialog fix, the
sharing regression and then the complete verification sequence passed; the
final results above reflect the complete successful run.

Current desktop/390px/320px screenshots were inspected. The preview, copy result,
clipboard fallback, form notices, and narrow-screen handoff remain readable and
within the viewport. Screenshots and traces are repository-local ignored artifacts
in `test-results/`. Reflow, focus, and header checks do not constitute a complete
accessibility or security certification. Browser coverage remains Chromium only.

The final visual pass rejected a form screenshot captured before its entrance
animation. The capture test now waits for both the form and containing section
to reach full opacity. All eight targeted trust-boundary checks passed after
that test-only correction; the ordinary build and normal client-bundle guard
were restored again. Application code did not change after the full passing run.
The in-app browser host was unavailable at final handoff; visual evidence comes
from the inspected current Chromium test screenshots, not a claimed live IAB check.

## Final Results After Isolation

The final `PLAYWRIGHT_BROWSERS_PATH=0 npm run verify` exits successfully:

- ESLint and the ordinary production build pass.
- 76 unit/integration tests pass across seven files.
- 53 production-browser tests pass; the one desktop skip remains intentional.
- Full dependency audit: zero vulnerabilities.
- Both the normal-build guard and isolated test-build guard pass on 20 JavaScript
  files each, including while the fixture app is running. Test output remains
  separate rather than overwriting ordinary production assets.
- Generated fixture assets are ignored. Next.js added its isolated type-output
  includes to `tsconfig.json`; the final ordinary build restores `next-env.d.ts`.
- The fixture services exit. A normal local preview remains on `127.0.0.1:3200`.

This local verification does not confirm live provider delivery, real accounts,
database RLS, expert validation, or release readiness.

## Changed Areas

- `next.config.ts`: browser protections and auth/account/API indexing/referrer
  boundaries plus a local-only fixture output directory, without changing normal
  hosting output or production variables.
- `LandingPage`, `landing-data`, `SiteFooter`, and the existing client/coach
  pages: sample-first discovery and explicit planned-capability boundaries.
- `LeadFormShell`: accessible data-minimization notice before detailed fields.
- `RecipeCatalog` and `recipe-catalog`: allowlisted selection and preview history
  that preserve existing search/filter state and keyboard focus.
- `RecipePreview` and new `recipe-sample`: icon actions, safe clipboard fallback,
  and an eight-module, non-executable public JSON blueprint.
- Catalog/sample unit tests and new trust-boundary/sharing/reflow browser tests:
  real production-app regressions using disposable local providers only.
- Test startup/bundle-check scripts, Git/ESLint ignores, generated type includes,
  and build-isolation unit tests: separate fixture and ordinary client assets.
- README and this review: package contract, setup, boundaries, and results.

No pages, dependencies, runtime providers, database schema, production settings,
or credentials were added or changed in this iteration. Existing unrelated and
previous-round working-tree changes were preserved. Work remains local and
uncommitted on the existing feature branch; no push or merge was performed.

## Stopping Decision

These four bounded rounds complete the local discovery, inspection, portable
sample, request journey, and build isolation. More catalog features would get ahead of evidence
again. Prioritize expert review of the six samples and real provider/identity/
privacy acceptance before ranking, payments, publishing, or private execution.
Those require owner decisions or live services and are not simulated here.

## Owner Boundary

Live account/provider delivery and intended Supabase/RLS setup still require the
real services. Industry-professional review of sample content and the company's
actual identity/privacy/data-retention decisions remain prerequisites to release.
No local test constitutes a professional review or a live deployment guarantee.

## Next Stage Acceptance

1. Real intake/auth verification comes before public acquisition. Acceptance:
   one authorized real account signs in and out, a synthetic lead persists once,
   actual mailbox receipt is observed, and anon/authenticated clients cannot read
   leads in the intended Supabase project. Requires owner access/configuration.
2. Professional sample validation comes before rankings or paid access.
   Acceptance: real, authorized industry reviewers exercise representative inputs
   and record evaluation results, failure modes, and risk boundaries. Do not
   invent reviewer identities or reviews; samples remain unverified meanwhile.
3. Collection/release prerequisites come before launch. Acceptance: the owner
   supplies the true company/contact identity and data-use/retention decisions,
   provides reviewed privacy material, and explicitly authorizes external release.
   No simulated deployment or invented policy substitutes for these gates.
