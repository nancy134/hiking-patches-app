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

/**
 * Normalise a group of URL form fields before saving.
 *
 * Returns the value to persist for each field — blank becomes null, a usable
 * address is made absolute — plus a message for any field that isn't a web
 * address at all, keyed by field name so a form can show it in place.
 */
export function normaliseUrlFields<K extends string>(
  raw: Record<K, string>,
  labels: Record<K, string>
): { values: Record<K, string | null>; errors: Partial<Record<K, string>> } {
  const values = {} as Record<K, string | null>;
  const errors: Partial<Record<K, string>> = {};

  (Object.keys(raw) as K[]).forEach((field) => {
    const trimmed = (raw[field] ?? '').trim();
    if (!trimmed) {
      values[field] = null;
      return;
    }
    const absolute = absoluteUrl(trimmed);
    if (absolute) values[field] = absolute;
    else errors[field] = `${labels[field]} doesn't look like a web address.`;
  });

  return { values, errors };
}
