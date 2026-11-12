import { ITBench } from "../charts/ITBench";
import { Figure } from "../ui/Figure";
import { Section } from "../ui/Section";

export function ITBenchSection() {
  return (
    <Section id="itbench" num="07" title="Third-party benchmark: ITBench-AA">
      <p className="lede">
        Lear initially trailed the single agent on lenient scoring. It followed dependency paths to the victim service instead of the injected chaos fault. After the changes it ties or leads on both scales.
      </p>
      <Figure
        no="7.1"
        title="Scenarios solved and cost per scenario"
        file="lear-itbench-aa"
        caption="23 public scenarios, 1 repeat. The single-agent cost bar is read from the report's chart; the report states the ratio as 2.0×. Lear uses 11× fewer input tokens."
      >
        <ITBench />
      </Figure>
      <div className="prose">
        <p>
          Before the changes Lear trailed the single agent on lenient scoring, 11 vs 14 of 16. After: Lear 9/17 against the single agent&rsquo;s 8/16 (strict/lenient, 23 scenarios, 1 repeat; unseen subset 7/12 each).
        </p>
      </div>
    </Section>
  );
}
