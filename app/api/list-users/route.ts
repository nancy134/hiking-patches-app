// app/api/list-users/route.ts
import { NextResponse } from 'next/server';
import {
  LambdaClient,
  InvokeCommand,
} from '@aws-sdk/client-lambda';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization'); // e.g., "Bearer eyJ..."
  console.log("authHeader");
  console.log(authHeader);
  const token = authHeader?.split(' ')[1]; // Extract token from "Bearer <token>"
  console.log("token:");
  console.log(token);

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const lambdaClient = new LambdaClient({ region: 'us-east-1' });

  const payload = JSON.stringify({ token });
  console.log("payload:");
  console.log(payload);

  const command = new InvokeCommand({
    FunctionName: 'listUsersFunction-staging',
    InvocationType: 'RequestResponse',
    Payload: new TextEncoder().encode(payload),
  });
  console.log("command:");
  console.log(command);

  try {
    const response = await lambdaClient.send(command);
    console.log("response:");
    console.log(response);
    const payload = JSON.parse(
      new TextDecoder('utf-8').decode(response.Payload)
    );
    console.log("payload:");
    console.log(payload);

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Error calling Lambda listUsersFunction-staging:', error);
    return NextResponse.json(
      { error: 'Failed to call Lambda' },
      { status: 500 }
    );
  }
}

