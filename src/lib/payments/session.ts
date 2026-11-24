/**
 * Client-side session for the active experience.
 * Holds ONLY the (demo) receipt + whether the user wants to write a Sankalp.
 * The Sankalp TEXT is never stored here or anywhere else — it lives in React
 * state inside the experience and disappears when the experience ends.
 */
import type { Receipt } from "./types";

const KEY = "devadwar.session.v1";

export interface ExperienceSession {
  receipt: Receipt;
  wantsSankalp: boolean;
}

export function saveSession(s: ExperienceSession) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}

export function loadSession(): ExperienceSession | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as ExperienceSession;
    if (!s?.receipt?.receiptId || !s.receipt.deity || !s.receipt.packageId) return null;
    return s;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}
