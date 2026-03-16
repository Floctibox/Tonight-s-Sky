export function Footer() {
  return (
    <footer className="mt-8 border-t border-white/10 pt-5 text-xs leading-6 text-slate-400">
      <p>
        Core integrations are free: Open-Meteo powers observation conditions, while Astronomy Engine and VirtualSky run locally in the browser. If you do not configure the optional OpenCage key, the app falls back to raw coordinates for the place label.
      </p>
    </footer>
  );
}
