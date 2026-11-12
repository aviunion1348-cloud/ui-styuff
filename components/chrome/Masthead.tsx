import { ARMS } from "@/lib/data";

/** Title block and the four figures that carry the report. */
export function Masthead() {
  const optimised = ARMS.find((a) => a.id === "optimised");
  return (
    <header id="top" className="mast">
      <p className="mast__kicker">Benchmark report · 12 November 2026 · Protocol v1.5</p>
      <h1 className="mast__title">
        <span className="mast__hl">Lear</span> diagnosis engine:
        <br />
        accuracy, cost and competitive position
      </h1>
      <p className="mast__deck">
        Every number below is recomputed from the raw answers committed in <code>evals/results/bench/</code>. Generator:{" "}
        <code>docs/benchmarks/report/build.py</code>. Method: <code>evals/bench/PROTOCOL.md</code>.
      </p>
      <dl className="mast__figures">
        <div>
          <dt>Model spend per incident, optimised Lear</dt>
          <dd>${optimised?.usdPerIncident.toFixed(4)}</dd>
          <dd className="mast__sub">$1.6 per 1,000 incidents. DeepSeek V4.1 Flash at list price.</dd>
        </div>
        <div>
          <dt>Cost against the baselines, identical code</dt>
          <dd>1.6×</dd>
          <dd className="mast__sub">Single-agent design. Multi-agent is 10.0×. Identical code, development set.</dd>
        </div>
        <div>
          <dt>Observe-only changes by Lear, scope cases</dt>
          <dd>0%</dd>
          <dd className="mast__sub">Single-agent 25%, multi-agent 38%, with prompts that forbade it.</dd>
        </div>
        <div>
          <dt>ITBench-AA, strict / lenient, of 23</dt>
          <dd>9 / 17</dd>
          <dd className="mast__sub">Single-agent 8 / 16. A tie, at 2.0× lower cost.</dd>
        </div>
      </dl>
    </header>
  );
}
