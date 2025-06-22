// app/api/list-users/route.ts
import awsExports from '@/aws-exports';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const token = authHeader?.split(' ')[1];
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const apiInfo = awsExports.aws_cloud_logic_custom.find(api => api.name === 'listusers');
  if (!apiInfo) {
    return new Response(JSON.stringify({ error: 'API endpoint not configured' }), { status: 500 });
  }
  try {
    const res = await fetch(apiInfo.endpoint + '/list-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      throw new Error(`Lambda call failed: ${res.statusText}`);
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Error calling Lambda:', error);
    return new Response(JSON.stringify({ error: 'Failed to call Lambda' }), { status: 500 });
  }
}

