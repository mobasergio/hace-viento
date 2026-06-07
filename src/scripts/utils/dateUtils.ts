export { TIMEZONE } from "../../lib/constants";

const dayNames: Record<string, string> = {
  L: "Lunes",
  M: "Martes",
  X: "Miércoles",
  J: "Jueves",
  V: "Viernes",
  S: "Sábado",
  D: "Domingo",
  Mo: "Lunes",
  Tu: "Martes",
  We: "Miércoles",
  Th: "Jueves",
  Fr: "Viernes",
  Sa: "Sábado",
  Su: "Domingo",
};

const WINDGURU_DATE_RE =
  /^((?:[LMXJVSD]|(?:Mo|Tu|We|Th|Fr|Sa|Su)))(\d+)\.(\d+)h$/i;

export function formatWindguruDate(dateString: string): string {
  const match = dateString.match(WINDGURU_DATE_RE);
  if (!match) return dateString;
  const [, code, day, hour] = match;
  const fullName = dayNames[code] ?? code;
  return `el ${fullName} ${day} a las ${hour}:00`;
}

export interface WindguruEntry {
  date: string;
  gustSpeed: string;
  windDirections: string | null;
  windDeg: number;
  speedKmh: number;
}

export function findCurrentForecastIndex(
  entries: WindguruEntry[],
  now: Date,
): number {
  const currentDayOfMonth = now.getDate();
  const currentHour = now.getHours();

  let bestMatchIndex = -1;
  let minHourDiff = Infinity;

  for (let i = 0; i < entries.length; i++) {
    const match = entries[i].date.match(WINDGURU_DATE_RE);
    if (!match) continue;

    const [, , dayStr, hourStr] = match;
    const dayOfMonth = parseInt(dayStr, 10);
    const hour = parseInt(hourStr, 10);

    const isToday = dayOfMonth === currentDayOfMonth;
    const isFuture =
      dayOfMonth > currentDayOfMonth ||
      (dayOfMonth < currentDayOfMonth &&
        Math.abs(dayOfMonth - currentDayOfMonth) > 20);

    if (!isToday && !isFuture) continue;

    if (isToday) {
      if (hour <= currentHour) {
        const diff = currentHour - hour;
        if (diff < minHourDiff) {
          minHourDiff = diff;
          bestMatchIndex = i;
        }
      } else if (bestMatchIndex === -1) {
        return i;
      }
    } else if (bestMatchIndex === -1) {
      bestMatchIndex = i;
    }
  }

  if (bestMatchIndex === -1 && entries.length > 0) return entries.length - 1;
  return bestMatchIndex;
}
