import type { UserMigrationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
  AdminAddUserToGroupCommand,
  AdminListGroupsForUserCommand,
  AuthFlowType,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION ?? 'us-east-1' });

const OLD_USER_POOL_ID = 'us-east-1_7sOys7dV8';
const OLD_CLIENT_ID = process.env.OLD_USER_POOL_CLIENT_ID ?? '253kf2olf3hg5h99tlbhctugc7';;

export const handler: UserMigrationTriggerHandler = async (event) => {
  if (event.triggerSource !== 'UserMigration_Authentication') return event;

  const { userName, request } = event;
  const password = request.password;

  try {
    const authResult = await client.send(
      new AdminInitiateAuthCommand({
        UserPoolId: OLD_USER_POOL_ID,
        ClientId: OLD_CLIENT_ID,
        AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
        AuthParameters: { USERNAME: userName, PASSWORD: password },
      })
    );

    if (!authResult.AuthenticationResult) {
      throw new Error('Authentication failed against old user pool');
    }

    const groupsResult = await client.send(
      new AdminListGroupsForUserCommand({
        UserPoolId: OLD_USER_POOL_ID,
        Username: userName,
      })
    );

    event.response.userAttributes = {
      email: userName,
      email_verified: 'true',
    };
    event.response.finalUserStatus = 'CONFIRMED';
    event.response.messageAction = 'SUPPRESS';

    const newUserPoolId = event.userPoolId;
    const groups = groupsResult.Groups ?? [];
    for (const group of groups) {
      if (group.GroupName) {
        await client.send(
          new AdminAddUserToGroupCommand({
            UserPoolId: newUserPoolId,
            Username: userName,
            GroupName: group.GroupName,
          })
        );
      }
    }
  } catch (err) {
    console.error('Migration failed for user', userName, err);
    return event;
  }

  return event;
};
