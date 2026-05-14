import React, { useState, useEffect } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { searchCities, getTimezoneForCoordinates } from '../services/geocodingService';

export function FavoritesPanel({ isOpen, onClose, onSelectFavorite, currentLocation, onAddCurrentLocationToFavorites }) {
  const { favorites, loading, addFavorite, deleteFavorite, loadFavorites } = useFavorites();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    country: '',
    region: '',
    timezone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [cityResults, setCityResults] = useState([]);
  const [showCityResults, setShowCityResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen, loadFavorites]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCitySearch = async (value) => {
    setCitySearch(value);
    
    if (value.length < 2) {
      setCityResults([]);
      setShowCityResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      const results = await searchCities(value);
      setCityResults(results);
      setShowCityResults(true);
    } catch (err) {
      console.error('City search error:', err);
      setCityResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCitySelect = async (city) => {
    const timezone = await getTimezoneForCoordinates(city.latitude, city.longitude);
    
    setFormData({
      name: city.name,
      latitude: city.latitude.toString(),
      longitude: city.longitude.toString(),
      country: city.country,
      region: city.region,
      timezone,
    });
    
    setCitySearch('');
    setCityResults([]);
    setShowCityResults(false);
  };

  const handleAddFromCurrent = () => {
    if (currentLocation) {
      setFormData({
        name: currentLocation.city || 'Current Location',
        latitude: currentLocation.latitude || '',
        longitude: currentLocation.longitude || '',
        country: currentLocation.country || '',
        region: currentLocation.region || '',
        timezone: currentLocation.timezone || '',
      });
      setShowAddForm(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.latitude || !formData.longitude) {
      setError('Please fill in name, latitude, and longitude');
      return;
    }

    try {
      await addFavorite({
        name: formData.name,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        country: formData.country,
        region: formData.region,
        timezone: formData.timezone,
      });
      setSuccess('Favorite added!');
      setFormData({
        name: '',
        latitude: '',
        longitude: '',
        country: '',
        region: '',
        timezone: '',
      });
      setShowAddForm(false);
      setTimeout(() => setSuccess(''), 3000);
      loadFavorites();
    } catch (err) {
      setError(err.message || 'Failed to add favorite');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-lg shadow-xl max-w-md w-full border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 rounded-t-lg sticky top-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">📍 Favorite Locations</h2>
            <button
              onClick={onClose}
              className="text-slate-200 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="p-3 bg-red-900 border border-red-700 text-red-200 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-900 border border-green-700 text-green-200 rounded mb-4">
              {success}
            </div>
          )}

          {!showAddForm ? (
            <>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                >
                  + Add Manual
                </button>
                <button
                  onClick={handleAddFromCurrent}
                  disabled={!currentLocation}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-2 px-4 rounded transition"
                >
                  + Add Current
                </button>
              </div>

              {loading ? (
                <p className="text-slate-400">Loading favorites...</p>
              ) : favorites.length === 0 ? (
                <p className="text-slate-400">No favorite locations yet.</p>
              ) : (
                <div className="space-y-2">
                  {favorites.map((fav) => (
                    <div
                      key={fav._id}
                      className="p-3 bg-slate-800 border border-slate-700 rounded hover:border-amber-600 cursor-pointer transition"
                    >
                      <div
                        onClick={() => {
                          onSelectFavorite(fav);
                          onClose();
                        }}
                        className="flex-1"
                      >
                        <p className="font-medium text-amber-400">{fav.name}</p>
                        <p className="text-sm text-slate-400">
                          {fav.latitude.toFixed(4)}, {fav.longitude.toFixed(4)}
                        </p>
                        {fav.country && (
                          <p className="text-xs text-slate-500">
                            {fav.country}
                            {fav.region && ` • ${fav.region}`}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFavorite(fav._id);
                        }}
                        className="text-red-400 hover:text-red-300 text-sm mt-2"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <h3 className="font-bold text-slate-100 mb-4">Add New Location</h3>

              <div>
                <label className="block text-sm text-slate-200 mb-1">Search for a City</label>
                <div className="relative">
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => handleCitySearch(e.target.value)}
                    onFocus={() => cityResults.length > 0 && setShowCityResults(true)}
                    placeholder="Type a city name (e.g., San Francisco)"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                  
                  {searchLoading && (
                    <div className="absolute right-3 top-2 text-slate-400 text-sm">
                      Searching...
                    </div>
                  )}

                  {showCityResults && cityResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded shadow-lg z-10 max-h-48 overflow-y-auto">
                      {cityResults.map((city, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleCitySelect(city)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-700 border-b border-slate-700 last:border-b-0 text-slate-100 text-sm transition"
                        >
                          <p className="font-medium">{city.name}</p>
                          <p className="text-xs text-slate-400">
                            {city.country}
                            {city.region && ` • ${city.region}`}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {showCityResults && citySearch && cityResults.length === 0 && !searchLoading && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-slate-400 text-sm">
                      No cities found
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-200 mb-1">Location Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Mount Tamalpais"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-slate-200 mb-1">Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="-90 to 90"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-200 mb-1">Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="-180 to 180"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-200 mb-1">Country (optional)</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="USA"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-slate-200 mb-1">Region/State</label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="CA"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-200 mb-1">Timezone</label>
                  <input
                    type="text"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    placeholder="America/Los_Angeles"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded text-sm transition"
                >
                  Save Location
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-4 rounded text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
