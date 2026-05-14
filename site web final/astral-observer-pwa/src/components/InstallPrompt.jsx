import { useEffect, useState } from 'react';
import { DownloadIcon } from './ui/icons';

export function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    function handleBeforeInstall(event) {
      event.preventDefault();
      setPromptEvent(event);
    }

    function handleInstalled() {
      setInstalled(true);
      setPromptEvent(null);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (!promptEvent || installed) {
    return null;
  }

  async function install() {
    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm rounded-3xl border border-cyan-400/25 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-100">
          <DownloadIcon className="h-5 w-5" />
        </div>
        <div className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Install Astral Observer</h2>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              Add the dashboard to your home screen for a fullscreen, app-like stargazing experience.
            </p>
          </div>

          <button
            type="button"
            onClick={install}
            className="inline-flex items-center rounded-full border border-cyan-300/40 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-50 transition hover:border-cyan-200/60 hover:bg-cyan-400/20"
          >
            Install app
          </button>
        </div>
      </div>
    </div>
  );
}
