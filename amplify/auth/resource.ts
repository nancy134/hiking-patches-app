import { referenceAuth } from '@aws-amplify/backend';

export const auth = referenceAuth({
  userPoolId: 'us-east-1_7sOys7dV8',
  userPoolClientId: '253kf2olf3hg5h99tlbhctugc7',
  identityPoolId: 'us-east-1:d6db393c-82ad-453c-af4a-10192489a3f5',
  authRoleArn: 'arn:aws:iam::461318555119:role/amplify-hikingpatchesapp-dev-880ac-authRole',
  unauthRoleArn: 'arn:aws:iam::461318555119:role/amplify-hikingpatchesapp-dev-880ac-unauthRole',
});
