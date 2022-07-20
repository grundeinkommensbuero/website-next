export function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('de', options).format(date);
}

export function formatDateTime(date: Date) {
  return `${formatDate(date)}, ${formatTime(date)} Uhr`;
}

export function formatDateShort(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('de', options).format(date);
}

// Format date to YYYY-MM-DD
export function formatDateShortIso(date: Date) {
  return date.toISOString().split('T')[0];
}

export function formatDateMonthYear(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
  };
  return new Intl.DateTimeFormat('de', options).format(date);
}

export function formatTime(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  };
  return new Intl.DateTimeFormat('de', options).format(date);
}

export function getDayAsString(date: Date) {
  return date.toLocaleString('de-de', { weekday: 'long' });
}
