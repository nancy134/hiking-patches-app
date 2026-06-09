// app/api/popular-patches/route.ts
const LIST_USERS_BASE = process.env.LIST_USERS_API_URL;

export async function GET() {
  if (!LIST_USERS_BASE) {
    return new Response(JSON.stringify({ error: 'API endpoint not configured' }), { status: 500 });
  }

  try {
    const res = await fetch(LIST_USERS_BASE + 'popular-patches', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const text = await res.text();
    return new Response(text, { status: res.status });
  } catch (error: unknown) {
    console.error('[popular-patches] fetch failed:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to call Lambda', details: String(error) }),
      { status: 500 }
    );
  }
}
