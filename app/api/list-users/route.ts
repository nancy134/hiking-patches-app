// app/api/list-users/route.ts
import { NextResponse } from 'next/server';
import {
  LambdaClient,
  InvokeCommand,
} from '@aws-sdk/client-lambda';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization'); // e.g., "Bearer eyJ..."
  const token = authHeader?.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const lambdaClient = new LambdaClient({ region: 'us-east-1' });

  const payload = JSON.stringify({ token });

  const command = new InvokeCommand({
    FunctionName: 'listUsersFunction-staging',
    InvocationType: 'RequestResponse',
    Payload: new TextEncoder().encode(payload),
  });

  try {
    const response = await lambdaClient.send(command);

    const payload = JSON.parse(
      new TextDecoder('utf-8').decode(response.Payload)
    );

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Error calling Lambda listUsersFunction-staging:', error);
    return NextResponse.json(
      { error: 'Failed to call Lambda' },
      { status: 500 }
    );
  }
}

