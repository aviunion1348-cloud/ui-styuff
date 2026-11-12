"use client";

import { useInView } from "@/lib/useInView";
import { fade } from "@/lib/motion";
import { linear } from "@/lib/scale";
import { fonts, palette } from "@/lib/theme";

export interface ForestRow {
  id: string;
  label: string;
  sub?: string;
  value: number;
  lo: number;
  hi: number;
  color: string;
  /** Shown above the point, e.g. "98%". */
  text: string;
  dim?: boolean;
}

/** Point estimate with a 95% interval for each row: a forest plot. */
export function Forest({
  rows,
  domain,
  ticks,
  label,
}: {
  rows: ForestRow[];
  domain: [number, number];
  ticks: number[];
  label: string;
}) {
  const { ref, inView } = useInView<SVGSVGElement>(0.2);
  const W = 760;
  const rowH = 66;
  const M = { l: 236, r: 36, t: 14, b: 46 };
  const H = M.t + rows.length * rowH + M.b;
  const x = linear(domain, [M.l, W - M.r]);

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={label} fontFamily={fonts.sans}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={M.t} y2={H - M.b} stroke={palette.rule} />
          <text x={x(t)} y={H - M.b + 22} textAnchor="middle" fontSize="12" fill={palette.ink3} fontFamily={fonts.mono}>
            {t}%
          </text>
        </g>
      ))}
      <line x1={M.l} x2={W - M.r} y1={H - M.b} y2={H - M.b} stroke={palette.ruleStrong} />

      {rows.map((r, i) => {
        const y = M.t + i * rowH + rowH / 2;
        const d = i * 110;
        const op = r.dim ? 0.5 : 1;
        return (
          <g key={r.id} opacity={op}>
            <title>{`${r.label}: ${r.value}% (95% CI ${r.lo}–${r.hi}%)`}</title>
            <text x={M.l - 22} y={y - 2} textAnchor="end" fontSize="14" fontWeight={600} fill={palette.ink}>
              {r.label}
            </text>
            {r.sub ? (
              <text x={M.l - 22} y={y + 16} textAnchor="end" fontSize="12" fill={palette.ink3}>
                {r.sub}
              </text>
            ) : null}
            <g style={fade(inView, d + 150)}>
              <line x1={x(r.lo)} x2={x(r.hi)} y1={y} y2={y} stroke={r.color} strokeWidth={1.6} />
              <line x1={x(r.lo)} x2={x(r.lo)} y1={y - 7} y2={y + 7} stroke={r.color} strokeWidth={1.6} />
              <line x1={x(r.hi)} x2={x(r.hi)} y1={y - 7} y2={y + 7} stroke={r.color} strokeWidth={1.6} />
            </g>
            <g style={fade(inView, d + 400)}>
              <circle cx={x(r.value)} cy={y} r={6} fill={r.color} stroke={palette.panel} strokeWidth={2} />
              <text x={x(r.value)} y={y - 16} textAnchor="middle" fontSize="13" fontFamily={fonts.mono} fill={palette.ink}>
                {r.text}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
