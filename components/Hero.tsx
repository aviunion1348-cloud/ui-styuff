import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";

const STATS = [
  { to: 98, suffix: "%", decimals: 0, label: "correct after optimisation", sub: "development set · 95% CI 96–100" },
  { to: 0.0016, prefix: "$", decimals: 4, label: "model spend per incident", sub: "= $1.60 per 1,000 incidents" },
  { to: 0, suffix: "%", decimals: 0, label: "observe-only changes by Lear", sub: "single-agent 25% · multi-agent 38%" },
  { to: 4.5, suffix: "x", decimals: 1, label: "fewer tokens than single-agent", sub: "same code (v1.1) · 23x vs multi-agent" },
];

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__inner">
        <Reveal>
          <p className="hero__kicker">Benchmark report · 12 Nov 2026 · Protocol v1.5</p>
          <h1>
            Lear diagnosis engine: <span className="grad">accuracy, cost and competitive position</span>
          </h1>
          <p className="hero__sub">
            Lear is cheaper than every design it was tested against, and in scope-case runs it changed an observe-only component 0% of the time. Accuracy ties a capable single agent. This page shows the evidence, with every number traced to the raw answers.
          </p>
          <div className="hero__cta">
            <a className="btn btn-primary" href="#summary">Read the findings</a>
            <a className="btn btn-ghost-light" href="/report/lear-benchmark-report.pdf" download>
              Download PDF
            </a>
          </div>
        </Reveal>

        <div className="stats">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={120 + i * 90} className="stat">
              <div className="stat__value">
                <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="stat__label">{s.label}</div>
              <div className="stat__sub">{s.sub}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
