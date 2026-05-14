import { LocationIcon, RefreshIcon, SparkIcon } from './ui/icons';
import { useAuth } from '../hooks/useAuth';

export function Header({
  location,
  onRefresh,
  refreshing,
  onLoginClick,
  onRegisterClick,
  onProfileClick,
  onFavoritesClick,
  onSaveEventClick,
  onAddCurrentLocationClick,
}) {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="mb-6 flex flex-col gap-6">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-3 flex-1">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="text-gradient">Tonight's Sky</span>
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
              Real-time skywatching conditions, visible constellations, celestial events, and locally calculated astrological transits from your current coordinates.
            </p>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <button
                onClick={onLoginClick}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
              >
                Sign In
              </button>
              <button
                onClick={onRegisterClick}
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onFavoritesClick}
                className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition hidden sm:block"
              >
                ⭐ Favorites
              </button>
              <button
                onClick={onSaveEventClick}
                className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition hidden sm:block"
              >
                📅 Save Event
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            <LocationIcon className="h-4 w-4 text-cyan-200" />
            <div>
              <p className="font-medium text-white">{location?.label || 'Resolving coordinates...'}</p>
              <p className="text-xs text-slate-400">
                {location ? `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}` : ''}
              </p>
            </div>
          </div>
          
          {isAuthenticated && (
            <button
              onClick={onAddCurrentLocationClick}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-300/40 hover:bg-white/[0.08]"
              title="Add current location to favorites"
            >
              📍 Save
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-cyan-300/40 hover:bg-white/[0.08]"
          >
            <RefreshIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing' : 'Refresh'}
          </button>

          {isAuthenticated && (
            <button
              onClick={onProfileClick}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-cyan-300/40 hover:bg-white/[0.08]"
            >
              👤 {user?.username || 'Profile'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
