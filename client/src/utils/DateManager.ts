type DateInput = string | Date | number;

export const formatDateToReadable = (
  isoDate: DateInput,
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

export const getTimeAgo = (isoDate: DateInput): string => {
  const inputDate = new Date(isoDate);

  if (isNaN(inputDate.getTime())) {
    throw new Error("Invalid date");
  }

  const now = new Date();
  const diff = now.getTime() - inputDate.getTime();

  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;

  if (diff < MINUTE) {
    const seconds = Math.floor(diff / SECOND);
    return seconds <= 5 ? "Just now" : `${seconds} seconds ago`;
  }

  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  if (diff < WEEK) {
    const days = Math.floor(diff / DAY);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  if (diff < MONTH) {
    const weeks = Math.floor(diff / WEEK);
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }

  if (diff < YEAR) {
    const months = Math.floor(diff / MONTH);
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }

  const years = Math.floor(diff / YEAR);
  return `${years} year${years === 1 ? "" : "s"} ago`;
};

type FormatRelativeDateOptions = {
  locale?: string;
  timeZone?: string;
};

export function formatRelativeDate(
  date: string | Date,
  options: FormatRelativeDateOptions = {},
): string {
  const inputDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(inputDate.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }

  const {
    locale = "en-US",
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  } = options;

  const getCalendarDate = (value: Date): string =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(value);

  const today = getCalendarDate(new Date());
  const target = getCalendarDate(inputDate);

  if (target === today) {
    return "Today";
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (target === getCalendarDate(yesterday)) {
    return "Yesterday";
  }

  const currentYear = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
  }).format(new Date());

  const targetYear = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
  }).format(inputDate);

  if (currentYear === targetYear) {
    return new Intl.DateTimeFormat(locale, {
      timeZone,
      month: "short",
      day: "numeric",
    }).format(inputDate);
  }

  return new Intl.DateTimeFormat(locale, {
    timeZone,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(inputDate);
}
