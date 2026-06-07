import { z } from "zod";

export const ForecastEntrySchema = z.object({
  label: z.string(),
  speedKmh: z.number(),
  windDeg: z.number(),
});

export const WindDataSchema = z.object({
  lastUpdate: z.number(),
  data: z.object({
    title: z.string(),
    subtitle: z.string(),
    changeText: z.string(),
    isWindy: z.boolean(),
  }),
  currentWind: z.string(),
  currentWindDirection: z.string().nullable(),
  currentWindKmh: z.number(),
  currentWindDeg: z.number(),
  currentGustKmh: z.number().nullable(),
  currentTemp: z.number().nullable(),
  currentPrecip: z.number().nullable(),
  currentTide: z.string().nullable(),
  forecast: z.array(ForecastEntrySchema),
});

export type ForecastEntry = z.infer<typeof ForecastEntrySchema>;
export type WindData = z.infer<typeof WindDataSchema>;
