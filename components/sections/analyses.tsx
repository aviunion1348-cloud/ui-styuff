import { OTHER_ANALYSES } from "@/lib/data";
import { Section } from "../ui/Section";

export function AnalysesSection() {
  return (
    <Section id="analyses" num="10" title="Other analyses">
      <dl className="facts">
        {OTHER_ANALYSES.map((a) => (
          <div key={a.title}>
            <dt>{a.title}</dt>
            <dd>{a.body}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
