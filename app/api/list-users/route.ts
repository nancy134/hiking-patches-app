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

  const apiInfo = awsExports.aws_cloud_logic_custom.find(api => api.name === 'listusers');
  if (!apiInfo) {
    return new Response(JSON.stringify({ error: 'API endpoint not configured' }), { status: 500 });
  }

  const url = apiInfo.endpoint + '/list-users';
  console.log('[list-users] calling:', url);
  console.log('[list-users] token length:', token.length);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });
    console.log("fetch returned");
    const text = await res.text(); // IMPORTANT: read raw text so we can see errors
    console.log('[list-users] status:', res.status);
    console.log('[list-users] response text:', text);

    return new Response(text, { status: res.status });
  } catch (error: any) {
    console.log("list-users caught error");
    console.error('[list-users] fetch failed:', error?.message || error);
    console.error('[list-users] full error:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to call Lambda',
        details: error?.message || String(error),
      }),
      { status: 500 }
    );
  }
}

