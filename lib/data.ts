/**
 * Figures from "Lear diagnosis engine: accuracy, cost and competitive position"
 * (benchmark report, 2026-11-12, Protocol v1.5). Pure data: no colour, no layout.
 * Where the report is internally inconsistent, the note is attached to the value.
 */

export type Interval = [number, number];
export type ArmId = "lear" | "single" | "multi" | "telemetry" | "optimised";

export interface Arm {
  id: ArmId;
  label: string;
  /** correct answers, % (95% CI) — development set, 60 cases × 2 */
  accuracy: number;
  ci: Interval;
  /** unsafe change, % of all cases (95% CI) */
  unsafe: number;
  unsafeCi: Interval;
  /** confident & wrong, % (95% CI) */
  confidentWrong: number;
  confidentWrongCi: Interval;
  usdPerIncident: number;
  usdPerCorrect: number;
}

export const ARMS: Arm[] = [
  { id: "lear", label: "Lear (v1.1)", accuracy: 88, ci: [79, 95], unsafe: 0, unsafeCi: [0, 0], confidentWrong: 3, confidentWrongCi: [1, 7], usdPerIncident: 0.002, usdPerCorrect: 0.0023 },
  { id: "single", label: "Single-agent", accuracy: 89, ci: [82, 96], unsafe: 3, unsafeCi: [0, 8], confidentWrong: 5, confidentWrongCi: [1, 9], usdPerIncident: 0.0033, usdPerCorrect: 0.0037 },
  { id: "multi", label: "Multi-agent", accuracy: 79, ci: [70, 88], unsafe: 6, unsafeCi: [1, 12], confidentWrong: 4, confidentWrongCi: [0, 9], usdPerIncident: 0.0202, usdPerCorrect: 0.0255 },
  { id: "telemetry", label: "Telemetry-only", accuracy: 62, ci: [49, 73], unsafe: 0, unsafeCi: [0, 0], confidentWrong: 15, confidentWrongCi: [8, 23], usdPerIncident: 0.0037, usdPerCorrect: 0.0059 },
  { id: "optimised", label: "Lear (optimised)", accuracy: 98, ci: [96, 100], unsafe: 0, unsafeCi: [0, 0], confidentWrong: 0, confidentWrongCi: [0, 0], usdPerIncident: 0.0016, usdPerCorrect: 0.0016 },
];

export const armById = (id: ArmId): Arm => {
  const a = ARMS.find((x) => x.id === id);
  if (!a) throw new Error(`unknown arm ${id}`);
  return a;
};

/** Section 4: tokens, calls, cost and wall time per incident. */
export interface CostRow {
  id: ArmId;
  label: string;
  inputTokens: number;
  outputTokens: number;
  modelCalls: number;
  usdCached: number;
  usdUncached: number;
  wallSeconds: number;
}

export const COST_ROWS: CostRow[] = [
  { id: "lear", label: "Lear (v1.1)", inputTokens: 1735, outputTokens: 1594, modelCalls: 1.1, usdCached: 0.002, usdUncached: 0.0024, wallSeconds: 9 },
  { id: "single", label: "Single-agent", inputTokens: 12821, outputTokens: 2133, modelCalls: 5.4, usdCached: 0.0033, usdUncached: 0.0064, wallSeconds: 15 },
  { id: "multi", label: "Multi-agent", inputTokens: 61668, outputTokens: 13269, modelCalls: 24.2, usdCached: 0.0202, usdUncached: 0.0344, wallSeconds: 64 },
  { id: "telemetry", label: "Telemetry-only", inputTokens: 14288, outputTokens: 2411, modelCalls: 5.9, usdCached: 0.0037, usdUncached: 0.0072, wallSeconds: 17 },
  { id: "optimised", label: "Lear (optimised)", inputTokens: 1897, outputTokens: 1219, modelCalls: 1.0, usdCached: 0.0016, usdUncached: 0.002, wallSeconds: 7 },
];

/** Section 3: accuracy against cost. Kimi is on the fresh set, not the development set. */
export interface ScatterPoint {
  id: ArmId | "kimi";
  label: string;
  usd: number;
  correct: number;
  note?: string;
}

export const SCATTER: ScatterPoint[] = [
  { id: "optimised", label: "Lear (optimised)", usd: 0.0016, correct: 0.98, note: "development set, ceiling" },
  { id: "lear", label: "Lear (v1.1)", usd: 0.002, correct: 0.88 },
  { id: "single", label: "Single-agent", usd: 0.0033, correct: 0.89 },
  { id: "telemetry", label: "Telemetry-only", usd: 0.0037, correct: 0.62 },
  { id: "multi", label: "Multi-agent", usd: 0.0202, correct: 0.79 },
  { id: "kimi", label: "Lear on Kimi K3.1", usd: 0.0089, correct: 0.92, note: "fresh set, 1 repeat" },
];

/** Section 4: monthly spend is linear in volume (USD per incident × incidents). */
export const SPEND_VOLUMES = [100, 1000, 10000, 100000];

/** Section 6: before → after, paired on the same incidents. */
export interface OptimisationRow {
  set: string;
  n: string;
  before: number;
  beforeN: number;
  after: number;
  afterN: number;
  change: string;
  ci: string;
  p: string;
  costRatio: string;
}

export const OPTIMISATION: OptimisationRow[] = [
  { set: "Development", n: "60 × 2", before: 105, beforeN: 120, after: 118, afterN: 120, change: "+0.11", ci: "[+0.04, +0.18]", p: "0.000977", costRatio: "×0.79" },
  { set: "Fresh", n: "24 × 2", before: 43, beforeN: 48, after: 46, afterN: 48, change: "+0.06", ci: "[+0.00, +0.12]", p: "0.25", costRatio: "×0.78" },
];

/**
 * Section 6: wrong answers by cause, development set, as drawn in the report.
 * NOTE: these segments total 15 before; the report's label and text say 17.
 */
export const CAUSES = [
  { key: "abstain", label: "abstained on a solvable incident", before: 4, after: 0 },
  { key: "refused", label: "proposed a fix the action code refuses", before: 4, after: 0 },
  { key: "right", label: "right cause, no fix proposed", before: 5, after: 0 },
  { key: "wrong", label: "wrong cause, no fix proposed", before: 2, after: 1 },
  { key: "unsupported", label: "named a cause the evidence does not show", before: 0, after: 1 },
] as const;

export type CauseKey = (typeof CAUSES)[number]["key"];

export const CHANGES = [
  { cause: "right cause, no fix proposed (5); abstained on a solvable incident (4)", fix: "prompt now states when a fix is warranted and the check's exact rules" },
  { cause: "fix the action code refuses (4): entity id as target, unit in params", fix: "Python respells the target; the check uses the action's own rule (also: scale needs replicas of at least 1)" },
  { cause: "a right answer refused for a cause-first causal path (paid second call)", fix: "Python reorders the path" },
  { cause: "topology listing: every path, cut at 40 lines, direction lost", fix: "one line per observed entity, true direction (prompt −40% on ITBench)" },
  { cause: "scope bug: unit.service bypassed an observe-only unit", fix: "normalised" },
];

/** Section 5: observe-only components changed, % of scope-case runs. */
export const SCOPE = [
  { id: "lear", label: "Lear", sub: "code check refuses the action", pct: 0 },
  { id: "single", label: "Single-agent", sub: "prompt asks it not to", pct: 25 },
  { id: "multi", label: "Multi-agent", sub: "prompt asks it not to", pct: 38 },
  { id: "ablation", label: "Lear, check removed", sub: "ablation", pct: 19 },
] as const;

/** Section 7: ITBench-AA, 23 public scenarios, 1 repeat. */
export const ITBENCH = {
  strict: { lear: 9, single: 8 },
  lenient: { lear: 17, single: 16 },
  of: 23,
  beforeLenient: { lear: 11, single: 14, of: 16 },
  costPerScenario: { lear: 0.0049, single: 0.0096 },
};

/** Section 8: fresh set, 24 incidents. Intervals are 95%. */
export const FRESH = [
  { id: "lear", label: "Lear", sub: "DeepSeek V4.1 Flash · 24 × 2", value: 96, ci: [88, 100] as Interval },
  { id: "single", label: "Single-agent", sub: "DeepSeek V4.1 Flash · 24 × 2", value: 90, ci: [77, 100] as Interval },
  { id: "kimi", label: "Lear on Kimi K3.1", sub: "24 cases · 1 repeat · reasoning low", value: 92, ci: [79, 100] as Interval },
];

export const COMPETITORS = [
  { name: "Single-agent design", tag: "Resolve AI 2025 style", strength: "simple, flexible, near-Lear accuracy (89%)", weakness: "5.4 model calls and 15k tokens per incident; changed observe-only components in 25% of scope runs", opportunity: "more capable models lift it directly", threat: "cost scales with investigation depth" },
  { name: "Multi-agent design", tag: "Resolve AI 2026 style", strength: "built for large, noisy evidence we did not test", weakness: "13x Lear's cost, lowest accuracy of the agentic arms (79%), 38% scope violations, 64 s per incident", opportunity: "may win where evidence exceeds a context window (untested here)", threat: "cost and latency at scale" },
  { name: "Telemetry-only design", tag: "NeuBird / Cleric style", strength: "lowest integration burden", weakness: "62% accuracy (p < 0.001 vs Lear): without config, change history and topology it names symptoms, not causes", opportunity: "adding config sources", threat: "ceiling is set by what it can see" },
];

export const SWOT = {
  strengths: "Lowest cost per incident of every design tested (1.6x to 10x cheaper on identical code); accuracy statistically tied with or ahead of a capable single agent; 0 out-of-scope changes (code-enforced); cited, host-checked answers that abstain instead of guessing; confidence separates right from wrong (AUROC 0.94); every step in a hash-chained audit ledger.",
  weaknesses: "Topology advantage unproven on these cases; fresh-set gain not significant (p = 0.25); evidence is assembled by Python, so a missing connector means missing evidence; all cases written by Lear's authors; one cheap model family tested; no time-to-resolution measured.",
  opportunities: "Position on cost + enforceable scope + open, rerunnable benchmark; DeepSeek-first routing; blind replay of a prospect's own incidents; large-haystack suite where tool agents can search; frontier-model replication.",
  threats: "Vendors with deep integrations and real production data; a baseline with better prompts closing the gap; model price cuts erasing the cost gap (the ratio is structural, the dollars are not); buyers distrusting vendor-run benchmarks.",
};

export const ARM_DEFINITIONS = [
  { name: "Lear", what: "Python-built cited evidence + topology, one checked structured answer, abstains if unverifiable", stands: "Lear" },
  { name: "Single-agent", what: "one tool-using loop, up to 30 turns", stands: "Resolve AI's published 2025 design; the harness shape ITBench-AA uses" },
  { name: "Multi-agent", what: "triage, 3 parallel hypothesis investigators, an independent verifier", stands: "Resolve AI's published 2026 design" },
  { name: "Telemetry-only", what: "single agent seeing only alerts, logs, metrics, state (no config, change history, code, topology)", stands: "telemetry-first products' published scope (NeuBird, Cleric style)" },
  { name: "Lear without check / without topology", what: "ablations", stands: "what each part of Lear is worth" },
];

export const OTHER_ANALYSES = [
  { title: "Where Lear still fails", body: "one case, fr-only-a-failed-unit (a failed unit with no reason): every design restarts it. The product rule is to abstain; models still guess." },
  { title: "Agreement as a free confidence signal", body: "two samples that agree were right in 57 of 57 (development) and 20 of 21 (fresh) cases; splits were rare (3 and 3), so this is not yet an escalation rule." },
  { title: "Cascade (simulated)", body: "Lear first, single agent only on abstention: no accuracy gain over Lear alone at higher cost." },
  { title: "Reasoning tokens", body: "about half of Lear's output cost is hidden reasoning (1,219 output tokens per incident); a test with reasoning off is the next cost lever (protocol v1.4 item 7), unrun." },
];

export const LIMITS = [
  "Competitors are designs, not products; no vendor's model, prompts, retrieval or tuning was used. Vendor claims (Resolve \u201c>2x\u201d, NeuBird \u201c94% RCA\u201d, Traversal \u201c82%+\u201d) are unverified and have no published method, tokens or cost.",
  "One cheap model (DeepSeek V4.1 Flash); rankings may move with frontier models. Retrieval is removed (all arms get the same evidence), which removes the multi-agent design's main advantage.",
  "The development-set result is a ceiling. The fresh cases share an author with the fixes. 60\u00a0+\u00a024 cases: intervals are about \u00b110 points.",
  "Costs are list-price tokens, not an invoice; the provider balance moved by less than metered on one run and about $0.75 more on an earlier one (retries, other key use).",
  "Cache hits understate Lear's billed cost by up to 20%; uncached figures are given above.",
  "No time-to-resolution, no production traffic. The gateway's fix-success and cost-per-verified-fix export covers real installs.",
];
