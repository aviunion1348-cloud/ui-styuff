/** Linear and log10 scales mapping a data domain onto a pixel range. */

export type Scale = (v: number) => number;

export function linear([d0, d1]: [number, number], [r0, r1]: [number, number]): Scale {
  return (v) => r0 + ((r1 - r0) * (v - d0)) / (d1 - d0);
}

export function log10([d0, d1]: [number, number], [r0, r1]: [number, number]): Scale {
  const a = Math.log10(d0);
  const b = Math.log10(d1);
  return (v) => r0 + ((r1 - r0) * (Math.log10(v) - a)) / (b - a);
}
