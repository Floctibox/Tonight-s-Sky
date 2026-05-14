import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
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
import { LoginModal } from './components/LoginModal';
import { RegisterModal } from './components/RegisterModal';
import { SaveEventModal } from './components/SaveEventModal';
import { FavoritesPanel } from './components/FavoritesPanel';
import { ProfilePage } from './components/ProfilePage';
import { useAstronomyDashboard } from './hooks/useAstronomyDashboard';

function AppContent() {
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
    setLocation,
  } = useAstronomyDashboard();

  const hasData = Boolean(location && weather && astronomy);

  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSaveEventModal, setShowSaveEventModal] = useState(false);
  const [showFavoritesPanel, setShowFavoritesPanel] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [eventToSave, setEventToSave] = useState(null);

  const handleAddCurrentLocationToFavorites = () => {
    // Open favorites panel and scroll to add current location
    setShowFavoritesPanel(true);
  };

  const handleSaveEvent = (eventData) => {
    setEventToSave(eventData);
    setShowSaveEventModal(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 antialiased">
      <AppBackground />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Header
          location={location}
          onRefresh={refresh}
          refreshing={refreshing}
          onLoginClick={() => setShowLoginModal(true)}
          onRegisterClick={() => setShowRegisterModal(true)}
          onFavoritesClick={() => setShowFavoritesPanel(true)}
          onSaveEventClick={() => setShowSaveEventModal(true)}
          onProfileClick={() => setShowProfilePage(true)}
          onAddCurrentLocationClick={handleAddCurrentLocationToFavorites}
        />

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
          <main className="grid auto-rows-min gap-6 xl:grid-cols-12 items-start">
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
              onSaveEvent={handleSaveEvent}
            />

            <SkyMapCard className="xl:col-span-7" location={location} />
          </main>
        )}

        <Footer />
      </div>

      {/* Modals and Panels */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => setShowRegisterModal(true)}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => setShowLoginModal(true)}
      />

      <SaveEventModal
        isOpen={showSaveEventModal}
        onClose={() => {
          setShowSaveEventModal(false);
          setEventToSave(null);
        }}
        eventToSave={eventToSave}
      />

      <FavoritesPanel
        isOpen={showFavoritesPanel}
        onClose={() => setShowFavoritesPanel(false)}
        currentLocation={location}
        onSelectFavorite={(favorite) => {
          // Convert favorite to location format and update dashboard
          const favoriteLocation = {
            latitude: favorite.latitude,
            longitude: favorite.longitude,
            city: favorite.name,
            country: favorite.country,
            region: favorite.region,
            timezone: favorite.timezone,
            label: favorite.name,
            isFallback: false,
          };
          setLocation(favoriteLocation);
          setShowFavoritesPanel(false);
        }}
      />

      <ProfilePage
        isOpen={showProfilePage}
        onClose={() => setShowProfilePage(false)}
      />

      <InstallPrompt />
      <PwaReloadPrompt />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
