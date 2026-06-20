// app/api/owner-patch/[id]/route.ts
// Thin proxy to the list-users Lambda's /owner-patch-update route, which
// verifies patch ownership server-side before applying a scoped patch update.
const LIST_USERS_BASE = process.env.LIST_USERS_API_URL;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (!LIST_USERS_BASE) {
    return new Response(JSON.stringify({ error: 'API endpoint not configured' }), { status: 500 });
  }

  try {
    const { description, howToGet, imageUrl } = await request.json();

    const res = await fetch(LIST_USERS_BASE + 'owner-patch-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ patchId: id, description, howToGet, imageUrl }),
    });

    const text = await res.text();
    return new Response(text, { status: res.status });
  } catch (error: unknown) {
    console.error('[owner-patch] fetch failed:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to call Lambda', details: String(error) }),
      { status: 500 }
    );
  }
}
