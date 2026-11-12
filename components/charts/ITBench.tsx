"use client";

import { ITBENCH } from "@/lib/data";
import { useInView } from "@/lib/useInView";
import { draw, fade } from "@/lib/motion";
import { linear } from "@/lib/scale";
import { armColor, fonts, palette } from "@/lib/theme";

/** Scenarios solved (of 23) as paired dots, and cost per scenario as bars. */
export function ITBench() {
  const { ref, inView } = useInView<SVGSVGElement>(0.25);
  const W = 760;
  const H = 330;
  const M = { l: 150, r: 110, t: 14 };
  const x = linear([0, 23], [M.l, W - M.r]);
  const cx = linear([0, 0.011], [M.l, W - 200]);
  const rows = [
    { label: "Strict", lear: ITBENCH.strict.lear, single: ITBENCH.strict.single },
    { label: "Lenient", lear: ITBENCH.lenient.lear, single: ITBENCH.lenient.single },
  ];

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="ITBench-AA, 23 scenarios. Strict: Lear 9, single-agent 8. Lenient: Lear 17, single-agent 16. Cost per scenario: Lear $0.0049, single-agent about $0.0096." fontFamily={fonts.sans}>
      <text x={M.l} y={M.t + 4} fontSize="11" fill={palette.ink3} fontFamily={fonts.mono} letterSpacing="0.08em">
        SCENARIOS SOLVED, OF 23
      </text>
      {[0, 5, 10, 15, 20, 23].map((v) => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1={M.t + 18} y2={M.t + 170} stroke={palette.rule} />
          <text x={x(v)} y={M.t + 186} textAnchor="middle" fontSize="12" fill={palette.ink3} fontFamily={fonts.mono}>
            {v}
          </text>
        </g>
      ))}
      {rows.map((r, i) => {
        const y = M.t + 50 + i * 70;
        return (
          <g key={r.label}>
            <text x={M.l - 22} y={y + 5} textAnchor="end" fontSize="14" fontWeight={600} fill={palette.ink}>
              {r.label}
            </text>
            <line x1={x(r.single)} x2={x(r.lear)} y1={y} y2={y} stroke={palette.ruleStrong} strokeWidth={3} style={draw(inView, i * 200, 700)} />
            <g style={fade(inView, i * 200 + 400)}>
              <circle cx={x(r.single)} cy={y} r={7} fill={armColor.single} />
              <circle cx={x(r.lear)} cy={y} r={7} fill={armColor.lear} />
              <text x={x(r.lear)} y={y - 14} textAnchor="middle" fontSize="13" fontFamily={fonts.mono} fill={palette.gold}>
                {r.lear}
              </text>
              <text x={x(r.single)} y={y + 24} textAnchor="middle" fontSize="13" fontFamily={fonts.mono} fill={palette.ink2}>
                {r.single}
              </text>
            </g>
          </g>
        );
      })}

      <text x={M.l} y={M.t + 222} fontSize="11" fill={palette.ink3} fontFamily={fonts.mono} letterSpacing="0.08em">
        COST PER SCENARIO, USD
      </text>
      {[
        { label: "Lear", v: ITBENCH.costPerScenario.lear, c: "url(#grad-lear)", text: "$0.0049", y: M.t + 240 },
        { label: "Single-agent", v: ITBENCH.costPerScenario.single, c: armColor.single, text: "≈ $0.0096", y: M.t + 282 },
      ].map((r) => (
        <g key={r.label}>
          <text x={M.l - 22} y={r.y + 14} textAnchor="end" fontSize="14" fontWeight={600} fill={palette.ink}>
            {r.label}
          </text>
          <rect x={M.l} y={r.y} width={cx(r.v) - M.l} height={24} fill={r.c} style={draw(inView, 500, 900)} />
          <text x={cx(r.v) + 12} y={r.y + 17} fontSize="13" fontFamily={fonts.mono} fill={palette.ink2} style={fade(inView, 1200)}>
            {r.text}
          </text>
        </g>
      ))}
    </svg>
  );
}
