"use client";

import { CAUSES, type CauseKey } from "@/lib/data";
import { useInView } from "@/lib/useInView";
import { draw, fade } from "@/lib/motion";
import { linear } from "@/lib/scale";
import { fonts, palette } from "@/lib/theme";

const FILL: Record<CauseKey, string> = {
  abstain: palette.violetDeep,
  refused: palette.violetMid,
  right: palette.silver,
  wrong: palette.silverMid,
  unsupported: palette.graphite,
};
const INK_ON: Record<CauseKey, string> = {
  abstain: palette.ink,
  refused: palette.panel,
  right: palette.panel,
  wrong: palette.panel,
  unsupported: palette.ink,
};

/** Wrong answers by cause, before and after. Segments as published (they total 15, not 17). */
export function CauseStack() {
  const { ref, inView } = useInView<SVGSVGElement>(0.25);
  const W = 760;
  const M = { l: 110, r: 30, t: 14, b: 50 };
  const rowH = 96;
  const H = M.t + 2 * rowH + M.b;
  const x = linear([0, 15], [M.l, W - M.r]);
  const rows = [
    { label: "Before", key: "before" as const },
    { label: "After", key: "after" as const },
  ];

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Wrong answers by cause on the development set. Before: 4 abstained on a solvable incident, 4 proposed a refused fix, 5 right cause with no fix, 2 wrong cause with no fix. After: 1 wrong cause with no fix, 1 named an unsupported cause." fontFamily={fonts.sans}>
      {[0, 3, 6, 9, 12, 15].map((v) => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1={M.t} y2={H - M.b} stroke={palette.rule} />
          <text x={x(v)} y={H - M.b + 22} textAnchor="middle" fontSize="12" fill={palette.ink3} fontFamily={fonts.mono}>
            {v}
          </text>
        </g>
      ))}
      <text x={(M.l + W - M.r) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill={palette.ink3}>
        wrong answers, out of 120 runs
      </text>
      {rows.map((row, ri) => {
        const y = M.t + ri * rowH + 14;
        let acc = 0;
        return (
          <g key={row.key}>
            <text x={M.l - 18} y={y + 28} textAnchor="end" fontSize="14" fontWeight={600} fill={palette.ink}>
              {row.label}
            </text>
            {CAUSES.filter((c) => c[row.key] > 0).map((c, si) => {
              const start = acc;
              acc += c[row.key];
              const x0 = x(start);
              const x1 = x(acc);
              const d = ri * 300 + si * 120;
              return (
                <g key={c.key}>
                  <title>{`${c.label}: ${c[row.key]}`}</title>
                  <rect x={x0} y={y} width={x1 - x0} height={52} fill={FILL[c.key]} stroke={palette.panel} strokeWidth={2} style={draw(inView, d, 700)} />
                  <text x={(x0 + x1) / 2} y={y + 32} textAnchor="middle" fontSize="14" fontWeight={600} fontFamily={fonts.mono} fill={INK_ON[c.key]} style={fade(inView, d + 600, 400)}>
                    {c[row.key]}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
