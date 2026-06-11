import { defineBackend } from '@aws-amplify/backend';
import {
  aws_apigateway as apigw,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_s3 as s3,
  CfnOutput,
  Stack,
} from 'aws-cdk-lib';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { createCheckout } from './functions/create-checkout/resource';
import { stripeWebhook } from './functions/stripe-webhook/resource';
import { listUsers } from './functions/list-users/resource';
import { getPatchProgress } from './functions/get-patch-progress/resource';

const backend = defineBackend({
  auth,
  data,
  storage,
  createCheckout,
  stripeWebhook,
  listUsers,
  getPatchProgress,
});

// ─── S3: allow public read on public/* (matches Gen1 behavior) ───────────────
// backend.storage.resources.bucket is IBucket (interface) — node.defaultChild
// and addToResourcePolicy are no-ops on it. Go through cfnResources.cfnBucket
// to get the real L1 construct, then walk up to the L2 Bucket for policy work.

const { cfnBucket } = backend.storage.resources.cfnResources;
const storageBucket = cfnBucket.node.scope as s3.Bucket;

cfnBucket.publicAccessBlockConfiguration = {
  blockPublicAcls: false,
  ignorePublicAcls: false,
  blockPublicPolicy: false,
  restrictPublicBuckets: false,
};
storageBucket.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['s3:GetObject'],
  principals: [new iam.AnyPrincipal()],
  resources: [`${storageBucket.bucketArn}/public/*`],
}));

// data stack: hosts functions that reference AppSync + all API Gateways (keeps Lambda integrations intra-stack)
const stack = Stack.of(backend.data.resources.graphqlApi);

// ─── AppSync URL + API key injected into HTTP-facing functions ───────────────

const graphqlUrl = backend.data.resources.cfnResources.cfnGraphqlApi.attrGraphQlUrl;
const apiKey = backend.data.resources.cfnResources.cfnApiKey?.attrApiKey ?? '';

const listUsersFn = backend.listUsers.resources.lambda as lambda.Function;
const stripeWebhookFn = backend.stripeWebhook.resources.lambda as lambda.Function;
const getPatchProgressFn = backend.getPatchProgress.resources.lambda as lambda.Function;

listUsersFn.addEnvironment('APPSYNC_URL', graphqlUrl);
listUsersFn.addEnvironment('APPSYNC_API_KEY', apiKey);
listUsersFn.addEnvironment('USER_POOL_ID', backend.auth.resources.userPool.userPoolId);

stripeWebhookFn.addEnvironment('APPSYNC_URL', graphqlUrl);
stripeWebhookFn.addEnvironment('APPSYNC_API_KEY', apiKey);

getPatchProgressFn.addEnvironment('APPSYNC_URL', graphqlUrl);
getPatchProgressFn.addEnvironment('APPSYNC_API_KEY', apiKey);

// ─── IAM grants ──────────────────────────────────────────────────────────────

listUsersFn.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['cognito-idp:ListUsers'],
    resources: [`arn:aws:cognito-idp:${stack.region}:${stack.account}:userpool/${backend.auth.resources.userPool.userPoolId}`],
  })
);

// ─── Checkout REST API (replaces Gen1 checkoutApi) ───────────────────────────

const checkoutApi = new apigw.RestApi(stack, 'CheckoutApi', {
  restApiName: 'checkout-api',
  defaultCorsPreflightOptions: {
    allowOrigins: apigw.Cors.ALL_ORIGINS,
    allowMethods: apigw.Cors.ALL_METHODS,
  },
});

const checkoutResource = checkoutApi.root.addResource('checkout');
checkoutResource.addMethod('POST', new apigw.LambdaIntegration(backend.createCheckout.resources.lambda));

const webhookResource = checkoutApi.root.addResource('stripe').addResource('webhook');
webhookResource.addMethod('POST', new apigw.LambdaIntegration(backend.stripeWebhook.resources.lambda));

new CfnOutput(stack, 'CheckoutApiUrl', {
  value: checkoutApi.url,
  description: 'Set as NEXT_PUBLIC_CHECKOUT_API (replaces Gen1 checkoutApi URL)',
});

// ─── Users REST API (replaces Gen1 listusers API) ────────────────────────────

const listUsersApi = new apigw.RestApi(stack, 'ListUsersApi', {
  restApiName: 'list-users-api',
  defaultCorsPreflightOptions: {
    allowOrigins: apigw.Cors.ALL_ORIGINS,
    allowMethods: apigw.Cors.ALL_METHODS,
  },
});

const listUsersIntegration = new apigw.LambdaIntegration(backend.listUsers.resources.lambda);
listUsersApi.root.addResource('list-users').addMethod('ANY', listUsersIntegration);
listUsersApi.root.addResource('user-entry-counts').addMethod('POST', listUsersIntegration);
listUsersApi.root.addResource('popular-patches').addMethod('GET', listUsersIntegration);

new CfnOutput(stack, 'ListUsersApiUrl', {
  value: listUsersApi.url,
  description: 'Update the list-users Next.js proxy routes to use this base URL',
});
