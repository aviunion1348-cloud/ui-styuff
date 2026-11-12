# Lear benchmark report: web edition

An interactive, static web version of the **Lear benchmark report** (2026-11-12,
Protocol v1.5). Every chart is drawn from the numbers in the report, and every
section keeps the PDF's numbering so the two can be read side by side.

The PDF is included at `public/report/lear-benchmark-report.pdf` and linked from
the page.

## What's on the page

- **Hero** with count-up key figures, and a reading-progress bar in the sticky nav.
- **Eleven numbered sections** matching the PDF, with section navigation that
  highlights the section you are reading.
- **Charts** (custom SVG, no chart library), each with:
  - entrance animations that play once as the chart scrolls into view,
  - a data table or caption beside it, so no number exists only in the picture,
  - **SVG** and **PNG** (2x) export buttons.
- **Monthly spend** chart with a volume slider (100 to 100,000 incidents/month).
- Print stylesheet, reduced-motion support, keyboard focus styles, and a skip link.

## Data

All numbers live in `lib/data.ts`, transcribed from the report. Where the report
is internally inconsistent, the page says so. The "why Lear's answers were wrong"
chart totals 15 wrong answers, while the report's label and text say 17. The
segments are shown as published.

## Develop

Requires Node 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build      # static prerender of /
npm start
```

## Deploy on Vercel

This is a standard Next.js app, so no configuration is needed:

1. Import the repository in Vercel.
2. Framework preset: **Next.js** (detected automatically).
3. Build command: `npm run build` · Output: automatic.

Every push to `main` produces a production deployment, and every pull request gets
a preview URL.

## Repository notes

- `package-lock.json` is committed so Vercel installs the exact versions tested.
- Security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`)
  are set in `next.config.mjs`.
