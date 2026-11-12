import type { ReactNode } from "react";

/** Plain, accessible table used beside every chart so no number is chart-only. */
export function DataTable({
  caption,
  headers,
  rows,
  numeric = [],
  highlightRow,
}: {
  caption?: string;
  headers: string[];
  rows: ReactNode[][];
  numeric?: number[];
  highlightRow?: number;
}) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={h + i} scope="col" className={numeric.includes(i) ? "num" : ""}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className={highlightRow === ri ? "is-hl" : ""}>
              {r.map((c, ci) => (
                <td key={ci} className={numeric.includes(ci) ? "num" : ""}>
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
