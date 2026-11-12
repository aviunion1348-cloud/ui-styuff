import { LIMITS } from "@/lib/data";
import { Section } from "../ui/Section";

export function LimitsSection() {
  return (
    <Section id="limits" num="11" title="Limits you must state with these numbers">
      <ol className="limits">
        {LIMITS.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ol>
    </Section>
  );
}
