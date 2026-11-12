"use client";

import { FRESH } from "@/lib/data";
import { useInView } from "@/lib/useInView";
import { ChartFrame } from "../ChartFrame";

const W = 640;
const ROW = 66;
const M = { l: 232, r: 40, t: 46, b: 44 };
const H = M.t + 3 * ROW + M.b;
const xPos = (v: number) => M.l + ((W - M.l - M.r) * (v - 60)) / 40;
const FONT = "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

const ROWS = [
  { label: "Lear", sub: "DeepSeek V4.1 Flash · 24 × 2", v: FRESH.lear.correct, ci: FRESH.lear.ci, color: "#14b8a6" },
  { label: "Single-agent", sub: "DeepSeek V4.1 Flash · 24 × 2", v: FRESH.single.correct, ci: FRESH.single.ci, color: "#f59e0b" },
  { label: "Lear on Kimi K3.1", sub: "24 cases · 1 repeat · reasoning low", v: FRESH.kimi.correct, ci: FRESH.kimi.ci, color: "#e11d48" },
];

/** Fresh set: point estimates with 95% intervals. */
export function FreshIntervalPlot() {
  const { ref, inView } = useInView<SVGSVGElement>(0.25);
  return (
    <ChartFrame
      title="Fresh set: the cross-design test"
      filename="lear-fresh-set"
      caption={
        <>
          The 24 fresh incidents were written after the fixes and before any run. Intervals overlap heavily: the gap between Lear and single-agent (p = 0.25) and the Kimi-versus-DeepSeek difference are not statistically resolved on this sample size.
        </>
      }
    >
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Interval plot on the fresh set: Lear on DeepSeek 96% [88, 100]; single-agent on DeepSeek 90% [77, 100]; Lear on Kimi K3.1 92% [79, 100]." fontFamily={FONT}>
        {[60, 70, 80, 90, 100].map((v) => (
          <g key={v}>
            <line x1={xPos(v)} x2={xPos(v)} y1={M.t - 10} y2={H - M.b} stroke="#e6ebf3" />
            <text x={xPos(v)} y={H - 16} textAnchor="middle" fontSize="12" fill="#64748b">{v}%</text>
          </g>
        ))}
        {ROWS.map((r, i) => {
          const y = M.t + i * ROW + ROW / 2 - 8;
          const delay = i * 200;
          return (
            <g key={r.label}>
              <title>{`${r.label}: ${r.v}% (95% CI ${r.ci[0]}–${r.ci[1]}%)`}</title>
              <text x={M.l - 18} y={y - 2} textAnchor="end" fontSize="14" fontWeight={700} fill="#0b1220">{r.label}</text>
              <text x={M.l - 18} y={y + 16} textAnchor="end" fontSize="11" fill="#64748b">{r.sub}</text>
              <line x1={xPos(r.ci[0])} x2={xPos(r.ci[1])} y1={y} y2={y} stroke={r.color} strokeWidth={3} strokeLinecap="round" style={{
                transformBox: "fill-box",
                transformOrigin: "left",
                transform: inView ? "scaleX(1)" : "scaleX(0)",
                transition: `transform 1000ms cubic-bezier(.2,.8,.2,1) ${delay}ms`,
              }} />
              <line x1={xPos(r.ci[0])} x2={xPos(r.ci[0])} y1={y - 8} y2={y + 8} stroke={r.color} strokeWidth={3} />
              <line x1={xPos(r.ci[1])} x2={xPos(r.ci[1])} y1={y - 8} y2={y + 8} stroke={r.color} strokeWidth={3} />
              <circle cx={xPos(r.v)} cy={y} r={11} fill={r.color} stroke="#ffffff" strokeWidth={3} style={{
                opacity: inView ? 1 : 0,
                transformBox: "fill-box",
                transformOrigin: "center",
                transform: inView ? "scale(1)" : "scale(0)",
                transition: `transform 600ms cubic-bezier(.3,1.4,.5,1) ${delay + 700}ms, opacity 400ms ease ${delay + 700}ms`,
              }} />
              <text x={xPos(r.v)} y={y - 18} textAnchor="middle" fontSize="14" fontWeight={800} fill="#0b1220" style={{ opacity: inView ? 1 : 0, transition: `opacity 400ms ease ${delay + 900}ms` }}>
                {r.v}%
              </text>
              <text x={xPos(r.v)} y={y + 30} textAnchor="middle" fontSize="11" fill="#64748b">95% CI [{r.ci[0]}, {r.ci[1]}]</text>
            </g>
          );
        })}
      </svg>
    </ChartFrame>
  );
}
