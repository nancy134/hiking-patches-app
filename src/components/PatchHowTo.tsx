'use client';

import ReactMarkdown from 'react-markdown';
import { absoluteUrl } from '@/lib/urls';

/* ------------------------------------------------------------------ */
/* "How to get this patch" — the prose explanation, with the patch's   */
/* resources woven in as inline named links rather than bare URLs.     */
/*                                                                     */
/* The prose comes from the howToGet field, which has URLs pasted into  */
/* it. Those read badly, so inline links are relabelled to read as       */
/* names — never removed, see humaniseLinks. A generated closing         */
/* sentence then points at whichever resources the patch has.           */
/* ------------------------------------------------------------------ */

export type HowToLinks = {
  website?: string | null;
  facebook?: string | null;
  alltrails?: string | null;
  purchase?: string | null;
  form?: string | null;
};

// How each resource reads inside the closing sentence.
const PHRASES: Record<keyof HowToLinks, string> = {
  website:   'visit the official website',
  facebook:  'join the Facebook page',
  alltrails: 'browse the route on AllTrails',
  form:      'download the printable form',
  purchase:  'order the patch',
};

const ORDER: (keyof HowToLinks)[] = ['website', 'facebook', 'alltrails', 'form', 'purchase'];

// Somewhere to read about the patch, versus something to go and do. They need
// separate sentences: "Order the patch for more details" is nonsense, because
// ordering is the action, not a source of information.
const INFO: (keyof HowToLinks)[] = ['website', 'facebook', 'alltrails'];

const norm = (u: string) => u.trim().replace(/\/+$/, '').toLowerCase();

/**
 * Make the prose readable without removing any of it.
 *
 * The stored text has URLs pasted inline, usually as a markdown link whose
 * label IS the URL: "Hike all 52 peaks on the list: [https://...](https://...)".
 * Rendering that verbatim is ugly, but *deleting* it is worse — the same shape
 * carries a bare pointer ("The official website is here: <url>") in one patch
 * and the actual requirement in the next, and nothing in the text distinguishes
 * them. So we only relabel: the link stays, it just reads as a name instead of
 * a URL. Nothing the admin wrote is ever dropped.
 */
function humaniseLinks(md: string, named: Map<string, string>): string {
  const label = (url: string) => {
    const known = named.get(norm(url));
    if (known) return known;
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return 'link';
    }
  };

  // Markdown links are set aside first and restored last. Linkifying bare URLs
  // in between would otherwise match the URL inside a link this pass just
  // rewrote and nest it: [foo]([foo](https://...)).
  // Sentinel written as an escape so this file stays plain ASCII text — a
  // literal control byte here makes git treat the source as binary. It must be
  // a character that cannot occur in the prose, or the restore pass below would
  // match digits in the text itself ("52 peaks") and swap in a placeholder.
  const MARK = '\u0001';
  const held: string[] = [];
  const hold = (s: string) => `${MARK}${held.push(s) - 1}${MARK}`;

  let out = md.replace(/\[([^\]]*)\]\(([^)\s]+)([^)]*)\)/g, (match, text: string, url: string) => {
    const labelIsUrl = /^https?:\/\//i.test(text.trim()) || text.trim() === '';
    return hold(labelIsUrl ? `[${label(url)}](${url})` : match);
  });

  out = out.replace(/(^|[\s(])(https?:\/\/[^\s)\]]+)/g, (m, pre: string, url: string) =>
    `${pre}${hold(`[${label(url)}](${url})`)}`
  );

  return out
    .replace(new RegExp(MARK + '(\\d+)' + MARK, 'g'), (m: string, i: string) => held[Number(i)])
    // Stray escaped line-breaks left over from the CSV round-trip.
    .replace(/\\(\s*\n)/g, '$1')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

export default function PatchHowTo({
  howToGet,
  links,
  className = '',
}: {
  howToGet?: string | null;
  links: HowToLinks;
  className?: string;
}) {
  const resolved = ORDER.map((k) => [k, absoluteUrl(links[k])] as const).filter(
    (e): e is readonly [keyof HowToLinks, string] => e[1] !== null
  );

  // Friendly names for the URLs we know about, so an inline link to the same
  // place reads "official website" rather than the raw address.
  const NOUNS: Record<keyof HowToLinks, string> = {
    website: 'official website',
    facebook: 'Facebook page',
    alltrails: 'AllTrails',
    form: 'printable form',
    purchase: 'purchase page',
  };
  const named = new Map(resolved.map(([kind, url]) => [norm(url), NOUNS[kind]]));
  const prose = humaniseLinks((howToGet ?? '').trim(), named);

  if (!prose && resolved.length === 0) return null;

  // "visit the official website or join the Facebook page" / commas for 3+.
  const series = (entries: readonly (readonly [keyof HowToLinks, string])[]) =>
    entries.map(([kind, url], i) => {
      const phrase = PHRASES[kind];
      const text = i === 0 ? phrase.charAt(0).toUpperCase() + phrase.slice(1) : phrase;
      const sep =
        i === 0 ? null : i === entries.length - 1 ? (entries.length > 2 ? ', or ' : ' or ') : ', ';
      return (
        <span key={kind}>
          {sep}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            {text}
          </a>
        </span>
      );
    });

  const info = resolved.filter(([k]) => INFO.includes(k));
  const actions = resolved.filter(([k]) => !INFO.includes(k));

  return (
    <div className={`bg-white rounded shadow p-4 ${className}`}>
      <h2 className="text-xl font-semibold mb-2">How to Get This Patch</h2>

      {prose && (
        <div className="prose max-w-none text-gray-800">
          <ReactMarkdown
            components={{
              a: ({ href, children }) => {
                const safe = absoluteUrl(href);
                return safe ? (
                  <a href={safe} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                    {children}
                  </a>
                ) : (
                  <>{children}</>
                );
              },
            }}
          >
            {prose}
          </ReactMarkdown>
        </div>
      )}

      {resolved.length > 0 && (
        <p className={`text-gray-800 ${prose ? 'mt-2' : ''}`}>
          {info.length > 0 && <>{series(info)} for more details.</>}
          {info.length > 0 && actions.length > 0 && ' '}
          {actions.length > 0 && <>{series(actions)}.</>}
        </p>
      )}
    </div>
  );
}
