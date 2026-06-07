import { formatWindguruDate, findCurrentForecastIndex } from "./dateUtils.js";
import type { WindguruEntry } from "./dateUtils.js";

export const WIND_THRESHOLD_KNOTS = 10;

const DEGREES_RE = /(\d+)[°º]/;

export function formatWind(wind: string): "levante" | "poniente" {
  const match = wind.match(DEGREES_RE);
  if (!match)
    throw new Error(
      `Formato inválido: ${wind}. Se esperaba algo como 'O (272°)'.`,
    );

  const degrees = parseInt(match[1], 10);
  if (degrees < 0 || degrees > 360)
    throw new Error("Los grados deben estar entre 0 y 360.");

  return degrees <= 180 ? "levante" : "poniente";
}

export function extractDegrees(wind: string): number {
  const match = wind.match(DEGREES_RE);
  return match ? parseInt(match[1], 10) : 0;
}

export interface WindSummary {
  title: string;
  subtitle: string;
  changeText: string;
  isWindy: boolean;
}

export function checkWind(entries: WindguruEntry[], now: Date): WindSummary {
  if (entries.length === 0) {
    return {
      title: "Datos insuficientes",
      subtitle: "No se encontraron datos de viento.",
      changeText: "",
      isWindy: false,
    };
  }

  const speeds = entries.map((e) => parseInt(e.gustSpeed, 10) || 0);

  const currentIndex = findCurrentForecastIndex(entries, now);
  if (currentIndex === -1) {
    return {
      title: "Fuera de rango",
      subtitle: "La hora actual no se encuentra en el periodo del forecast.",
      changeText: "",
      isWindy: false,
    };
  }

  const isCurrentlyWindy = speeds[currentIndex] >= WIND_THRESHOLD_KNOTS;
  const title = isCurrentlyWindy ? "Hace viento" : "No hace viento";

  let changeIndex = -1;
  for (let i = currentIndex + 1; i < speeds.length - 1; i++) {
    const next = speeds[i] >= WIND_THRESHOLD_KNOTS;
    const after = speeds[i + 1] >= WIND_THRESHOLD_KNOTS;
    if (isCurrentlyWindy ? !next && !after : next && after) {
      changeIndex = i;
      break;
    }
  }

  if (changeIndex === -1 && speeds.length > currentIndex + 1) {
    const lastIdx = speeds.length - 1;
    const lastWindy = speeds[lastIdx] >= WIND_THRESHOLD_KNOTS;
    if (isCurrentlyWindy !== lastWindy) changeIndex = lastIdx;
  }

  if (changeIndex === -1) {
    return {
      title,
      subtitle: "To la semana por lo pronto",
      changeText: "to la semana por lo pronto",
      isWindy: isCurrentlyWindy,
    };
  }

  const formattedDate = formatWindguruDate(entries[changeIndex].date);
  const verb = isCurrentlyWindy ? "amaina" : "arrecia";
  return {
    title,
    subtitle: `Hasta ${formattedDate}`,
    changeText: `${verb} ${formattedDate}`,
    isWindy: isCurrentlyWindy,
  };
}
