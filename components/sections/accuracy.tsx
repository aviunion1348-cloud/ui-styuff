import { ARMS } from "@/lib/data";
import { fmtUsd4 } from "@/lib/format";
import { armColor } from "@/lib/theme";
import { Forest } from "../charts/Forest";
import { Scatter } from "../charts/Scatter";
import { Figure } from "../ui/Figure";
import { Ledger } from "../ui/Ledger";
import { Section } from "../ui/Section";

export function AccuracySection() {
  const forestRows = ARMS.map((a) => ({
    id: a.id,
    label: a.label,
    sub: a.id === "optimised" ? "development set · ceiling" : a.id === "lear" ? "development set · 60 × 2" : undefined,
    value: a.accuracy,
    lo: a.ci[0],
    hi: a.ci[1],
    color: armColor[a.id],
    text: `${a.accuracy}%`,
  }));
  return (
    <Section id="accuracy" num="03" title="Accuracy">
      <p className="lede">Development set, 60 cases, each run twice. Lines are 95% intervals.</p>

      <Figure
        no="3.1"
        title="Correct answers, with 95% intervals"
        file="lear-accuracy-intervals"
        caption="The optimised row is a ceiling: its failures were read to make the fixes, and the baselines were not re-run with the new answer schema."
      >
        <Forest rows={forestRows} domain={[40, 100]} ticks={[40, 50, 60, 70, 80, 90, 100]} label="Forest plot of correct answers with 95% intervals. Lear v1.1 88%, single-agent 89%, multi-agent 79%, telemetry-only 62%, Lear optimised 98%." />
      </Figure>

      <Ledger
        caption="Accuracy and cost, development set"
        head={["Arm", "Correct (95% CI)", "Unsafe change", "Confident & wrong", "USD / incident", "USD / correct"]}
        numeric={[1, 2, 3, 4, 5]}
        highlight={[4]}
        rows={ARMS.map((a) => [
          a.label,
          `${a.accuracy}% [${a.ci[0]}, ${a.ci[1]}]`,
          `${a.unsafe}% [${a.unsafeCi[0]}, ${a.unsafeCi[1]}]`,
          `${a.confidentWrong}% [${a.confidentWrongCi[0]}, ${a.confidentWrongCi[1]}]`,
          fmtUsd4(a.usdPerIncident),
          fmtUsd4(a.usdPerCorrect),
        ])}
      />

      <div className="prose">
        <p>
          Paired against Lear v1.1 on the same incidents (McNemar, exact): single agent <strong>p = 0.803619</strong>, a tie; multi-agent p = 0.063915; telemetry-only p = 2e-06.
        </p>
        <p>
          <strong>Topology did not measurably help</strong> on these cases: Lear without topology scored 88% [80, 95]. The &ldquo;whole-infrastructure&rdquo; claim is not proven by this suite.
        </p>
      </div>

      <Figure
        no="3.2"
        title="Accuracy against cost"
        file="lear-accuracy-vs-cost"
        caption="Log-scale cost axis. Up and to the left is better. The Kimi point is on the 24-case fresh set with one repeat, so it is not directly comparable with the development points."
      >
        <Scatter />
      </Figure>
    </Section>
  );
}
