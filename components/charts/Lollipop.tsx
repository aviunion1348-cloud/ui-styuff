"use client";

import { SCOPE } from "@/lib/data";
import { useInView } from "@/lib/useInView";
import { draw, fade } from "@/lib/motion";
import { linear } from "@/lib/scale";
import { fonts, palette } from "@/lib/theme";

const COLOR: Record<string, string> = {
  lear: palette.gold,
  single: palette.silver,
  multi: palette.silverMid,
  ablation: palette.graphite,
};

/** Share of observe-only scope cases where a component was changed. */
export function Lollipop() {
  const { ref, inView } = useInView<SVGSVGElement>(0.25);
  const W = 760;
  const rowH = 74;
  const M = { l: 214, r: 80, t: 14, b: 46 };
  const H = M.t + SCOPE.length * rowH + M.b;
  const x = linear([0, 50], [M.l, W - M.r]);

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Percentage of scope-case runs in which an observe-only component was changed: Lear 0%, single-agent 25%, multi-agent 38%, Lear with the code check removed 19%." fontFamily={fonts.sans}>
      {[0, 10, 20, 30, 40, 50].map((v) => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1={M.t} y2={H - M.b} stroke={palette.rule} />
          <text x={x(v)} y={H - M.b + 22} textAnchor="middle" fontSize="12" fill={palette.ink3} fontFamily={fonts.mono}>
            {v}%
          </text>
        </g>
      ))}
      <line x1={M.l} x2={W - M.r} y1={H - M.b} y2={H - M.b} stroke={palette.ruleStrong} />
      {SCOPE.map((r, i) => {
        const y = M.t + i * rowH + rowH / 2;
        const c = COLOR[r.id];
        const d = i * 130;
        return (
          <g key={r.id}>
            <title>{`${r.label}: ${r.pct}%`}</title>
            <text x={M.l - 22} y={y - 2} textAnchor="end" fontSize="14" fontWeight={600} fill={r.id === "lear" ? palette.gold : palette.ink}>
              {r.label}
            </text>
            <text x={M.l - 22} y={y + 16} textAnchor="end" fontSize="12" fill={palette.ink3}>
              {r.sub}
            </text>
            <line x1={M.l} x2={x(r.pct)} y1={y} y2={y} stroke={c} strokeWidth={2} style={draw(inView, d + 100, 800)} />
            <g style={fade(inView, d + 500)}>
              <circle cx={x(r.pct)} cy={y} r={8} fill={c} />
              <text x={x(r.pct) + 18} y={y + 6} fontSize="18" fontWeight={600} fontFamily={fonts.mono} fill={palette.ink}>
                {r.pct}%
              </text>
            </g>
          </g>
        );
      })}
      <line x1={M.l} x2={M.l} y1={M.t} y2={H - M.b} stroke={palette.ruleStrong} />
    </svg>
  );
}
