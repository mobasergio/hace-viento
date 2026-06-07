export function buildFallbackForecast(speed: number): {
  label: string;
  v: number;
}[] {
  const factors = [1, 1.08, 1.15, 0.85, 0.55, 0.35, 0.2];
  return ["ahora", "15h", "17h", "19h", "21h", "23h", "01h"].map(
    (label, i) => ({
      label,
      v: Math.max(0, Math.round(speed * factors[i] + Math.sin(i * 1.7) * 3)),
    }),
  );
}
