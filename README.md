# AgentCoach

AgentCoach is an early-stage product website for a public network and future marketplace of expert-built AI Agent Recipes. Agent Recipes are complete expert workflow systems, not simple prompts: they combine instruction, workflow, input templates, output formats, tools, evaluation, risk boundaries, and deployment logic.

The site supports two primary paths:

- Become a Coach: experts package professional workflows into reusable Agent Recipes.
- Become a Client: individuals, teams, and enterprises use Agent Recipes or deploy private AI coaches.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React icons
- Supabase for lead storage and authentication
- Resend for lead notification emails

## Routes

- `/` - Premium homepage with Agent Recipe positioning, conversion paths, industries, featured recipes, use cases, enterprise narrative, and waitlist.
- `/become-a-coach` - Coach application page for experts and creators.
- `/become-a-client` - Client access page, optionally pre-filled from a selected sample recipe.
- `/industries/[slug]` - Data-driven industry detail pages for all six industries.
- `/recipes` - Searchable sample catalog with URL-backed filters and same-page recipe previews.
- `/login` - Supabase magic-link login foundation.
- `/account` - Server-verified early access account with sign out.
- `/auth/callback` - PKCE exchange or email-link confirmation, then a fixed redirect to `/account` on success.
- `/api/leads` - Server-side lead capture route that writes to Supabase and sends Resend notifications.

## Recipe Previews And Requests

All six catalog entries are illustrative, unverified samples. Homepage and catalog
previews expose system instruction, workflow steps, input template, output format,
required tools, evaluation criteria, risk boundary, and a proposed deployment path.
No recipe execution, certification, purchase, or new detail page is implied.

The homepage's primary action opens this catalog. Private deployment, team roles,
internal integrations, publishing, rankings, and monetization are described as
planned capabilities, not services provisioned by the current site.

A recipe-specific URL opens its full preview, for example:

```text
/recipes?recipe=biotech-bd-meeting-prep-agent
```

Known single slugs only are accepted. Catalog filters remain intact when opening
and closing the preview, including browser back/forward. Copying a recipe link
uses only the recipe slug, never a visitor's search or other query parameters.
If clipboard access is blocked, a read-only selectable URL is shown instead.

Each preview also downloads a public JSON sample with `kind` set to
`agentcoach.sample-recipe` and `schemaVersion` set to `1`. The package contains
all eight modules, explicit unverified/human-review flags, and a proposed (not
live) deployment path. It is a portable blueprint, not an executable agent or a
runtime import format. The version denotes the sample schema, not an expert
certification or a content release. No account/form state or credentials enter
the export. No creator identity, license, or deployment support is invented.

Catalog filters are stored in the URL: `q`, `industry`, `maturity`, `featured=1`,
and `verified=1`. They survive refresh and browser back/forward navigation; the
server also renders filtered results before JavaScript runs. The verified filter
currently has an explicit empty state because no sample is independently verified.

A recipe-specific link opens the same preview, without a separate detail page:

```text
/recipes?recipe=biotech-bd-meeting-prep-agent
```

Only one known slug opens a preview. Refresh and browser back/forward preserve
selection; closing returns to the catalog and keeps its filters. The copy action
shares the recipe-only URL, not search terms or filter state. If clipboard access
is unavailable, the preview exposes a selectable read-only link instead.

The download action produces a JSON sample using `schemaVersion: 1`, containing
all eight modules, unverified status, human-review requirements, and explicit
proposed/not-live deployment status. It exports only public blueprint fields;
form inputs, authentication state, presentation fields, and URL searches are not
included. It does not execute an agent or grant access to integrations. `v1`
identifies the package schema, not a verified content revision. Links resolve the
current catalog content; a downloaded file is a snapshot of that sample.

The preview's request link leads to:

```text
/become-a-client?recipe=biotech-bd-meeting-prep-agent#client-access
```

Only a known, single recipe slug is accepted. Its name is visible in the form,
industry and improvement goal are editable, and the existing `recipe_interest`
lead field carries the selected recipe name. Unknown or repeated values fall back
to the general client form. No additional table or account is required.

## Environment Variables

Public variables can be exposed to the browser:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Server-only variables must never use `NEXT_PUBLIC_`:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
NOTIFICATION_TO_EMAIL=founder_or_team_email@example.com
NOTIFICATION_FROM_EMAIL=AgentCoach <notifications@your-verified-domain.com>
```

Use `.env.example` as the variable inventory; put actual local values in the ignored `.env.local`. Server secrets must remain unprefixed. Never commit credentials.

Without Supabase server configuration, lead forms show a temporary-unavailability message. Without Resend configuration, the lead is still saved and the visitor sees a notification-delay notice. Login reports unavailability gracefully. These states do not certify a live provider connection.

## Supabase Setup

Review and apply the migrations in order in an owner-approved staging project
before releasing the updated app:

1. [`202611060001_leads.sql`](supabase/migrations/202611060001_leads.sql) creates
   `public.leads` or upgrades the previous README table without deleting records.
2. [`202611070001_lead_admission.sql`](supabase/migrations/202611070001_lead_admission.sql)
   adds indexed quotas and the service-role-only `accept_lead_v1` function.
3. [`202611070002_lead_lock_timeout.sql`](supabase/migrations/202611070002_lead_lock_timeout.sql)
   bounds lock waits in that function without changing stored rows.

The local checks have not applied any migration to a hosted project. Run the
[read-only intake preflight](supabase/checks/lead-intake-preflight.sql) in approved
staging after all three migrations. All eight checks should report `passed = true`;
the query returns no lead records. This checks the database structure and grants,
not whether the hosted REST service is configured correctly. If the admission
function is absent or unavailable, the form returns a retryable 503; it never
falls back to an unrestricted insert.

The table contains `id`, `lead_type`, `name`, `email`, `company`, `role`, `industry`, `expertise_area`, `linkedin_or_website`, `improvement_goal`, `recipe_interest`, `team_size`, `message`, `source`, and `created_at`, plus:

| Column | Purpose |
| --- | --- |
| `notification_status` | `pending`, `sent`, `failed`, or `not-configured` |
| `notification_id` | Resend's accepted-message ID, when available |

RLS is enabled and table access is revoked from both `anon` and `authenticated`. All writes and operational reads go through server-only code using the service role. No public insert or select policy is needed. Signing in does not grant access to other visitors' leads.

If an older version used `waitlist`, `coach_leads`, or `client_leads`, those tables are not automatically migrated or deleted. Review any real records separately.

## Lead Submission Behavior

The server accepts JSON bodies up to 16 KiB, checks field types/lengths and required client/coach fields, derives the source from `lead_type`, and rejects cross-site browser submissions. Reading the body has a five-second deadline; stalled requests return 408 before storage. Network/provider exceptions produce public-safe responses.

Client and coach forms ask for a high-level workflow description and explicitly
discourage patient records, financial account details, credentials, and confidential
documents before the fields. This operational notice is not a privacy policy or
consent agreement; company identity and data-retention decisions still need the owner.

Each form attempt gets a UUID sent as `Idempotency-Key` and stored as `leads.id`. Retrying an unchanged form before reloading reuses the ID; an edit creates a new attempt. Database uniqueness prevents duplicate records for the same ID. An ID reused with different data is rejected. After saved success, fields and submission are locked, including when email notification is delayed.

Notifications use the stable provider key `lead/<id>`. `sent` means Resend accepted the request, not verified inbox delivery. A failed or unconfigured notification returns HTTP 202 with a saved-request warning; it does not turn a persisted lead into a failed submission. Failed attempts can be retried with the original ID for 23 hours. Older ambiguous notifications require owner review because Resend's [deduplication window is 24 hours](https://resend.com/docs/dashboard/emails/idempotency-keys).

There is no scheduled retry worker or delivery webhook yet. The owner can inspect unsent leads in Supabase:

```sql
select id, lead_type, created_at, notification_status
from public.leads
where notification_status <> 'sent'
order by created_at;
```

Lead intake uses two layers:

- A cheap in-memory guard allows five attempts per minute per forwarded client
  key and caps stored keys at 1,000. It is per process and depends on a trusted
  proxy overwriting client-supplied forwarding headers.
- The database admits up to three new requests per normalized email in a rolling
  hour and thirty new requests across the site in a rolling minute. These are
  early-access defaults. All upgraded app instances using the same database
  share the limits, regardless of forwarded IP headers or process restarts.
  Replays are looked up before the database quota check and do not add a row.
  A rejected request returns 429 with `Retry-After` and sends no notification.

The function uses `READ COMMITTED` and a transaction-level lock so quota checks
and insertion are serialized together. Lock waits in the function are limited to
two seconds per lock acquisition. A lock timeout returns 503 with `Retry-After: 2`
without saving or notifying; the same request ID can be retried. Quota checks
use existing lead rows and do not store IPs or separate contact identifiers.
Direct maintenance inserts and older
app versions bypass this admission path. Apply the migration before upgrading
the app and verify the hosted function and permissions in staging. These caps
bound stored submissions; they do not verify email ownership or replace trusted
edge rate limits and anti-abuse controls before public acquisition.

Detailed request forms ask for high-level workflow descriptions and explicitly
warn against submitting patient records, financial account details, credentials,
or confidential documents. This is a data-minimization instruction, not a privacy
policy or a compliance claim. The actual company identity, handling/retention
decisions, and privacy text still require the owner before public lead collection.

## Browser Response Boundaries

The app sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and
`Referrer-Policy: strict-origin-when-cross-origin`. Camera, microphone, and
geolocation are disabled through `Permissions-Policy`; the current site uses
none of them. Account, login, auth, and API paths additionally use `no-referrer`
and `X-Robots-Tag: noindex, nofollow`. Existing account/login metadata also stays
no-index. Robots directives are not access control: `/account` continues to
require independently verified server identity.

These are baseline browser protections, not a security/compliance certification,
complete CSP, durable abuse protection, or a substitute for actual provider/RLS
verification. No production domain, HSTS policy, or external service is assumed.

## Supabase Auth Setup

1. In Supabase, enable Email provider authentication.
2. Keep magic-link login enabled and set the Site URL to the actual app origin.
3. Add local and deployed redirect URLs, for example:
   - `http://localhost:3000/auth/callback`
   - Your deployed origin followed by `/auth/callback`
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` locally and in Vercel.

The app uses Supabase's [cookie-based App Router pattern](https://supabase.com/docs/guides/auth/server-side/creating-a-client). `/auth/callback` exchanges a PKCE code for a session and always returns to `/account`; arbitrary redirect destinations are ignored. The account proxy refreshes cookies, and the server page independently calls `getUser()` before rendering an email. Auth responses are not publicly cached. Older browser-local sessions require a fresh sign-in after this change.

For email links that may open in a different browser, the callback also supports the official token-hash flow. Set the Supabase Magic Link email template link to:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email">Sign in to AgentCoach</a>
```

Opening this token-hash link sets a five-minute, HTTP-only confirmation cookie
and redirects to `/login` without the hash in the new URL. GET and HEAD do not
redeem the hash. The confirmation button submits a same-origin POST with the
matching challenge, works without JavaScript, and clears the pending cookie
after the verification attempt. The existing PKCE code exchange is unchanged.
This protects the app's token-hash link from passive email scans; it cannot
protect a token already redeemed by the provider's default confirmation URL.

Keep the redirect allowlist narrow. Verify the template and SMTP delivery in the real project before release. Expired or invalid links return to a recoverable login error. Signing out targets this browser session. If the provider rejects revocation but the SDK already cleared local cookies, login shows a local-sign-out notice; otherwise the account shows a retryable error. Neither case claims to have signed out every device. The implementation does not add role management, payments, recipe publishing, or a dashboard.

## Resend Setup

1. Create a Resend account.
2. Verify a sending domain or sender address.
3. Create a Resend API key.
4. Set `RESEND_API_KEY` as a server-only environment variable.
5. Set `NOTIFICATION_FROM_EMAIL` to the verified sender.
6. Set `NOTIFICATION_TO_EMAIL` to the inbox that should receive new AgentCoach lead alerts.

Notification emails include lead ID/type, name, email, company, role, industry, relevant form fields, notes, source, and timestamp. Secrets are never included. Resend notification setup is separate from the Supabase Auth email/SMTP configuration.

## Local Development

Use Node.js 24 LTS for the included local checks and native TypeScript test fixtures.

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run checks:

```bash
npm run lint
npm test
npm run test:e2e
npm run build
npm audit --omit=dev
```

Run the full local verification sequence with:

```bash
PLAYWRIGHT_BROWSERS_PATH=0 npm run verify
```

It runs lint, unit/integration tests, a full dependency audit, production-browser
journeys, and a normal production build with the client-bundle guard. The fixture
app uses a separate `.next-e2e` build directory, leaving ordinary `.next` client
assets separate. The final build also refreshes Next's generated type references,
even when a browser assertion fails. It does not push or deploy anything.

`npm test` covers validation, streaming limits, rate limits, provider failure/retry
behavior, account protection, auth callbacks, refresh cookies, catalog selection,
and the public sample-export contract. HTTP integration tests use local fixture
providers. `npm test -- tests/unit/lead-storage.test.ts` runs the actual SQL
migrations against in-memory [PGlite](https://pglite.dev/docs/about), a test-only
PostgreSQL engine. It checks fresh/legacy migration, permissions, rolling quotas,
replays, and transaction rollback without credentials or a database service.
This embedded test does not exercise parallel connections or hosted Supabase roles.

For changes to admission and locking, run the optional native PostgreSQL check:

```bash
npm install --prefix node_modules/.cache/agentcoach-postgres --no-save \
  --package-lock=false --ignore-scripts --cache node_modules/.cache/npm \
  embedded-postgres@18.6.0-beta.19
npm run test:postgres
```

This uses the platform-specific [Embedded Postgres runner](https://github.com/leinelissen/embedded-postgres)
in an ignored directory, without adding it to the app's dependencies. It creates
a disposable, authenticated loopback cluster under that directory, applies the
SQL, checks permissions, and exercises eight independent connections. It covers
commit/rollback visibility, duplicate IDs, the shared quota, and lock timeout
recovery. It does not accept a database URL or connect to a hosted project.

`npm run test:e2e` starts disposable local providers on `127.0.0.1:4319` and an optimized `next build` / `next start` test app on `127.0.0.1:3100`. It injects synthetic test credentials and `AGENTCOACH_TEST_BUILD=1` into those child processes, never changes a real `.env` file, and never calls real Supabase/Resend services. The flag selects `.next-e2e` for both build and start; do not set it in hosting or ordinary app environments. Keep these ports free and run only one browser suite per checkout at a time. Desktop/mobile traces and screenshots go to ignored `test-results/`. Use `npm run verify` or a normal build after a standalone browser run to restore generated type references; the fixture bundle no longer overwrites the ordinary production assets.

To keep the test browser installation inside this repository:

```bash
PLAYWRIGHT_BROWSERS_PATH=0 npm exec playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=0 npm run test:e2e
```

Local SQL, native concurrency, and HTTP fixture checks do not replace hosted
Supabase role, REST integration, or email-delivery tests.

Production browser checks include copy/download behavior and the blocked-clipboard
fallback, recipe permalinks/history/focus, response headers, planned-capability
copy, and data-minimization notices on desktop/mobile.

`npm run check:client-bundle` checks the generated `.next/static` JavaScript for
server-only environment names and known fixture secret markers. It does not print
secrets and is not a general certification that arbitrary credentials are absent.
Its `--normal-build` mode also rejects known public test-provider markers, so the
final verification cannot leave the local production bundle pointed at fixtures.
`--test-build` checks `.next-e2e/static` instead. The two modes cannot be combined.
Isolation prevents test credentials from overwriting a normal client build; it
does not allow concurrent test suites to share fixture state or ports.

The development-only minimatch override is scoped to the TypeScript ESLint
consumer and covered by an actual parser/project-service compatibility check.
Remove the override when upstream ships a fixed dependency range; do not force a
Next lint-config downgrade to satisfy an audit suggestion.

## Browser Response Boundaries

Application responses set MIME-sniffing and framing protections, a strict-origin
cross-origin referrer policy, and disable unused camera/microphone/geolocation
permissions. Account, login, auth callback, and API paths additionally set
`X-Robots-Tag: noindex, nofollow` and `Referrer-Policy: no-referrer`. Login/account
page metadata remains no-index, and auth/account protections still enforce server
identity and private caching behavior. No-index is not an access-control mechanism.

These are tested application headers, not a security/compliance certification or
a substitute for provider RLS, hosting controls, a full CSP review, or a real
privacy policy. No hosting configuration or production secrets are changed.

## Project Structure

```text
src/
  app/
    account/
    api/leads/
    auth/callback/
    become-a-client/
    become-a-coach/
    industries/[slug]/
    login/
    recipes/
    globals.css
    layout.tsx
    page.tsx
  components/
    auth/
    forms/
    landing/
    recipes/
  lib/
    email/
    leads/
    server/
    supabase/
    industries-data.ts
    landing-data.ts
    lead-submission.ts
    personas-data.ts
    recipes-data.ts
    recipe-catalog.ts
    use-cases-data.ts
  proxy.ts
supabase/migrations/
tests/
  e2e/
  fixtures/
  unit/
docs/engineering-review.md
docs/product-readiness-2026-11-07.md
docs/local-product-iteration-2026-11-07.md
scripts/
```

## Development Guardrails

- Do not rebuild the project from scratch.
- Preserve the Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion stack.
- Keep the visual direction premium, dark, cinematic, and enterprise-grade.
- Do not make AgentCoach look like a prompt marketplace, forum, or generic SaaS template.
- Do not expose server secrets to the browser.
- Prefer shared data files and reusable components over duplicated page content.
- Run `npm run lint` and `npm run build` before opening a PR.

## Deployment

This project uses the standard Next.js hosting model supported by Vercel and other compatible platforms.

For Vercel:

1. Import the GitHub repository.
2. Add all public and server-only environment variables.
3. Apply all reviewed Supabase migrations in order before deploying the app update. Run the read-only preflight and configure the deployed `/auth/callback` allowlist and email template.
4. Confirm Resend sender verification is complete.
5. Keep the default build command: `npm run build`.
6. Redeploy after setting or changing environment variables.

These are owner-operated deployment instructions; no deployment or production configuration is performed by the local checks. Before public lead collection, the owner must provide the actual company/contact identity and privacy/data-retention decisions. No legal policy is generated by this repository change. See the [admission verification record](docs/local-admission-verification-2026-11-07.md) and [product-readiness follow-up](docs/product-readiness-2026-11-07.md) for acceptance criteria and remaining owner-dependent verification.
