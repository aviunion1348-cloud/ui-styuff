import type { ReactNode } from "react";

/** One numbered report section. The numbers match the PDF. */
export function Section({ id, num, title, children }: { id: string; num: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="sec" aria-labelledby={`${id}-title`}>
      <header className="sec__head">
        <span className="sec__num">{num}</span>
        <h2 id={`${id}-title`} className="sec__title">
          {title}
        </h2>
      </header>
      <div className="sec__body">{children}</div>
    </section>
  );
}
