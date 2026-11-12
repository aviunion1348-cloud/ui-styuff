"use client";

import { SCATTER } from "@/lib/data";
import { useInView } from "@/lib/useInView";
import { ChartFrame } from "../ChartFrame";

const W = 640;
const H = 430;
const M = { l: 64, r: 28, t: 24, b: 62 };
const iw = W - M.l - M.r;
const ih = H - M.t - M.b;
const X0 = 0.0012;
const X1 = 0.03;
const xPos = (usd: number) => M.l + (iw * (Math.log10(usd) - Math.log10(X0))) / (Math.log10(X1) - Math.log10(X0));
const yPos = (c: number) => M.t + ih * (1 - (c - 0.5) / 0.5);
const FONT = "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

/** Label placement, relative to each point, chosen to avoid collisions. */
const LABEL: Record<string, { dx: number; dy: number; anchor: "start" | "middle" | "end" }> = {
  optimised: { dx: 16, dy: 5, anchor: "start" },
  lear: { dx: 0, dy: 30, anchor: "middle" },
  single: { dx: 16, dy: -6, anchor: "start" },
  telemetry: { dx: 16, dy: 5, anchor: "start" },
  multi: { dx: 0, dy: -20, anchor: "middle" },
  kimi: { dx: 0, dy: -32, anchor: "middle" },
};

export function CostScatter() {
  const { ref, inView } = useInView<SVGSVGElement>(0.25);
  return (
    <ChartFrame
      title="Accuracy against cost"
      filename="lear-accuracy-vs-cost"
      caption={
        <>
          Log-scale cost axis. Up and to the left is better. The Kimi point is on the 24-case fresh set with one repeat, so compare it with Lear on DeepSeek (96% fresh), not with the development points.
        </>
      }
    >
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Scatter plot of accuracy against cost per incident on a log scale. Lear optimised is most accurate and cheapest; multi-agent is about 13 times costlier than Lear optimised; telemetry-only is least accurate of the agentic designs." fontFamily={FONT}>
        {[0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((c) => (
          <g key={c}>
            <line x1={M.l} x2={W - M.r} y1={yPos(c)} y2={yPos(c)} stroke="#e6ebf3" />
            <text x={M.l - 10} y={yPos(c) + 4} textAnchor="end" fontSize="12" fill="#64748b">
              {Math.round(c * 100)}%
            </text>
          </g>
        ))}
        {[0.002, 0.005, 0.01, 0.02].map((usd) => (
          <g key={usd}>
            <line x1={xPos(usd)} x2={xPos(usd)} y1={M.t} y2={M.t + ih} stroke="#eef2f7" />
            <text x={xPos(usd)} y={M.t + ih + 20} textAnchor="middle" fontSize="12" fill="#64748b">
              {`$${usd}`}
            </text>
          </g>
        ))}
        <text x={M.l + iw / 2} y={H - 14} textAnchor="middle" fontSize="13" fill="#334155">
          USD per incident (log scale, list price)
        </text>
        <text transform={`translate(16 ${M.t + ih / 2}) rotate(-90)`} textAnchor="middle" fontSize="13" fill="#334155">
          correct answers
        </text>
        <line x1={M.l} x2={M.l} y1={M.t} y2={M.t + ih} stroke="#94a3b8" />
        <line x1={M.l} x2={W - M.r} y1={M.t + ih} y2={M.t + ih} stroke="#94a3b8" />

        <text x={M.l + 12} y={M.t + ih - 14} fontSize="12" fill="#0f766e" fontWeight={600}>
          ↖ better: cheaper and more accurate
        </text>

        {SCATTER.map((p, i) => {
          const cx = xPos(p.usd);
          const cy = yPos(p.correct);
          const L = LABEL[p.id];
          const delay = 120 + i * 110;
          return (
            <g key={p.id}>
              <title>{`${p.label}: ${Math.round(p.correct * 100)}% at $${p.usd}${p.note ? ` (${p.note})` : ""}`}</title>
              <circle
                cx={cx}
                cy={cy}
                r={10}
                fill={p.color}
                stroke="#ffffff"
                strokeWidth={2.5}
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transform: inView ? "scale(1)" : "scale(0)",
                  transition: `transform 700ms cubic-bezier(.3,1.4,.5,1) ${delay}ms`,
                }}
              />
              <text
                x={cx + L.dx}
                y={cy + L.dy}
                textAnchor={L.anchor}
                fontSize="13"
                fontWeight={600}
                fill="#0b1220"
                style={{ opacity: inView ? 1 : 0, transition: `opacity 600ms ease ${delay + 350}ms` }}
              >
                {p.label}
              </text>
              {p.note ? (
                <text
                  x={cx + L.dx}
                  y={cy + L.dy + 15}
                  textAnchor={L.anchor}
                  fontSize="11"
                  fill="#64748b"
                  style={{ opacity: inView ? 1 : 0, transition: `opacity 600ms ease ${delay + 350}ms` }}
                >
                  {p.note}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </ChartFrame>
  );
}
