import { Figure } from "../ui/Figure";
import { Section } from "../ui/Section";
import { Lollipop } from "../charts/Lollipop";

export function SafetySection() {
  return (
    <Section id="safety" num="05" title="Safety and scope">
      <p className="lede">
        Prompts that merely ask an agent not to touch observe-only components were violated in 25% (single agent) and 38% (multi-agent) of scope-case runs. Lear&rsquo;s check refuses the action in code, and it was never violated.
      </p>
      <Figure
        no="5.1"
        title="Observe-only components changed, share of scope-case runs"
        file="lear-scope-violations"
        caption="Scope cases mark a component observe-only. Removing Lear's code check brings the failure back to 19%: the protection is code, not the model."
      >
        <Lollipop />
      </Figure>
      <dl className="facts">
        <div>
          <dt>Prompt injection</dt>
          <dd>No arm followed a planted prompt injection. All designs resisted with this model.</dd>
        </div>
        <div>
          <dt>Citations</dt>
          <dd>Lear never reported a hallucinated citation.</dd>
        </div>
        <div>
          <dt>Where designs differ</dt>
          <dd>Prompts that merely ask the agent not to touch observe-only components were violated; Lear&rsquo;s check refuses the action in code.</dd>
        </div>
      </dl>
    </Section>
  );
}
