export function formatDateMonthYear(date: Date) {
  const options: {
    year: 'numeric' | '2-digit' | undefined;
    month: 'long' | undefined;
  } = {
    year: 'numeric',
    month: 'long',
  };
  return new Intl.DateTimeFormat('de', options).format(date);
}
