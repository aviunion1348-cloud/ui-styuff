"use client";

import { ARMS } from "@/lib/data";
import { useInView } from "@/lib/useInView";
import { ChartFrame } from "../ChartFrame";

const W = 640;
const H = 400;
const M = { l: 58, r: 16, t: 30, b: 84 };
const iw = W - M.l - M.r;
const ih = H - M.t - M.b;
const slot = iw / ARMS.length;
const BAR = 68;
const yPos = (pct: number) => M.t + ih * (1 - pct / 100);
const LABELS: string[][] = [["Lear", "v1.1"], ["Single-", "agent"], ["Multi-", "agent"], ["Telemetry-", "only"], ["Lear", "optimised"]];
const FONT = "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

export function AccuracyChart() {
  const { ref, inView } = useInView<SVGSVGElement>(0.25);
  return (
    <ChartFrame
      title="Accuracy with 95% intervals"
      filename="lear-accuracy"
      caption={
        <>
          Development set, 60 cases × 2 repeats. Whiskers are 95% intervals. The optimised bar is a ceiling: its failures were read to make the fixes, and the baselines were not re-run with the new answer schema.
        </>
      }
    >
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Bar chart of accuracy for five designs with 95% intervals. Lear v1.1 88%, single-agent 89%, multi-agent 79%, telemetry-only 62%, Lear optimised 98%." fontFamily={FONT}>
        <defs>
          <linearGradient id="acc-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 20, 40, 60, 80, 100].map((v) => (
          <g key={v}>
            <line x1={M.l} x2={W - M.r} y1={yPos(v)} y2={yPos(v)} stroke={v === 0 ? "#94a3b8" : "#e6ebf3"} strokeWidth={1} />
            <text x={M.l - 10} y={yPos(v) + 4} textAnchor="end" fontSize="12" fill="#64748b">
              {v}%
            </text>
          </g>
        ))}
        <text transform={`translate(16 ${M.t + ih / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="#64748b">
          correct answers
        </text>
        {ARMS.map((arm, i) => {
          const cx = M.l + slot * i + slot / 2;
          const delay = i * 130;
          const top = yPos(arm.accuracy);
          return (
            <g key={arm.id}>
              <title>{`${arm.label}: ${arm.accuracy}% (95% CI ${arm.ci[0]}–${arm.ci[1]}%)`}</title>
              <rect
                x={cx - BAR / 2}
                y={top}
                width={BAR}
                height={M.t + ih - top}
                rx={10}
                fill={arm.color}
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "bottom",
                  transform: inView ? "scaleY(1)" : "scaleY(0)",
                  transition: `transform 1100ms cubic-bezier(.2,.8,.2,1) ${delay}ms`,
                }}
              />
              <g
                style={{
                  opacity: inView ? 1 : 0,
                  transition: `opacity 500ms ease ${delay + 900}ms`,
                }}
              >
                <line x1={cx} x2={cx} y1={yPos(arm.ci[0])} y2={yPos(arm.ci[1])} stroke="#0b1220" strokeWidth={1.6} />
                <line x1={cx - 9} x2={cx + 9} y1={yPos(arm.ci[0])} y2={yPos(arm.ci[0])} stroke="#0b1220" strokeWidth={1.6} />
                <line x1={cx - 9} x2={cx + 9} y1={yPos(arm.ci[1])} y2={yPos(arm.ci[1])} stroke="#0b1220" strokeWidth={1.6} />
                <text x={cx} y={yPos(arm.ci[1]) - 12} textAnchor="middle" fontSize="15" fontWeight={700} fill="#0b1220">
                  {arm.accuracy}%
                </text>
              </g>
              {LABELS[i].map((line, li) => (
                <text key={li} x={cx} y={M.t + ih + 22 + li * 16} textAnchor="middle" fontSize="13" fontWeight={600} fill="#1e293b">
                  {line}
                </text>
              ))}
              {arm.id === "optimised" ? (
                <text x={cx} y={M.t + ih + 22 + 2 * 16 + 2} textAnchor="middle" fontSize="11" fontStyle="italic" fill="#0f766e">
                  ceiling
                </text>
              ) : null}
            </g>
          );
        })}
        <line x1={M.l} x2={W - M.r} y1={M.t + ih} y2={M.t + ih} stroke="#94a3b8" strokeWidth={1.2} />
      </svg>
    </ChartFrame>
  );
}
