import { Reveal } from "./Reveal";

/** Numbered section heading. Numbers match the section numbers in the PDF. */
export function SectionHeader({ num, title, lede }: { num: string; title: string; lede?: string }) {
  return (
    <Reveal className="section-head">
      <p className="eyebrow">Section {num}</p>
      <h2>{title}</h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </Reveal>
  );
}
