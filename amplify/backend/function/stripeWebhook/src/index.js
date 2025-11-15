/* eslint-disable */
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

exports.handler = async (event) => {
  const sig = event.headers['Stripe-Signature'] || event.headers['stripe-signature'];

  // Recreate raw body
  let rawBody = event.body;
  if (event.isBase64Encoded) {
    rawBody = Buffer.from(event.body, 'base64').toString('utf8');
  }

  let evt;
  try {
    evt = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  try {
    if (evt.type === 'checkout.session.completed') {
      const session = evt.data.object;
      // Fulfill: session.metadata.userId, session.id, etc.
      // e.g., mark license/entitlement, send email, create DB record
    }
    // You can handle other events as needed
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error('Webhook processing error', err);
    return { statusCode: 500, body: 'Webhook handler error' };
  }
};

