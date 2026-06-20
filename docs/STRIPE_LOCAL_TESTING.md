# Local Stripe testing

This project's Stripe flow is two **deployed** Lambdas behind API Gateway
(`create-checkout` + `stripe-webhook`, wired in `amplify/backend.ts`). There is
no local Lambda runtime, so "testing locally" means running those same handler
files as a plain HTTP server on `localhost` and pointing the Stripe CLI at it.

`scripts/local-stripe-server.ts` imports the **real** handlers, so you're
exercising the actual deployed code — not a copy.

```
┌─ Terminal A ─────────────┐   ┌─ Terminal B ──────────────┐   ┌─ Terminal C ─────────┐
│ npm run stripe:listen    │   │ npm run stripe:server     │   │ npm run dev          │
│ Stripe CLI → forwards    │──▶│ localhost:4242            │   │ Next.js, buy a patch │
│ webhook events           │   │  /checkout  → Lambda      │◀──│ NEXT_PUBLIC_CHECKOUT │
│                          │   │  /stripe/webhook → Lambda │   │ _API → localhost:4242│
└──────────────────────────┘   └───────────────────────────┘   └──────────────────────┘
```

The local webhook writes `PatchPurchase` / `AdminNotification` rows to whatever
AppSync `amplify_outputs.json` points at (your **sandbox** by default — isolated
from staging/prod).

## One-time setup

### 1. Install the Stripe CLI

Not bundled. Pick one:

```bash
# Option A — official APT repo (needs sudo)
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public \
  | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" \
  | sudo tee /etc/apt/sources.list.d/stripe.list
sudo apt-get update && sudo apt-get install stripe

# Option B — no sudo: download a release tarball into ~/.local/bin
mkdir -p ~/.local/bin && cd /tmp
curl -L -o stripe.tgz https://github.com/stripe/stripe-cli/releases/latest/download/stripe_$(curl -s https://api.github.com/repos/stripe/stripe-cli/releases/latest | grep -oP '"tag_name":\s*"v\K[^"]+')_linux_x86_64.tar.gz
tar -xzf stripe.tgz stripe && mv stripe ~/.local/bin/   # ensure ~/.local/bin is on PATH
```

Then authenticate once: `stripe login`.

### 2. Fill in `.env.stripe.local`

This file is gitignored. Set:

- `STRIPE_SECRET_KEY` — your **test-mode** secret key (`sk_test_…`).
- `STRIPE_WEBHOOK_SECRET` — printed by `stripe listen` (step 3); paste it here.

`APPSYNC_URL` / `APPSYNC_API_KEY` and the success/cancel URLs default
automatically — only override if you want the webhook to write somewhere other
than your sandbox.

### 3. Point the frontend at the local server

In `.env.local`, set the checkout API to the local server:

```
NEXT_PUBLIC_CHECKOUT_API=http://localhost:4242/checkout
```

(Keep your real sandbox/staging value somewhere handy to switch back.)

## Running a test

```bash
# Terminal A — start forwarding. Copy the whsec_… it prints into .env.stripe.local.
npm run stripe:listen

# Terminal B — start the local handler server.
npm run stripe:server

# Terminal C — start the app and buy a patch with a test card.
npm run dev
```

Use Stripe test card **4242 4242 4242 4242**, any future expiry, any CVC/ZIP.

On success Stripe fires `checkout.session.completed` → the CLI forwards it to
`localhost:4242/stripe/webhook` → the webhook verifies the signature and writes
the purchase. Watch Terminal B for `webhook -> 200: ok`.

### Quick plumbing check (no real card)

```bash
stripe trigger checkout.session.completed
```

This verifies signature handling and that the server is reachable, but the
synthetic event has **no `userId`/`patchId` metadata**, so the handler returns
`200 ok` and skips the DB write. Use a real checkout (above) for the end-to-end
DB/notification path.

## Notes & gotchas

- **The price ID must live in the same Stripe account as your local test key.**
  `NEXT_PUBLIC_STRIPE_PRICE_ID` in `.env.local` defaults to the *deployed*
  backend's price, which belongs to that backend's Stripe account. If your local
  `sk_test_…` is a different account, `create-checkout` fails with
  `400 resource_missing / line_items[0][price]` — "No such price" — before
  Checkout even opens. Fix: create a test price under your local key's account
  and point `NEXT_PUBLIC_STRIPE_PRICE_ID` at it, e.g.:
  ```bash
  SK=$(grep '^STRIPE_SECRET_KEY=' .env.stripe.local | cut -d= -f2)
  curl -s https://api.stripe.com/v1/prices -u "$SK:" \
    -d unit_amount=1500 -d currency=usd \
    -d "product_data[name]=Hiking Patch (local test)"
  ```
  Then restart `npm run dev` (NEXT_PUBLIC_* vars are baked in at startup).


- **Restart `stripe:server` after editing a handler** — Node caches the module.
- The `whsec_…` from `stripe listen` is **per-session-ish**; if webhook
  signature verification starts failing with `400`, re-copy the current value
  into `.env.stripe.local`.
- The webhook signing secret here is **separate** from the deployed sandbox's
  `STRIPE_WEBHOOK_SECRET` Amplify secret — that's expected.
- Remember to revert `NEXT_PUBLIC_CHECKOUT_API` in `.env.local` when you're done
  testing locally.
