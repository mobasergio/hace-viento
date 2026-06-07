export interface Segment {
  text: string;
  dim?: true;
}

export interface Intensity {
  limit: number;
  tone:
    | "negative"
    | "neutral"
    | "mild"
    | "yes"
    | "yes-strong"
    | "strong"
    | "extreme"
    | "severe"
    | "danger";
  segments: Segment[];
  color?: string;
  note: string;
  particles: number;
  streakSpeed: number;
  gustShake: number;
}

const thresholds: Intensity[] = [
  {
    limit: 12,
    tone: "negative",
    segments: [{ text: "No hace" }, { text: "viento." }],
    note: "Aprovecha, vete pa la playa pero ya.",
    particles: 4,
    streakSpeed: 40,
    gustShake: 0,
  },
  {
    limit: 22,
    tone: "neutral",
    segments: [{ text: "No hace" }, { text: "viento." }],
    note: "Brisilla pero se está to bien.",
    particles: 14,
    streakSpeed: 16,
    gustShake: 0.2,
  },
  {
    limit: 35,
    tone: "mild",
    segments: [{ text: "Hace" }, { text: "viento." }],
    note: "Posibles chiflazos de arena en la piernas.",
    particles: 26,
    streakSpeed: 9,
    gustShake: 0.5,
  },
  {
    limit: 50,
    tone: "yes",
    segments: [{ text: "Hace" }, { text: "viento." }],
    note: "Los Lances petao de cometas.",
    particles: 42,
    streakSpeed: 6,
    gustShake: 1,
  },
  {
    limit: 65,
    tone: "yes-strong",
    segments: [{ text: "Hace" }, { text: "viento." }],
    note: "Ni te peines, si da igual.",
    particles: 60,
    streakSpeed: 4,
    gustShake: 1.6,
  },
  {
    limit: 85,
    tone: "strong",
    segments: [{ text: "Hace" }, { text: "viento." }],
    note: "El viento que te la pela, pero que tira a tu abuela.",
    particles: 82,
    streakSpeed: 2.6,
    gustShake: 2.6,
  },
  {
    limit: 100,
    tone: "extreme",
    segments: [{ text: "Hace" }, { text: "MUCHO viento." }],
    note: "Ferry a Tánger cancelado. Mejor ni salgas.",
    particles: 108,
    streakSpeed: 1.7,
    gustShake: 4,
  },
  {
    limit: 118,
    tone: "severe",
    segments: [{ text: "Hace" }, { text: "MUCHÍSIMO viento." }],
    color: "#c94a3a",
    note: "No salgas si no tienes que salir, de verdad.",
    particles: 134,
    streakSpeed: 1.2,
    gustShake: 5.2,
  },
  {
    limit: 999,
    tone: "danger",
    segments: [{ text: "Hace" }, { text: "Huracán." }],
    color: "#8a2820",
    note: "Que haces mirando esto sal corriendo.",
    particles: 170,
    streakSpeed: 0.8,
    gustShake: 7,
  },
];

export function intensityFor(speed: number): Intensity {
  return (
    thresholds.find((t) => speed <= t.limit) ??
    thresholds[thresholds.length - 1]
  );
}
