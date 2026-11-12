import { FRESH } from "@/lib/data";
import { armColor, palette } from "@/lib/theme";
import { Forest } from "../charts/Forest";
import { Figure } from "../ui/Figure";
import { Section } from "../ui/Section";

export function ProductionSection() {
  const colors = [armColor.lear, armColor.single, palette.ink];
  return (
    <Section id="production" num="08" title="Production model: Kimi K3.1 Pro">
      <p className="lede">Lear on Kimi was measured on the 24 fresh cases with one repeat and reasoning set to low.</p>
      <Figure
        no="8.1"
        title="Fresh set, correct answers with 95% intervals"
        file="lear-fresh-set"
        caption="One repeat is a hint, not a result. The intervals overlap heavily."
      >
        <Forest
          rows={FRESH.map((f, i) => ({
            id: f.id,
            label: f.label,
            sub: f.sub,
            value: f.value,
            lo: f.ci[0],
            hi: f.ci[1],
            color: colors[i],
            text: `${f.value}%`,
          }))}
          domain={[60, 100]}
          ticks={[60, 70, 80, 90, 100]}
          label="Fresh-set forest plot. Lear on DeepSeek 96% [88, 100]. Single-agent on DeepSeek 90% [77, 100]. Lear on Kimi K3.1 92% [79, 100]."
        />
      </Figure>
      <div className="prose">
        <p>
          On the 24 fresh cases (1 repeat, reasoning low) Lear on Kimi scored <strong>92% [79, 100]</strong> at $0.0089 per incident, 5.2× the DeepSeek cost, with no measured accuracy gain over DeepSeek (96% [88, 100]).
        </p>
        <p>Worth testing a DeepSeek-first, Kimi-on-escalation routing; one repeat is a hint, not a result.</p>
      </div>
    </Section>
  );
}
