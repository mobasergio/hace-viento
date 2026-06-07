export const SCRAPER_INTERVAL_MS = 60 * 60 * 1000;

export function timeUntilNext(
  lastUpdate: number,
  intervalMs: number = SCRAPER_INTERVAL_MS,
): string {
  const now = Date.now();
  const diff = lastUpdate + intervalMs - now;

  if (diff > 0) {
    const minutes = Math.ceil(diff / 60_000);
    if (minutes < 60) return `Se actualiza en ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `Se actualiza en ${hours}h`;
    return `Se actualiza en ${hours}h ${mins}min`;
  }

  const elapsedMin = Math.max(0, Math.floor((now - lastUpdate) / 60_000));
  if (elapsedMin < 60) return `Actualizado hace ${elapsedMin} min`;
  const hours = Math.floor(elapsedMin / 60);
  if (hours < 24) return `Actualizado hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Actualizado hace ${days}d`;
}
