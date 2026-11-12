"use client";

import { useRef, type ReactNode } from "react";
import { exportPng, exportSvg } from "@/lib/export";

/** A numbered figure: header with title and exports, the chart, and a caption. */
export function Figure({
  no,
  title,
  file,
  caption,
  children,
}: {
  no: string;
  title: string;
  file: string;
  caption?: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  return (
    <figure className="fig" ref={ref as React.RefObject<HTMLElement>}>
      <header className="fig__head">
        <p className="fig__title">
          <span className="fig__no">Fig. {no}</span>
          {title}
        </p>
        <p className="fig__tools">
          <button type="button" onClick={() => ref.current && exportSvg(ref.current, file)}>
            SVG
          </button>
          <button type="button" onClick={() => ref.current && exportPng(ref.current, file)}>
            PNG
          </button>
        </p>
      </header>
      <div className="fig__body">{children}</div>
      {caption ? <figcaption className="fig__cap">{caption}</figcaption> : null}
    </figure>
  );
}
