const RELATIVE_UNITS = [
  ["year", 365],
  ["month", 30],
  ["week", 7],
  ["day", 1],
] as const;

/**
 * "3 months ago" for a date (or a `YYYY-MM-DD` string), in the reader's
 * language. `narrow` gives "3w ago" for tight rows.
 */
export const relativeDate = (
  date: Date | string,
  locale: string,
  style: Intl.RelativeTimeFormatStyle = "long"
) => {
  const time = new Date(date).getTime();
  const days = Math.round((time - Date.now()) / (24 * 60 * 60 * 1000));
  const format = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
    style,
  });
  for (const [unit, size] of RELATIVE_UNITS) {
    if (Math.abs(days) >= size || unit === "day") {
      return format.format(Math.round(days / size), unit);
    }
  }
  return String(date);
};
