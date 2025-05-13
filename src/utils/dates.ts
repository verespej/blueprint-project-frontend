export function formatFriendlyDate(isoDateString: string, locale = 'en-US'): string {
  const date = new Date(isoDateString);
  const formatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
    day:   'numeric',
    year:  'numeric',
  });
  return formatter.format(date);
}
