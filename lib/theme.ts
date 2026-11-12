import type { ArmId } from "./data";

/**
 * Palette: black ground, silver for text and baselines, gold for Lear,
 * pink for the failures we are counting (refusals, abstentions, unsafe changes).
 * Nothing else is coloured. Charts read by position and label first.
 */
export const palette = {
  ground: "#0a0a0b",
  panel: "#111113",
  rule: "#25262b",
  ruleStrong: "#3b3d44",
  ink: "#eef0f4",
  ink2: "#c3c7cf",
  ink3: "#8f949e",
  ink4: "#62666f",
  gold: "#e2b35e",
  goldBright: "#f1d38c",
  goldMid: "#c99a45",
  goldDeep: "#8e6a2c",
  pink: "#ec8db7",
  pinkDeep: "#b9577f",
  silver: "#d9dee6",
  silverMid: "#9ba2ae",
  graphite: "#5b606a",
} as const;

export const armColor: Record<ArmId, string> = {
  lear: palette.gold,
  optimised: palette.goldBright,
  single: palette.silver,
  multi: palette.silverMid,
  telemetry: palette.graphite,
};

export const fonts = {
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  serif: '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
} as const;
