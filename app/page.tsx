import { BackToTop } from "@/components/BackToTop";
import { DataTable } from "@/components/DataTable";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { AccuracyChart } from "@/components/charts/AccuracyChart";
import { CostChart } from "@/components/charts/CostChart";
import { CostScatter } from "@/components/charts/CostScatter";
import { ITBenchChart } from "@/components/charts/ITBenchChart";
import { FreshIntervalPlot } from "@/components/charts/IntervalPlot";
import { OptimisationDumbbell, CauseChart } from "@/components/charts/OptimisationChart";
import { ScopeChart } from "@/components/charts/ScopeChart";
import { SpendChart } from "@/components/charts/SpendChart";
import { ARM_DEFINITIONS, ARMS, CHANGES, COMPETITORS, COST_ROWS, LIMITS, OPTIMISATION, OTHER_ANALYSES, SWOT } from "@/lib/data";
import { fmtInt, fmtUsd4 } from "@/lib/format";

/** Colours match the charts: Lear, single-agent, multi-agent, telemetry-only, ablations. */
const ARM_COLORS = ["#14b8a6", "#f59e0b", "#6366f1", "#a855f7", "#94a3b8"];

export default function Page() {
  return (
    <>
      <Hero />

      <main id="main">
        {/* 1. Executive summary ------------------------------------------- */}
        <section className="section" id="summary">
          <SectionHeader num="1" title="Executive summary" lede="Lear is the cheapest design tested, and in scope-case runs it changed an observe-only component 0% of the time. On accuracy it ties a capable single agent; its margin over the multi-agent design is not statistically significant." />
          <div className="grid-2 claims">
            <Reveal delay={0}>
              <article className="card card--accent">
                <p className="card__kicker">Cost</p>
                <h3>$0.0016 per incident</h3>
                <p>
                  Model spend, DeepSeek V4.1 Flash at list price: $1.6 per 1,000 incidents. On identical code, model, evidence and cases, a single-agent tool loop costs <strong>1.6x</strong> as much as Lear, and an investigators-plus-verifier design <strong>10.0x</strong>.
                </p>
              </article>
            </Reveal>
            <Reveal delay={80}>
              <article className="card card--accent">
                <p className="card__kicker">Accuracy</p>
                <h3>A tie with the single agent</h3>
                <p>
                  Like for like (v1.1): Lear 88% [79, 95], single agent 89% [82, 96], multi-agent 79% [70, 88]. Lear vs single-agent p = 0.80; vs multi-agent p = 0.06, not significant. On 24 fresh incidents written before any run, Lear scores 96% [88, 100] and the single agent 90% [77, 100], at 2.0x lower cost (p = 0.25).
                </p>
              </article>
            </Reveal>
            <Reveal delay={0}>
              <article className="card card--accent">
                <p className="card__kicker">Safety</p>
                <h3>0% observe-only changes</h3>
                <p>
                  On cases where a component is marked observe-only, Lear changed it in 0% of runs. The single agent did in 25% and the multi-agent design in 38%, although their prompts forbade it. Removing Lear's code check brought the failure back to 19%: the protection is code, not the model.
                </p>
              </article>
            </Reveal>
            <Reveal delay={80}>
              <article className="card card--accent">
                <p className="card__kicker">Third-party benchmark</p>
                <h3>ITBench-AA: 9 / 17 vs 8 / 16</h3>
                <p>
                  On 23 public scenarios, Lear solves 9 strict and 17 lenient; the single agent 8 and 16. A tie, at 2.0x lower cost.
                </p>
              </article>
            </Reveal>
          </div>
          <Reveal>
            <div className="callout callout--rose" style={{ marginTop: 22 }}>
              <span className="callout__icon" aria-hidden="true">!</span>
              <p>
                <strong>What this does not show.</strong> It does not show Lear is more accurate than a good single agent in a statistically firm way, and it does not compare Lear with any vendor's product. Competitors are represented by open implementations of their published designs.
              </p>
            </div>
          </Reveal>
        </section>

        {/* 2. What was compared ------------------------------------------- */}
        <section className="section" id="compared">
          <SectionHeader num="2" title="What was compared" lede="Four designs and two ablations. Every arm gets the same model, the same evidence rows, the same allowed actions and the same scorer." />
          <div className="arm-cards">
            {ARM_DEFINITIONS.map((arm, i) => (
              <Reveal key={arm.name} delay={i * 60}>
                <div className="arm-card">
                  <span className="arm-card__dot" style={{ background: ARM_COLORS[i] }} aria-hidden="true" />
                  <h3>{arm.name}</h3>
                  <p>{arm.what}</p>
                  <small>{arm.stands}</small>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="prose" style={{ marginTop: 22 }}>
              <p>
                All arms get the <strong>same model</strong> (DeepSeek V4.1 Flash, temperature 0.6), the <strong>same evidence rows</strong> (read through tools by the baselines), the same allowed actions and scope note, the same answer schema and one scorer. Baseline prompts are in <code>evals/bench/arms.py</code>. Cost is the provider's reported tokens at list price (<code>cloud/lear_cloud/model_catalog.py</code>): $0.30/M input, $0.006/M cached, $1.20/M output.
              </p>
            </div>
          </Reveal>
        </section>

        {/* 3. Accuracy ----------------------------------------------------- */}
        <section className="section" id="accuracy">
          <SectionHeader num="3" title="Accuracy" lede="Development set: 60 cases, each run twice. Whiskers are 95% intervals, so overlapping bars are not a difference." />
          <Reveal>
            <AccuracyChart />
          </Reveal>
          <Reveal>
            <DataTable
              caption="Accuracy and cost, development set (60 × 2). Lear (optimised) is the post-fix ceiling."
              headers={["Arm", "Correct (95% CI)", "Unsafe change", "Confident & wrong", "USD / incident", "USD / correct answer"]}
              numeric={[1, 2, 3, 4, 5]}
              rows={ARMS.map((a) => [
                a.label,
                `${a.accuracy}% [${a.ci[0]}, ${a.ci[1]}]`,
                `${a.unsafe}% [${a.unsafeCi[0]}, ${a.unsafeCi[1]}]`,
                `${a.confidentWrong}% [${a.confidentWrongCi[0]}, ${a.confidentWrongCi[1]}]`,
                fmtUsd4(a.usdPerIncident),
                fmtUsd4(a.usdPerCorrect),
              ])}
            />
          </Reveal>
          <Reveal>
            <div className="prose" style={{ marginTop: 18 }}>
              <p>
                Paired against Lear v1.1 on the same incidents (McNemar, exact): single-agent <strong>p = 0.803619</strong> (a tie), multi-agent p = 0.063915, telemetry-only p = 2e-06. <strong>Topology did not measurably help</strong> on these cases: Lear without topology scored 88% [80, 95]. The "whole-infrastructure" claim is not proven by this suite.
              </p>
            </div>
          </Reveal>

          <h3 className="sub-title">Accuracy against cost</h3>
          <p className="sub-lede">Up and to the left is better. The Kimi point is a different set and is covered in section 8.</p>
          <Reveal>
            <CostScatter />
          </Reveal>
        </section>

        {/* 4. Cost and tokens ---------------------------------------------- */}
        <section className="section" id="cost">
          <SectionHeader num="4" title="Cost and tokens" lede="Lear costs $0.0016 per incident after optimisation, and $0.0020 before. The baselines make 5 to 24 model calls per incident; Lear makes about one." />
          <Reveal>
            <CostChart />
          </Reveal>
          <Reveal>
            <DataTable
              caption="Tokens, calls and wall time per incident"
              headers={["Arm", "Input tokens", "Output tokens", "Model calls", "USD / incident (cached)", "USD (no cache)", "Wall time"]}
              numeric={[1, 2, 3, 4, 5, 6]}
              highlightRow={COST_ROWS.findIndex((r) => r.id === "optimised")}
              rows={COST_ROWS.map((r) => [
                r.label,
                fmtInt(r.inputTokens),
                fmtInt(r.outputTokens),
                r.modelCalls.toFixed(1),
                fmtUsd4(r.usdPerIncident),
                fmtUsd4(r.usdNoCache),
                `${r.wallSeconds} s`,
              ])}
            />
          </Reveal>
          <Reveal>
            <div className="callout" style={{ marginTop: 22 }}>
              <span className="callout__icon" aria-hidden="true">i</span>
              <p>
                <strong>Honest cost caveat.</strong> DeepSeek bills a repeated prompt prefix at 1/50 of the input price. Lear's prompt for a case is identical across repeats and ablations, so about 81% of its input was billed as cached. In production each incident's evidence is new, so the uncached cost is the safer planning number: $0.0024 per incident (Lear v1.1; $0.0020 optimised) against $0.0064 (single-agent) and $0.0344 (multi-agent). That is still 2.6x and 14.1x cheaper on identical code.
              </p>
            </div>
          </Reveal>

          <h3 className="sub-title">Monthly model spend</h3>
          <p className="sub-lede">Drag the slider to see what each design costs at your volume. The lines are straight on log axes because spend scales linearly with incidents.</p>
          <Reveal>
            <SpendChart />
          </Reveal>
          <Reveal>
            <div className="callout callout--teal" style={{ marginTop: 22 }}>
              <span className="callout__icon" aria-hidden="true">✓</span>
              <p>
                At 1,000 incidents a month, Lear's model spend is about $2, well under 0.1% of the $3,000-per-team subscription (CHANGELOG 4.0.0-rc5, plus $75 per service watched). Inference cost is not where Lear's margin is decided: the cost advantage matters for scalability and for the "no hidden token bill" message to buyers.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="prose" style={{ marginTop: 10 }}>
              <h3 style={{ marginBottom: 8 }}>Against public frontier-model figures (context only, not like-for-like)</h3>
              <p>
                The ITBench-AA leaderboard (Artificial Analysis, 2026-05-27) reports Claude Opus 4.7 at 47% for $5.38 per task in a 100-turn shell agent over the full raw snapshot (about 1 GB per scenario); GPT-5.5 46%. Our run is a different harness (23 public scenarios, alerts, events and object dumps only, no logs, metrics or traces) on a ~$0.30/M-token model: Lear spends $0.0049 per scenario. The ratio (~1,105x) mixes a different model, harness and data; quote it only with that sentence. We have not run frontier models ourselves.
              </p>
            </div>
          </Reveal>
        </section>

        {/* 5. Safety ------------------------------------------------------- */}
        <section className="section" id="safety">
          <SectionHeader num="5" title="Safety and scope" lede="Prompts that merely ask an agent not to touch observe-only components are not enough. Lear's check refuses the action in code, and in scope-case runs it was never violated." />
          <Reveal>
            <ScopeChart />
          </Reveal>
          <div className="grid-3" style={{ marginTop: 22 }}>
            <Reveal delay={0}>
              <article className="card">
                <p className="card__kicker">Prompt injection</p>
                <h3>No arm was hijacked</h3>
                <p>No arm followed a planted prompt injection. All designs resisted it with this model.</p>
              </article>
            </Reveal>
            <Reveal delay={80}>
              <article className="card">
                <p className="card__kicker">Citations</p>
                <h3>Nothing invented</h3>
                <p>Lear never reported a hallucinated citation. Its answers are cited and host-checked, and it abstains rather than guessing.</p>
              </article>
            </Reveal>
            <Reveal delay={160}>
              <article className="card">
                <p className="card__kicker">Scope</p>
                <h3>Where designs differ</h3>
                <p>Prompts that merely ask an agent not to touch observe-only components were violated in 25% (single-agent) and 38% (multi-agent) of scope-case runs.</p>
              </article>
            </Reveal>
          </div>
        </section>

        {/* 6. What changed ------------------------------------------------- */}
        <section className="section" id="changes">
          <SectionHeader num="6" title="What changed in Lear, and what it bought" lede="Accuracy rose and cost fell together. Most of the lost accuracy was wasted work: refused answers cost a second call, and under-acting answers cost a human." />
          <Reveal>
            <OptimisationDumbbell />
          </Reveal>
          <Reveal>
            <DataTable
              caption="Paired before/after, same incidents. Gate: no safety metric worse, no fewer correct answers, cost at most 1.10x."
              headers={["Set", "Before", "After", "Change (95% CI)", "Paired p", "Cost ratio"]}
              numeric={[1, 2]}
              rows={OPTIMISATION.map((o) => [o.set, `${o.before}/${o.beforeN}`, `${o.after}/${o.afterN}`, `${o.change} ${o.ci}`, o.p, o.costRatio])}
            />
          </Reveal>
          <div className="chart-grid" style={{ marginTop: 26 }}>
            <Reveal>
              <CauseChart />
            </Reveal>
          </div>

          <h3 className="sub-title">The fixes</h3>
          <p className="sub-lede">Each cause from the 17 wrong answers, and the change that addressed it.</p>
          <Reveal>
            <DataTable
              headers={["Cause", "Fix"]}
              rows={CHANGES.map((c) => [c.cause, c.fix])}
            />
          </Reveal>
        </section>

        {/* 7. ITBench ------------------------------------------------------- */}
        <section className="section" id="itbench">
          <SectionHeader num="7" title="Third-party benchmark: ITBench-AA" lede="Lear initially trailed the single agent on lenient scoring. It followed dependency paths to the victim service instead of the injected chaos fault. After the changes it ties or leads on both scales." />
          <Reveal>
            <ITBenchChart />
          </Reveal>
          <Reveal>
            <div className="prose" style={{ marginTop: 18 }}>
              <p>
                Before the changes Lear trailed the single agent on lenient scoring (11 vs 14 of 16). After: Lear 9/17 against the single agent's 8/16 (strict/lenient, 23 scenarios, 1 repeat; unseen subset 7/12 each). Lear uses 11x fewer input tokens.
              </p>
            </div>
          </Reveal>
        </section>

        {/* 8. Production model --------------------------------------------- */}
        <section className="section" id="production">
          <SectionHeader num="8" title="Production model: Kimi K3.1 Pro" lede="Kimi showed no measured accuracy gain over DeepSeek on these cases, and it costs 5.2x more per incident. Worth testing as an escalation tier, not as the default." />
          <Reveal>
            <FreshIntervalPlot />
          </Reveal>
          <Reveal>
            <div className="prose" style={{ marginTop: 18 }}>
              <p>
                On the 24 fresh cases (1 repeat, reasoning low) Lear on Kimi scored <strong>92% [79, 100]</strong> at $0.0089 per incident, 5.2x the DeepSeek cost, with no measured accuracy gain over DeepSeek (96% [88, 100]). Worth testing a DeepSeek-first, Kimi-on-escalation routing; one repeat is a hint, not a result.
              </p>
            </div>
          </Reveal>
        </section>

        {/* 9. SWOT ------------------------------------------------------------ */}
        <section className="section" id="swot">
          <SectionHeader num="9" title="SWOT and competitor designs" />
          <div className="swot">
            <Reveal delay={0}>
              <article className="swot__cell swot__cell--s">
                <h3>Strengths</h3>
                <p>{SWOT.strengths}</p>
              </article>
            </Reveal>
            <Reveal delay={80}>
              <article className="swot__cell swot__cell--w">
                <h3>Weaknesses</h3>
                <p>{SWOT.weaknesses}</p>
              </article>
            </Reveal>
            <Reveal delay={0}>
              <article className="swot__cell swot__cell--o">
                <h3>Opportunities</h3>
                <p>{SWOT.opportunities}</p>
              </article>
            </Reveal>
            <Reveal delay={80}>
              <article className="swot__cell swot__cell--t">
                <h3>Threats</h3>
                <p>{SWOT.threats}</p>
              </article>
            </Reveal>
          </div>

          <h3 className="sub-title">The three competitor designs</h3>
          <p className="sub-lede">Open implementations of published designs, not vendor products.</p>
          <div className="competitors">
            {COMPETITORS.map((c, i) => (
              <Reveal key={c.name} delay={i * 80}>
                <article className="competitor">
                  <div className="competitor__head">
                    <h3>{c.name}</h3>
                    <span className="pill">{c.tag}</span>
                  </div>
                  <dl>
                    <dt>Strength</dt>
                    <dd>{c.s}</dd>
                    <dt>Weakness</dt>
                    <dd>{c.w}</dd>
                    <dt>Opportunity</dt>
                    <dd>{c.o}</dd>
                    <dt>Threat</dt>
                    <dd>{c.t}</dd>
                  </dl>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 10. Other analyses ------------------------------------------------- */}
        <section className="section" id="other">
          <SectionHeader num="10" title="Other analyses" />
          <div className="grid-2 other-grid">
            {OTHER_ANALYSES.map((o, i) => (
              <Reveal key={o.title} delay={(i % 2) * 80}>
                <article className="card">
                  <h3>{o.title}</h3>
                  <p>{o.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 11. Limits ----------------------------------------------------------- */}
        <section className="section" id="limits">
          <SectionHeader num="11" title="Limits you must state with these numbers" />
          <Reveal>
            <ol className="limits">
              {LIMITS.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ol>
          </Reveal>
        </section>
      </main>

      <footer className="footer">
        <div className="page footer__inner">
          <div>
            <strong>Lear benchmark report</strong>
            <p style={{ margin: "6px 0 0" }}>Generated 2026-11-12 · Protocol v1.5</p>
            <p style={{ margin: "6px 0 0" }}>
              <a href="/report/lear-benchmark-report.pdf">Download the PDF</a>
            </p>
          </div>
          <ul>
            <li>Every number is recomputed from raw answers in <code>evals/results/bench/</code></li>
            <li>Generator: <code>docs/benchmarks/report/build.py</code></li>
            <li>Method and every amendment: <code>evals/bench/PROTOCOL.md</code></li>
            <li>Threats: <code>docs/benchmarks/VALIDITY.md</code> · Rerun: <code>docs/benchmarks/README.md</code></li>
          </ul>
        </div>
      </footer>

      <BackToTop />
    </>
  );
}
