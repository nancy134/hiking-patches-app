# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev        # Start dev server with Turbopack at localhost:3000

# Production
npm run build      # Build for production
npm run start      # Start production server
```

There is no lint step. `package.json` still defines `"lint": "next lint"`, but ESLint
is not set up here — no config file and no `eslint` dependency — so running it drops
into Next's interactive "How would you like to configure ESLint?" prompt and hangs
rather than checking anything. Don't run it. (A stray `.eslintignore` remains from
whenever it last worked.)

## Tests

There **is** a Playwright end-to-end suite — 25 tests across 8 specs in `tests/e2e/`
(home, auth, sign-out, public pages, my-patches, patch detail signed-out and
signed-in, add ascent). Run it:

```bash
npm run test:e2e                         # reporter is html — opens a report, no terminal output
npx playwright test --reporter=line      # what you usually want locally
npx playwright test tests/e2e/home.spec.ts   # one spec
npm run test:e2e:report                  # reopen the last html report
```

Notes worth knowing before running it:

- **Use `--workers=1` on the dev box.** 2 vCPU / 4 GiB does not comfortably run the
  dev server plus parallel Chromium workers; the box has OOM-killed a dev server
  during a concurrent build.
- **Playwright starts its own dev server** (`webServer` in `playwright.config.ts`,
  `reuseExistingServer` unless CI), so don't start `npm run dev` first — and don't run
  `npm run build` at the same time, as they share `.next` and the build fails with a
  confusing `Failed to collect page data for /favicon.ico`.
- **The signed-in specs need `E2E_TEST_EMAIL` and `E2E_TEST_PASSWORD` in `.env.local`**
  (see `tests/e2e/helpers/login.ts`, which throws without them).
- **Tests run against whatever backend `amplify_outputs.json` points at** — normally
  the personal sandbox — and against its real data, including hard-coded ids such as
  the Belknap Range patch. They also write and clean up real records.
- **`add-ascent.spec.ts` used to be intermittent — it isn't any more, so treat a
  failure there as a real regression.** It failed roughly two runs in three because
  `PatchMountains` passed `userMountainMap[id] || []` to `MountainAscentModal`, a
  fresh array identity on every parent render, and the modal re-seeded its draft
  dates from that prop — wiping what the user had typed, so Save submitted an empty
  list and the ascent was lost with no error shown. Fixed in `0acc08f`: the modal
  seeds its draft only when the dialog opens, and the parent passes a stable
  constant. If this spec starts failing again, look for something re-introducing
  prop-identity churn or re-adding `userMountain` to that effect's dependencies.

## Amplify backend deploys (IMPORTANT — Gen2)

This app is on **Amplify Gen2** (code-first `defineBackend`) in every environment — the Gen1→Gen2 migration completed 2026-06-14. **Do NOT use `amplify push`** (that is the Gen1 CLI; it deploys the old, decommissioning Gen1 backend and only regenerates Gen1 codegen files — it does NOT touch the live Gen2 backend). Schema lives in `amplify/data/resource.ts` (`a.model()` / `a.string()` etc.), **not** `amplify/backend/api/.../schema.graphql` (Gen1 leftover).

All `ampx` commands **must run on Node 20** (not the default Node 24 — tsx@4.19 + Node 24 fails to parse the TS backend with `SyntaxError: Unexpected identifier 'as'`) and need `AWS_PROFILE=hiking-patches-app` (CDK bootstrap SSM perms). The `NODE_OPTIONS=--max-old-space-size=3072` heap flag is **no longer required** since the dev box was upgraded to 4 GiB (2026-07-04) — a verified sandbox deploy peaks ~2.9 GiB with no OOM. Re-add it only if a deploy OOMs.

```bash
# dev (personal sandbox) — deploy here FIRST, always
PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" AWS_PROFILE=hiking-patches-app \
  npx ampx sandbox --once

# staging / prod (Amplify Hosting app id d1gebwofi6iyc4) — CI=true + AWS_BRANCH required
PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" AWS_PROFILE=hiking-patches-app \
  AWS_BRANCH=staging CI=true \
  npx ampx pipeline-deploy --branch staging --app-id d1gebwofi6iyc4 --outputs-out-dir .amplify/outputs-staging
```

Deploy to **dev first**, never straight to prod. `ampx sandbox` regenerates `amplify_outputs.json`; `pipeline-deploy` writes per-env outputs under `.amplify/outputs-<env>/`. Frontend promotion is via branch merge dev→staging→prod, but the branch merge alone does NOT deploy schema changes to that env's AppSync backend — each env must be `pipeline-deploy`'d separately (Amplify Hosting runs `ampx pipeline-deploy` in its build per branch). `referenceAuth()` selects the per-env Cognito pool via `AWS_BRANCH` (defaults to `dev` when unset, e.g. local sandbox).

## Architecture

**Next.js 15 (App Router) + React 19 frontend backed by AWS Amplify.**

### Routing Structure
- `app/` — Next.js App Router pages
  - Public pages: home, about, safety, privacy-policy, terms, auth, request-patch
  - Protected user pages: `my-patches/`, `account/`, `patch/[id]/`, `mountain/[id]/`, `trail/[id]/`, `purchase/`
  - Admin pages (role-gated): `admin/` with sub-pages for patches, mountains, trails, users, requests
  - API routes: `app/api/list-users/`, `app/api/user-entry-counts/`
- `src/components/` — All shared React components
- `src/graphql/` — GraphQL queries/mutations (auto-generated + custom)

### Backend (AWS Amplify)
- **AppSync (GraphQL)** — Primary data API. Client initialized via `src/lib/amplifyClient.ts` using `generateClient()`.
- **DynamoDB** — Stores patches, user progress, mountains, trails, purchases, requests.
- **Cognito** — Auth with User Pools. Admin role detected via `cognito:groups` claim.
- **S3** — Patch image storage (`patchImages` bucket).
- **Lambda functions** in `amplify/functions/` (Gen2 `defineFunction`):
  - `create-checkout` + `stripe-webhook` — Stripe payment flow
  - `get-patch-progress` — Calculates patch completion %
  - `list-users` — Admin user listing

### Authentication
- `AuthProvider` in `src/context/auth-context.tsx` wraps the app in `app/layout.tsx`.
- `useAuth()` hook exposes: `user`, `isAdmin`, `signIn`, `signOut`, etc.
- Admin check: user belongs to a Cognito group; `isAdmin` bool from auth context.

### Data Layer
- Auto-generated TypeScript types live in `src/API.ts` — do not edit manually. It now
  matches a fresh codegen run exactly, so regenerating it is lossless. Regenerate with
  `npx ampx generate graphql-client-code --format graphql-codegen --statement-target
  typescript --type-target typescript --out <dir>` (Node 20 + `AWS_PROFILE`, as with every
  `ampx` command); it writes flat, so move the statement files into `src/graphql/` and
  change their `./API` import to `../API`.
- **Types for custom operations go in `src/graphql/custom-types.ts`, never in `API.ts`.**
  Codegen cannot emit them — it knows nothing about the custom operations — so anything
  hand-written in `API.ts` is destroyed by the next regeneration. They used to live at the
  foot of `API.ts` for exactly that reason, and had to be re-appended by hand each time.
- Custom queries/mutations are in `src/graphql/custom-queries.ts` and `src/graphql/custom-mutations.ts`; the auto-generated files (`queries.ts`, `mutations.ts`, `subscriptions.ts`) are regenerated by Amplify CLI.
- Custom operation strings need the `GeneratedQuery<In, Out>` brand (see the top of
  `custom-queries.ts`) or `client.graphql()` returns an untyped union and assigning the
  result to `GraphQLResult<T>` fails to compile.
- Key models: `Patch`, `UserPatch`, `Mountain`, `UserMountain`, `Trail`, `UserTrail`, `PatchPurchase`, `PatchRequest`.

### Payments
- Stripe integration via two Lambda functions. Checkout API URL comes from `NEXT_PUBLIC_CHECKOUT_API` env var; price from `NEXT_PUBLIC_STRIPE_PRICE_ID`.

### Styling
- Tailwind CSS v4 via PostCSS. No component library — custom components using Headless UI (`@headlessui/react`) for accessible primitives (modals, dialogs).
