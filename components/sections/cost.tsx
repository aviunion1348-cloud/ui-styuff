import { COST_ROWS, type ArmId } from "@/lib/data";
import { fmtInt, fmtUsd4 } from "@/lib/format";
import { armColor } from "@/lib/theme";
import { Dumbbell } from "../charts/Dumbbell";
import { Spend } from "../charts/Spend";
import { Figure } from "../ui/Figure";
import { Ledger } from "../ui/Ledger";
import { Note } from "../ui/Note";
import { Section } from "../ui/Section";

export function CostSection() {
  const rows = COST_ROWS.map((r) => ({
    id: r.id,
    label: r.label,
    from: r.usdUncached,
    to: r.usdCached,
    toColor: armColor[r.id as ArmId],
    right: `${fmtUsd4(r.usdCached)} · ${fmtUsd4(r.usdUncached)}`,
    highlight: r.id === "lear" || r.id === "optimised",
  }));
  return (
    <Section id="cost" num="04" title="Cost and tokens">
      <p className="lede">
        Lear costs $0.0016 per incident after optimisation, and $0.0020 before. The baselines make between 5 and 24 model calls per incident; Lear makes about one.
      </p>

      <Ledger
        caption="Tokens, model calls and wall time per incident"
        head={["Arm", "Input tokens", "Output tokens", "Model calls", "USD (cached)", "USD (no cache)", "Wall time"]}
        numeric={[1, 2, 3, 4, 5, 6]}
        highlight={[4]}
        rows={COST_ROWS.map((r) => [
          r.label,
          fmtInt(r.inputTokens),
          fmtInt(r.outputTokens),
          r.modelCalls.toFixed(1),
          fmtUsd4(r.usdCached),
          fmtUsd4(r.usdUncached),
          `${r.wallSeconds} s`,
        ])}
      />

      <Figure
        no="4.1"
        title="USD per incident, cached and uncached"
        file="lear-cost-per-incident"
        caption="Cached is the provider's billed figure. Uncached is the safer planning number, because each production incident's evidence is new."
      >
        <Dumbbell
          rows={rows}
          domain={[0, 0.036]}
          ticks={[0, 0.01, 0.02, 0.03]}
          format="usd2"
          fromLabel="UNCACHED"
          toLabel="CACHED"
          label="USD per incident for five designs, cached and uncached. Lear optimised is cheapest at $0.0016 cached and $0.0020 uncached. Multi-agent is most expensive at $0.0202 cached and $0.0344 uncached."
        />
      </Figure>

      <Note label="Cost caveat">
        <p>
          DeepSeek bills a repeated prompt prefix at 1/50 of the input price. Lear&rsquo;s prompt for a case is identical across repeats and ablations, so about 81% of its input was billed as cached. In production each incident&rsquo;s evidence is new, so the uncached cost is the safer planning number: $0.0024 per incident (Lear v1.1; $0.0020 optimised) against $0.0064 (single agent) and $0.0344 (multi-agent). That is still 2.6× and 14.1× cheaper on identical code.
        </p>
      </Note>

      <h3 className="sub">Monthly model spend</h3>
      <p className="prose-line">
        Spend is linear in volume. Drag the slider to set your own incidents per month.
      </p>
      <Figure
        no="4.2"
        title="Monthly model spend against volume"
        file="lear-monthly-spend"
        caption="Trend lines. The baselines were not re-run after the schema change, so the same-code ratios in section 3 are the fair comparison."
      >
        <Spend />
      </Figure>

      <Note label="Scale">
        <p>
          At 1,000 incidents a month, Lear&rsquo;s model spend is about $2, well under 0.1% of the subscription ($3,000 per team per month, plus $75 per service watched; CHANGELOG 4.0.0-rc5). Inference cost is not where Lear&rsquo;s margin is decided: the cost advantage matters for the design&rsquo;s scalability and for the &ldquo;no hidden token bill&rdquo; message to buyers.
        </p>
      </Note>

      <h3 className="sub">Against public frontier-model figures</h3>
      <div className="prose">
        <p>
          Context only, not like-for-like. The ITBench-AA leaderboard (Artificial Analysis, 2026-05-27) reports Claude Opus 4.7 at 47% for $5.38 per task in a 100-turn shell agent over the full raw snapshot (about 1 GB per scenario); GPT-5.5 46%. Our run is a different harness (23 public scenarios, alerts, events and object dumps only, no logs, metrics or traces) on a ~$0.30/M-token model: Lear spends $0.0049 per scenario. The ratio (~1,105x) mixes a different model, harness and data; quote it only with that sentence. We have not run frontier models ourselves.
        </p>
      </div>
    </Section>
  );
}
