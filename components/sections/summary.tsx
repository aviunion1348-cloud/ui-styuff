import { Note } from "../ui/Note";
import { Section } from "../ui/Section";

export function SummarySection() {
  return (
    <Section id="summary" num="01" title="Executive summary">
      <p className="lede">
        Lear is the cheapest design tested. On identical code it ties a capable single agent on accuracy, and it changed observe-only components in 0% of scope-case runs.
      </p>
      <dl className="claims">
        <div>
          <dt>Cost</dt>
          <dd>
            <p>
              Lear&rsquo;s incident diagnosis costs <strong>$0.0016 per incident</strong> in model spend (DeepSeek V4.1 Flash at list price), i.e. <strong>$1.6 per 1,000 incidents</strong>. On identical code, model, evidence and cases, a single-agent tool loop costs <strong>1.6×</strong> as much as Lear (development set, v1.1 vs v1.1; 2.0× on the fresh set against the optimised Lear) and an investigators-plus-verifier design <strong>10.0×</strong>.
            </p>
            <p>
              In tokens, Lear uses 4.5× fewer than the single agent and 23× fewer than the multi-agent design. Lear alone is 3.1k tokens per incident after optimisation.
            </p>
          </dd>
        </div>
        <div>
          <dt>Accuracy</dt>
          <dd>
            <p>
              Like for like (same code, v1.1): Lear <strong>88% [79, 95]</strong>, single agent <strong>89% [82, 96]</strong>, multi-agent <strong>79% [70, 88]</strong>. That is a tie with the single agent (p = 0.80) and nominally ahead of the multi-agent design (p = 0.06, not significant).
            </p>
            <p>
              After optimisation Lear scores <strong>98% [96, 100]</strong> on the development set, but that is a ceiling: its failures were read to make the fixes, and the baselines were not re-run with the new answer schema. The cross-design test is the 24 fresh incidents written after the fixes and before any run, where Lear scores <strong>96% [88, 100]</strong> and the single agent <strong>90% [77, 100]</strong>, at 2.0× lower cost. The fresh-set gap is not statistically significant (p = 0.25).
            </p>
          </dd>
        </div>
        <div>
          <dt>Safety</dt>
          <dd>
            <p>
              On cases where a component is marked observe-only, Lear changed it in <strong>0%</strong> of runs. The single agent did in 25% and the multi-agent design in 38%, although their prompts forbade it. Removing Lear&rsquo;s code check brought the failure back (19%): the protection is code, not the model.
            </p>
          </dd>
        </div>
        <div>
          <dt>Third-party benchmark</dt>
          <dd>
            <p>
              ITBench-AA, 23 public scenarios. Lear solves <strong>9 strict / 17 lenient</strong>, the single agent 8 / 16: a tie, at 2.0× lower cost.
            </p>
          </dd>
        </div>
      </dl>
      <Note label="What this does not show">
        <p>
          It does not show Lear is more accurate than a good single agent in a statistically firm way, and it does not compare Lear with any vendor&rsquo;s product. Competitors are represented by open implementations of their published designs.
        </p>
      </Note>
      <Note label="Ratios across code versions">
        <p>
          Ratios that divide the optimised Lear into the v1.1 baselines, 2.1× and 12.6×, mix two code versions and are shown only as a trend.
        </p>
      </Note>
    </Section>
  );
}
