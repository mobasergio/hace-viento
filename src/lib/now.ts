import { TIMEZONE } from "./constants";

export { TIMEZONE };

export function nowInMadrid(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE }));
}
