/**
 * Export a figure's SVG as a standalone file: SVG, or PNG at 2x.
 * Serialises the live DOM, so exports show the final state of each chart
 * on the chart's own panel colour.
 */

import { palette } from "./theme";

const NS = "http://www.w3.org/2000/svg";

function serialise(svg: SVGSVGElement) {
  const vb = svg.viewBox.baseVal;
  const width = vb.width || svg.clientWidth;
  const height = vb.height || svg.clientHeight;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", NS);
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  clone.removeAttribute("role");
  const bg = document.createElementNS(NS, "rect");
  bg.setAttribute("width", "100%");
  bg.setAttribute("height", "100%");
  bg.setAttribute("fill", palette.panel);
  clone.insertBefore(bg, clone.firstChild);
  const xml = new XMLSerializer().serializeToString(clone);
  return { xml, width, height };
}

function save(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function exportSvg(figure: HTMLElement, filename: string) {
  const svg = figure.querySelector("svg");
  if (!svg) return;
  const { xml } = serialise(svg);
  const url = URL.createObjectURL(new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`], { type: "image/svg+xml" }));
  save(url, `${filename}.svg`);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function exportPng(figure: HTMLElement, filename: string) {
  const svg = figure.querySelector("svg");
  if (!svg) return;
  const { xml, width, height } = serialise(svg);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = palette.panel;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      save(url, `${filename}.png`);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    }, "image/png");
  };
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
}
