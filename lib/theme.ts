import type { ArmId } from "./data";

/**
 * Palette: charcoal ground, silver hierarchy, one violet accent.
 * Violet marks Lear. Everything else is silver or graphite, so the eye lands
 * on the subject without decoration.
 */
export const palette = {
  ground: "#0c0c0e",
  panel: "#121215",
  rule: "#25252b",
  ruleStrong: "#3a3b43",
  ink: "#eceef2",
  ink2: "#bcc0c9",
  ink3: "#8a909b",
  ink4: "#60656f",
  violet: "#cbbcff",
  violetMid: "#9d82f7",
  violetDeep: "#6e4fe3",
  silver: "#d6dae1",
  silverMid: "#9aa0ab",
  graphite: "#5d626d",
} as const;

export const armColor: Record<ArmId, string> = {
  lear: palette.violetMid,
  optimised: palette.violet,
  single: palette.silver,
  multi: palette.silverMid,
  telemetry: palette.graphite,
};

export const fonts = {
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  serif: '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
} as const;
