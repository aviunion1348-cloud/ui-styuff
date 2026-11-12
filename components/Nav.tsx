"use client";

import { useEffect, useState } from "react";

export const NAV_ITEMS = [
  { id: "summary", label: "Summary" },
  { id: "compared", label: "Compared" },
  { id: "accuracy", label: "Accuracy" },
  { id: "cost", label: "Cost" },
  { id: "safety", label: "Safety" },
  { id: "changes", label: "Changes" },
  { id: "itbench", label: "ITBench" },
  { id: "production", label: "Production" },
  { id: "swot", label: "SWOT" },
  { id: "other", label: "Analyses" },
  { id: "limits", label: "Limits" },
];

/** Sticky top bar: reading-progress line, section links with active state. */
export function Nav() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("summary");

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
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header className="nav">
      <div className="nav__bar" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <div className="nav__inner">
        <a href="#top" className="nav__brand">
          Lear <span>benchmark</span>
        </a>
        <nav aria-label="Report sections" className="nav__links">
          {NAV_ITEMS.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={active === n.id ? "is-active" : ""} aria-current={active === n.id ? "location" : undefined}>
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
