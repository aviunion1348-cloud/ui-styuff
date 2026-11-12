/**
 * Export a chart's SVG as a standalone file (SVG, or PNG at 2x for slides).
 * Works on the live DOM, so the chart is exported in its final, fully
 * animated state with an opaque white background.
 */

const SVG_NS = "http://www.w3.org/2000/svg";

function serialise(svg: SVGSVGElement): { xml: string; width: number; height: number } {
  const vb = svg.viewBox.baseVal;
  const width = vb.width || svg.clientWidth;
  const height = vb.height || svg.clientHeight;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", SVG_NS);
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  clone.removeAttribute("role");
  clone.removeAttribute("class");
  const bg = document.createElementNS(SVG_NS, "rect");
  bg.setAttribute("width", "100%");
  bg.setAttribute("height", "100%");
  bg.setAttribute("fill", "#ffffff");
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

export function downloadSvg(figure: HTMLElement, filename: string) {
  const svg = figure.querySelector("svg");
  if (!svg) return;
  const { xml } = serialise(svg);
  const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  save(url, `${filename}.svg`);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function downloadPng(figure: HTMLElement, filename: string) {
  const svg = figure.querySelector("svg");
  if (!svg) return;
  const { xml, width, height } = serialise(svg);
  const scale = 2;
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
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
