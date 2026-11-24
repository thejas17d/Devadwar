/** Round to 2 decimals — keeps SSR and client SVG output identical (trig results differ in the last bits). */
export const r2 = (n: number) => Math.round(n * 100) / 100;
