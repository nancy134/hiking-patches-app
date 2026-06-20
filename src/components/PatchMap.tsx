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

// Marker colors: green = climbed by the signed-in user, blue = not yet (and the
// only color anonymous visitors ever see, since they have no completion data).
const DONE = { background: '#16a34a', borderColor: '#15803d', glyphColor: '#bbf7d0' };
const TODO = { background: '#2563eb', borderColor: '#1d4ed8', glyphColor: '#bfdbfe' };

export type MapPeak = {
  id: string;
  name: string;
  elevation?: number | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
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

  return (
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
            const c = done ? DONE : TODO;
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
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
