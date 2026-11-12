"use client";

import { useRef, type ReactNode } from "react";
import { downloadPng, downloadSvg } from "@/lib/download";

interface Props {
  title: string;
  caption?: ReactNode;
  filename: string;
  children: ReactNode;
}

/** Figure wrapper: title, the chart, a caption, and SVG/PNG export buttons. */
export function ChartFrame({ title, caption, filename, children }: Props) {
  const figRef = useRef<HTMLElement>(null);
  return (
    <figure className="chart" ref={figRef}>
      <div className="chart__head">
        <h3 className="chart__title">{title}</h3>
        <div className="chart__actions" role="group" aria-label="Export chart">
          <button type="button" className="btn-ghost" onClick={() => figRef.current && downloadSvg(figRef.current, filename)}>
            SVG
          </button>
          <button type="button" className="btn-ghost" onClick={() => figRef.current && downloadPng(figRef.current, filename)}>
            PNG
          </button>
        </div>
      </div>
      <div className="chart__body">{children}</div>
      {caption ? <figcaption className="chart__caption">{caption}</figcaption> : null}
    </figure>
  );
}
