export const formatDateToReadable = (
  isoDate: string,
  options?: {
    locale?: string;
    includeTime?: boolean;
  },
): string => {
  if (!isoDate) return "";

  const date = new Date(isoDate);

  // Guard against invalid dates
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  return new Intl.DateTimeFormat(options?.locale || "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(options?.includeTime && {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  }).format(date);
};
