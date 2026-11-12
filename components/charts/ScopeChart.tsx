"use client";

import { useInView } from "@/lib/useInView";
import { ChartFrame } from "../ChartFrame";

const W = 640;
const ROW = 62;
const M = { l: 214, r: 70, t: 14, b: 40 };
const ROWS = [
  { label: "Lear", sub: "code check refuses the action", pct: 0, color: "#14b8a6" },
  { label: "Single-agent", sub: "prompt asks it not to", pct: 25, color: "#f59e0b" },
  { label: "Multi-agent", sub: "prompt asks it not to", pct: 38, color: "#6366f1" },
  { label: "Lear, no check", sub: "ablation: code check removed", pct: 19, color: "#94a3b8" },
];
const H = M.t + ROWS.length * ROW + M.b;
const iw = W - M.l - M.r;
const xPos = (p: number) => M.l + (iw * p) / 50;
const FONT = "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

/** Share of observe-only scope cases where the design changed the component. */
export function ScopeChart() {
  const { ref, inView } = useInView<SVGSVGElement>(0.25);
  return (
    <ChartFrame
      title="Observe-only components changed, % of scope-case runs"
      filename="lear-scope-violations"
      caption={
        <>
          Scope cases mark a component observe-only. Lear's check refuses the action in code, so the protection does not depend on the model. Removing the check brings the failure back to 19%: the protection is code, not the model.
        </>
      }
    >
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Horizontal bars: observe-only components changed in 0% of Lear runs, 25% of single-agent runs, 38% of multi-agent runs, and 19% of Lear runs with the code check removed." fontFamily={FONT}>
        {[0, 10, 20, 30, 40, 50].map((v) => (
          <g key={v}>
            <line x1={xPos(v)} x2={xPos(v)} y1={M.t} y2={H - M.b} stroke="#e6ebf3" />
            <text x={xPos(v)} y={H - 14} textAnchor="middle" fontSize="12" fill="#64748b">
              {v}%
            </text>
          </g>
        ))}
        {ROWS.map((r, i) => {
          const y = M.t + i * ROW;
          return (
            <g key={r.label}>
              <title>{`${r.label}: ${r.pct}%`}</title>
              <text x={M.l - 16} y={y + 24} textAnchor="end" fontSize="15" fontWeight={700} fill="#0b1220">
                {r.label}
              </text>
              <text x={M.l - 16} y={y + 42} textAnchor="end" fontSize="12" fill="#64748b">
                {r.sub}
              </text>
              <rect x={M.l} y={y + 10} width={Math.max(iw * (r.pct / 50), 0)} height={34} rx={8} fill={r.color} style={{
                transformBox: "fill-box",
                transformOrigin: "left",
                transform: inView ? "scaleX(1)" : "scaleX(0)",
                transition: `transform 1100ms cubic-bezier(.2,.8,.2,1) ${i * 140}ms`,
              }} />
              {r.pct === 0 ? (
                <line x1={M.l} x2={M.l} y1={y + 6} y2={y + 48} stroke="#14b8a6" strokeWidth={3} strokeLinecap="round" />
              ) : null}
              <text x={xPos(r.pct) + 10} y={y + 33} fontSize="18" fontWeight={800} fill="#0b1220" className="tabular" style={{ opacity: inView ? 1 : 0, transition: `opacity 500ms ease ${i * 140 + 800}ms` }}>
                {r.pct}%
              </text>
            </g>
          );
        })}
        <line x1={M.l} x2={M.l} y1={M.t} y2={H - M.b} stroke="#94a3b8" />
      </svg>
    </ChartFrame>
  );
}
