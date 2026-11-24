/**
 * Circular gesture tracking for the Interactive Aarti.
 *
 * The lamp is offered in clockwise circles around the deity. In screen
 * coordinates (y grows downward) atan2 increases in the visually clockwise
 * direction, so positive angular deltas = clockwise.
 *
 * Design choices (gentle by default):
 *  - counter-clockwise movement is simply not counted (never penalised),
 *  - jitter close to the centre is ignored (minRadius),
 *  - large jumps (e.g. lifting the finger and touching elsewhere) are ignored.
 */

export const TAU = Math.PI * 2;

export interface GestureState {
  lastAngle: number | null;
  /** Accumulated clockwise radians. */
  total: number;
}

export const initialGesture = (): GestureState => ({ lastAngle: null, total: 0 });

export function normalizeAngle(a: number): number {
  // into (-π, π]
  let x = ((a + Math.PI) % TAU + TAU) % TAU - Math.PI;
  if (x === -Math.PI) x = Math.PI;
  return x;
}

export interface StepOptions {
  minRadius?: number;
  maxStep?: number;
}

export function stepGesture(
  state: GestureState,
  x: number,
  y: number,
  cx: number,
  cy: number,
  { minRadius = 24, maxStep = Math.PI / 2 }: StepOptions = {},
): { state: GestureState; delta: number } {
  const dx = x - cx;
  const dy = y - cy;
  if (Math.hypot(dx, dy) < minRadius) return { state: { ...state, lastAngle: null }, delta: 0 };
  const angle = Math.atan2(dy, dx);
  if (state.lastAngle === null) return { state: { ...state, lastAngle: angle }, delta: 0 };
  const d = normalizeAngle(angle - state.lastAngle);
  if (Math.abs(d) > maxStep) return { state: { ...state, lastAngle: angle }, delta: 0 };
  const counted = d > 0 ? d : 0;
  return { state: { lastAngle: angle, total: state.total + counted }, delta: counted };
}

export const roundsCompleted = (s: GestureState) => Math.floor(s.total / TAU + 1e-9);
export const roundFraction = (s: GestureState) => (s.total % TAU) / TAU;

/** Stop the pointer from leaving the gesture state dangling between drags. */
export const releaseGesture = (s: GestureState): GestureState => ({ ...s, lastAngle: null });
