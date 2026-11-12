/**
 * Every number on the site comes from this file, transcribed from
 * "Lear benchmark report, 2026-11-12" (Protocol v1.5). Where the report
 * itself is inconsistent, the discrepancy is noted next to the value.
 */

export type Interval = [number, number];

export type ArmId = "lear" | "single" | "multi" | "telemetry" | "optimised";

export interface Arm {
  id: ArmId;
  label: string;
  short: string;
  color: string;
  /** correct answers, percent (95% CI) */
  accuracy: number;
  ci: Interval;
  /** unsafe change on all cases, percent (95% CI) */
  unsafe: number;
  unsafeCi: Interval;
  /** confident & wrong, percent (95% CI) */
  confidentWrong: number;
  confidentWrongCi: Interval;
  /** USD per incident, list price, cached input allowed */
  usdPerIncident: number;
  /** USD per correct answer */
  usdPerCorrect: number;
}

export const ARMS: Arm[] = [
  {
    id: "lear",
    label: "Lear (v1.1)",
    short: "Lear v1.1",
    color: "#1e3a8a",
    accuracy: 88,
    ci: [79, 95],
    unsafe: 0,
    unsafeCi: [0, 0],
    confidentWrong: 3,
    confidentWrongCi: [1, 7],
    usdPerIncident: 0.002,
    usdPerCorrect: 0.0023,
  },
  {
    id: "single",
    label: "Single-agent",
    short: "Single-agent",
    color: "#f59e0b",
    accuracy: 89,
    ci: [82, 96],
    unsafe: 3,
    unsafeCi: [0, 8],
    confidentWrong: 5,
    confidentWrongCi: [1, 9],
    usdPerIncident: 0.0033,
    usdPerCorrect: 0.0037,
  },
  {
    id: "multi",
    label: "Multi-agent",
    short: "Multi-agent",
    color: "#6366f1",
    accuracy: 79,
    ci: [70, 88],
    unsafe: 6,
    unsafeCi: [1, 12],
    confidentWrong: 4,
    confidentWrongCi: [0, 9],
    usdPerIncident: 0.0202,
    usdPerCorrect: 0.0255,
  },
  {
    id: "telemetry",
    label: "Telemetry-only",
    short: "Telemetry-only",
    color: "#a855f7",
    accuracy: 62,
    ci: [49, 73],
    unsafe: 0,
    unsafeCi: [0, 0],
    confidentWrong: 15,
    confidentWrongCi: [8, 23],
    usdPerIncident: 0.0037,
    usdPerCorrect: 0.0059,
  },
  {
    id: "optimised",
    label: "Lear (optimised)",
    short: "Lear optimised",
    color: "#14b8a6",
    accuracy: 98,
    ci: [96, 100],
    unsafe: 0,
    unsafeCi: [0, 0],
    confidentWrong: 0,
    confidentWrongCi: [0, 0],
    usdPerIncident: 0.0016,
    usdPerCorrect: 0.0016,
  },
];

export const ARM_BY_ID = Object.fromEntries(ARMS.map((a) => [a.id, a])) as Record<
  ArmId,
  Arm
>;

/** Cost and token table (report section 4). */
export interface CostRow {
  id: ArmId;
  label: string;
  inputTokens: number;
  outputTokens: number;
  modelCalls: number;
  usdPerIncident: number;
  usdNoCache: number;
  wallSeconds: number;
}

export const COST_ROWS: CostRow[] = [
  { id: "lear", label: "Lear (v1.1)", inputTokens: 1735, outputTokens: 1594, modelCalls: 1.1, usdPerIncident: 0.002, usdNoCache: 0.0024, wallSeconds: 9 },
  { id: "single", label: "Single-agent", inputTokens: 12821, outputTokens: 2133, modelCalls: 5.4, usdPerIncident: 0.0033, usdNoCache: 0.0064, wallSeconds: 15 },
  { id: "multi", label: "Multi-agent", inputTokens: 61668, outputTokens: 13269, modelCalls: 24.2, usdPerIncident: 0.0202, usdNoCache: 0.0344, wallSeconds: 64 },
  { id: "telemetry", label: "Telemetry-only", inputTokens: 14288, outputTokens: 2411, modelCalls: 5.9, usdPerIncident: 0.0037, usdNoCache: 0.0072, wallSeconds: 17 },
  { id: "optimised", label: "Lear (optimised)", inputTokens: 1897, outputTokens: 1219, modelCalls: 1.0, usdPerIncident: 0.0016, usdNoCache: 0.002, wallSeconds: 7 },
];

/** Monthly model spend, USD (section 5). Linear in volume: spend = volume x USD per incident. */
export const SPEND_VOLUMES = [100, 1000, 10000, 100000];
export const SPEND_TABLE: Record<"optimised" | "single" | "multi", number[]> = {
  optimised: [0.16, 1.6, 16, 160],
  single: [0.33, 3.3, 33, 330],
  multi: [2.02, 20.2, 202, 2020],
};

/** Accuracy vs cost points (section 3 scatter). Kimi point is on the fresh set. */
export interface ScatterPoint {
  id: string;
  label: string;
  usd: number;
  correct: number;
  color: string;
  note?: string;
}

export const SCATTER: ScatterPoint[] = [
  { id: "optimised", label: "Lear (optimised)", usd: 0.0016, correct: 0.98, color: "#14b8a6", note: "development set (ceiling)" },
  { id: "lear", label: "Lear (v1.1)", usd: 0.002, correct: 0.88, color: "#1e3a8a" },
  { id: "single", label: "Single-agent", usd: 0.0033, correct: 0.89, color: "#f59e0b" },
  { id: "telemetry", label: "Telemetry-only", usd: 0.0037, correct: 0.62, color: "#a855f7" },
  { id: "multi", label: "Multi-agent", usd: 0.0202, correct: 0.79, color: "#6366f1" },
  { id: "kimi", label: "Lear on Kimi K3.1", usd: 0.0089, correct: 0.92, color: "#e11d48", note: "fresh set, 1 repeat" },
];

/** Before/after the optimisation (section 6). */
export const OPTIMISATION = [
  { set: "Development (60 x 2)", before: 105, beforeN: 120, after: 118, afterN: 120, change: "+0.11", ci: "[+0.04, +0.18]", p: "0.000977", costRatio: "x0.79", beforePct: 88, afterPct: 98 },
  { set: "Fresh (24 x 2)", before: 43, beforeN: 48, after: 46, afterN: 48, change: "+0.06", ci: "[+0.00, +0.12]", p: "0.25", costRatio: "x0.78", beforePct: 90, afterPct: 96 },
];

/** Breakdown of wrong answers as drawn in the report's section 6 chart (development set, 120 runs). */
export const CAUSE_SEGMENTS = [
  { label: "abstained on a solvable incident", color: "#1e3a8a", before: 4, after: 0 },
  { label: "proposed a fix the action code refuses", color: "#f97316", before: 4, after: 0 },
  { label: "right cause, no fix proposed", color: "#fdba74", before: 5, after: 0 },
  { label: "wrong cause, no fix proposed", color: "#16a34a", before: 2, after: 1 },
  { label: "named a cause the evidence does not show", color: "#93c5fd", before: 0, after: 1 },
];

/** Fresh-set comparison (sections 1, 10). */
export const FRESH = {
  lear: { correct: 96, ci: [88, 100] as Interval, n: 48 },
  single: { correct: 90, ci: [77, 100] as Interval, n: 48 },
  kimi: { correct: 92, ci: [79, 100] as Interval, usd: 0.0089, n: 48 },
  deepseekLear: { correct: 96, ci: [88, 100] as Interval },
};

/** Third-party ITBench-AA (section 7). */
export const ITBENCH = {
  strict: { lear: 9, single: 8, of: 23 },
  lenient: { lear: 17, single: 16, of: 23 },
  before: { lear: 11, single: 14, of: 16 },
  costPerScenario: { lear: 0.0049, single: 0.0096 },
  inputTokenRatio: 11,
};

/** Safety: observe-only scope cases (section 5). */
export const SCOPE_VIOLATIONS = [
  { id: "lear", label: "Lear", pct: 0, color: "#14b8a6" },
  { id: "single", label: "Single-agent", pct: 25, color: "#f59e0b" },
  { id: "multi", label: "Multi-agent", pct: 38, color: "#6366f1" },
];

/** Frontier context (section 4, context only). */
export const FRONTIER = {
  opus: { name: "Claude Opus 4.7", solved: 47, usdPerTask: 5.38 },
  gpt: { name: "GPT-5.5", solved: 46 },
  learPerScenario: 0.0049,
};

/** SWOT for Lear and the three competitor designs (sections 9). */
export const SWOT = {
  strengths: "Lowest cost per incident of every design tested (1.6x to 10x cheaper on identical code); accuracy statistically tied with or ahead of a capable single agent; 0 out-of-scope changes (code-enforced); cited, host-checked answers that abstain instead of guessing; confidence separates right from wrong (AUROC 0.94); every step in a hash-chained audit ledger.",
  weaknesses: "Topology advantage unproven on these cases; fresh-set gain not significant (p = 0.25); evidence is assembled by Python, so a missing connector means missing evidence; all cases written by Lear's authors; one cheap model family tested; no time-to-resolution measured.",
  opportunities: "Position on cost + enforceable scope + open, rerunnable benchmark; DeepSeek-first routing; blind replay of a prospect's own incidents; large-haystack suite where tool agents can search; frontier-model replication.",
  threats: "Vendors with deep integrations and real production data; a baseline with better prompts closing the gap; model price cuts erasing the cost gap (the ratio is structural, the dollars are not); buyers distrusting vendor-run benchmarks.",
};

export const COMPETITORS = [
  {
    name: "Single-agent design",
    tag: "Resolve AI 2025 style",
    s: "simple, flexible, near-Lear accuracy (89%)",
    w: "5.4 model calls and 15k tokens per incident; changed observe-only components in 25% of scope runs",
    o: "more capable models lift it directly",
    t: "cost scales with investigation depth",
  },
  {
    name: "Multi-agent design",
    tag: "Resolve AI 2026 style",
    s: "built for large, noisy evidence we did not test",
    w: "13x Lear's cost, lowest accuracy of the agentic arms (79%), 38% scope violations, 64 s per incident",
    o: "may win where evidence exceeds a context window (untested here)",
    t: "cost and latency at scale",
  },
  {
    name: "Telemetry-only design",
    tag: "NeuBird / Cleric style",
    s: "lowest integration burden",
    w: "62% accuracy (p < 0.001 vs Lear): without config, change history and topology it names symptoms, not causes",
    o: "adding config sources",
    t: "ceiling is set by what it can see",
  },
];

export const ARM_DEFINITIONS = [
  { name: "Lear", what: "Python-built cited evidence + topology, one checked structured answer, abstains if unverifiable", stands: "Lear" },
  { name: "Single-agent", what: "one tool-using loop, up to 30 turns", stands: "Resolve AI's published 2025 design; the harness shape ITBench-AA uses" },
  { name: "Multi-agent", what: "triage, 3 parallel hypothesis investigators, an independent verifier", stands: "Resolve AI's published 2026 design" },
  { name: "Telemetry-only", what: "single agent seeing only alerts, logs, metrics, state (no config, change history, code, topology)", stands: "telemetry-first products' published scope (NeuBird, Cleric style)" },
  { name: "Lear without check / without topology", what: "ablations", stands: "what each part of Lear is worth" },
];

export const LIMITS = [
  "Competitors are designs, not products; no vendor's model, prompts, retrieval or tuning was used. Vendor claims (Resolve \">2x\", NeuBird \"94% RCA\", Traversal \"82%+\") are unverified and have no published method, tokens or cost.",
  "One cheap model (DeepSeek V4.1 Flash); rankings may move with frontier models. Retrieval is removed (all arms get the same evidence), which removes the multi-agent design's main advantage.",
  "The development-set result is a ceiling. The fresh cases share an author with the fixes. 60 + 24 cases: intervals are about ±10 points.",
  "Costs are list-price tokens, not an invoice; the provider balance moved by less than metered on one run and about $0.75 more on an earlier one (retries, other key use).",
  "Cache hits understate Lear's billed cost by up to 20%; uncached figures are given above.",
  "No time-to-resolution, no production traffic. The gateway's fix-success and cost-per-verified-fix export covers real installs.",
];

export const OTHER_ANALYSES = [
  { title: "Where Lear still fails", body: "one case, fr-only-a-failed-unit (a failed unit with no reason): every design restarts it. The product rule is to abstain; models still guess." },
  { title: "Agreement as a free confidence signal", body: "two samples that agree were right in 57 of 57 (development) and 20 of 21 (fresh) cases; splits were rare (3 and 3), so this is not yet an escalation rule." },
  { title: "Cascade (simulated)", body: "Lear first, single agent only on abstention: no accuracy gain over Lear alone at higher cost." },
  { title: "Reasoning tokens", body: "about half of Lear's output cost is hidden reasoning (1,219 output tokens per incident); a test with reasoning off is the next cost lever (protocol v1.4 item 7), unrun." },
];

export const CHANGES = [
  { cause: "right cause, no fix proposed (5); abstained on a solvable incident (4)", fix: "prompt now states when a fix is warranted and the check's exact rules" },
  { cause: "fix the action code refuses (4): entity id as target, unit in params", fix: "Python respells the target; the check uses the action's own rule (also: scale needs replicas of at least 1)" },
  { cause: "a right answer refused for a cause-first causal path (paid second call)", fix: "Python reorders the path" },
  { cause: "topology listing: every path, cut at 40 lines, direction lost", fix: "one line per observed entity, true direction (prompt -40% on ITBench)" },
  { cause: "scope bug: unit.service bypassed an observe-only unit", fix: "normalised" },
];
