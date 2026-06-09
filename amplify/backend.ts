import { defineBackend } from '@aws-amplify/backend';
import {
  aws_apigateway as apigw,
  aws_iam as iam,
  aws_lambda as lambda,
  CfnOutput,
  Stack,
} from 'aws-cdk-lib';
import { migrateUser } from './functions/migrate-user/resource';
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
  migrateUser,
});

const stack = Stack.of(backend.auth.resources.userPool);

// ─── Cognito password policy: match Gen1 (8-char min, no special char req) ──

const cfnUserPool = backend.auth.resources.cfnResources.cfnUserPool;
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: false,
    requireUppercase: false,
    requireNumbers: false,
    requireSymbols: false,
  },
};

// ─── User pool ID available to functions that need it ────────────────────────

const newUserPoolId = backend.auth.resources.userPool.userPoolId;
const newUserPoolArn = backend.auth.resources.userPool.userPoolArn;
const oldUserPoolArn = `arn:aws:cognito-idp:us-east-1:${stack.account}:userpool/us-east-1_7sOys7dV8`;

// ─── AppSync URL + API key injected into HTTP-facing functions ───────────────

const graphqlUrl = backend.data.resources.cfnResources.cfnGraphqlApi.attrGraphQlUrl;
const apiKey = backend.data.resources.cfnResources.cfnApiKey?.attrApiKey ?? '';

const listUsersFn = backend.listUsers.resources.lambda as lambda.Function;
const stripeWebhookFn = backend.stripeWebhook.resources.lambda as lambda.Function;
const migrateUserFn = backend.migrateUser.resources.lambda as lambda.Function;

listUsersFn.addEnvironment('USER_POOL_ID', newUserPoolId);
listUsersFn.addEnvironment('APPSYNC_URL', graphqlUrl);
listUsersFn.addEnvironment('APPSYNC_API_KEY', apiKey);

stripeWebhookFn.addEnvironment('APPSYNC_URL', graphqlUrl);
stripeWebhookFn.addEnvironment('APPSYNC_API_KEY', apiKey);

// ─── IAM grants ──────────────────────────────────────────────────────────────

listUsersFn.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['cognito-idp:ListUsers'],
    resources: [newUserPoolArn],
  })
);

// migrateUser needs to authenticate against the OLD pool and re-apply groups in the NEW pool
migrateUserFn.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['cognito-idp:AdminInitiateAuth', 'cognito-idp:AdminListGroupsForUser'],
    resources: [oldUserPoolArn],
  })
);
migrateUserFn.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['cognito-idp:AdminAddUserToGroup'],
    resources: [newUserPoolArn],
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
checkoutResource.addMethod('OPTIONS', new apigw.MockIntegration({
  integrationResponses: [{ statusCode: '200' }],
  passthroughBehavior: apigw.PassthroughBehavior.WHEN_NO_MATCH,
  requestTemplates: { 'application/json': '{"statusCode": 200}' },
}), {
  methodResponses: [{ statusCode: '200' }],
});

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
