"use client";

import { SCATTER } from "@/lib/data";
import { useInView } from "@/lib/useInView";
import { fade } from "@/lib/motion";
import { log10 } from "@/lib/scale";
import { armColor, fonts, palette } from "@/lib/theme";

const W = 760;
const H = 470;
const M = { l: 70, r: 30, t: 22, b: 60 };
const X: [number, number] = [0.0012, 0.03];
const x = log10(X, [M.l, W - M.r]);
const y = (c: number) => M.t + ((H - M.t - M.b) * (1 - (c - 0.5) / 0.5));

/** Label offsets per point, tuned so the labels do not collide. */
const LABEL: Record<string, { dx: number; dy: number; anchor: "start" | "middle" | "end" }> = {
  optimised: { dx: 14, dy: 5, anchor: "start" },
  lear: { dx: 0, dy: 30, anchor: "middle" },
  single: { dx: 14, dy: -8, anchor: "start" },
  telemetry: { dx: 14, dy: 5, anchor: "start" },
  multi: { dx: 0, dy: -22, anchor: "middle" },
  kimi: { dx: 0, dy: -30, anchor: "middle" },
};

export function Scatter() {
  const { ref, inView } = useInView<SVGSVGElement>(0.2);
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Accuracy against cost per incident, log scale. Lear optimised is the most accurate and the cheapest; multi-agent costs about 13 times as much as Lear optimised and is less accurate than Lear v1.1." fontFamily={fonts.sans}>
      {[0.5, 0.6, 0.7, 0.8, 0.9, 1].map((c) => (
        <g key={c}>
          <line x1={M.l} x2={W - M.r} y1={y(c)} y2={y(c)} stroke={palette.rule} />
          <text x={M.l - 12} y={y(c) + 4} textAnchor="end" fontSize="12" fill={palette.ink3} fontFamily={fonts.mono}>
            {Math.round(c * 100)}%
          </text>
        </g>
      ))}
      {[0.002, 0.005, 0.01, 0.02].map((v) => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1={M.t} y2={H - M.b} stroke={palette.rule} strokeDasharray="2 4" />
          <text x={x(v)} y={H - M.b + 22} textAnchor="middle" fontSize="12" fill={palette.ink3} fontFamily={fonts.mono}>
            ${v}
          </text>
        </g>
      ))}
      <line x1={M.l} x2={W - M.r} y1={H - M.b} y2={H - M.b} stroke={palette.ruleStrong} />
      <line x1={M.l} x2={M.l} y1={M.t} y2={H - M.b} stroke={palette.ruleStrong} />
      <text x={(M.l + W - M.r) / 2} y={H - 10} textAnchor="middle" fontSize="12" fill={palette.ink3}>
        USD per incident, list price (log scale)
      </text>
      <text x={18} y={(M.t + H - M.b) / 2} textAnchor="middle" fontSize="12" fill={palette.ink3} transform={`rotate(-90 18 ${(M.t + H - M.b) / 2})`}>
        correct answers
      </text>
      <text x={M.l + 12} y={H - M.b - 12} fontSize="12" fill={palette.violet} fontFamily={fonts.mono}>
        ↖ cheaper and more accurate
      </text>

      {SCATTER.map((p, i) => {
        const cx = x(p.usd);
        const cy = y(p.correct);
        const L = LABEL[p.id];
        const color = p.id === "kimi" ? palette.ink : armColor[p.id];
        const d = 140 + i * 110;
        return (
          <g key={p.id}>
            <title>{`${p.label}: ${Math.round(p.correct * 100)}% at $${p.usd}`}</title>
            <g style={fade(inView, d)}>
              <circle cx={cx} cy={cy} r={p.id === "kimi" ? 8 : 9} fill={p.id === "kimi" ? palette.panel : color} stroke={color} strokeWidth={p.id === "kimi" ? 2.5 : 0} />
            </g>
            <g style={fade(inView, d + 300)}>
              <text x={cx + L.dx} y={cy + L.dy} textAnchor={L.anchor} fontSize="13" fontWeight={600} fill={palette.ink}>
                {p.label}
              </text>
              {p.note ? (
                <text x={cx + L.dx} y={cy + L.dy + 15} textAnchor={L.anchor} fontSize="11" fill={palette.ink3}>
                  {p.note}
                </text>
              ) : null}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
