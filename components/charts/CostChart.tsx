"use client";

import { COST_ROWS } from "@/lib/data";
import { fmtUsd4 } from "@/lib/format";
import { useInView } from "@/lib/useInView";
import { ChartFrame } from "../ChartFrame";

const W = 640;
const ROW = 58;
const M = { l: 150, r: 84, t: 46, b: 30 };
const H = M.t + COST_ROWS.length * ROW + M.b;
const iw = W - M.l - M.r;
const MAX = 0.035;
const xPos = (v: number) => M.l + (iw * v) / MAX;
const FONT = "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
const COLORS = { cached: "#0d9488", uncached: "#99f6e4" };

/** Two bars per arm: cached (the headline) and uncached (the safer planning number). */
export function CostChart() {
  const { ref, inView } = useInView<SVGSVGElement>(0.25);
  return (
    <ChartFrame
      title="USD per incident, cached and uncached"
      filename="lear-cost-per-incident"
      caption={
        <>
          Cached is the provider's billed figure: DeepSeek bills a repeated prompt prefix at 1/50 of the input price. Uncached is the safer planning number, because each production incident's evidence is new.
        </>
      }
    >
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Horizontal bars of USD per incident, cached and uncached, for five designs. Lear optimised is cheapest at $0.0016 cached and $0.0020 uncached; multi-agent is most expensive at $0.0202 cached and $0.0344 uncached." fontFamily={FONT}>
        <g>
          <rect x={M.l} y={14} width={12} height={12} rx={3} fill={COLORS.cached} />
          <text x={M.l + 18} y={25} fontSize="12" fill="#334155">cached (billed)</text>
          <rect x={M.l + 130} y={14} width={12} height={12} rx={3} fill={COLORS.uncached} />
          <text x={M.l + 148} y={25} fontSize="12" fill="#334155">uncached (planning)</text>
        </g>
        {[0, 0.01, 0.02, 0.03].map((v) => (
          <g key={v}>
            <line x1={xPos(v)} x2={xPos(v)} y1={M.t - 6} y2={H - M.b} stroke="#e6ebf3" />
            <text x={xPos(v)} y={H - 8} textAnchor="middle" fontSize="12" fill="#64748b">
              ${v.toFixed(2)}
            </text>
          </g>
        ))}
        {COST_ROWS.map((row, i) => {
          const y0 = M.t + i * ROW;
          const isLear = row.id === "optimised" || row.id === "lear";
          const bar = (v: number, yy: number, fill: string, delay: number) => (
            <rect
              x={M.l}
              y={yy}
              width={xPos(v) - M.l}
              height={20}
              rx={6}
              fill={fill}
              style={{
                transformBox: "fill-box",
                transformOrigin: "left",
                transform: inView ? "scaleX(1)" : "scaleX(0)",
                transition: `transform 1000ms cubic-bezier(.2,.8,.2,1) ${delay}ms`,
              }}
            />
          );
          return (
            <g key={row.id}>
              <title>{`${row.label}: ${fmtUsd4(row.usdPerIncident)} cached, ${fmtUsd4(row.usdNoCache)} uncached`}</title>
              <text x={M.l - 14} y={y0 + 24} textAnchor="end" fontSize="14" fontWeight={isLear ? 700 : 500} fill="#0b1220">
                {row.label}
              </text>
              {bar(row.usdNoCache, y0 + 2, COLORS.uncached, i * 90 + 150)}
              {bar(row.usdPerIncident, y0 + 26, COLORS.cached, i * 90 + 220)}
              <text x={xPos(row.usdNoCache) + 8} y={y0 + 18} fontSize="12" fill="#475569" className="tabular" style={{ opacity: inView ? 1 : 0, transition: `opacity 500ms ease ${i * 90 + 900}ms` }}>
                {fmtUsd4(row.usdNoCache)}
              </text>
              <text x={xPos(row.usdPerIncident) + 8} y={y0 + 40} fontSize="12" fontWeight={600} fill="#0f766e" className="tabular" style={{ opacity: inView ? 1 : 0, transition: `opacity 500ms ease ${i * 90 + 1000}ms` }}>
                {fmtUsd4(row.usdPerIncident)}
              </text>
            </g>
          );
        })}
      </svg>
    </ChartFrame>
  );
}
