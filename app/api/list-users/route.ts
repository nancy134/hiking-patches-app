// app/api/list-users/route.ts
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  console.log("authHeader:");
  console.log(authHeader);
  const token = authHeader?.split(' ')[1];
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const res = await fetch('https://zlshwrb5h6.execute-api.us-east-1.amazonaws.com/staging/list-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // if your API Gateway uses Cognito auth
      },
      body: JSON.stringify({ token }), // if your Lambda expects it in body
    });

    console.log("res:");
    console.log(res);
    if (!res.ok) {
      throw new Error(`Lambda call failed: ${res.statusText}`);
    }

    const data = await res.json();
    console.log("data:");
    console.log(data);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Error calling Lambda:', error);
    return new Response(JSON.stringify({ error: 'Failed to call Lambda' }), { status: 500 });
  }
}

