import { CONSTELLATION_CENTERS } from '../data/constellationCenters';
import { METEOR_SHOWERS } from '../data/meteorShowers';
import { addDays, addHours, tonightAt, tomorrowAt } from '../utils/time';
import { ASPECTS, getZodiacSign, isRetrograde, shortestAngleDistance } from '../utils/zodiac';
import { titleCase } from '../utils/format';

const TRANSIT_BODIES = [
  { key: 'Sun', label: 'Sun' },
  { key: 'Moon', label: 'Moon' },
  { key: 'Mercury', label: 'Mercury' },
  { key: 'Venus', label: 'Venus' },
  { key: 'Mars', label: 'Mars' },
  { key: 'Jupiter', label: 'Jupiter' },
  { key: 'Saturn', label: 'Saturn' },
  { key: 'Uranus', label: 'Uranus' },
  { key: 'Neptune', label: 'Neptune' },
  { key: 'Pluto', label: 'Pluto' },
];

const CONJUNCTION_SCAN_BODIES = ['Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
const MOON_QUARTERS = ['New Moon', 'First Quarter', 'Full Moon', 'Last Quarter'];

function getAstronomy() {
  if (!window.Astronomy) {
    throw new Error('Astronomy Engine was not loaded.');
  }

  return window.Astronomy;
}

function buildObserver(Astronomy, location) {
  return new Astronomy.Observer(location.latitude, location.longitude, location.elevation || 0);
}

function getMoonPhaseName(phaseAngle) {
  if (phaseAngle < 45 || phaseAngle >= 315) return 'New Moon';
  if (phaseAngle < 90) return 'Waxing Crescent';
  if (phaseAngle < 135) return 'First Quarter';
  if (phaseAngle < 180) return 'Waxing Gibbous';
  if (phaseAngle < 225) return 'Full Moon';
  if (phaseAngle < 270) return 'Waning Gibbous';
  if (phaseAngle < 315) return 'Last Quarter';
  return 'Waning Crescent';
}

function getConstellationsForDate(Astronomy, observer, targetDate) {
  return CONSTELLATION_CENTERS
    .map((item) => {
      const horizon = Astronomy.Horizon(targetDate, observer, item.raHours, item.dec, 'normal');
      return {
        ...item,
        altitude: Number(horizon.altitude.toFixed(1)),
        azimuth: Number(horizon.azimuth.toFixed(1)),
      };
    })
    .filter((item) => item.altitude > 12)
    .sort((a, b) => b.altitude - a.altitude);
}

function getMoonBundle(Astronomy, now) {
  const illumination = Astronomy.Illumination(Astronomy.Body.Moon, now);
  const phaseAngle = Astronomy.MoonPhase(now);
  let upcomingQuarter = Astronomy.SearchMoonQuarter(now);
  const upcomingPhases = [];

  for (let index = 0; index < 4; index += 1) {
    upcomingPhases.push({
      name: MOON_QUARTERS[upcomingQuarter.quarter],
      date: upcomingQuarter.time.date,
    });
    upcomingQuarter = Astronomy.NextMoonQuarter(upcomingQuarter);
  }

  return {
    illuminationPercent: Math.round((illumination.phase_fraction || 0) * 100),
    phaseAngle: Number(phaseAngle.toFixed(1)),
    phaseName: getMoonPhaseName(phaseAngle),
    ageDays: Number(((phaseAngle / 360) * 29.53).toFixed(1)),
    upcomingPhases,
  };
}

function getPlanetLongitude(Astronomy, bodyName, date) {
  const vector = Astronomy.GeoVector(Astronomy.Body[bodyName], date, true);
  const ecliptic = Astronomy.Ecliptic(vector);
  return {
    vector,
    ecliptic,
    longitude: ecliptic.elon,
  };
}

function getTransitBundle(Astronomy, now) {
  const yesterday = addDays(now, -1);

  const positions = TRANSIT_BODIES.map(({ key, label }) => {
    const current = getPlanetLongitude(Astronomy, key, now);
    const previous = getPlanetLongitude(Astronomy, key, yesterday);
    const zodiac = getZodiacSign(current.longitude);

    return {
      body: label,
      longitude: Number(current.longitude.toFixed(2)),
      latitude: Number(current.ecliptic.elat.toFixed(2)),
      sign: zodiac.sign,
      degreeInSign: Number(zodiac.degreeInSign.toFixed(1)),
      retrograde: key === 'Sun' || key === 'Moon' ? false : isRetrograde(previous.longitude, current.longitude),
    };
  });

  const aspects = [];
  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      const first = positions[i];
      const second = positions[j];
      const distance = shortestAngleDistance(first.longitude, second.longitude);
      const matchingAspect = ASPECTS.find((aspect) => Math.abs(distance - aspect.angle) <= aspect.orb);

      if (matchingAspect) {
        aspects.push({
          id: `${first.body}-${second.body}-${matchingAspect.label}`,
          bodies: `${first.body} · ${second.body}`,
          aspect: matchingAspect.label,
          orb: Number(Math.abs(distance - matchingAspect.angle).toFixed(1)),
        });
      }
    }
  }

  aspects.sort((a, b) => a.orb - b.orb);

  return {
    disclaimer: 'Calculated locally from planetary ecliptic longitudes. Use for reflection and entertainment.',
    positions,
    aspects: aspects.slice(0, 8),
  };
}

function buildAnnualMeteorWindows(now) {
  const year = now.getFullYear();
  const candidates = [];

  for (const shower of METEOR_SHOWERS) {
    for (const baseYear of [year, year + 1]) {
      const start = new Date(baseYear, shower.startMonth - 1, shower.startDay, 0, 0, 0, 0);
      const endYear = shower.endMonth < shower.startMonth ? baseYear + 1 : baseYear;
      const end = new Date(endYear, shower.endMonth - 1, shower.endDay, 23, 59, 59, 999);
      const peak = new Date((start.getTime() + end.getTime()) / 2);

      candidates.push({
        ...shower,
        start,
        end,
        peak,
      });
    }
  }

  return candidates
    .filter((item) => item.end >= now && item.start <= addDays(now, 180))
    .sort((a, b) => {
      if (a.featured !== b.featured) {
        return Number(b.featured) - Number(a.featured);
      }
      return a.peak.getTime() - b.peak.getTime();
    });
}

function getMeteorEvents(now) {
  return buildAnnualMeteorWindows(now)
    .slice(0, 4)
    .map((shower) => ({
      id: `meteor-${shower.code}-${shower.peak.toISOString()}`,
      type: 'Meteor shower',
      title: shower.name,
      date: shower.peak,
      detail: now >= shower.start && now <= shower.end
        ? `Active now · Window ${shower.start.toLocaleDateString()}–${shower.end.toLocaleDateString()}`
        : `Active ${shower.start.toLocaleDateString()}–${shower.end.toLocaleDateString()}`,
    }));
}

function getConjunctionEvents(Astronomy, now) {
  const events = [];

  for (let i = 0; i < CONJUNCTION_SCAN_BODIES.length; i += 1) {
    for (let j = i + 1; j < CONJUNCTION_SCAN_BODIES.length; j += 1) {
      const first = CONJUNCTION_SCAN_BODIES[i];
      const second = CONJUNCTION_SCAN_BODIES[j];
      const threshold = first === 'Moon' || second === 'Moon' ? 5 : 2.5;
      const samples = [];

      for (let hours = 0; hours <= 24 * 45; hours += 6) {
        const sampleDate = addHours(now, hours);
        const firstVector = Astronomy.GeoVector(Astronomy.Body[first], sampleDate, true);
        const secondVector = Astronomy.GeoVector(Astronomy.Body[second], sampleDate, true);
        samples.push({
          date: sampleDate,
          separation: Astronomy.AngleBetween(firstVector, secondVector),
        });
      }

      for (let sampleIndex = 1; sampleIndex < samples.length - 1; sampleIndex += 1) {
        const current = samples[sampleIndex];
        const prev = samples[sampleIndex - 1];
        const next = samples[sampleIndex + 1];
        if (current.separation <= prev.separation && current.separation <= next.separation && current.separation <= threshold) {
          events.push({
            id: `conjunction-${first}-${second}-${current.date.toISOString()}`,
            type: 'Conjunction',
            title: `${first} × ${second}`,
            date: current.date,
            detail: `${current.separation.toFixed(1)}° apart`,
          });
        }
      }
    }
  }

  return events
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 6);
}

function getEclipseEvents(Astronomy, now) {
  const lunar = Astronomy.SearchLunarEclipse(now);
  const solar = Astronomy.SearchGlobalSolarEclipse(now);

  return [
    {
      id: 'next-lunar-eclipse',
      type: 'Eclipse',
      title: `Lunar eclipse · ${titleCase(lunar.kind)}`,
      date: lunar.peak.date,
      detail: `${Math.round((lunar.obscuration || 0) * 100)}% obscuration at peak`,
    },
    {
      id: 'next-solar-eclipse',
      type: 'Eclipse',
      title: `Solar eclipse · ${titleCase(solar.kind)}`,
      date: solar.peak.date,
      detail: solar.latitude === undefined || solar.longitude === undefined
        ? 'Global event'
        : `Peak shadow near ${solar.latitude.toFixed(1)}°, ${solar.longitude.toFixed(1)}°`,
    },
  ];
}

function getMoonPhaseEvents(Astronomy, now) {
  const events = [];
  let quarter = Astronomy.SearchMoonQuarter(now);

  for (let index = 0; index < 4; index += 1) {
    events.push({
      id: `moon-quarter-${index}-${quarter.time.date.toISOString()}`,
      type: 'Lunar event',
      title: MOON_QUARTERS[quarter.quarter],
      date: quarter.time.date,
      detail: 'Quarter phase calculated locally with Astronomy Engine.',
    });
    quarter = Astronomy.NextMoonQuarter(quarter);
  }

  return events;
}

export async function buildAstronomyBundle(location) {
  const Astronomy = getAstronomy();
  const now = new Date();
  const observer = buildObserver(Astronomy, location);

  const tonightDate = tonightAt(22, now);
  const tomorrowDate = tomorrowAt(22, now);

  const tonightConstellations = getConstellationsForDate(Astronomy, observer, tonightDate);
  const tomorrowConstellations = getConstellationsForDate(Astronomy, observer, tomorrowDate);

  const moon = getMoonBundle(Astronomy, now);
  const transits = getTransitBundle(Astronomy, now);

  const agenda = [
    ...getMoonPhaseEvents(Astronomy, now),
    ...getEclipseEvents(Astronomy, now),
    ...getMeteorEvents(now),
    ...getConjunctionEvents(Astronomy, now),
  ]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 10);

  return {
    generatedAt: now,
    moon,
    constellations: {
      tonight: {
        date: tonightDate,
        visible: tonightConstellations,
      },
      tomorrow: {
        date: tomorrowDate,
        visible: tomorrowConstellations,
      },
    },
    agenda,
    transits,
  };
}
