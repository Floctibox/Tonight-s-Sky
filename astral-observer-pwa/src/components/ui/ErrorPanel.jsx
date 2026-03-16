export function ErrorPanel({ error, onRetry }) {
  return (
    <div className="panel">
      <div className="relative z-10 space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-200/80">Unable to load live sky data</p>
        <h2 className="text-2xl font-semibold text-white">The dashboard could not be generated yet.</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-300">
          {error || 'Try again once you have connectivity or allow geolocation access. The app can also fall back to Greenwich Observatory when location access is unavailable.'}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/50 hover:bg-cyan-400/15"
        >
          Retry dashboard
        </button>
      </div>
    </div>
  );
}
