// app/api/list-users/route.ts
import { CognitoIdentityProviderClient, ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider';
import awsExports from '@/aws-exports';

const cognitoClient = new CognitoIdentityProviderClient({ region: awsExports.aws_cognito_region });

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized: missing auth header' }), { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized: missing token' }), { status: 401 });
  }

  try {
    let allUsers: object[] = [];
    let paginationToken: string | undefined;

    do {
      const command = new ListUsersCommand({
        UserPoolId: awsExports.aws_user_pools_id,
        Limit: 60,
        PaginationToken: paginationToken,
      });
      const result = await cognitoClient.send(command);
      allUsers = allUsers.concat(result.Users ?? []);
      paginationToken = result.PaginationToken;
    } while (paginationToken);

    console.log(`[list-users] returning ${allUsers.length} users`);
    return new Response(JSON.stringify(allUsers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[list-users] Cognito error:', error?.message || error);
    return new Response(
      JSON.stringify({ error: 'Failed to list users', details: error?.message || String(error) }),
      { status: 500 }
    );
  }
}

