import { ARM_DEFINITIONS } from "@/lib/data";
import { Ledger } from "../ui/Ledger";
import { Section } from "../ui/Section";

export function ComparedSection() {
  return (
    <Section id="compared" num="02" title="What was compared">
      <p className="lede">Five arms, one playing field: the same model, the same evidence, the same allowed actions, the same answer format, and one scorer.</p>
      <Ledger
        head={["Arm", "What it is", "Stands for"]}
        rows={ARM_DEFINITIONS.map((a) => [<strong key="n">{a.name}</strong>, a.what, a.stands])}
      />
      <div className="prose">
        <p>
          Every arm gets the <strong>same model</strong> (DeepSeek V4.1 Flash, temperature 0.6), the <strong>same evidence rows</strong> (read through tools by the baselines), the same allowed actions and scope note, the same answer schema and one scorer. Baseline prompts are in <code>evals/bench/arms.py</code>.
        </p>
        <p>
          Cost is the provider&rsquo;s reported tokens at list price (<code>cloud/lear_cloud/model_catalog.py</code>): $0.30/M input, $0.006/M cached, $1.20/M output.
        </p>
      </div>
    </Section>
  );
}
