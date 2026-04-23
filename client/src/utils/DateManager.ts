export function formatDateToReadable(
  isoDate: string,
  locale: string = "en-US",
): string {
  if (!isoDate) return "";

  const date = new Date(isoDate);

  // Guard against invalid dates
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
