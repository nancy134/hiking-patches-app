import { defineFunction, secret } from '@aws-amplify/backend';

export const createCheckout = defineFunction({
  name: 'create-checkout',
  resourceGroupName: 'data',
  entry: './handler.ts',
  environment: {
    STRIPE_SECRET_KEY: secret('STRIPE_SECRET_KEY'),
    SUCCESS_URL: secret('CHECKOUT_SUCCESS_URL'),
    CANCEL_URL: secret('CHECKOUT_CANCEL_URL'),
  },
});
