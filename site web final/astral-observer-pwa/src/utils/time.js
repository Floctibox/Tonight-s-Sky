export function tonightAt(hour = 22, baseDate = new Date()) {
  const date = new Date(baseDate);
  date.setHours(hour, 0, 0, 0);
  return date;
}

export function tomorrowAt(hour = 22, baseDate = new Date()) {
  const date = tonightAt(hour, baseDate);
  date.setDate(date.getDate() + 1);
  return date;
}

export function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}
