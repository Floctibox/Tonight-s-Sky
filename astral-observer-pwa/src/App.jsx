import { AppBackground } from './components/AppBackground';
import { Header } from './components/Header';
import { StatusBanner } from './components/StatusBanner';
import { ObservationSummaryCard } from './components/ObservationSummaryCard';
import { WeatherTimelineCard } from './components/WeatherTimelineCard';
import { MoonCard } from './components/MoonCard';
import { VisibleConstellationsCard } from './components/VisibleConstellationsCard';
import { SkyMapCard } from './components/SkyMapCard';
import { AstronomyAgendaCard } from './components/AstronomyAgendaCard';
import { TransitCard } from './components/TransitCard';
import { Footer } from './components/Footer';
import { InstallPrompt } from './components/InstallPrompt';
import { PwaReloadPrompt } from './components/PwaReloadPrompt';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ErrorPanel } from './components/ui/ErrorPanel';
import { useAstronomyDashboard } from './hooks/useAstronomyDashboard';

export default function App() {
  const {
    loading,
    refreshing,
    error,
    source,
    cachedAt,
    location,
    weather,
    astronomy,
    refresh,
  } = useAstronomyDashboard();

  const hasData = Boolean(location && weather && astronomy);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 antialiased">
      <AppBackground />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Header location={location} onRefresh={refresh} refreshing={refreshing} />

        {hasData && (
          <StatusBanner
            source={source}
            cachedAt={cachedAt}
            location={location}
            error={error}
          />
        )}

        {loading && !hasData ? (
          <LoadingScreen />
        ) : !hasData ? (
          <ErrorPanel error={error} onRetry={refresh} />
        ) : (
          <main className="grid auto-rows-fr gap-6 xl:grid-cols-12">
            <ObservationSummaryCard
              className="xl:col-span-4"
              weather={weather}
              astronomy={astronomy}
            />
            <WeatherTimelineCard className="xl:col-span-5" weather={weather} />
            <MoonCard className="xl:col-span-3" moon={astronomy.moon} />

            <VisibleConstellationsCard
              className="xl:col-span-6"
              constellations={astronomy.constellations}
            />
            <AstronomyAgendaCard
              className="xl:col-span-6"
              agenda={astronomy.agenda}
            />

            <SkyMapCard className="xl:col-span-7" location={location} />
            <TransitCard className="xl:col-span-5" transits={astronomy.transits} />
          </main>
        )}

        <Footer />
      </div>

      <InstallPrompt />
      <PwaReloadPrompt />
    </div>
  );
}
