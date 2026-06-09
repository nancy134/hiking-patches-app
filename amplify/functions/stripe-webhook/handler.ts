// TODO (Phase 4): wire APPSYNC_URL from backend.ts via
//   backend.stripeWebhook.resources.lambda.addEnvironment(...)
// The APPSYNC_API_KEY env var should be replaced with IAM-signed requests
// using the Lambda's execution role (grant access via allow.resource() in
// the PatchPurchase auth rule) to avoid hardcoding the key.

import type { APIGatewayProxyHandler } from 'aws-lambda';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

const CREATE_PATCH_PURCHASE = /* GraphQL */ `
  mutation CreatePatchPurchase($input: CreatePatchPurchaseInput!) {
    createPatchPurchase(input: $input) {
      id userId patchId stripeSessionId amount currency stripeReceiptUrl createdAt
    }
  }
`;

export const handler: APIGatewayProxyHandler = async (event) => {
  const sig = event.headers['Stripe-Signature'] ?? event.headers['stripe-signature'] ?? '';
  let rawBody = event.body ?? '';
  if (event.isBase64Encoded) rawBody = Buffer.from(rawBody, 'base64').toString('utf8');

  let evt;
  try {
    evt = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Webhook signature verification failed', err);
    return { statusCode: 400, body: `Webhook Error: ${msg}` };
  }

  if (evt.type !== 'checkout.session.completed') {
    return { statusCode: 200, body: 'ok' };
  }

  const session = evt.data.object as Record<string, unknown>;
  const metadata = (session.metadata ?? {}) as Record<string, string>;
  const { userId, patchId } = metadata;
  const stripeSessionId = session.id as string;

  if (!userId || !patchId) {
    console.warn('Missing userId or patchId in session metadata; skipping DB save.');
    return { statusCode: 200, body: 'ok' };
  }

  try {
    let amount: number | null = null;
    let currency: string | null = null;
    let stripeReceiptUrl: string | null = null;

    if (session.payment_intent) {
      const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string, { expand: ['charges'] });
      amount = pi.amount_received ?? pi.amount ?? null;
      currency = pi.currency ?? null;
      stripeReceiptUrl = pi.charges?.data?.[0]?.receipt_url ?? null;
    }

    const appsyncUrl = process.env.APPSYNC_URL!;
    const apiKey = process.env.APPSYNC_API_KEY!;

    const res = await fetch(appsyncUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({
        query: CREATE_PATCH_PURCHASE,
        variables: { input: { userId, patchId, stripeSessionId, amount, currency, stripeReceiptUrl } },
      }),
    });

    const json = await res.json() as { errors?: unknown[] };
    if (json.errors) throw new Error(`AppSync error: ${JSON.stringify(json.errors)}`);
  } catch (err) {
    console.error('Error creating PatchPurchase', err);
    return { statusCode: 500, body: 'Internal error' };
  }

  return { statusCode: 200, body: 'ok' };
};
