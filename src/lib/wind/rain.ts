export type RainState = "drops" | "light" | "rain" | "heavy" | "none";
export interface RainLine {
  verb: string;
  icon: string;
}

export function rainLineFor(state: RainState): RainLine | null {
  switch (state) {
    case "drops":
      return { verb: "chispea", icon: "·" };
    case "light":
      return { verb: "llueve flojito", icon: "··" };
    case "rain":
      return { verb: "llueve", icon: "···" };
    case "heavy":
      return { verb: "diluvia", icon: "░" };
    default:
      return null;
  }
}
