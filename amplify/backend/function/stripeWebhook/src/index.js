/* eslint-disable */
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// If you're on Node.js 18+ runtime, fetch is global and you don't need this.
// Otherwise, add node-fetch to your Lambda layer/package and uncomment:
// const fetch = require('node-fetch');

const APPSYNC_URL = process.env.APPSYNC_URL;
const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY;

// GraphQL mutation to create a PatchPurchase
const CREATE_PATCH_PURCHASE = /* GraphQL */ `
  mutation CreatePatchPurchase($input: CreatePatchPurchaseInput!) {
    createPatchPurchase(input: $input) {
      id
      userId
      patchId
      stripeSessionId
      createdAt
    }
  }
`;

exports.handler = async (event) => {
  const sig =
    event.headers['Stripe-Signature'] || event.headers['stripe-signature'];

  // Recreate raw body
  let rawBody = event.body;
  if (event.isBase64Encoded) {
    rawBody = Buffer.from(event.body, 'base64').toString('utf8');
  }

  let evt;
  try {
    evt = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  try {
    if (evt.type === 'checkout.session.completed') {
      const session = evt.data.object;

      const metadata = session.metadata || {};
      const userId = metadata.userId;
      const patchId = metadata.patchId;
      const stripeSessionId = session.id;

      console.log('checkout.session.completed received', {
        userId,
        patchId,
        stripeSessionId,
      });

      if (!userId || !patchId) {
        console.warn(
          'Missing userId or patchId in session metadata; skipping DB save.'
        );
      } else {
        // Call AppSync to create PatchPurchase
        const graphqlBody = {
          query: CREATE_PATCH_PURCHASE,
          variables: {
            input: {
              userId,
              patchId,
              stripeSessionId,
            },
          },
        };

        const resp = await fetch(APPSYNC_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': APPSYNC_API_KEY,
          },
          body: JSON.stringify(graphqlBody),
        });

        const json = await resp.json();

        if (!resp.ok || json.errors) {
          console.error('Error creating PatchPurchase in AppSync', {
            status: resp.status,
            body: json,
            errors: json.errors
          });
        } else {
          console.log('PatchPurchase created', json.data.createPatchPurchase);
        }
      }
    }

    // Handle other Stripe event types if you want
    // e.g. payment_intent.succeeded, charge.refunded, etc.

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error('Webhook processing error', err);
    return { statusCode: 500, body: 'Webhook handler error' };
  }
};

