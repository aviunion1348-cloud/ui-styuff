"use client";

import { useState } from "react";
import { armById, SPEND_VOLUMES } from "@/lib/data";
import { fmtInt, fmtUsd } from "@/lib/format";
import { fade } from "@/lib/motion";
import { log10 } from "@/lib/scale";
import { useInView } from "@/lib/useInView";
import { armColor, fonts, palette } from "@/lib/theme";

const W = 760;
const H = 400;
const M = { l: 78, r: 170, t: 20, b: 52 };
const X: [number, number] = [100, 100000];
const Y: [number, number] = [0.1, 3500];
const x = log10(X, [M.l, W - M.r]);
const y = log10(Y, [H - M.b, M.t]);

const SERIES = [
  { id: "multi" as const, label: "Multi-agent", color: armColor.multi },
  { id: "single" as const, label: "Single-agent", color: armColor.single },
  { id: "optimised" as const, label: "Lear (optimised)", color: armColor.optimised },
];

const cost = (id: "multi" | "single" | "optimised", volume: number) => armById(id).usdPerIncident * volume;

/**
 * Monthly model spend against incidents per month. Both axes are log scale, so
 * linear cost reads as a straight line. The slider drives a cursor and a readout.
 */
export function Spend() {
  const { ref, inView } = useInView<SVGSVGElement>(0.2);
  const [logVol, setLogVol] = useState(3);
  const volume = Math.round(Math.pow(10, logVol));
  const cx = x(volume);

  // End-of-line labels: keep at least 38px between them so the three series names never overlap.
  const endY = (id: (typeof SERIES)[number]["id"]) => y(armById(id).usdPerIncident * X[1]);
  const labelY: Record<string, number> = {};
  let prevLabel = -Infinity;
  for (const s of [...SERIES].sort((a, b) => endY(a.id) - endY(b.id))) {
    labelY[s.id] = Math.max(endY(s.id), prevLabel + 38);
    prevLabel = labelY[s.id];
  }

  return (
    <div className="spend">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Log-log chart of monthly model spend against incidents per month. Multi-agent is highest, single-agent next, Lear optimised lowest. All three lines are straight." fontFamily={fonts.sans}>
        {[0.1, 1, 10, 100, 1000].map((v) => (
          <g key={v}>
            <line x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} stroke={palette.rule} />
            <text x={M.l - 12} y={y(v) + 4} textAnchor="end" fontSize="12" fill={palette.ink3} fontFamily={fonts.mono}>
              {v < 1 ? `$${v}` : v >= 1000 ? `$${v / 1000}k` : `$${v}`}
            </text>
          </g>
        ))}
        {SPEND_VOLUMES.map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={M.t} y2={H - M.b} stroke={palette.rule} strokeDasharray="2 4" />
            <text x={x(v)} y={H - M.b + 22} textAnchor="middle" fontSize="12" fill={palette.ink3} fontFamily={fonts.mono}>
              {fmtInt(v)}
            </text>
          </g>
        ))}
        <line x1={M.l} x2={W - M.r} y1={H - M.b} y2={H - M.b} stroke={palette.ruleStrong} />
        <line x1={M.l} x2={M.l} y1={M.t} y2={H - M.b} stroke={palette.ruleStrong} />
        <text x={(M.l + W - M.r) / 2} y={H - 10} textAnchor="middle" fontSize="12" fill={palette.ink3}>
          incidents per month (log scale)
        </text>

        <line x1={cx} x2={cx} y1={M.t} y2={H - M.b} stroke={palette.ink3} strokeWidth={1} strokeDasharray="4 4" />

        {SERIES.map((s, si) => {
          const pts = SPEND_VOLUMES.map((v) => [x(v), y(armById(s.id).usdPerIncident * v)] as const);
          const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
          const last = pts[pts.length - 1];
          const endVal = cost(s.id, X[1]);
          return (
            <g key={s.id}>
              <path
                d={d}
                pathLength={1}
                fill="none"
                stroke={s.color}
                strokeWidth={s.id === "optimised" ? 3 : 2}
                strokeLinecap="round"
                strokeDasharray={1}
                strokeDashoffset={inView ? 0 : 1}
                style={{ transition: `stroke-dashoffset 1400ms cubic-bezier(.4,0,.2,1) ${si * 180}ms` }}
              />
              {pts.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r={3.5} fill={s.color} style={fade(inView, 900 + si * 150 + i * 90, 400)} />
              ))}
              <g style={fade(inView, 1200 + si * 150, 500)}>
                <text x={last[0] + 12} y={labelY[s.id] + 4} fontSize="13" fontWeight={600} fill={s.color}>
                  {s.label}
                </text>
                <text x={last[0] + 12} y={labelY[s.id] + 19} fontSize="12" fill={palette.ink3} fontFamily={fonts.mono}>
                  {fmtUsd(endVal)}
                </text>
              </g>
            </g>
          );
        })}

        {SERIES.map((s) => (
          <circle key={`c-${s.id}`} cx={cx} cy={y(cost(s.id, volume))} r={5.5} fill={palette.panel} stroke={s.color} strokeWidth={2.5} />
        ))}
      </svg>

      <div className="spend__control">
        <label htmlFor="volume">
          Incidents per month <output htmlFor="volume" className="spend__volume">{fmtInt(volume)}</output>
        </label>
        <input
          id="volume"
          type="range"
          min={2}
          max={5}
          step={0.01}
          value={logVol}
          onChange={(e) => setLogVol(Number(e.target.value))}
          aria-valuetext={`${fmtInt(volume)} incidents per month`}
        />
        <div className="spend__ticks" aria-hidden="true">
          <span>100</span>
          <span>1,000</span>
          <span>10,000</span>
          <span>100,000</span>
        </div>
      </div>

      <table className="spend__table">
        <caption>Model spend per month at the selected volume</caption>
        <tbody>
          {SERIES.map((s) => (
            <tr key={s.id}>
              <th scope="row">
                <span className="swatch" style={{ background: s.color }} aria-hidden="true" />
                {s.label}
              </th>
              <td className="num">{fmtUsd(cost(s.id, volume))}</td>
            </tr>
          ))}
          <tr className="is-hl">
            <th scope="row">Saved against single-agent</th>
            <td className="num">{fmtUsd(cost("single", volume) - cost("optimised", volume))}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
