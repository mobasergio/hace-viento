import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TIMEZONE, findCurrentForecastIndex } from "./utils/dateUtils.js";
import type { WindguruEntry } from "./utils/dateUtils.js";
import { checkWind, formatWind, extractDegrees } from "./utils/windUtils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../");
const OUT = path.join(ROOT, "public", "wind.json");
const TMP = OUT + ".tmp";

fs.mkdirSync(path.dirname(OUT), { recursive: true });

const KT_TO_KMH = 1.852;
const HOUR_RE = /\.(\d+)h$/;

function parseDirection(raw: string | undefined): {
  direction: string | null;
  deg: number;
} {
  try {
    return {
      direction: formatWind(raw ?? ""),
      deg: extractDegrees(raw ?? ""),
    };
  } catch {
    return { direction: null, deg: 0 };
  }
}

function parseKnotsToKmh(value: string | undefined): number | null {
  const kt = parseInt(value ?? "", 10);
  return Number.isFinite(kt) ? Math.round(kt * KT_TO_KMH) : null;
}

async function getWindData() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--lang=es-ES,es"],
  });
  const page = await browser.newPage();

  try {
    await page.goto("https://www.windguru.cz/43", {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector("#tabid_0_0_dates");
    await page.waitForSelector("#tabid_0_0_WINDSPD");
    await page.waitForSelector("#tabid_0_0_SMER");

    const dates = await page.$$eval("#tabid_0_0_dates td", (tds) =>
      tds.map((td) => td.textContent ?? ""),
    );
    const gustSpeeds = await page.$$eval("#tabid_0_0_WINDSPD td", (tds) =>
      tds.map((td) => td.textContent ?? ""),
    );
    const rawDirections = await page.$$eval("#tabid_0_0_SMER span", (spans) =>
      spans.map((s) => s.getAttribute("title") ?? ""),
    );

    const gustData = await page
      .$$eval("#tabid_0_0_GUST td", (tds) =>
        tds.map((td) => td.textContent?.trim() ?? ""),
      )
      .catch(() => [] as string[]);
    const tempData = await page
      .$$eval("#tabid_0_0_TMPE td", (tds) =>
        tds.map((td) => td.textContent?.trim() ?? ""),
      )
      .catch(() => [] as string[]);
    const precipData = await page
      .$$eval("#tabid_0_0_APCP1s td", (tds) =>
        tds.map((td) => td.textContent?.trim() ?? ""),
      )
      .catch(() => [] as string[]);

    const windData: WindguruEntry[] = dates
      .map((date, i) => {
        const { direction, deg } = parseDirection(rawDirections[i]);
        return {
          date,
          gustSpeed: gustSpeeds[i],
          windDirections: direction,
          windDeg: deg,
          speedKmh: parseKnotsToKmh(gustSpeeds[i]),
        };
      })
      .filter(
        (e): e is WindguruEntry & { speedKmh: number } =>
          e.windDirections !== null && e.speedKmh !== null,
      );

    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: TIMEZONE }),
    );
    const currentIndex = findCurrentForecastIndex(windData, now);

    if (currentIndex === -1 || !windData[currentIndex]) {
      throw new Error("No se pudo determinar el índice actual del forecast.");
    }

    const forecastSlice = windData
      .slice(currentIndex, currentIndex + 7)
      .map((entry) => {
        const hourMatch = entry.date.match(HOUR_RE);
        return {
          label: hourMatch ? `${hourMatch[1]}h` : entry.date,
          speedKmh: entry.speedKmh,
          windDeg: entry.windDeg,
        };
      });

    const currentGustKt = parseInt(gustData[currentIndex] ?? "", 10);
    const currentTempVal = parseFloat(tempData[currentIndex] ?? "");
    const precipRaw = precipData[currentIndex] ?? "";
    const precipNum = parseFloat(precipRaw);
    const currentPrecip: number | null =
      precipRaw === "" || precipRaw == null
        ? null
        : Number.isFinite(precipNum)
          ? precipNum
          : null;

    const tideState = await page
      .evaluate(
        (nowSec: number) => {
          const cells = [
            ...document.querySelectorAll<HTMLElement>("#tabid_0_0_tides td"),
          ];
          let targetCell: HTMLElement | null = null;
          let cellData: { start: number; end: number } | null = null;
          for (const cell of cells) {
            try {
              const d = JSON.parse(cell.dataset.tide ?? "{}");
              if (d.start && d.end && nowSec >= d.start && nowSec < d.end) {
                targetCell = cell;
                cellData = d;
                break;
              }
            } catch {
              /* skip cells without tide data */
            }
          }
          if (!targetCell || !cellData) return null;

          const svgEl = targetCell.querySelector("svg");
          const pathEl = targetCell.querySelector("path");
          if (!svgEl || !pathEl) return null;

          const svgWidth = parseFloat(svgEl.getAttribute("width") ?? "0");
          const timeRatio =
            (nowSec - cellData.start) / (cellData.end - cellData.start);
          const targetX = timeRatio * svgWidth;

          const tokens =
            (pathEl.getAttribute("d") ?? "").match(/[MLC]|[-\d.]+/g) ?? [];
          const pts: { x: number; y: number }[] = [];
          let cmd = "";
          let j = 0;
          while (j < tokens.length) {
            if (/^[MLC]$/.test(tokens[j])) {
              cmd = tokens[j++];
              continue;
            }
            if (cmd === "M" || cmd === "L") {
              pts.push({
                x: parseFloat(tokens[j]),
                y: parseFloat(tokens[j + 1]),
              });
              j += 2;
            } else if (cmd === "C") {
              pts.push({
                x: parseFloat(tokens[j + 4]),
                y: parseFloat(tokens[j + 5]),
              });
              j += 6;
            } else {
              j++;
            }
          }
          if (pts.length < 2) return null;

          const curvePts: { x: number; y: number }[] = [];
          for (const p of pts) {
            if (curvePts.length > 0 && p.x <= curvePts[curvePts.length - 1].x)
              break;
            curvePts.push(p);
          }
          if (curvePts.length < 2) return null;

          let y0 = curvePts[0].y;
          let y1 = curvePts[1].y;
          for (let i = 0; i < curvePts.length - 1; i++) {
            if (curvePts[i].x <= targetX && curvePts[i + 1].x >= targetX) {
              y0 = curvePts[i].y;
              y1 = curvePts[i + 1].y;
              break;
            }
          }
          const yCurrent = (y0 + y1) / 2;

          const ys = curvePts.map((p) => p.y);
          const mid = (Math.min(...ys) + Math.max(...ys)) / 2;
          const level = yCurrent <= mid ? "Alta" : "Baja";

          const diff = y1 - y0;
          if (Math.abs(diff) < 0.3) return level;
          return `${level} (${diff < 0 ? "subiendo" : "bajando"})`;
        },
        Math.floor(Date.now() / 1000),
      )
      .catch(() => null);

    const result = {
      lastUpdate: Date.now(),
      data: checkWind(windData, now),
      currentWind: windData[currentIndex].gustSpeed,
      currentWindDirection: windData[currentIndex].windDirections,
      currentWindKmh: windData[currentIndex].speedKmh,
      currentWindDeg: windData[currentIndex].windDeg,
      currentGustKmh: Number.isFinite(currentGustKt)
        ? Math.round(currentGustKt * KT_TO_KMH)
        : null,
      currentTemp: Number.isFinite(currentTempVal)
        ? Math.round(currentTempVal)
        : null,
      currentPrecip,
      currentTide: tideState,
      forecast: forecastSlice,
    };

    fs.writeFileSync(TMP, JSON.stringify(result));
    fs.renameSync(TMP, OUT);

    console.log(
      `[fetch-wind] OK — ${result.currentWindKmh} km/h ${result.currentWindDirection ?? ""}`,
    );
    return result;
  } catch (error) {
    if (fs.existsSync(TMP)) fs.unlinkSync(TMP);
    console.error("[fetch-wind] Error — conservando JSON anterior:", error);
    process.exitCode = 1;
    return null;
  } finally {
    await browser.close();
  }
}

async function main() {
  await getWindData();
}

main().catch(() => process.exit(1));
