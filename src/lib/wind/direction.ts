export interface Direction {
  primary: string;
  name: string;
  code: string;
  local: string;
  family: string;
  deg: number;
}

const dirs = [
  {
    from: 337.5,
    to: 360,
    name: "Norte",
    code: "N",
    local: "tramontana",
    family: "Poniente",
  },
  {
    from: 0,
    to: 22.5,
    name: "Norte",
    code: "N",
    local: "tramontana",
    family: "Levante",
  },
  {
    from: 22.5,
    to: 67.5,
    name: "Nordeste",
    code: "NE",
    local: "gregal",
    family: "Levante",
  },
  {
    from: 67.5,
    to: 112.5,
    name: "Este",
    code: "E",
    local: "levante",
    family: "Levante",
  },
  {
    from: 112.5,
    to: 157.5,
    name: "Sudeste",
    code: "SE",
    local: "siroco",
    family: "Levante",
  },
  {
    from: 157.5,
    to: 202.5,
    name: "Sur",
    code: "S",
    local: "ostro",
    family: "Poniente",
  },
  {
    from: 202.5,
    to: 247.5,
    name: "Sudoeste",
    code: "SO",
    local: "lebeche",
    family: "Poniente",
  },
  {
    from: 247.5,
    to: 292.5,
    name: "Oeste",
    code: "O",
    local: "poniente",
    family: "Poniente",
  },
  {
    from: 292.5,
    to: 337.5,
    name: "Noroeste",
    code: "NO",
    local: "mistral",
    family: "Poniente",
  },
];

export function directionFor(deg: number, speed?: number): Direction {
  const d = ((deg % 360) + 360) % 360;
  const primary =
    speed != null && speed <= 4 ? "Calma" : d < 180 ? "Levante" : "Poniente";
  const detailed = dirs.find((x) => d >= x.from && d < x.to) ?? {
    name: "Norte",
    code: "N",
    local: "tramontana",
    family: "Levante",
  };
  return { primary, ...detailed, deg: Math.round(d) };
}
