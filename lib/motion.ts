import type { CSSProperties } from "react";

/** Fade an SVG element in once its chart is on screen. */
export function fade(on: boolean, delay = 0, ms = 700): CSSProperties {
  return {
    opacity: on ? 1 : 0,
    transition: `opacity ${ms}ms cubic-bezier(.2,.7,.2,1) ${delay}ms`,
  };
}

/** Draw a horizontal element left to right. */
export function draw(on: boolean, delay = 0, ms = 900): CSSProperties {
  return {
    transformBox: "fill-box",
    transformOrigin: "left center",
    transform: on ? "scaleX(1)" : "scaleX(0)",
    transition: `transform ${ms}ms cubic-bezier(.2,.7,.2,1) ${delay}ms`,
  };
}
