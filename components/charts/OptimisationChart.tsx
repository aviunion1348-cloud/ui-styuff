"use client";

import { CAUSE_SEGMENTS, OPTIMISATION } from "@/lib/data";
import { useInView } from "@/lib/useInView";
import { ChartFrame } from "../ChartFrame";

const FONT = "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

/* ---------- Dumbbell: before → after, per set ---------- */
const DW = 640;
const DH = 226;
const DM = { l: 160, r: 40, t: 22, b: 44 };
const dx = (pct: number) => DM.l + ((DW - DM.l - DM.r) * (pct - 80)) / 20;
const dRowY = (i: number) => DM.t + 40 + i * 92;

export function OptimisationDumbbell() {
  const { ref, inView } = useInView<SVGSVGElement>(0.25);
  return (
    <ChartFrame
      title="Accuracy before and after the changes"
      filename="lear-before-after"
      caption={
        <>
          Paired counts from section 6. The gate for keeping any change: no safety metric worse, no fewer correct answers, cost at most 1.10x. Both changes passed it; the fresh-set gain is not statistically significant (p = 0.25).
        </>
      }
    >
      <svg ref={ref} viewBox={`0 0 ${DW} ${DH}`} width="100%" role="img" aria-label="Dumbbell chart: development set accuracy rose from 88% to 98%, fresh set from 90% to 96%." fontFamily={FONT}>
        {[80, 85, 90, 95, 100].map((v) => (
          <g key={v}>
            <line x1={dx(v)} x2={dx(v)} y1={DM.t} y2={DH - DM.b} stroke="#e6ebf3" />
            <text x={dx(v)} y={DH - 14} textAnchor="middle" fontSize="12" fill="#64748b">
              {v}%
            </text>
          </g>
        ))}
        {OPTIMISATION.map((row, i) => {
          const y = dRowY(i);
          const b = (row.before / row.beforeN) * 100;
          const a = (row.after / row.afterN) * 100;
          return (
            <g key={row.set}>
              <text x={DM.l - 16} y={y + 4} textAnchor="end" fontSize="14" fontWeight={700} fill="#0b1220">
                {row.set.split(" (")[0]}
              </text>
              <text x={DM.l - 16} y={y + 22} textAnchor="end" fontSize="12" fill="#64748b">
                {row.set.match(/\(.*\)/)?.[0]}
              </text>
              <line x1={dx(b)} x2={dx(a)} y1={y} y2={y} stroke="#14b8a6" strokeWidth={6} strokeLinecap="round" style={{
                transformBox: "fill-box",
                transformOrigin: "left",
                transform: inView ? "scaleX(1)" : "scaleX(0)",
                transition: `transform 1000ms cubic-bezier(.2,.8,.2,1) ${i * 250 + 200}ms`,
              }} />
              <circle cx={dx(b)} cy={y} r={11} fill="#ffffff" stroke="#1e3a8a" strokeWidth={3} style={{ opacity: inView ? 1 : 0, transition: `opacity 400ms ease ${i * 250}ms` }} />
              <circle cx={dx(a)} cy={y} r={11} fill="#0d9488" stroke="#ffffff" strokeWidth={2} style={{ opacity: inView ? 1 : 0, transition: `opacity 400ms ease ${i * 250 + 900}ms` }} />
              <text x={dx(b)} y={y - 20} textAnchor="middle" fontSize="13" fontWeight={600} fill="#1e3a8a" style={{ opacity: inView ? 1 : 0, transition: `opacity 400ms ease ${i * 250 + 300}ms` }}>
                before {row.before}/{row.beforeN}
              </text>
              <text x={dx(a) + 14} y={y - 20} textAnchor="end" fontSize="13" fontWeight={600} fill="#0f766e" style={{ opacity: inView ? 1 : 0, transition: `opacity 400ms ease ${i * 250 + 1100}ms` }}>
                after {row.after}/{row.afterN}
              </text>
              <text x={(dx(b) + dx(a)) / 2} y={y + 38} textAnchor="middle" fontSize="12" fill="#475569" style={{ opacity: inView ? 1 : 0, transition: `opacity 400ms ease ${i * 250 + 1200}ms` }}>
                change {row.change} {row.ci} · p = {row.p} · cost {row.costRatio}
              </text>
            </g>
          );
        })}
      </svg>
    </ChartFrame>
  );
}

/* ---------- Stacked bar: why the wrong answers were wrong ---------- */
const CW = 640;
const CH = 230;
const CM = { l: 110, r: 24, t: 14, b: 58 };
const CMAX = 15;
const cx = (v: number) => CM.l + ((CW - CM.l - CM.r) * v) / CMAX;

export function CauseChart() {
  const { ref, inView } = useInView<SVGSVGElement>(0.25);
  const rows = [
    { label: "Before", key: "before" as const, y: CM.t + 20 },
    { label: "After", key: "after" as const, y: CM.t + 110 },
  ];
  return (
    <ChartFrame
      title="Why Lear's answers were wrong (development set)"
      filename="lear-wrong-answer-causes"
      caption={
        <>
          <strong>Data note:</strong> the segments above total 15 wrong answers before the changes, while the report's chart label and text say 17. The segments are shown as published; the 2 unaccounted answers are not broken down in the report.
        </>
      }
    >
      <svg ref={ref} viewBox={`0 0 ${CW} ${CH}`} width="100%" role="img" aria-label="Stacked bars of wrong answers by cause. Before the changes, 15 segments are drawn (4 abstained on a solvable incident, 4 proposed a refused fix, 5 right cause without a fix, 2 wrong cause without a fix). After, 2 wrong: 1 named a cause the evidence does not show, 1 wrong cause without a fix." fontFamily={FONT}>
        {[0, 3, 6, 9, 12, 15].map((v) => (
          <g key={v}>
            <line x1={cx(v)} x2={cx(v)} y1={CM.t} y2={CH - CM.b} stroke="#e6ebf3" />
            <text x={cx(v)} y={CH - 30} textAnchor="middle" fontSize="12" fill="#64748b">
              {v}
            </text>
          </g>
        ))}
        <text x={CM.l + (CW - CM.l - CM.r) / 2} y={CH - 6} textAnchor="middle" fontSize="12" fill="#475569">
          wrong answers out of 120 runs
        </text>
        {rows.map((row, ri) => {
          let acc = 0;
          return (
            <g key={row.key}>
              <text x={CM.l - 14} y={row.y + 26} textAnchor="end" fontSize="14" fontWeight={700} fill="#0b1220">
                {row.label}
              </text>
              {CAUSE_SEGMENTS.filter((s) => s[row.key] > 0).map((s, si) => {
                const start = acc;
                acc += s[row.key];
                return (
                  <g key={s.label}>
                    <title>{`${s.label}: ${s[row.key]}`}</title>
                    <rect
                      x={cx(start)}
                      y={row.y}
                      width={cx(acc) - cx(start)}
                      height={52}
                      fill={s.color}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      style={{
                        transformBox: "fill-box",
                        transformOrigin: "left",
                        transform: inView ? "scaleX(1)" : "scaleX(0)",
                        transition: `transform 900ms cubic-bezier(.2,.8,.2,1) ${ri * 350 + si * 110}ms`,
                      }}
                    />
                    <text x={(cx(start) + cx(acc)) / 2} y={row.y + 31} textAnchor="middle" fontSize="13" fontWeight={700} fill={s.color === "#fdba74" || s.color === "#93c5fd" ? "#0b1220" : "#ffffff"} style={{ opacity: inView ? 1 : 0, transition: `opacity 400ms ease ${ri * 350 + 800}ms` }}>
                      {s[row.key]}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
      <ul className="legend-list">
        {CAUSE_SEGMENTS.map((s) => (
          <li key={s.label}>
            <span className="swatch" style={{ background: s.color }} aria-hidden="true" />
            {s.label}
          </li>
        ))}
      </ul>
    </ChartFrame>
  );
}
