'use client';

// Embeds an AllTrails widget for a mountain/trail. The admin stores just the
// widget src URL (e.g. https://www.alltrails.com/widget/trail/...); we build the
// <iframe> here with fixed attributes. Fail-soft: renders nothing if there's no
// URL, or if the URL isn't an AllTrails widget (guards against arbitrary iframe
// injection via the admin field).

function isAllTrailsWidget(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.protocol === 'https:' &&
      u.hostname === 'www.alltrails.com' &&
      u.pathname.startsWith('/widget/')
    );
  } catch {
    return false;
  }
}

export default function AllTrailsEmbed({ url }: { url?: string | null }) {
  const src = (url ?? '').trim();
  if (!src || !isAllTrailsWidget(src)) return null;

  return (
    <div className="mb-6">
      <iframe
        className="alltrails w-full rounded border"
        src={src}
        height={400}
        frameBorder={0}
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        title="AllTrails: Trail Guides and Maps for Hiking, Camping, and Running"
      />
    </div>
  );
}
