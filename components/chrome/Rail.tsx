"use client";

import { useEffect, useState } from "react";

export const RAIL = [
  { id: "summary", num: "01", label: "Summary" },
  { id: "compared", num: "02", label: "What was compared" },
  { id: "accuracy", num: "03", label: "Accuracy" },
  { id: "cost", num: "04", label: "Cost and tokens" },
  { id: "safety", num: "05", label: "Safety and scope" },
  { id: "changes", num: "06", label: "What changed" },
  { id: "itbench", num: "07", label: "ITBench-AA" },
  { id: "production", num: "08", label: "Production model" },
  { id: "swot", num: "09", label: "SWOT and designs" },
  { id: "analyses", num: "10", label: "Other analyses" },
  { id: "limits", num: "11", label: "Limits" },
];

/** Section index: tracks the section in view and the reading position. */
export function Rail() {
  const [active, setActive] = useState("summary");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const targets = RAIL.map((r) => document.getElementById(r.id)).filter((e): e is HTMLElement => e !== null);
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="rail" aria-label="Report sections">
      <a href="#top" className="rail__brand">
        Lear <span>/ benchmark</span>
      </a>
      <ol className="rail__list">
        {RAIL.map((r) => (
          <li key={r.id}>
            <a href={`#${r.id}`} className={active === r.id ? "is-active" : undefined} aria-current={active === r.id ? "location" : undefined}>
              <span className="rail__num">{r.num}</span>
              <span className="rail__label">{r.label}</span>
            </a>
          </li>
        ))}
      </ol>
      <div className="rail__track" aria-hidden="true">
        <div className="rail__fill" style={{ transform: `scaleY(${progress})` }} />
      </div>
      <a className="rail__pdf" href="/report/lear-benchmark-report.pdf" download>
        PDF ↓
      </a>
    </nav>
  );
}
