// app/api/user-entry-counts/route.ts
import AWS from 'aws-sdk';

const lambda = new AWS.Lambda({ region: 'us-east-1' });
const FUNCTION_NAME = 'listUsersFunction-dev';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { userIds } = await request.json();

    if (!Array.isArray(userIds)) {
      return new Response(JSON.stringify({ error: 'userIds must be an array' }), { status: 400 });
    }

    const event = {
      httpMethod: 'POST',
      path: '/user-entry-counts',
      resource: '/user-entry-counts',
      body: JSON.stringify({ userIds }),
    };

    const result = await lambda.invoke({
      FunctionName: FUNCTION_NAME,
      Payload: JSON.stringify(event),
    }).promise();

    const lambdaResponse = JSON.parse(result.Payload as string);
    return new Response(lambdaResponse.body, {
      status: lambdaResponse.statusCode || 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[user-entry-counts] Lambda invoke error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get counts' }), { status: 500 });
  }
}

