// Formats an ISO date (YYYY-MM-DD). Uses UTC so the day doesn't shift with the server's time zone.
const formatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' });

export const formatDate = (isoDate: string) => formatter.format(new Date(isoDate));
