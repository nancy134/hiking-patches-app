// app/api/list-users/route.ts
import awsExports from '@/aws-exports';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized: missing auth header' }), { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized: missing token' }), { status: 401 });
  }

  const apiInfo = awsExports.aws_cloud_logic_custom.find((api: { name: string }) => api.name === 'listusers');
  if (!apiInfo) {
    return new Response(JSON.stringify({ error: 'API endpoint not configured' }), { status: 500 });
  }

  try {
    const res = await fetch((apiInfo as { endpoint: string }).endpoint + '/list-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await res.text();
    return new Response(text, { status: res.status });
  } catch (error: any) {
    console.error('[list-users] fetch failed:', error?.message || error);
    return new Response(
      JSON.stringify({ error: 'Failed to call Lambda', details: error?.message || String(error) }),
      { status: 500 }
    );
  }
}

