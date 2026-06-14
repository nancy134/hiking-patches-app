import { referenceAuth } from '@aws-amplify/backend';

// Each Gen1 environment keeps its own Cognito user/identity pool permanently
// (referenceAuth, no migration). Amplify Hosting sets AWS_BRANCH during
// branch builds / `ampx pipeline-deploy --branch <name>`; `ampx sandbox` runs
// locally with no AWS_BRANCH, so it falls back to dev.
const referenceAuthConfigs = {
  dev: {
    userPoolId: 'us-east-1_7sOys7dV8',
    userPoolClientId: '253kf2olf3hg5h99tlbhctugc7',
    identityPoolId: 'us-east-1:d6db393c-82ad-453c-af4a-10192489a3f5',
    authRoleArn: 'arn:aws:iam::461318555119:role/amplify-hikingpatchesapp-dev-880ac-authRole',
    unauthRoleArn: 'arn:aws:iam::461318555119:role/amplify-hikingpatchesapp-dev-880ac-unauthRole',
  },
  staging: {
    userPoolId: 'us-east-1_YUggYUAuX',
    userPoolClientId: '7n6bbbf9l822mp37uh2cmcl95t',
    identityPoolId: 'us-east-1:715a63b6-b654-4942-9bbd-ed2155db61fd',
    authRoleArn: 'arn:aws:iam::461318555119:role/amplify-hikingpatchesapp-staging-a9b1a-authRole',
    unauthRoleArn: 'arn:aws:iam::461318555119:role/amplify-hikingpatchesapp-staging-a9b1a-unauthRole',
  },
  prod: {
    userPoolId: 'us-east-1_cIdcGcLGa',
    userPoolClientId: '6d85av0qbdisvm96pfjf6edtp2',
    identityPoolId: 'us-east-1:cdf05493-2373-4a04-8817-1c2517628006',
    authRoleArn: 'arn:aws:iam::461318555119:role/amplify-hikingpatchesapp-prod-94c94-authRole',
    unauthRoleArn: 'arn:aws:iam::461318555119:role/amplify-hikingpatchesapp-prod-94c94-unauthRole',
  },
} as const;

const branch = (process.env.AWS_BRANCH ?? 'dev') as keyof typeof referenceAuthConfigs;

export const auth = referenceAuth(referenceAuthConfigs[branch] ?? referenceAuthConfigs.dev);
