export const ZODIAC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

export const ASPECTS = [
  { angle: 0, label: 'Conjunction', orb: 6 },
  { angle: 60, label: 'Sextile', orb: 4 },
  { angle: 90, label: 'Square', orb: 5 },
  { angle: 120, label: 'Trine', orb: 5 },
  { angle: 180, label: 'Opposition', orb: 6 },
];

export function normalizeAngle(angle) {
  let normalized = Number(angle) % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  return normalized;
}

export function shortestAngleDistance(a, b) {
  const diff = Math.abs(normalizeAngle(a) - normalizeAngle(b));
  return diff > 180 ? 360 - diff : diff;
}

export function getZodiacSign(longitude) {
  const normalized = normalizeAngle(longitude);
  const signIndex = Math.floor(normalized / 30);
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degreeInSign: normalized % 30,
    normalized,
  };
}

export function isRetrograde(previousLongitude, currentLongitude) {
  const delta = ((currentLongitude - previousLongitude + 540) % 360) - 180;
  return delta < 0;
}
