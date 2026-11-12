import { COMPETITORS, SWOT } from "@/lib/data";
import { Section } from "../ui/Section";

export function LandscapeSection() {
  return (
    <Section id="swot" num="09" title="SWOT and competitor designs">
      <h3 className="sub sub--first">Lear (this engine)</h3>
      <dl className="swot">
        <div>
          <dt>Strengths</dt>
          <dd>{SWOT.strengths}</dd>
        </div>
        <div>
          <dt>Weaknesses</dt>
          <dd>{SWOT.weaknesses}</dd>
        </div>
        <div>
          <dt>Opportunities</dt>
          <dd>{SWOT.opportunities}</dd>
        </div>
        <div>
          <dt>Threats</dt>
          <dd>{SWOT.threats}</dd>
        </div>
      </dl>

      <h3 className="sub">Competitor designs</h3>
      <p className="prose-line">Open implementations of published designs, not vendor products.</p>
      <div className="designs">
        {COMPETITORS.map((c) => (
          <article key={c.name} className="design">
            <header>
              <h4>{c.name}</h4>
              <span>{c.tag}</span>
            </header>
            <dl>
              <dt>Strength</dt>
              <dd>{c.strength}</dd>
              <dt>Weakness</dt>
              <dd>{c.weakness}</dd>
              <dt>Opportunity</dt>
              <dd>{c.opportunity}</dd>
              <dt>Threat</dt>
              <dd>{c.threat}</dd>
            </dl>
          </article>
        ))}
      </div>
    </Section>
  );
}
