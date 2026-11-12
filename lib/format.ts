const usdFmt = (min: number, max: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  });

/** Dollar amount with 2 decimals (monthly spend), e.g. $1,602.00 */
export const fmtUsd = (v: number) => usdFmt(2, 2).format(v);

/** Per-incident dollar amount with 4 decimals, e.g. $0.0016 */
export const fmtUsd4 = (v: number) => usdFmt(4, 4).format(v);

export const fmtInt = (n: number) => new Intl.NumberFormat("en-US").format(n);
