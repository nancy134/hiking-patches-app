'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import Link from 'next/link';

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

// Marker colors. Priority: climbed (green) > delisted-and-not-climbed (yellow) >
// not climbed (blue). Anonymous visitors never have completion data, so they see
// blue/yellow only.
const DONE = { background: '#16a34a', borderColor: '#15803d', glyphColor: '#bbf7d0' };
const TODO = { background: '#2563eb', borderColor: '#1d4ed8', glyphColor: '#bfdbfe' };
const DELISTED = { background: '#eab308', borderColor: '#ca8a06', glyphColor: '#fef9c3' };

export type MapPeak = {
  id: string;
  name: string;
  elevation?: number | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  delisted?: boolean | null;
};

type PlottablePeak = MapPeak & { latitude: number; longitude: number };

interface PatchMapProps {
  peaks: MapPeak[];
  completedIds: Set<string>;
  patchId: string;
}

// Fits the viewport to all plotted peaks. Lives as a child so it can call
// useMap() (only available inside <Map>). Re-fits whenever the peak set changes.
function FitBounds({ peaks }: { peaks: PlottablePeak[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || peaks.length === 0) return;

    if (peaks.length === 1) {
      map.setCenter({ lat: peaks[0].latitude, lng: peaks[0].longitude });
      map.setZoom(11);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    peaks.forEach((p) => bounds.extend({ lat: p.latitude, lng: p.longitude }));
    map.fitBounds(bounds, 48);
  }, [map, peaks]);

  return null;
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-3 w-3 rounded-full border"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

export default function PatchMap({ peaks, completedIds, patchId }: PatchMapProps) {
  const [active, setActive] = useState<string | null>(null);

  const plottable = useMemo<PlottablePeak[]>(
    () =>
      peaks.filter(
        (p): p is PlottablePeak =>
          typeof p.latitude === 'number' && typeof p.longitude === 'number'
      ),
    [peaks]
  );

  if (!MAPS_KEY) {
    return (
      <div className="flex h-[420px] w-full items-center justify-center rounded border bg-gray-50 text-sm text-gray-500">
        Map unavailable.
      </div>
    );
  }

  if (plottable.length === 0) {
    return (
      <div className="flex h-[420px] w-full items-center justify-center rounded border bg-gray-50 text-sm text-gray-500">
        No mapped peaks for this selection.
      </div>
    );
  }

  const center = { lat: plottable[0].latitude, lng: plottable[0].longitude };
  const activePeak = plottable.find((p) => p.id === active) ?? null;

  // Only show legend entries for categories actually present in the current view.
  const hasClimbed = plottable.some((p) => completedIds.has(p.id));
  const hasDelisted = plottable.some(
    (p) => p.delisted && !completedIds.has(p.id)
  );
  const hasTodo = plottable.some(
    (p) => !completedIds.has(p.id) && !p.delisted
  );

  return (
    <div>
      <div className="h-[420px] w-full overflow-hidden rounded border">
        <APIProvider apiKey={MAPS_KEY}>
          <Map
            mapId={MAP_ID}
            defaultCenter={center}
            defaultZoom={9}
            gestureHandling="cooperative"
            disableDefaultUI={false}
            className="h-full w-full"
          >
            <FitBounds peaks={plottable} />

            {plottable.map((p) => {
              const done = completedIds.has(p.id);
              const c = done ? DONE : p.delisted ? DELISTED : TODO;
              return (
                <AdvancedMarker
                  key={p.id}
                  position={{ lat: p.latitude, lng: p.longitude }}
                  title={p.name}
                  onClick={() => setActive(p.id)}
                >
                  <Pin
                    background={c.background}
                    borderColor={c.borderColor}
                    glyphColor={c.glyphColor}
                  />
                </AdvancedMarker>
              );
            })}

            {activePeak && (
              <InfoWindow
                position={{ lat: activePeak.latitude, lng: activePeak.longitude }}
                onCloseClick={() => setActive(null)}
              >
                <div className="min-w-[140px] text-sm">
                  <Link
                    href={`/mountain/${activePeak.id}?patchId=${patchId}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {activePeak.name}
                  </Link>
                  <div className="mt-1 text-gray-600">
                    {activePeak.elevation != null && (
                      <span>{activePeak.elevation.toLocaleString()} ft</span>
                    )}
                    {activePeak.elevation != null && activePeak.state ? ' · ' : ''}
                    {activePeak.state}
                  </div>
                  {completedIds.has(activePeak.id) && (
                    <div className="mt-1 font-medium text-green-700">✓ Climbed</div>
                  )}
                  {activePeak.delisted && (
                    <div className="mt-1 font-medium text-yellow-700">Delisted</div>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
        {hasClimbed && <LegendItem color={DONE.background} label="Climbed" />}
        {hasTodo && <LegendItem color={TODO.background} label="Not climbed" />}
        {hasDelisted && <LegendItem color={DELISTED.background} label="Delisted" />}
      </div>
    </div>
  );
}
