// app/api/list-users/route.ts
import { NextResponse } from 'next/server';
import { CognitoIdentityProviderClient, ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider';
import awsExports from '@/aws-exports';


export async function GET() {
  console.log("GET");
  const client = new CognitoIdentityProviderClient({ region: 'us-east-1' }); // Replace with your region

  const command = new ListUsersCommand({
    UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID, // or hardcode for testing
    Limit: 25,
  });

  try {
    const response = await client.send(command);
    console.log(response);
    return NextResponse.json(response.Users);
  } catch (error) {
    console.error('Error listing users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

