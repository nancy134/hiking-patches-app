'use client';

import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* "Links & Resources" card (prototype Direction B). Shared across      */
/* Patch / Mountain / Trail pages. Renders only the links that are      */
/* present, in a fixed order, so an entity with no links shows nothing. */
/* ------------------------------------------------------------------ */

export type LinkKind =
  | 'website' | 'facebook' | 'alltrails'
  | 'peakbagger' | 'weather' | 'traillink'
  | 'purchase' | 'form';

type LinkMeta = { label: string; hint: string; icon: ReactNode; tone: string };

/* Inline SVGs so we don't add an icon dependency. */
const globe = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
  </svg>
);
const facebook = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
  </svg>
);
const route = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    <circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h6a3 3 0 0 0 0-6H10a3 3 0 0 1 0-6h6" />
  </svg>
);
const summit = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    <path d="m3 20 6.5-12 4 7 2-3.5L21 20Z" /><path d="m8.5 11 1.5-3" />
  </svg>
);
const weather = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    <circle cx="8" cy="8" r="3" /><path d="M8 1v2M2 8H1m3.6-3.4L3 3m9 5h1a4 4 0 0 1 0 8H7a4 4 0 0 1-.5-8" />
  </svg>
);
const pin = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" />
  </svg>
);
const cart = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M3 4h2l2.4 12.4a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 8H6" />
  </svg>
);
const download = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    <path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
);

const META: Record<LinkKind, LinkMeta> = {
  website:    { label: 'Website',    hint: 'Official page',            icon: globe,    tone: 'text-slate-700 bg-slate-100' },
  facebook:   { label: 'Facebook',   hint: 'Community & updates',      icon: facebook, tone: 'text-blue-700 bg-blue-50' },
  alltrails:  { label: 'AllTrails',  hint: 'Map, photos & reviews',    icon: route,    tone: 'text-green-700 bg-green-50' },
  peakbagger: { label: 'Peakbagger', hint: 'Stats & trip reports',     icon: summit,   tone: 'text-amber-700 bg-amber-50' },
  weather:    { label: 'Weather',    hint: 'Mountain forecast',        icon: weather,  tone: 'text-sky-700 bg-sky-50' },
  traillink:  { label: 'TrailLink',  hint: 'Trail maps & info',        icon: pin,      tone: 'text-teal-700 bg-teal-50' },
  purchase:   { label: 'Buy Patch',  hint: 'Order the physical patch', icon: cart,     tone: 'text-indigo-700 bg-indigo-50' },
  form:       { label: 'Patch Form', hint: 'Printable form to fill out', icon: download, tone: 'text-purple-700 bg-purple-50' },
};

// Fixed display order regardless of prop key order.
const ORDER: LinkKind[] = [
  'website', 'facebook', 'alltrails',
  'peakbagger', 'weather', 'traillink',
  'purchase', 'form',
];

export default function ReferenceLinks({
  links,
  className = '',
}: {
  links: Partial<Record<LinkKind, string | null | undefined>>;
  className?: string;
}) {
  const items = ORDER.filter((k) => links[k]?.trim());
  if (items.length === 0) return null;

  return (
    <div className={`bg-white rounded shadow p-4 ${className}`}>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
        Links &amp; Resources
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((kind) => {
          const m = META[kind];
          return (
            <a
              key={kind}
              href={links[kind] as string}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-lg border border-gray-100 p-2.5 hover:border-gray-300 hover:bg-gray-50 transition"
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${m.tone}`}>
                {m.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-gray-900">{m.label}</span>
                <span className="block text-xs text-gray-500 truncate">{m.hint}</span>
              </span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto h-4 w-4 text-gray-300 group-hover:text-gray-500" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
}
