/**
 * Local Stripe dev server.
 *
 * Runs the REAL deployed Lambda handlers (create-checkout + stripe-webhook)
 * as a plain HTTP server on localhost, so you can test the Stripe flow end to
 * end without redeploying the Amplify sandbox on every edit.
 *
 * Flow:
 *   Terminal A:  npm run stripe:listen      (Stripe CLI -> forwards webhooks here)
 *   Terminal B:  npm run stripe:server      (this server)
 *   Terminal C:  npm run dev                (Next.js, NEXT_PUBLIC_CHECKOUT_API -> here)
 *
 * Config comes from .env.stripe.local (gitignored). See docs/STRIPE_LOCAL_TESTING.md.
 *
 * NOTE: env must be populated BEFORE the handlers are imported, because each
 * handler module instantiates Stripe with process.env.STRIPE_SECRET_KEY at load
 * time. That's why the handlers are pulled in via dynamic import() below.
 */
import http from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

// 1. Load secrets/overrides from .env.stripe.local
dotenv.config({ path: path.join(repoRoot, '.env.stripe.local') });

// 2. Default APPSYNC_URL / APPSYNC_API_KEY from the active backend
//    (amplify_outputs.json) so the webhook can write PatchPurchase rows.
try {
  const outputs = JSON.parse(
    readFileSync(path.join(repoRoot, 'amplify_outputs.json'), 'utf8'),
  );
  process.env.APPSYNC_URL ??= outputs?.data?.url ?? '';
  process.env.APPSYNC_API_KEY ??= outputs?.data?.api_key ?? '';
} catch {
  // amplify_outputs.json missing — user can set APPSYNC_URL/KEY manually.
}

// 3. Defaults for the checkout success/cancel redirect targets. The
//    create-checkout handler appends `&patchId=` to SUCCESS_URL (so it must
//    already contain a `?`) and `?patchId=` to CANCEL_URL (so it must not).
process.env.SUCCESS_URL ??=
  'http://localhost:3000/purchase/success?session_id={CHECKOUT_SESSION_ID}';
process.env.CANCEL_URL ??= 'http://localhost:3000/purchase/cancel';

const PORT = Number(process.env.STRIPE_LOCAL_PORT ?? 4242);

// 4. Fail fast on missing required secrets.
const missing = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'].filter(
  (k) => !process.env[k],
);
if (missing.length) {
  console.error(
    `\n✖ Missing required env: ${missing.join(', ')}\n` +
      `  Add them to .env.stripe.local (see docs/STRIPE_LOCAL_TESTING.md).\n` +
      `  STRIPE_WEBHOOK_SECRET (whsec_...) is printed by \`npm run stripe:listen\`.\n`,
  );
  process.exit(1);
}

type LambdaResult = {
  statusCode: number;
  headers?: Record<string, string | number | boolean>;
  body?: string;
};
type LambdaHandler = (event: Record<string, unknown>) => Promise<LambdaResult>;

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c as Buffer));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function main() {
  // Dynamic import AFTER env is set (see note at top of file). The handlers
  // use require('stripe'), so tsx compiles them as CommonJS and the named
  // `handler` export lands under `.default` — accept either shape.
  type HandlerModule = { handler?: LambdaHandler; default?: { handler?: LambdaHandler } };
  const pickHandler = (m: HandlerModule, name: string): LambdaHandler => {
    const fn = m.handler ?? m.default?.handler;
    if (typeof fn !== 'function') throw new Error(`No handler export found in ${name}`);
    return fn;
  };
  // Cast through `unknown`: the handlers' APIGatewayProxyHandler signature
  // (3 args) doesn't overlap our loose single-arg LambdaHandler, so a direct
  // assertion is rejected by tsc (which runs during `next build`).
  const createCheckout = pickHandler(
    (await import('../amplify/functions/create-checkout/handler.ts')) as unknown as HandlerModule,
    'create-checkout',
  );
  const stripeWebhook = pickHandler(
    (await import('../amplify/functions/stripe-webhook/handler.ts')) as unknown as HandlerModule,
    'stripe-webhook',
  );

  const server = http.createServer(async (req, res) => {
    const url = (req.url ?? '').split('?')[0];
    const method = req.method ?? 'GET';

    const send = (r: LambdaResult) => {
      res.writeHead(r.statusCode, {
        'content-type': 'application/json',
        ...(r.headers as Record<string, string> | undefined),
      });
      res.end(r.body ?? '');
    };

    try {
      // POST /checkout  -> create-checkout Lambda
      if (url === '/checkout' && (method === 'POST' || method === 'OPTIONS')) {
        const body = method === 'POST' ? await readBody(req) : '';
        return send(await createCheckout({ httpMethod: method, body }));
      }

      // POST /stripe/webhook -> stripe-webhook Lambda (raw body for signature)
      if (url === '/stripe/webhook' && method === 'POST') {
        const body = await readBody(req);
        const result = await stripeWebhook({
          headers: {
            'stripe-signature': req.headers['stripe-signature'] ?? '',
          },
          body,
          isBase64Encoded: false,
        });
        if (result.statusCode >= 400) {
          console.error(`webhook -> ${result.statusCode}: ${result.body}`);
        } else {
          console.log(`webhook -> ${result.statusCode}: ${result.body}`);
        }
        return send(result);
      }

      res.writeHead(404).end('Not found');
    } catch (err) {
      console.error('Local Stripe server error', err);
      res.writeHead(500).end('Internal error');
    }
  });

  server.listen(PORT, () => {
    console.log(`\n▲ Local Stripe server listening on http://localhost:${PORT}`);
    console.log(`  POST /checkout         -> create-checkout Lambda`);
    console.log(`  POST /stripe/webhook   -> stripe-webhook Lambda`);
    console.log(`  AppSync target: ${process.env.APPSYNC_URL || '(unset)'}`);
    console.log(`  Success URL:    ${process.env.SUCCESS_URL}`);
    console.log(`\n  Point .env.local NEXT_PUBLIC_CHECKOUT_API at`);
    console.log(`  http://localhost:${PORT}/checkout and run \`npm run stripe:listen\`.\n`);
  });
}

main();
