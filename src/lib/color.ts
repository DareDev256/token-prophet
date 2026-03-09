// ─── Color Utilities — Probability Palette ───
// Interpolation between the game's purple (low probability) and gold (high probability).

/** Interpolate hex color between purple (#9b59b6) and gold (#f1c40f) based on t [0,1] */
export function lerpColor(t: number): string {
  const r = Math.round(155 + t * (241 - 155));
  const g = Math.round(89 + t * (196 - 89));
  const b = Math.round(182 + t * (15 - 182));
  return `rgb(${r},${g},${b})`;
}
