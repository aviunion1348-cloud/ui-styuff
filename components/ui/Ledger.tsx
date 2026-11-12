import type { ReactNode } from "react";

/** Plain ruled table. Every figure in the report that is not charted lives here. */
export function Ledger({
  caption,
  head,
  rows,
  numeric = [],
  highlight = [],
}: {
  caption?: string;
  head: string[];
  rows: ReactNode[][];
  numeric?: number[];
  highlight?: number[];
}) {
  return (
    <div className="ledger">
      <table>
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col" className={numeric.includes(i) ? "num" : undefined}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className={highlight.includes(ri) ? "is-hl" : undefined}>
              {r.map((c, ci) => (
                <td key={ci} className={numeric.includes(ci) ? "num" : undefined}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
