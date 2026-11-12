import { CHANGES, OPTIMISATION } from "@/lib/data";
import { armColor } from "@/lib/theme";
import { CauseStack } from "../charts/CauseStack";
import { Dumbbell } from "../charts/Dumbbell";
import { Figure } from "../ui/Figure";
import { Ledger } from "../ui/Ledger";
import { Section } from "../ui/Section";

export function ChangesSection() {
  const pct = (n: number, d: number) => (n / d) * 100;
  return (
    <Section id="changes" num="06" title="What changed in Lear, and what it bought">
      <p className="lede">
        Accuracy rose and cost fell together. Most of the lost accuracy was wasted work: refused answers cost a second call, and under-acting answers cost a human.
      </p>

      <Figure
        no="6.1"
        title="Correct answers before and after the changes, paired on the same incidents"
        file="lear-before-after"
        caption="The gate for keeping any change: no safety metric worse, no fewer correct answers, cost at most 1.10×."
      >
        <Dumbbell
          rows={OPTIMISATION.map((o) => ({
            id: o.set.toLowerCase(),
            label: o.set,
            sub: o.n,
            from: pct(o.before, o.beforeN),
            to: pct(o.after, o.afterN),
            toColor: armColor.optimised,
            right: `${Math.round(pct(o.before, o.beforeN))}% → ${Math.round(pct(o.after, o.afterN))}%`,
            highlight: true,
          }))}
          domain={[80, 100]}
          ticks={[80, 85, 90, 95, 100]}
          format="pct"
          fromLabel="BEFORE"
          toLabel="AFTER"
          label="Dumbbell chart. Development accuracy rose from 88% to 98%. Fresh accuracy rose from 90% to 96%."
        />
      </Figure>

      <Ledger
        caption="Paired before and after"
        head={["Set", "Runs", "Before", "After", "Change (95% CI)", "Paired p", "Cost ratio"]}
        numeric={[2, 3]}
        rows={OPTIMISATION.map((o) => [o.set, o.n, `${o.before}/${o.beforeN}`, `${o.after}/${o.afterN}`, `${o.change} ${o.ci}`, o.p, o.costRatio])}
      />

      <Figure
        no="6.2"
        title="Why Lear's answers were wrong, development set"
        file="lear-wrong-answer-causes"
        caption={
          <>
            <strong>Data note.</strong> The segments total 15 wrong answers before the changes; the report&rsquo;s chart label and text say 17. The segments are shown as published, and the two unaccounted answers are not broken down in the report.
          </>
        }
      >
        <CauseStack />
      </Figure>

      <Ledger
        caption="Each cause, and the change that addressed it"
        head={["Cause", "Fix"]}
        rows={CHANGES.map((c) => [c.cause, c.fix])}
      />
    </Section>
  );
}
