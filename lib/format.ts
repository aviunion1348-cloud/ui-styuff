const money = (min: number, max: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  });

/** $1,602.00 */
export const fmtUsd = (v: number) => money(2, 2).format(v);

/** $0.0016 */
export const fmtUsd4 = (v: number) => money(4, 4).format(v);

/** 1,000 */
export const fmtInt = (n: number) => new Intl.NumberFormat("en-US").format(n);
