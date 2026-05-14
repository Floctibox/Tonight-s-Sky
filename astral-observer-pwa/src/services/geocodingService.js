/**
 * Geocoding Service
 * Uses OpenStreetMap Nominatim API for free geocoding (city name to coordinates)
 */

const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

/**
 * Search for a city and return location information
 * @param {string} cityName - City name to search for
 * @returns {Promise<Array>} Array of location results
 */
export async function searchCities(cityName) {
  if (!cityName || cityName.trim().length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `${NOMINATIM_API}?q=${encodeURIComponent(cityName)}&format=json&limit=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'TonightsSky/1.0',
        },
      }
    );

    if (!response.ok) {
      console.error('Geocoding API error:', response.status);
      return [];
    }

    const results = await response.json();

    // Transform results to our format
    return results.map((result) => ({
      name: result.name || result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      country: result.address?.country || '',
      region: result.address?.state || result.address?.region || '',
      fullAddress: result.display_name,
    }));
  } catch (error) {
    console.error('Geocoding service error:', error);
    return [];
  }
}

/**
 * Get timezone for given coordinates using an external API
 * Falls back to UTC if service is unavailable
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<string>} Timezone string or 'UTC'
 */
export async function getTimezoneForCoordinates(latitude, longitude) {
  try {
    // Using timeanddate.com's free API or similar
    const response = await fetch(
      `https://timeapi.io/api/timezone/coordinate?latitude=${latitude}&longitude=${longitude}`,
      {
        signal: AbortSignal.timeout(3000), // 3 second timeout
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.timeZone || 'UTC';
    }
  } catch (error) {
    console.warn('Could not fetch timezone:', error);
  }

  return 'UTC';
}
