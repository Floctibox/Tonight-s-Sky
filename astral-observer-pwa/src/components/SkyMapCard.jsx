import { useEffect, useMemo, useRef, useState } from 'react';
import { MapIcon } from './ui/icons';
import { SectionCard } from './ui/SectionCard';

let virtualSkyLoadPromise;

function loadScript(src, key) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-vendor="${key}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
      } else {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error(`Failed to load ${key}.`)), { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.vendor = key;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error(`Failed to load ${key}.`)), { once: true });
    document.body.appendChild(script);
  });
}

function ensureVirtualSkyAssets() {
  if (!virtualSkyLoadPromise) {
    virtualSkyLoadPromise = (async () => {
      await loadScript('/vendor/virtualsky/stuquery.min.js', 'stuquery');
      await loadScript('/vendor/virtualsky/virtualsky.min.js', 'virtualsky');
      await loadScript('/vendor/virtualsky/virtualsky-planets.js', 'virtualsky-planets');
    })();
  }

  return virtualSkyLoadPromise;
}

export function SkyMapCard({ className = '', location }) {
  const mapId = useMemo(() => `virtual-sky-${Math.random().toString(36).slice(2, 9)}`, []);
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let resizeObserver;

    async function renderSkyMap() {
      try {
        setError(null);
        await ensureVirtualSkyAssets();
        if (cancelled || !containerRef.current || !window.S?.virtualsky) {
          return;
        }

        const width = Math.max(containerRef.current.clientWidth, 280);
        containerRef.current.innerHTML = '';

        window.S.virtualsky({
          id: mapId,
          width,
          height: 420,
          projection: 'stereo',
          longitude: location.longitude,
          latitude: location.latitude,
          background: 'rgba(2, 6, 23, 0)',
          transparent: true,
          color: 'rgb(226, 232, 240)',
          cardinalpoints: true,
          constellationlabels: true,
          constellations: true,
          ecliptic: true,
          meridian: true,
          gridlines_az: true,
          showplanets: true,
          showplanetlabels: true,
          showstars: true,
          showstarlabels: false,
          meteorshowers: true,
          showgalaxy: true,
          ground: true,
          keyboard: true,
          mouse: true,
          live: true,
          magnitude: 6,
          fontsize: '12px',
          fontfamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
          lang: 'en',
        });
      } catch (caughtError) {
        if (!cancelled) {
          setError(caughtError.message || 'Unable to render the interactive sky map.');
        }
      }
    }

    renderSkyMap();

    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        renderSkyMap();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [location.latitude, location.longitude, mapId]);

  return (
    <SectionCard
      className={className}
      eyebrow="Interactive sky"
      title="Live star map"
      icon={<MapIcon className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-slate-300">
          This embedded planetarium uses VirtualSky with your current latitude and longitude. It updates in real time and includes constellations, planets, the ecliptic, and current meteor-shower radiants.
        </p>

        <div id={mapId} ref={containerRef} className="overflow-hidden rounded-2xl border border-white/10 bg-black/20" />

        {error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}
