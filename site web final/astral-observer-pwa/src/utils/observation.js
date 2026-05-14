function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function scoreSkyConditions({ cloudCover = 0, visibilityKm = 0, windSpeedKmh = 0, isDay = 0 }) {
  if (isDay) {
    return 28;
  }

  let score = 100;
  score -= Number(cloudCover) * 0.72;
  score -= Math.max(0, 18 - Number(visibilityKm)) * 1.8;
  score -= Math.min(Number(windSpeedKmh), 45) * 0.45;
  return Math.round(clamp(score, 0, 100));
}

export function describeObservationScore(score, isDay) {
  if (isDay) {
    return {
      rating: 'Daylight',
      tone: 'amber',
      insight: 'Planetary observing can still work, but deep-sky viewing improves after dark.',
    };
  }

  if (score >= 85) {
    return {
      rating: 'Excellent',
      tone: 'emerald',
      insight: 'Very low cloud impact and strong transparency make tonight promising for deep-sky observing.',
    };
  }

  if (score >= 70) {
    return {
      rating: 'Good',
      tone: 'cyan',
      insight: 'You should have solid observing conditions with only modest weather interference.',
    };
  }

  if (score >= 50) {
    return {
      rating: 'Fair',
      tone: 'amber',
      insight: 'Some targets may still be worthwhile, but clouds or haze will limit contrast.',
    };
  }

  return {
    rating: 'Poor',
    tone: 'rose',
    insight: 'Cloud cover or low visibility will make stargazing challenging right now.',
  };
}

export function pickBestNightWindow(hourlyHours = []) {
  const candidates = hourlyHours.filter((hour) => hour.isDay === 0);
  if (!candidates.length) {
    return null;
  }

  const ranked = candidates
    .map((hour) => ({
      ...hour,
      score: scoreSkyConditions({
        cloudCover: hour.cloudCover,
        visibilityKm: hour.visibilityKm,
        windSpeedKmh: hour.windSpeedKmh,
        isDay: hour.isDay,
      }),
    }))
    .sort((a, b) => b.score - a.score);

  return ranked[0] || null;
}
