'use client';

// PROTOTYPE — UI exploration for "reference links" on Patch / Mountain / Trail
// pages. No DB wiring; everything below is mock data. Visit /prototype/references
// in the dev server to compare design directions. Safe to delete.

import { useState, type ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Icons (inline SVG so we don't add an icon dependency)               */
/* ------------------------------------------------------------------ */

const ic = {
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  clipboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1Z" /><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><path d="m9 14 2 2 4-4" />
    </svg>
  ),
  cart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M3 4h2l2.4 12.4a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 8H6" />
    </svg>
  ),
  route: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h6a3 3 0 0 0 0-6H10a3 3 0 0 1 0-6h6" />
    </svg>
  ),
  summit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="m3 20 6.5-12 4 7 2-3.5L21 20Z" /><path d="m8.5 11 1.5-3" />
    </svg>
  ),
  weather: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="8" cy="8" r="3" /><path d="M8 1v2M2 8H1m3.6-3.4L3 3m9 5h1a4 4 0 0 1 0 8H7a4 4 0 0 1-.5-8" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" /><path d="M19 17H6a2 2 0 0 0-2 2" />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/* Reference catalog: each "kind" gets a label, icon, and brand color  */
/* ------------------------------------------------------------------ */

type RefKind =
  | 'website' | 'facebook' | 'instagram' | 'tracker' | 'buy'
  | 'alltrails' | 'peakbagger' | 'weather' | 'wikipedia' | 'gpx' | 'gaia' | 'directions';

type RefMeta = { label: string; icon: ReactNode; tone: string };

// `tone` = Tailwind classes for the pill (text + bg + hover). Kept muted so the
// page doesn't turn into a rainbow; each brand still reads at a glance.
const REFS: Record<RefKind, RefMeta> = {
  website:    { label: 'Website',        icon: ic.globe,     tone: 'text-slate-700 bg-slate-100 hover:bg-slate-200 ring-slate-200' },
  facebook:   { label: 'Facebook',       icon: ic.facebook,  tone: 'text-blue-700 bg-blue-50 hover:bg-blue-100 ring-blue-200' },
  instagram:  { label: 'Instagram',      icon: ic.instagram, tone: 'text-pink-700 bg-pink-50 hover:bg-pink-100 ring-pink-200' },
  tracker:    { label: 'Track Progress', icon: ic.clipboard, tone: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 ring-emerald-200' },
  buy:        { label: 'Buy Patch',      icon: ic.cart,      tone: 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 ring-indigo-200' },
  alltrails:  { label: 'AllTrails',      icon: ic.route,     tone: 'text-green-700 bg-green-50 hover:bg-green-100 ring-green-200' },
  peakbagger: { label: 'Peakbagger',     icon: ic.summit,    tone: 'text-amber-700 bg-amber-50 hover:bg-amber-100 ring-amber-200' },
  weather:    { label: 'Weather',        icon: ic.weather,   tone: 'text-sky-700 bg-sky-50 hover:bg-sky-100 ring-sky-200' },
  wikipedia:  { label: 'Wikipedia',      icon: ic.book,      tone: 'text-gray-700 bg-gray-100 hover:bg-gray-200 ring-gray-200' },
  gpx:        { label: 'GPX Track',      icon: ic.download,  tone: 'text-purple-700 bg-purple-50 hover:bg-purple-100 ring-purple-200' },
  gaia:       { label: 'Gaia GPS',       icon: ic.pin,       tone: 'text-teal-700 bg-teal-50 hover:bg-teal-100 ring-teal-200' },
  directions: { label: 'Directions',     icon: ic.pin,       tone: 'text-rose-700 bg-rose-50 hover:bg-rose-100 ring-rose-200' },
};

// Optional one-line hints, used by the "resource grid" variant.
const HINTS: Partial<Record<RefKind, string>> = {
  website: 'Official patch page',
  facebook: 'Community & updates',
  tracker: 'Log your summits',
  buy: 'Order the physical patch',
  alltrails: 'Map, photos & reviews',
  peakbagger: 'Stats & trip reports',
  weather: 'Mountain forecast',
  wikipedia: 'Background & history',
  gpx: 'Download for your GPS',
  gaia: 'Open in Gaia GPS',
  directions: 'Trailhead navigation',
};

type Links = Partial<Record<RefKind, string>>;

/* ------------------------------------------------------------------ */
/* Mock entities — note each omits some links on purpose               */
/* ------------------------------------------------------------------ */

const patch: { name: string; links: Links } = {
  name: 'New England 4000 Footers',
  links: {
    website: '#', facebook: '#', buy: '#',
    // no tracker (in-app logging handles that) and no instagram → no pill
  },
};

const mountain: { name: string; links: Links } = {
  name: 'Mount Washington',
  links: {
    alltrails: '#', peakbagger: '#', weather: '#', wikipedia: '#',
    // no directions pill — the Google map covers navigation
  },
};

const trail: { name: string; links: Links } = {
  name: 'Tuckerman Ravine Trail',
  links: {
    alltrails: '#', gpx: '#', gaia: '#',
    // no peakbagger/weather/wiki → fewer pills, layout still fine
  },
};

function entries(links: Links): [RefKind, string][] {
  return (Object.keys(REFS) as RefKind[])
    .filter((k) => links[k])
    .map((k) => [k, links[k] as string]);
}

/* ------------------------------------------------------------------ */
/* Patch image placeholder (offline-safe stand-in for patch.imageUrl)  */
/* ------------------------------------------------------------------ */

// Real patch image (same one reused across every prototype). Mock data only.
const SAMPLE_IMG =
  'https://hikingpatchesapp0e9048b9369e4b4a8a610d6b803f349880ac-dev.s3.us-east-1.amazonaws.com/public/1749550940664-52-wav.jpeg';

function PatchImg({ className = 'w-40' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SAMPLE_IMG}
      alt="Sample patch"
      className={`${className} h-auto shrink-0 rounded-lg shadow ring-1 ring-black/5 object-contain`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* "Overall Patch Status" — per-user, interactive (logged-in only).    */
/* Distinct from reference links: this is YOUR progress, not the        */
/* patch's external links.                                              */
/* ------------------------------------------------------------------ */

function StatusRow() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
        Overall Patch Status:
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        In progress
      </span>
      <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">
        40% complete
      </span>
      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
        <span aria-hidden>♥</span> Wishlisted
      </span>
      <button className="inline-flex items-center gap-1 rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-100">
        ▾ Update
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Variant A — Branded pills (inline, wraps under the title)           */
/* ------------------------------------------------------------------ */

function PillsRow({ links }: { links: Links }) {
  const items = entries(links);
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(([kind, href]) => {
        const m = REFS[kind];
        return (
          <a
            key={kind}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset transition ${m.tone}`}
          >
            {m.icon}
            {m.label}
          </a>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Variant B — "Links & Resources" card with labeled tiles            */
/* ------------------------------------------------------------------ */

function ResourceCard({ links }: { links: Links }) {
  const items = entries(links);
  if (items.length === 0) return null;
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
        Links &amp; Resources
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map(([kind, href]) => {
          const m = REFS[kind];
          return (
            <a
              key={kind}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-lg border border-gray-100 p-2.5 hover:border-gray-300 hover:bg-gray-50 transition"
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${m.tone}`}>
                {m.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-gray-900">{m.label}</span>
                {HINTS[kind] && (
                  <span className="block text-xs text-gray-500 truncate">{HINTS[kind]}</span>
                )}
              </span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto h-4 w-4 text-gray-300 group-hover:text-gray-500">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Variant C — Compact icon bar (icon-only, label on hover)            */
/* ------------------------------------------------------------------ */

function IconBar({ links }: { links: Links }) {
  const items = entries(links);
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(([kind, href]) => {
        const m = REFS[kind];
        return (
          <a
            key={kind}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={m.label}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-inset transition ${m.tone}`}
          >
            {m.icon}
            <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 z-10">
              {m.label}
            </span>
          </a>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="mb-12">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-500">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function EntityCard({ name, kicker, links, variant }: { name: string; kicker: string; links: Links; variant: 'A' | 'B' | 'C' }) {
  const isPatch = kicker === 'Patch';
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{kicker}</p>
          <h3 className="text-xl font-bold mb-1">{name}</h3>
          <p className="text-gray-600 mb-3 max-w-prose">
            A short description of this {kicker.toLowerCase()} sits here, just like today. The
            reference links below only appear when the data exists.
          </p>
          {/* Status row: PATCH ONLY, and visually separate from the links */}
          {isPatch && <div className="mb-3"><StatusRow /></div>}

          {/* Reference links group */}
          {variant === 'A' && <PillsRow links={links} />}
          {variant === 'C' && <IconBar links={links} />}
        </div>

        {/* Image, like today's w-40 image on the right — patches only */}
        {isPatch && <PatchImg className="w-32 sm:w-40" />}
      </div>

      {/* Variant B's card sits full-width under the header */}
      {variant === 'B' && <div className="mt-4"><ResourceCard links={links} /></div>}
    </div>
  );
}

/* A faithful mock of the proposed patch header, with annotations for where
   each piece lives. This is the part that answers "where does status go?". */
function ProposedHeader() {
  return (
    <div className="rounded-xl border-2 border-blue-200 bg-white p-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-5">
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold mb-1">New England 4000 Footers</h3>
          <p className="text-gray-600 mb-1 max-w-prose">
            Summit all 67 official 4,000-foot peaks across New Hampshire, Vermont and Maine.
          </p>
          <p className="text-sm text-gray-700 mb-4"><strong>Regions:</strong> NH, VT, ME</p>

          {/* 1) YOUR progress — interactive, logged-in only */}
          <div className="rounded-lg bg-gray-50 ring-1 ring-gray-200 p-3 mb-4">
            <StatusRow />
          </div>

          {/* 2) THE PATCH's external links — static, same for everyone */}
          <PillsRow links={patch.links} />
        </div>
        <PatchImg className="w-32 sm:w-44" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Full-page Patch mock — Direction B                                  */
/* ------------------------------------------------------------------ */

const mockPeaks = [
  { n: 1, name: 'Mount Washington', elev: '6,288 ft', state: 'NH', dates: ['2024-07-12', '2025-09-03'] },
  { n: 2, name: 'Mount Adams', elev: '5,774 ft', state: 'NH', dates: ['2024-08-19'] },
  { n: 3, name: 'Mount Jefferson', elev: '5,712 ft', state: 'NH', dates: [] },
  { n: 4, name: 'Mount Monroe', elev: '5,372 ft', state: 'NH', dates: ['2025-06-21'] },
  { n: 5, name: 'Mount Madison', elev: '5,367 ft', state: 'NH', dates: [] },
];

const mockTrails = [
  { n: 1, name: 'Tuckerman Ravine Trail', length: 4.2, done: 4.2, remaining: 0, date: '2025-06-21' },
  { n: 2, name: 'Lion Head Trail', length: 4.5, done: 2.0, remaining: 2.5, date: null },
  { n: 3, name: 'Jewell Trail', length: 5.1, done: 0, remaining: 5.1, date: null },
];

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded shadow p-4 ${className}`}>{children}</div>;
}

// Small button that stands in for "opens a dialog" (ascent log / trail progress).
function LogButton({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-1 rounded-md border border-blue-300 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100">
      {ic.clipboard}
      {label}
    </button>
  );
}

/* Depiction of the popup the Action buttons open (not a real modal here). */
function AscentDialogMock() {
  return (
    <div className="relative rounded-xl ring-1 ring-gray-300 bg-gray-500/20 p-6">
      <p className="absolute top-2 left-3 text-xs font-medium text-gray-500">
        ↓ what the &ldquo;Ascent Log&rdquo; button opens
      </p>
      <div className="mx-auto max-w-sm rounded-lg bg-white shadow-xl ring-1 ring-black/10 p-5 mt-4">
        <h3 className="text-lg font-bold mb-3">Update Ascents for Mount Washington</h3>
        <div className="space-y-2 mb-3">
          {['2024-07-12', '2025-09-03'].map((d) => (
            <div key={d} className="flex items-center gap-2">
              <input type="date" defaultValue={d} className="flex-1 rounded border px-2 py-1 text-sm" />
              <button className="text-xs font-semibold text-red-600 hover:underline">Remove</button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input type="date" className="flex-1 rounded border px-2 py-1 text-sm text-gray-400" />
            <button className="text-xs font-semibold text-red-600 hover:underline invisible">Remove</button>
          </div>
        </div>
        <button className="text-sm font-semibold text-blue-600 hover:underline mb-4">+ Add another date</button>
        <div className="flex justify-end gap-2">
          <button className="rounded bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300">Cancel</button>
          <button className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
}

function FullPagePatchB({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="rounded-xl ring-1 ring-gray-300 bg-gray-100 overflow-hidden">
      {/* fake browser chrome so it reads as a full page */}
      <div className="flex items-center gap-1.5 bg-gray-200 px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <span className="ml-3 rounded bg-white/70 px-2 py-0.5 text-xs text-gray-500">
          /patch/new-england-4000-footers
        </span>
        <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${loggedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-300 text-gray-600'}`}>
          {loggedIn ? 'Signed in' : 'Signed out'}
        </span>
      </div>

      <div className="p-5 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold mb-1">New England 4000 Footers</h1>
            <p className="text-lg text-gray-700 mb-1">
              Summit all 67 official 4,000-foot peaks across New Hampshire, Vermont and Maine.
            </p>
            <p className="text-gray-700 mb-3"><strong>Regions:</strong> NH, VT, ME</p>
            {loggedIn && (
              <div className="rounded-lg bg-gray-50 ring-1 ring-gray-200 p-3">
                <StatusRow />
              </div>
            )}
          </div>
          <PatchImg className="w-36 sm:w-44" />
        </div>

        {/* Signed-out CTA — full-width emerald banner, promoted out of the header */}
        {!loggedIn && (
          <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="text-2xl leading-none" aria-hidden>🥾</span>
                <div>
                  <p className="text-lg font-semibold">Track your progress on this patch</p>
                  <p className="text-sm text-emerald-50">
                    Log every ascent and trail mile, and watch your patch fill in — it&apos;s free.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50 transition-colors"
              >
                Sign in — it&apos;s free
              </button>
            </div>
          </div>
        )}

        {/* Links & Resources (Direction B) */}
        <ResourceCard links={patch.links} />

        {/* Peaks — List / Map toggle */}
        <PeaksSection loggedIn={loggedIn} />

        {/* Trails table */}
        <Card>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-xl font-semibold">Trails in Patch</h2>
            {loggedIn && <span className="text-sm text-gray-500">6.2 of 13.8 mi completed</span>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-2 w-8 text-right">#</th>
                  <th className="py-2 pr-3">Trail name</th>
                  <th className="py-2 pr-3">Length</th>
                  {loggedIn && <th className="py-2 pr-3">Miles completed</th>}
                  {loggedIn && <th className="py-2 pr-3">Miles remaining</th>}
                  {loggedIn && <th className="py-2 pr-3">Date completed</th>}
                  {loggedIn && <th className="py-2">Action</th>}
                </tr>
              </thead>
              <tbody>
                {mockTrails.map((t) => (
                  <tr key={t.n} className="border-b last:border-0 align-middle">
                    <td className="py-2 pr-2 text-right text-gray-500">{t.n}</td>
                    <td className="py-2 pr-3"><span className="text-blue-600 font-medium">{t.name}</span></td>
                    <td className="py-2 pr-3 text-gray-600">{t.length.toFixed(2)} mi</td>
                    {loggedIn && <td className="py-2 pr-3 text-gray-600">{t.done.toFixed(2)}</td>}
                    {loggedIn && <td className="py-2 pr-3 text-gray-600">{t.remaining.toFixed(2)}</td>}
                    {loggedIn && <td className="py-2 pr-3 text-gray-600">{t.date ?? <span className="text-gray-400">—</span>}</td>}
                    {loggedIn && <td className="py-2"><LogButton label="Log Progress" /></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* The dialog that the Action buttons open — only meaningful when signed in */}
        {loggedIn && <AscentDialogMock />}

        {/* Related patches */}
        <Card>
          <h2 className="text-lg font-semibold mb-3">Related Patches</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['NH 48', 'New England 67', 'Adirondack 46'].map((name) => (
              <div key={name} className="rounded-lg border border-gray-100 p-3 text-center">
                <PatchImg className="w-20 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-800">{name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mountains in Patch — List / Map toggle                              */
/* ------------------------------------------------------------------ */

function PeaksSection({ loggedIn }: { loggedIn: boolean }) {
  const [view, setView] = useState<'list' | 'map'>('list');
  return (
    <Card>
      <div className="flex items-baseline justify-between mb-3 gap-3">
        <h2 className="text-xl font-semibold">Mountains in Patch</h2>
        <div className="flex items-center gap-3">
          {loggedIn && <span className="text-sm text-gray-500">3 of 67 climbed</span>}
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      {view === 'list' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-2 w-8 text-right">#</th>
                <th className="py-2 pr-3">Mountain</th>
                <th className="py-2 pr-3">Elevation</th>
                <th className="py-2 pr-3">State</th>
                {loggedIn && <th className="py-2 pr-3">Dates Ascended</th>}
                {loggedIn && <th className="py-2">Action</th>}
              </tr>
            </thead>
            <tbody>
              {mockPeaks.map((p) => (
                <tr key={p.n} className="border-b last:border-0 align-middle">
                  <td className="py-2 pr-2 text-right text-gray-500">{p.n}</td>
                  <td className="py-2 pr-3"><span className="text-blue-600 font-medium">{p.name}</span></td>
                  <td className="py-2 pr-3 text-gray-600">{p.elev}</td>
                  <td className="py-2 pr-3 text-gray-600">{p.state}</td>
                  {loggedIn && (
                    <td className="py-2 pr-3 text-gray-600">
                      {p.dates.length ? p.dates.join(', ') : <span className="text-gray-400">—</span>}
                    </td>
                  )}
                  {loggedIn && <td className="py-2"><LogButton label="Ascent Log" /></td>}
                </tr>
              ))}
              <tr><td colSpan={loggedIn ? 6 : 4} className="py-2 text-center text-sm text-gray-400">…62 more</td></tr>
            </tbody>
          </table>
        </div>
      ) : (
        <PeaksMapMock loggedIn={loggedIn} />
      )}
    </Card>
  );
}

/* Segmented List / Map control. */
function ViewToggle({ view, onChange }: { view: 'list' | 'map'; onChange: (v: 'list' | 'map') => void }) {
  const base = 'inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-md transition-colors';
  const active = 'bg-white text-gray-900 shadow-sm';
  const idle = 'text-gray-500 hover:text-gray-700';
  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-0.5 ring-1 ring-gray-200">
      <button type="button" onClick={() => onChange('list')} className={`${base} ${view === 'list' ? active : idle}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        List
      </button>
      <button type="button" onClick={() => onChange('map')} className={`${base} ${view === 'map' ? active : idle}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <polygon points="1 6 8 3 16 6 23 3 23 18 16 21 8 18 1 21 1 6" /><line x1="8" y1="3" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="21" />
        </svg>
        Map
      </button>
    </div>
  );
}

/* Faux Google Map depiction with pins — stands in for the real embed. */
function PeaksMapMock({ loggedIn }: { loggedIn: boolean }) {
  const pins = [
    { top: '30%', left: '25%', done: true },
    { top: '55%', left: '40%', done: false },
    { top: '40%', left: '62%', done: true },
    { top: '68%', left: '72%', done: false },
    { top: '22%', left: '78%', done: false },
  ];
  return (
    <div>
      <div className="relative h-72 w-full overflow-hidden rounded-lg ring-1 ring-gray-200 bg-[#e8ece4]">
        {/* faux terrain */}
        <div className="absolute inset-0 opacity-60"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #cfe0c3 0 18%, transparent 20%), radial-gradient(circle at 70% 65%, #d6e4cc 0 22%, transparent 24%), linear-gradient(#eef2ea, #e2e8dd)' }} />
        {/* faux roads */}
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <path d="M0 200 Q 200 120 400 220 T 800 180" fill="none" stroke="#ffffff" strokeWidth="4" />
          <path d="M120 0 Q 200 200 160 400" fill="none" stroke="#ffffff" strokeWidth="3" />
        </svg>
        {/* pins */}
        {pins.map((pin, i) => (
          <div key={i} className="absolute -translate-x-1/2 -translate-y-full" style={{ top: pin.top, left: pin.left }}>
            <svg viewBox="0 0 24 24" className={`h-7 w-7 drop-shadow ${loggedIn && pin.done ? 'text-emerald-600' : 'text-red-500'}`} fill="currentColor">
              <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7Z" />
              <circle cx="12" cy="9" r="2.5" fill="white" />
            </svg>
          </div>
        ))}
        <span className="absolute bottom-2 right-2 rounded bg-white/80 px-2 py-0.5 text-[11px] text-gray-500">Map depiction — real page uses Google Maps</span>
      </div>
      {loggedIn && (
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Climbed</span>
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Not yet</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits for Mountain / Trail standalone pages                   */
/* ------------------------------------------------------------------ */

function Chrome({ path, loggedIn }: { path: string; loggedIn: boolean }) {
  return (
    <div className="flex items-center gap-1.5 bg-gray-200 px-3 py-2">
      <span className="h-3 w-3 rounded-full bg-red-400" />
      <span className="h-3 w-3 rounded-full bg-yellow-400" />
      <span className="h-3 w-3 rounded-full bg-green-400" />
      <span className="ml-3 rounded bg-white/70 px-2 py-0.5 text-xs text-gray-500">{path}</span>
      <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${loggedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-300 text-gray-600'}`}>
        {loggedIn ? 'Signed in' : 'Signed out'}
      </span>
    </div>
  );
}

// Stand-in for PatchMap / the AllTrails embed iframe.
function MapBlock({ label }: { label: string }) {
  return (
    <div className="relative h-56 rounded-lg ring-1 ring-gray-300 bg-[linear-gradient(135deg,#dbeafe_25%,transparent_25%),linear-gradient(225deg,#dcfce7_25%,transparent_25%),linear-gradient(45deg,#dbeafe_25%,transparent_25%),linear-gradient(315deg,#dcfce7_25%,#eef2ff_25%)] bg-[length:32px_32px] flex items-center justify-center">
      <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-gray-600 inline-flex items-center gap-1.5">
        {ic.pin}{label}
      </span>
    </div>
  );
}

function StatusCard({ status, action, loggedIn, signedOutText }: { status: ReactNode; action: string; loggedIn: boolean; signedOutText: string }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm text-gray-500">Your Status</div>
          <div className="text-base">{loggedIn ? status : <span className="text-gray-600">Not signed in</span>}</div>
        </div>
        {loggedIn ? (
          <button className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">{action}</button>
        ) : (
          <div className="text-sm text-gray-600">{signedOutText}</div>
        )}
      </div>
    </Card>
  );
}

/* Trail progress dialog depiction (date completed, miles completed, notes). */
function TrailDialogMock() {
  return (
    <div className="relative rounded-xl ring-1 ring-gray-300 bg-gray-500/20 p-6">
      <p className="absolute top-2 left-3 text-xs font-medium text-gray-500">
        ↓ what the &ldquo;Update Progress&rdquo; button opens
      </p>
      <div className="mx-auto max-w-sm rounded-lg bg-white shadow-xl ring-1 ring-black/10 p-5 mt-4">
        <h3 className="text-lg font-bold mb-3">Log Progress — Lion Head Trail</h3>
        <label className="block text-sm font-medium mb-1">Date completed</label>
        <input type="date" defaultValue="" className="w-full rounded border px-2 py-1 text-sm mb-3 text-gray-400" />
        <label className="block text-sm font-medium mb-1">Miles completed</label>
        <input type="number" defaultValue="2.0" className="w-full rounded border px-2 py-1 text-sm mb-1" />
        <p className="text-xs text-gray-500 mb-3">2.50 mi remaining of 4.50</p>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea rows={2} placeholder="Optional notes…" className="w-full rounded border px-2 py-1 text-sm mb-4" />
        <div className="flex justify-end gap-2">
          <button className="rounded bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300">Cancel</button>
          <button className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
}

function FullPageMountainB({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="rounded-xl ring-1 ring-gray-300 bg-gray-100 overflow-hidden">
      <Chrome path="/mountain/mount-washington" loggedIn={loggedIn} />
      <div className="p-5 space-y-6">
        <a className="text-sm text-blue-600 hover:underline">← Back to Patch</a>
        <div>
          <h1 className="text-3xl font-bold mb-2">Mount Washington</h1>
          <div className="text-gray-700 space-y-1">
            <div><span className="font-semibold">Elevation:</span> 6,288 ft</div>
            <div><span className="font-semibold">Location:</span> Sargent&apos;s Purchase, NH</div>
            <div><span className="font-semibold">Coordinates:</span> 44.27059, -71.30339</div>
          </div>
        </div>

        <ResourceCard links={mountain.links} />

        <MapBlock label="Google Map" />

        <StatusCard
          loggedIn={loggedIn}
          action="Update Ascents"
          signedOutText="Sign in to log your ascents."
          status={<>Climbed 2 times — <span className="text-gray-600">2024-07-12, 2025-09-03</span></>}
        />

        {loggedIn && <AscentDialogMock />}
      </div>
    </div>
  );
}

function FullPageTrailB({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="rounded-xl ring-1 ring-gray-300 bg-gray-100 overflow-hidden">
      <Chrome path="/trail/lion-head-trail" loggedIn={loggedIn} />
      <div className="p-5 space-y-6">
        <a className="text-sm text-blue-600 hover:underline">← Back to Patch</a>
        <div>
          <h1 className="text-3xl font-bold mb-2">Lion Head Trail</h1>
          <div className="text-gray-700 mb-3"><span className="font-semibold">Length:</span> 4.50 miles</div>
          <p className="text-gray-600 max-w-prose">
            A steep, rocky route to the summit cone of Mount Washington, used as the
            winter alternative to Tuckerman Ravine. Exposed above treeline.
          </p>
        </div>

        <ResourceCard links={trail.links} />

        <StatusCard
          loggedIn={loggedIn}
          action="Update Progress"
          signedOutText="Sign in to log your trail progress."
          status={<>2.00 of 4.50 mi completed — <span className="text-gray-600">in progress</span></>}
        />

        {loggedIn && <TrailDialogMock />}
      </div>
    </div>
  );
}

export default function ReferencesPrototype() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Reference Links — UI Prototype</h1>
        <p className="text-gray-500 mt-1">
          Three directions for surfacing external links (Website, Facebook, AllTrails,
          Peakbagger, weather, GPX, …). Pills only render when the entity has that link.
          Mock data only — no DB changes.
        </p>
      </header>

      <Section title="Proposed patch header (with image + status)" subtitle="How the pieces compose. Status = your progress (boxed). Pills = the patch's links. Image stays top-right.">
        <ProposedHeader />
        <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
          <p className="rounded bg-gray-50 ring-1 ring-gray-200 p-3 text-gray-700">
            <strong className="text-gray-900">① Overall Patch Status</strong> stays its own
            labeled, boxed row right under the description — it&apos;s interactive and
            per-user, so it should read as &ldquo;yours,&rdquo; not as another link.
          </p>
          <p className="rounded bg-gray-50 ring-1 ring-gray-200 p-3 text-gray-700">
            <strong className="text-gray-900">② Reference pills</strong> sit just below as a
            distinct group. These replace the links buried in the description / &ldquo;How to
            Get This Patch&rdquo; prose — not the title, image, or status.
          </p>
        </div>
      </Section>

      <Section title="Direction A — Branded pills" subtitle="Inline, wraps under the title. Lowest visual weight; great on mobile.">
        <div className="space-y-4">
          <EntityCard kicker="Patch" name={patch.name} links={patch.links} variant="A" />
          <EntityCard kicker="Mountain" name={mountain.name} links={mountain.links} variant="A" />
          <EntityCard kicker="Trail" name={trail.name} links={trail.links} variant="A" />
        </div>
      </Section>

      <Section title="Direction B — Links & Resources card" subtitle="A dedicated card with labels + hints. More scannable, more vertical space.">
        <div className="space-y-4">
          <EntityCard kicker="Patch" name={patch.name} links={patch.links} variant="B" />
          <EntityCard kicker="Mountain" name={mountain.name} links={mountain.links} variant="B" />
          <EntityCard kicker="Trail" name={trail.name} links={trail.links} variant="B" />
        </div>
      </Section>

      <Section title="Direction C — Compact icon bar" subtitle="Icon-only, label on hover. Most compact; relies on recognizable icons.">
        <div className="space-y-4">
          <EntityCard kicker="Patch" name={patch.name} links={patch.links} variant="C" />
          <EntityCard kicker="Mountain" name={mountain.name} links={mountain.links} variant="C" />
          <EntityCard kicker="Trail" name={trail.name} links={trail.links} variant="C" />
        </div>
      </Section>

      <Section
        title="Full patch page — Direction B (signed in)"
        subtitle="Logging is a dialog, not a checkbox. Peaks show dates ascended; trails show miles completed/remaining + date. Progress % folded into Overall Patch Status."
      >
        <FullPagePatchB loggedIn />
      </Section>

      <Section
        title="Full patch page — Direction B (signed out)"
        subtitle="No status row or logging actions — just the mountains/trails and their pertinent info, plus a prompt to sign in."
      >
        <FullPagePatchB loggedIn={false} />
      </Section>

      <Section
        title="Mountain page — Direction B (signed in)"
        subtitle="References as a resources card (AllTrails, Peakbagger, Weather, Wikipedia) + Google map. Your Status shows ascent dates; Update Ascents opens the dialog."
      >
        <FullPageMountainB loggedIn />
      </Section>

      <Section
        title="Mountain page — Direction B (signed out)"
        subtitle="Facts + references + map only. No status or logging."
      >
        <FullPageMountainB loggedIn={false} />
      </Section>

      <Section
        title="Trail page — Direction B (signed in)"
        subtitle="References (AllTrails, GPX, Gaia GPS). Your Status shows miles completed; Update Progress opens the trail dialog."
      >
        <FullPageTrailB loggedIn />
      </Section>

      <Section
        title="Trail page — Direction B (signed out)"
        subtitle="Length + description + references only. No status or logging."
      >
        <FullPageTrailB loggedIn={false} />
      </Section>

      <footer className="mt-12 rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900">
        <strong>Note:</strong> This is a throwaway prototype at <code>/prototype/references</code>.
        Pick a direction (or mix — e.g. pills on the page + a resources card in a sidebar) and
        we&apos;ll design the data model to back it.
      </footer>
    </div>
  );
}
