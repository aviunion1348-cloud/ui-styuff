"use client";

import { useState } from "react";
import { ARM_BY_ID, SPEND_VOLUMES } from "@/lib/data";
import { fmtInt, fmtUsd } from "@/lib/format";
import { useInView } from "@/lib/useInView";
import { ChartFrame } from "../ChartFrame";

const W = 640;
const H = 380;
const M = { l: 70, r: 26, t: 22, b: 56 };
const iw = W - M.l - M.r;
const ih = H - M.t - M.b;
const LOG_MIN = 2; // 100 incidents
const LOG_MAX = 5; // 100,000 incidents
const Y_MIN = -1; // $0.10
const Y_MAX = 3.5; // ~$3,162
const xPos = (vol: number) => M.l + (iw * (Math.log10(vol) - LOG_MIN)) / (LOG_MAX - LOG_MIN);
const yPos = (usd: number) => M.t + ih * (Y_MAX - Math.log10(usd)) / (Y_MAX - Y_MIN);
const FONT = "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

const SERIES = [
  { id: "multi" as const, label: "Multi-agent design", color: ARM_BY_ID.multi.color },
  { id: "single" as const, label: "Single-agent design", color: ARM_BY_ID.single.color },
  { id: "optimised" as const, label: "Lear (optimised)", color: ARM_BY_ID.optimised.color },
];

const ticks = [0.1, 1, 10, 100, 1000];
const tickLabel = (v: number) => (v >= 1000 ? `$${v / 1000}k` : v < 1 ? `$${v}` : `$${v}`);

export function SpendChart() {
  const { ref, inView } = useInView<SVGSVGElement>(0.25);
  // Slider works in log10 space so 100 to 100,000 is evenly spread.
  const [logVol, setLogVol] = useState(3); // 1,000 incidents by default
  const volume = Math.round(Math.pow(10, logVol));
  const cost = (id: "multi" | "single" | "optimised") => ARM_BY_ID[id].usdPerIncident * volume;
  const saved = cost("single") - cost("optimised");
  const xCursor = xPos(volume);

  return (
    <div className="spend">
      <ChartFrame
        title="Monthly model spend, by volume"
        filename="lear-monthly-spend"
        caption={
          <>
            Both axes are logarithmic. Spend is linear in volume: monthly spend = incidents × USD per incident. Trend lines only: the baselines were not re-run after the schema change, so the same-code ratios from section 3 are the fair comparison.
          </>
        }
      >
        <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Log-log line chart of monthly model spend against incidents per month for Lear optimised, single-agent and multi-agent designs. All three are straight lines; Lear is the lowest." fontFamily={FONT}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={M.l} x2={W - M.r} y1={yPos(t)} y2={yPos(t)} stroke="#e6ebf3" />
              <text x={M.l - 10} y={yPos(t) + 4} textAnchor="end" fontSize="12" fill="#64748b">
                {tickLabel(t)}
              </text>
            </g>
          ))}
          {[100, 1000, 10000, 100000].map((v) => (
            <g key={v}>
              <line x1={xPos(v)} x2={xPos(v)} y1={M.t} y2={M.t + ih} stroke="#eef2f7" />
              <text x={xPos(v)} y={M.t + ih + 20} textAnchor="middle" fontSize="12" fill="#64748b">
                {fmtInt(v)}
              </text>
            </g>
          ))}
          <text x={M.l + iw / 2} y={H - 10} textAnchor="middle" fontSize="13" fill="#334155">
            incidents per month
          </text>
          <text transform={`translate(18 ${M.t + ih / 2}) rotate(-90)`} textAnchor="middle" fontSize="13" fill="#334155">
            model cost per month (USD)
          </text>

          <line x1={xCursor} x2={xCursor} y1={M.t} y2={M.t + ih} stroke="#0b1220" strokeDasharray="4 5" strokeWidth={1.2} opacity={0.5} />

          {SERIES.map((s, si) => {
            const pts = SPEND_VOLUMES.map((v) => [xPos(v), yPos(ARM_BY_ID[s.id].usdPerIncident * v)] as const);
            const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
            return (
              <g key={s.id}>
                <path
                  d={d}
                  pathLength={1}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={3.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={1}
                  strokeDashoffset={inView ? 0 : 1}
                  style={{ transition: `stroke-dashoffset 1600ms cubic-bezier(.4,0,.2,1) ${si * 200}ms` }}
                />
                {pts.map((p, i) => (
                  <circle
                    key={i}
                    cx={p[0]}
                    cy={p[1]}
                    r={5}
                    fill={s.color}
                    stroke="#fff"
                    strokeWidth={2}
                    style={{ opacity: inView ? 1 : 0, transition: `opacity 400ms ease ${900 + si * 200 + i * 120}ms` }}
                  />
                ))}
              </g>
            );
          })}

          {SERIES.map((s) => {
            const v = cost(s.id);
            return (
              <circle key={`cur-${s.id}`} cx={xCursor} cy={yPos(v)} r={7} fill={s.color} stroke="#0b1220" strokeWidth={1.5}>
                <title>{`${s.label}: ${fmtUsd(v)} per month at ${fmtInt(volume)} incidents`}</title>
              </circle>
            );
          })}
        </svg>
        <ul className="legend-list">
          {SERIES.map((s) => (
            <li key={s.id}>
              <span className="swatch" style={{ background: s.color }} aria-hidden="true" />
              {s.label}
            </li>
          ))}
        </ul>
      </ChartFrame>

      <div className="spend__controls">
        <label htmlFor="volume" className="spend__label">
          Incidents per month: <strong className="tabular">{fmtInt(volume)}</strong>
        </label>
        <input
          id="volume"
          type="range"
          min={LOG_MIN}
          max={LOG_MAX}
          step={0.01}
          value={logVol}
          onChange={(e) => setLogVol(Number(e.target.value))}
          aria-valuetext={`${fmtInt(volume)} incidents per month`}
        />
        <div className="spend__scale" aria-hidden="true">
          <span>100</span>
          <span>1k</span>
          <span>10k</span>
          <span>100k</span>
        </div>
        <dl className="spend__readout">
          <div>
            <dt>Lear (optimised)</dt>
            <dd className="tabular" style={{ color: ARM_BY_ID.optimised.color }}>{fmtUsd(cost("optimised"))}</dd>
          </div>
          <div>
            <dt>Single-agent</dt>
            <dd className="tabular">{fmtUsd(cost("single"))}</dd>
          </div>
          <div>
            <dt>Multi-agent</dt>
            <dd className="tabular">{fmtUsd(cost("multi"))}</dd>
          </div>
          <div className="spend__save">
            <dt>Saved vs single-agent / month</dt>
            <dd className="tabular">{fmtUsd(saved)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
