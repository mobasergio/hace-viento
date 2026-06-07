import SunCalc from "suncalc";

export interface Sky {
  top: string;
  mid: string;
  bottom: string;
  ink: string;
  inkSoft: string;
  muted: string;
  cardBg: string;
  cardInk: string;
  accent: string;
  horizonGlow: string;
  cardBorder: string;
  stars: boolean;
  label: string;
}

const LAT = 36.01;
const LON = -5.61;

type Anchor = Sky;
type SolarKey =
  | "nadir"
  | "nauticalDawn"
  | "dawn"
  | "sunrise"
  | "goldenHourEnd"
  | "solarNoon"
  | "goldenHour"
  | "sunset"
  | "dusk"
  | "nauticalDusk"
  | "night";

const PHASES: { key: SolarKey; anchor: Anchor }[] = [
  {
    key: "nadir",
    anchor: {
      top: "#05071a",
      mid: "#0a1132",
      bottom: "#141e44",
      ink: "#f2f5ff",
      inkSoft: "#b9c4e0",
      muted: "rgba(242,245,255,0.72)",
      cardBg: "#0a1130",
      cardInk: "#f2f5ff",
      accent: "#7db3ff",
      horizonGlow: "#1a1c46",
      cardBorder: "rgba(125,179,255,0.20)",
      stars: true,
      label: "noche",
    },
  },
  {
    key: "nauticalDawn",
    anchor: {
      top: "#0d1740",
      mid: "#1c2a5a",
      bottom: "#4a5c8c",
      ink: "#edf2ff",
      inkSoft: "#aec0e0",
      muted: "rgba(237,242,255,0.74)",
      cardBg: "#0f1634",
      cardInk: "#edf2ff",
      accent: "#ff9780",
      horizonGlow: "#6a3b5e",
      cardBorder: "rgba(255,151,128,0.20)",
      stars: true,
      label: "madrugada",
    },
  },
  {
    key: "dawn",
    anchor: {
      top: "#263b76",
      mid: "#8a6a9c",
      bottom: "#e89880",
      ink: "#fff0e4",
      inkSoft: "#d8c0b0",
      muted: "rgba(255,240,228,0.78)",
      cardBg: "#22182e",
      cardInk: "#fff0e4",
      accent: "#e64c38",
      horizonGlow: "#f0906c",
      cardBorder: "rgba(230,76,56,0.26)",
      stars: false,
      label: "amanecer",
    },
  },
  {
    key: "sunrise",
    anchor: {
      top: "#5a95d0",
      mid: "#f0b884",
      bottom: "#ffd8a8",
      ink: "#2a1608",
      inkSoft: "#6a4028",
      muted: "rgba(42,22,8,0.74)",
      cardBg: "#fffaf3",
      cardInk: "#2a1608",
      accent: "#d64820",
      horizonGlow: "#ffb878",
      cardBorder: "rgba(214,72,32,0.22)",
      stars: false,
      label: "alba",
    },
  },
  {
    key: "goldenHourEnd",
    anchor: {
      top: "#2e82c6",
      mid: "#6ba6d4",
      bottom: "#b8dbf0",
      ink: "#072846",
      inkSoft: "#2a6aa2",
      muted: "rgba(7,40,70,0.74)",
      cardBg: "#fcfdff",
      cardInk: "#072846",
      accent: "#0a4a7a",
      horizonGlow: "#c8e2f2",
      cardBorder: "rgba(10,74,122,0.18)",
      stars: false,
      label: "mañana",
    },
  },
  {
    key: "solarNoon",
    anchor: {
      top: "#3694d8",
      mid: "#5aabd8",
      bottom: "#b2d8ee",
      ink: "#072846",
      inkSoft: "#2a6aa2",
      muted: "rgba(7,40,70,0.74)",
      cardBg: "#ffffff",
      cardInk: "#072846",
      accent: "#084a7a",
      horizonGlow: "#c2dcef",
      cardBorder: "rgba(8,74,122,0.18)",
      stars: false,
      label: "mediodía",
    },
  },
  {
    key: "goldenHour",
    anchor: {
      top: "#ce5e1e",
      mid: "#eb9634",
      bottom: "#ffca74",
      ink: "#2a0e00",
      inkSoft: "#7a3e0c",
      muted: "rgba(42,14,0,0.76)",
      cardBg: "#fff7ec",
      cardInk: "#2a0e00",
      accent: "#a03000",
      horizonGlow: "#ffce7a",
      cardBorder: "rgba(160,48,0,0.22)",
      stars: false,
      label: "tarde dorada",
    },
  },
  {
    key: "sunset",
    anchor: {
      top: "#6e1c2e",
      mid: "#d44028",
      bottom: "#f88448",
      ink: "#fff2e2",
      inkSoft: "#e8c8b0",
      muted: "rgba(255,242,226,0.78)",
      cardBg: "#280a1c",
      cardInk: "#fff2e2",
      accent: "#ff8a3a",
      horizonGlow: "#ff8548",
      cardBorder: "rgba(255,138,58,0.28)",
      stars: false,
      label: "atardecer",
    },
  },
  {
    key: "dusk",
    anchor: {
      top: "#402858",
      mid: "#a85260",
      bottom: "#e8886a",
      ink: "#fceadd",
      inkSoft: "#d6b8aa",
      muted: "rgba(252,234,221,0.78)",
      cardBg: "#1a0d24",
      cardInk: "#fceadd",
      accent: "#ff9868",
      horizonGlow: "#e8886a",
      cardBorder: "rgba(255,152,104,0.26)",
      stars: true,
      label: "crepúsculo",
    },
  },
  {
    key: "nauticalDusk",
    anchor: {
      top: "#0a1238",
      mid: "#182852",
      bottom: "#3a5088",
      ink: "#ebf0ff",
      inkSoft: "#aebde0",
      muted: "rgba(235,240,255,0.74)",
      cardBg: "#0c1534",
      cardInk: "#ebf0ff",
      accent: "#e06e48",
      horizonGlow: "#8a4856",
      cardBorder: "rgba(224,110,72,0.24)",
      stars: true,
      label: "anochecer",
    },
  },
  {
    key: "night",
    anchor: {
      top: "#05071a",
      mid: "#0a1132",
      bottom: "#141e44",
      ink: "#f2f5ff",
      inkSoft: "#b9c4e0",
      muted: "rgba(242,245,255,0.72)",
      cardBg: "#0a1130",
      cardInk: "#f2f5ff",
      accent: "#7db3ff",
      horizonGlow: "#1a1c46",
      cardBorder: "rgba(125,179,255,0.20)",
      stars: true,
      label: "noche",
    },
  },
];

function lerpColor(c1: string, c2: string, t: number): string {
  const p = (s: string) => s.match(/\w\w/g)?.map((x) => parseInt(x, 16)) ?? [];
  const [r1, g1, b1] = p(c1);
  const [r2, g2, b2] = p(c2);
  if (r1 === undefined || g1 === undefined || b1 === undefined) return c1;
  if (r2 === undefined || g2 === undefined || b2 === undefined) return c2;
  return `#${[
    Math.round(r1 + (r2 - r1) * t),
    Math.round(g1 + (g2 - g1) * t),
    Math.round(b1 + (b2 - b1) * t),
  ]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("")}`;
}

function blend(a: Anchor, b: Anchor, t: number): Sky {
  const pick = t < 0.5 ? a : b;
  return {
    top: lerpColor(a.top, b.top, t),
    mid: lerpColor(a.mid, b.mid, t),
    bottom: lerpColor(a.bottom, b.bottom, t),
    ink: pick.ink,
    inkSoft: pick.inkSoft,
    muted: pick.muted,
    cardBg: pick.cardBg,
    cardInk: pick.cardInk,
    accent: pick.accent,
    horizonGlow: pick.horizonGlow,
    cardBorder: pick.cardBorder,
    stars: pick.stars,
    label: pick.label,
  };
}

export function skyForDate(date: Date): Sky {
  const timeline: { t: number; anchor: Anchor }[] = [];

  for (let offset = -1; offset <= 1; offset++) {
    const d = new Date(date.getTime() + offset * 86_400_000);
    const times = SunCalc.getTimes(d, LAT, LON);
    for (const { key, anchor } of PHASES) {
      const ev = times[key];
      if (ev && !isNaN(ev.getTime())) {
        timeline.push({ t: ev.getTime(), anchor });
      }
    }
  }

  timeline.sort((a, b) => a.t - b.t);

  const now = date.getTime();
  let i = timeline.findIndex((e) => e.t > now);
  if (i <= 0) i = 1;

  const before = timeline[i - 1];
  const after = timeline[i];
  const t = (now - before.t) / Math.max(1, after.t - before.t);

  return blend(before.anchor, after.anchor, Math.min(1, Math.max(0, t)));
}

export function sunPosition(date: Date): {
  x: number;
  y: number;
  body: "sun" | "moon" | "hidden";
} {
  const pos = SunCalc.getPosition(date, LAT, LON);
  const x = Math.min(1, Math.max(0, 0.5 + (pos.azimuth / Math.PI) * 0.9));
  const alt = Math.max(-0.35, Math.min(Math.PI / 2, pos.altitude));
  const y = 0.82 - (Math.max(0, alt) / (Math.PI / 2)) * 0.74;
  if (pos.altitude > -0.09) return { x, y, body: "sun" };
  const moonPos = SunCalc.getMoonPosition(date, LAT, LON);
  const mx = Math.min(1, Math.max(0, 0.5 + (moonPos.azimuth / Math.PI) * 0.9));
  const malt = Math.max(-0.4, Math.min(Math.PI / 2, moonPos.altitude));
  const my = 0.78 - (Math.max(0, malt) / (Math.PI / 2)) * 0.68;
  if (moonPos.altitude > -0.05) return { x: mx, y: my, body: "moon" };
  return { x: 0.5, y: 1.2, body: "hidden" };
}

export function skyForHour(h: number): Sky {
  const d = new Date();
  d.setHours(h, 30, 0, 0);
  return skyForDate(d);
}

export interface DiscDisplay {
  discX: string;
  discY: string;
  haloOpacity: string;
  haloW: string;
  haloH: string;
  baseHalo: string;
}

export function discDisplay(
  sky: Sky,
  sunPos: { x: number; y: number; body: "sun" | "moon" | "hidden" },
): DiscDisplay {
  const isSun = sunPos.body === "sun";
  const nearHorizon = Math.max(0, 1 - Math.abs(sunPos.y - 0.72) * 2.5);
  return {
    discX: (sunPos.x * 100).toFixed(1) + "%",
    discY: (sunPos.y * 100).toFixed(1) + "%",
    haloOpacity: (isSun ? 0.35 + nearHorizon * 0.5 : 0.06).toFixed(2),
    haloW: isSun ? "75%" : "35%",
    haloH: isSun ? "100%" : "55%",
    baseHalo: sky.stars ? "transparent" : sky.horizonGlow,
  };
}
