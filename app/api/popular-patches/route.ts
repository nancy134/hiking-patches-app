// app/api/popular-patches/route.ts
import awsExports from '@/aws-exports';

export async function GET() {
  const apiInfo = awsExports.aws_cloud_logic_custom.find((api: { name: string }) => api.name === 'listusers');
  if (!apiInfo) {
    return new Response(JSON.stringify({ error: 'API endpoint not configured' }), { status: 500 });
  }

  try {
    const res = await fetch((apiInfo as { endpoint: string }).endpoint + '/popular-patches', {
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
