/* eslint-disable */
const Stripe = require('stripe');
console.log("process.env.STRIPE_SECRET_KEY: "+process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

exports.handler = async (event) => {
  try {
    console.log("process.env.STRIPE_SECRET_KEY: "+process.env.STRIPE_SECRET_KEY);
    // If you protected the API with auth, you can inspect event.requestContext.authorizer here
    const body = event.body ? JSON.parse(event.body) : {};
    const { userId, priceId, patchId, quantity = 1 } = body;

    const successUrl = `${process.env.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}&patchId=${encodeURIComponent(patchId)}`;
    const cancelUrl  = `${process.env.CANCEL_URL}?patchId=${encodeURIComponent(patchId)}`;

    console.log("successUrl: "+successUrl);
    console.log("cancelUrl: "+cancelUrl);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId , patchId},
      // Optional: customer, customer_email, allow_promotion_codes: true, etc.
    });

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('createCheckout error', err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Unable to create session' }),
    };
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',         // tighten to your domain in prod
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
  };
}

