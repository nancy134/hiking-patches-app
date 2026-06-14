// app/api/list-users/route.ts
const LIST_USERS_BASE = process.env.LIST_USERS_API_URL;

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized: missing auth header' }), { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized: missing token' }), { status: 401 });
  }

  if (!LIST_USERS_BASE) {
    return new Response(JSON.stringify({ error: 'API endpoint not configured' }), { status: 500 });
  }

  try {
    const res = await fetch(LIST_USERS_BASE + 'list-users', {
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

