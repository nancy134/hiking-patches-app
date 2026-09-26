// A bare "www.example.com" used as an href is a *relative* link — the browser
// resolves it against the current path, so a patch page would navigate to
// /patch/www.example.com. Admin-entered URLs are not guaranteed to carry a
// scheme, so normalise before rendering rather than trusting the stored value.
export function absoluteUrl(raw?: string | null): string | null {
  const v = (raw ?? '').trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^\/\//.test(v)) return `https:${v}`;
  // Anything that looks like a hostname gets https://; anything else (a bare
  // word, a relative path someone pasted by mistake) is not a usable link.
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/|$|\?|#)/i.test(v)) return `https://${v}`;
  return null;
}
