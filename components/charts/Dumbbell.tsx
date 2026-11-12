"use client";

import { useInView } from "@/lib/useInView";
import { draw, fade } from "@/lib/motion";
import { linear } from "@/lib/scale";
import { fonts, palette } from "@/lib/theme";

export interface DumbbellRow {
  id: string;
  label: string;
  sub?: string;
  from: number;
  to: number;
  /** Hollow marker at `from`, filled marker at `to`. */
  toColor: string;
  /** Text in the right-hand column. */
  right: string;
  /** Violet label for the subject design. */
  highlight?: boolean;
}

/** Paired values per row: hollow marker = before or uncached, filled = after or cached. */
/** Tick format is named, not passed as a function: functions cannot cross into a client component. */
const FORMAT = {
  pct: (v: number) => `${v}%`,
  usd2: (v: number) => `$${v.toFixed(2)}`,
} as const;

export function Dumbbell({
  rows,
  domain,
  ticks,
  format,
  label,
  fromLabel,
  toLabel,
}: {
  rows: DumbbellRow[];
  domain: [number, number];
  ticks: number[];
  format: keyof typeof FORMAT;
  label: string;
  fromLabel: string;
  toLabel: string;
}) {
  const { ref, inView } = useInView<SVGSVGElement>(0.2);
  const W = 760;
  const rowH = 84;
  const M = { l: 214, r: 176, t: 40, b: 46 };
  const H = M.t + rows.length * rowH + M.b;
  const x = linear(domain, [M.l, W - M.r]);

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={label} fontFamily={fonts.sans}>
      <text x={M.l} y={20} fontSize="11" fill={palette.ink3} fontFamily={fonts.mono} letterSpacing="0.08em">
        ○ {fromLabel}
      </text>
      <text x={M.l + 170} y={20} fontSize="11" fill={palette.ink3} fontFamily={fonts.mono} letterSpacing="0.08em">
        ● {toLabel}
      </text>
      <text x={W - 4} y={20} textAnchor="end" fontSize="11" fill={palette.ink3} fontFamily={fonts.mono} letterSpacing="0.08em">
        VALUES
      </text>

      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={M.t} y2={H - M.b} stroke={palette.rule} />
          <text x={x(t)} y={H - M.b + 22} textAnchor="middle" fontSize="12" fill={palette.ink3} fontFamily={fonts.mono}>
            {FORMAT[format](t)}
          </text>
        </g>
      ))}
      <line x1={M.l} x2={W - M.r} y1={H - M.b} y2={H - M.b} stroke={palette.ruleStrong} />

      {rows.map((r, i) => {
        const y = M.t + i * rowH + rowH / 2;
        const d = i * 120;
        const x0 = x(Math.min(r.from, r.to));
        const x1 = x(Math.max(r.from, r.to));
        return (
          <g key={r.id}>
            <title>{`${r.label}: ${r.from} → ${r.to}`}</title>
            <text x={M.l - 22} y={y - 2} textAnchor="end" fontSize="14" fontWeight={600} fill={r.highlight ? palette.gold : palette.ink}>
              {r.label}
            </text>
            {r.sub ? (
              <text x={M.l - 22} y={y + 16} textAnchor="end" fontSize="12" fill={palette.ink3}>
                {r.sub}
              </text>
            ) : null}
            <line x1={x0} x2={x1} y1={y} y2={y} stroke={palette.ruleStrong} strokeWidth={3} strokeLinecap="round" style={draw(inView, d + 100)} />
            <g style={fade(inView, d + 300)}>
              <circle cx={x(r.from)} cy={y} r={6.5} fill={palette.panel} stroke={palette.silverMid} strokeWidth={2} />
              <circle cx={x(r.to)} cy={y} r={6.5} fill={r.toColor} />
            </g>
            <text x={W - 4} y={y + 5} textAnchor="end" fontSize="13" fontFamily={fonts.mono} fill={palette.ink2}>
              {r.right}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
