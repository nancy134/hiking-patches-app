// TODO (Phase 4): port from amplify/backend/function/createCheckout/src/index.js
// No logic changes needed — only the entry point format changes for Gen2 bundling.

import type { APIGatewayProxyHandler } from 'aws-lambda';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
};

export const handler: APIGatewayProxyHandler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { userId, priceId, patchId, quantity = 1 } = body;

    const successUrl = `${process.env.SUCCESS_URL}&patchId=${encodeURIComponent(patchId)}`;
    const cancelUrl = `${process.env.CANCEL_URL}?patchId=${encodeURIComponent(patchId)}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity }],
      shipping_address_collection: { allowed_countries: ['US'] },
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId, patchId },
    });

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    console.error('createCheckout error', err);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Unable to create session' }) };
  }
};
