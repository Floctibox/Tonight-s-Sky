import { useRegisterSW } from 'virtual:pwa-register/react';

export function PwaReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.error('Service worker registration error', error);
    },
  });

  const visible = offlineReady || needRefresh;
  if (!visible) {
    return null;
  }

  function dismiss() {
    setOfflineReady(false);
    setNeedRefresh(false);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-3xl border border-white/10 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-xl">
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-white">
            {offlineReady ? 'Offline mode ready' : 'Update available'}
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-300">
            {offlineReady
              ? 'Astral Observer can now open from your home screen and work with cached content when you are offline.'
              : 'A newer version of the app is ready. Reload to update the service worker and cached assets.'}
          </p>
        </div>

        <div className="flex gap-2">
          {needRefresh ? (
            <button
              type="button"
              onClick={() => updateServiceWorker(true)}
              className="rounded-full border border-cyan-300/40 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-50 transition hover:border-cyan-200/60 hover:bg-cyan-400/20"
            >
              Reload
            </button>
          ) : null}

          <button
            type="button"
            onClick={dismiss}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/[0.08]"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
