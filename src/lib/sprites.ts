/**
 * Pre-rendered radial-glow sprites. Drawing a cached sprite with drawImage is
 * far cheaper than building a radial gradient per particle per frame.
 */
const cache = new Map<string, HTMLCanvasElement>();

/** A soft round glow of colour `rgb` ("r,g,b"); draw it scaled with globalAlpha. */
export function glowSprite(rgb: string, size = 64, hardness = 0): HTMLCanvasElement {
  const key = `${rgb}|${size}|${hardness}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(Math.min(0.9, 0.15 + hardness), `rgba(${rgb},0.55)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  cache.set(key, c);
  return c;
}
