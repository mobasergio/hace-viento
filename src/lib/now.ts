import { TIMEZONE } from "./constants";

export { TIMEZONE };

export function nowInMadrid(): Date {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const get = (t: string) =>
    parseInt(parts.find((p) => p.type === t)?.value ?? "0", 10);

  const targetYear = get("year");
  const targetMonth = get("month") - 1;
  const targetDay = get("day");
  const targetHour = get("hour");
  const targetMinute = get("minute");
  const targetSecond = get("second");

  // Build a UTC candidate that has the same wall-clock numbers as Madrid
  let candidate = new Date(
    Date.UTC(targetYear, targetMonth, targetDay, targetHour, targetMinute, targetSecond)
  );

  const getParts = (d: Date) => formatter.formatToParts(d);
  const getHour = (d: Date) =>
    parseInt(getParts(d).find((p) => p.type === "hour")?.value ?? "0", 10);
  const getDay = (d: Date) =>
    parseInt(getParts(d).find((p) => p.type === "day")?.value ?? "0", 10);

  // Adjust hour to match Madrid wall-clock hour
  const hourDiff = targetHour - getHour(candidate);
  if (hourDiff !== 0) {
    candidate = new Date(candidate.getTime() + hourDiff * 3600000);
  }

  // Adjust day if needed (handles wrap-around near midnight)
  const dayDiff = targetDay - getDay(candidate);
  if (dayDiff !== 0) {
    candidate = new Date(candidate.getTime() + dayDiff * 86400000);
  }

  return candidate;
}
