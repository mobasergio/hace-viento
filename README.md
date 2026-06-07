# ¿Hace viento?

Web minimalista que responde a una pregunta concreta: **¿hace viento ahora mismo en Tarifa?**

Muestra de un vistazo:

- Si hace viento o no.
- Dirección del viento (Levante o Poniente, con nombre local).
- Velocidad en km/h o nudos.
- Previsión por horas y cambio próximo.
- Ráfagas, temperatura, precipitación y marea.

## Stack

- **[Astro](https://astro.build/)** v6 — output `static`, sin frameworks UI, JS mínimo en cliente.
- **[SunCalc](https://github.com/mourner/suncalc)** — cielo dinámico (amanecer, atardecer, noche).
- **Puppeteer** — scraping horario de Windguru vía GitHub Actions.
- **Vercel** — hosting estático con cache y headers de seguridad.

## Desarrollo

```bash
npm install
npm run dev          # localhost:4321
npm run fetch-wind   # actualiza public/wind.json
npm run build
```

Node 20+.

## Estructura

```
src/
├── components/   componentes Astro
├── layouts/      Layout.astro
├── lib/          dominio (wind, tipos, utilidades)
├── pages/        index, 404
├── scripts/      fetcher Puppeteer (TS, ejecutado por GH Actions)
└── styles/       global.css
public/wind.json  datos generados por el fetcher
```
