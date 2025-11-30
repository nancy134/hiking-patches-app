/* eslint-disable */
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

exports.handler = async (event) => {
  try {
    // If you protected the API with auth, you can inspect event.requestContext.authorizer here
    const body = event.body ? JSON.parse(event.body) : {};
    const { userId, priceId, patchId, quantity = 1 } = body;

    const successUrl = `${process.env.SUCCESS_URL}&patchId=${encodeURIComponent(patchId)}`;
    const cancelUrl  = `${process.env.CANCEL_URL}?patchId=${encodeURIComponent(patchId)}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity }],
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
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

