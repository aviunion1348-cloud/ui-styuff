"use client";

import { ITBENCH } from "@/lib/data";
import { useInView } from "@/lib/useInView";
import { ChartFrame } from "../ChartFrame";

const W = 640;
const H = 340;
const FONT = "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
const LEAR = "#14b8a6";
const SINGLE = "#f59e0b";

/* Left panel: scenarios solved (counts out of 23). */
const A = { x: 52, w: 262, top: 56, bottom: 280 };
const aY = (v: number) => A.bottom - ((A.bottom - A.top) * v) / 25;
const groups = [
  { label: "strict", lear: ITBENCH.strict.lear, single: ITBENCH.strict.single },
  { label: "lenient", lear: ITBENCH.lenient.lear, single: ITBENCH.lenient.single },
];

/* Right panel: cost per scenario (USD), horizontal. */
const B = { x: 380, w: 220 };
const bX = (v: number) => B.x + (B.w * v) / 0.011;

export function ITBenchChart() {
  const { ref, inView } = useInView<SVGSVGElement>(0.25);
  return (
    <ChartFrame
      title="ITBench-AA: solved scenarios and cost"
      filename="lear-itbench-aa"
      caption={
        <>
          23 public scenarios, 1 repeat, a different harness from the frontier leaderboard (alerts, events and object dumps only). Before the changes Lear trailed on lenient scoring, 11 vs 14 of 16. The single-agent cost bar is read from the report's chart; the report states the ratio as 2.0x.
        </>
      }
    >
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Left: scenarios solved on ITBench-AA. Strict: Lear 9, single-agent 8 of 23. Lenient: Lear 17, single-agent 16 of 23. Right: cost per scenario, Lear $0.0049, single-agent about $0.0096." fontFamily={FONT}>
        <text x={A.x} y={24} fontSize="14" fontWeight={700} fill="#0b1220">Scenarios solved (of 23)</text>
        <g>
          <rect x={A.x + 8} y={34} width={12} height={12} rx={3} fill={LEAR} />
          <text x={A.x + 26} y={44} fontSize="12" fill="#334155">Lear</text>
          <rect x={A.x + 70} y={34} width={12} height={12} rx={3} fill={SINGLE} />
          <text x={A.x + 88} y={44} fontSize="12" fill="#334155">Single-agent</text>
        </g>
        {[0, 5, 10, 15, 20, 25].map((v) => (
          <g key={v}>
            <line x1={A.x} x2={A.x + A.w} y1={aY(v)} y2={aY(v)} stroke={v === 0 ? "#94a3b8" : "#e6ebf3"} />
            <text x={A.x - 8} y={aY(v) + 4} textAnchor="end" fontSize="11" fill="#64748b">{v}</text>
          </g>
        ))}
        {groups.map((g, gi) => {
          const gc = A.x + A.w * (gi === 0 ? 0.25 : 0.75);
          const items = [
            { v: g.lear, x: gc - 52, color: LEAR, name: "Lear" },
            { v: g.single, x: gc + 4, color: SINGLE, name: "Single" },
          ];
          return (
            <g key={g.label}>
              {items.map((it, ii) => {
                const delay = gi * 200 + ii * 150;
                return (
                  <g key={it.name}>
                    <title>{`${g.label}, ${it.name}: ${it.v} of 23`}</title>
                    <rect x={it.x} y={aY(it.v)} width={48} height={A.bottom - aY(it.v)} rx={7} fill={it.color} style={{
                      transformBox: "fill-box",
                      transformOrigin: "bottom",
                      transform: inView ? "scaleY(1)" : "scaleY(0)",
                      transition: `transform 1000ms cubic-bezier(.2,.8,.2,1) ${delay}ms`,
                    }} />
                    <text x={it.x + 24} y={aY(it.v) - 8} textAnchor="middle" fontSize="15" fontWeight={800} fill="#0b1220" style={{ opacity: inView ? 1 : 0, transition: `opacity 400ms ease ${delay + 800}ms` }}>
                      {it.v}
                    </text>
                  </g>
                );
              })}
              <text x={gc} y={A.bottom + 22} textAnchor="middle" fontSize="13" fontWeight={600} fill="#1e293b">{g.label}</text>
            </g>
          );
        })}
        <line x1={A.x} x2={A.x + A.w} y1={A.bottom} y2={A.bottom} stroke="#94a3b8" />

        <text x={B.x} y={24} fontSize="14" fontWeight={700} fill="#0b1220">Cost per scenario (USD)</text>
        {[0, 0.005, 0.01].map((v) => (
          <g key={v}>
            <line x1={bX(v)} x2={bX(v)} y1={56} y2={A.bottom} stroke={v === 0 ? "#94a3b8" : "#e6ebf3"} />
            <text x={bX(v)} y={A.bottom + 22} textAnchor="middle" fontSize="11" fill="#64748b">${v.toFixed(3)}</text>
          </g>
        ))}
        {[
          { name: "Lear", v: ITBENCH.costPerScenario.lear, color: LEAR, y: 96, label: "$0.0049" },
          { name: "Single-agent", v: ITBENCH.costPerScenario.single, color: SINGLE, y: 180, label: "≈$0.0096" },
        ].map((r, i) => (
          <g key={r.name}>
            <text x={B.x} y={r.y - 12} fontSize="13" fontWeight={600} fill="#1e293b">{r.name}</text>
            <rect x={B.x} y={r.y} width={bX(r.v) - B.x} height={40} rx={8} fill={r.color} style={{
              transformBox: "fill-box",
              transformOrigin: "left",
              transform: inView ? "scaleX(1)" : "scaleX(0)",
              transition: `transform 1100ms cubic-bezier(.2,.8,.2,1) ${i * 180 + 200}ms`,
            }} />
            <text x={bX(r.v) - 10} y={r.y + 26} textAnchor="end" fontSize="14" fontWeight={800} fill="#ffffff" style={{ opacity: inView ? 1 : 0, transition: `opacity 400ms ease ${i * 180 + 1000}ms` }}>
              {r.label}
            </text>
          </g>
        ))}
        <text x={B.x} y={262} fontSize="12" fill="#475569">Lear uses 11x fewer input tokens.</text>
        <line x1={B.x} x2={B.x} y1={56} y2={A.bottom} stroke="#94a3b8" />
      </svg>
    </ChartFrame>
  );
}
