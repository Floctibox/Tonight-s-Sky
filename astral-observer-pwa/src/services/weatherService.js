import { describeObservationScore, pickBestNightWindow, scoreSkyConditions } from '../utils/observation';

function toKm(valueMeters) {
  return Number(valueMeters || 0) / 1000;
}

export async function getWeatherBundle(location) {
  const params = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    current: 'temperature_2m,is_day,cloud_cover,visibility,wind_speed_10m',
    hourly: 'temperature_2m,is_day,cloud_cover,visibility,wind_speed_10m',
    daily: 'sunrise,sunset',
    forecast_days: '3',
    timezone: 'auto',
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Unable to load weather conditions from Open-Meteo.');
  }

  const data = await response.json();

  const hourly = data.hourly.time.map((time, index) => ({
    time,
    date: new Date(time),
    temperature: data.hourly.temperature_2m[index],
    isDay: Number(data.hourly.is_day[index]),
    cloudCover: Number(data.hourly.cloud_cover[index]),
    visibilityKm: toKm(data.hourly.visibility[index]),
    windSpeedKmh: Number(data.hourly.wind_speed_10m[index]),
  }));

  const current = {
    time: data.current.time,
    date: new Date(data.current.time),
    temperature: Number(data.current.temperature_2m),
    isDay: Number(data.current.is_day),
    cloudCover: Number(data.current.cloud_cover),
    visibilityKm: toKm(data.current.visibility),
    windSpeedKmh: Number(data.current.wind_speed_10m),
  };

  const currentScore = scoreSkyConditions(current);
  const description = describeObservationScore(currentScore, current.isDay === 1);
  const bestWindow = pickBestNightWindow(hourly.slice(0, 18));

  return {
    timezone: data.timezone,
    current,
    hourly,
    daily: data.daily.time.map((day, index) => ({
      date: day,
      sunrise: data.daily.sunrise[index],
      sunset: data.daily.sunset[index],
    })),
    summary: {
      score: currentScore,
      ...description,
      bestWindow,
    },
  };
}
