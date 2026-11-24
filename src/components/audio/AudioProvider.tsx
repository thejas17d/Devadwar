"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { AudioManifest, Track, TrackRole } from "@/lib/types";
import { getEngine, type SfxName } from "@/lib/audio/engine";

export interface Scene {
  deity: string | null;
  role: TrackRole;
}

interface Prefs {
  soundWanted: boolean; // user opted in to sound at some point
  musicOn: boolean;
  sfxOn: boolean;
  volume: number;
  muted: boolean;
}

const DEFAULT_PREFS: Prefs = { soundWanted: false, musicOn: true, sfxOn: true, volume: 0.8, muted: false };
const PREFS_KEY = "devadwar.audio.v1";

interface AudioApi extends Prefs {
  unlocked: boolean;
  playing: boolean;
  track: Track | null;
  sceneTracks: Track[];
  enableSound: () => Promise<void>;
  disableSound: () => void;
  togglePlay: () => void;
  selectTrack: (id: string) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleMusic: () => void;
  toggleSfx: () => void;
  sfx: (name: SfxName, opts?: { pitch?: number; vel?: number }) => void;
  setScene: (s: Scene) => void;
}

const Ctx = createContext<AudioApi | null>(null);

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_PREFS;
}

export function pickTrack(tracks: Track[], scene: Scene, override?: string | null): Track | null {
  const playable = tracks.filter((t) => t.cleared);
  if (override) {
    const o = playable.find((t) => t.id === override);
    if (o) return o;
  }
  const byRole = (deity: string | null, role: TrackRole) => playable.find((t) => t.deity === deity && t.role === role);
  return (
    byRole(scene.deity, scene.role) ??
    (scene.deity ? byRole(scene.deity, "ambient") : null) ??
    byRole(null, scene.role) ??
    byRole(null, "gallery") ??
    null
  );
}

export function AudioProvider({ manifest, children }: { manifest: AudioManifest; children: React.ReactNode }) {
  const engine = getEngine();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [unlocked, setUnlocked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [scene, setSceneState] = useState<Scene>({ deity: null, role: "home" });
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const prefsLoaded = useRef(false);

  useEffect(() => {
    setPrefs(loadPrefs());
    prefsLoaded.current = true;
  }, []);

  useEffect(() => {
    if (!prefsLoaded.current) return;
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {}
    engine.setVolume(prefs.volume);
    engine.setMuted(prefs.muted);
    engine.setMusicEnabled(prefs.musicOn);
    engine.setSfxEnabled(prefs.sfxOn);
  }, [prefs, engine]);

  const sceneKey = `${scene.deity ?? "-"}|${scene.role}`;
  const track = useMemo(() => pickTrack(manifest.tracks, scene, overrides[sceneKey]), [manifest, scene, overrides, sceneKey]);

  const sceneTracks = useMemo(() => {
    const t = manifest.tracks.filter((x) => x.cleared && (scene.deity ? x.deity === scene.deity : x.deity === null));
    return t;
  }, [manifest, scene.deity]);

  // Keep the engine in sync with the chosen track.
  useEffect(() => {
    if (!unlocked || !playing || !track) return;
    engine.playTrack(track);
  }, [unlocked, playing, track, engine]);

  const enableSound = useCallback(async () => {
    const ok = await engine.unlock();
    if (!ok) return;
    setUnlocked(true);
    setPlaying(true);
    setPrefs((p) => ({ ...p, soundWanted: true, muted: false }));
  }, [engine]);

  // Returning visitors who opted in: start on their FIRST interaction (never autoplay).
  useEffect(() => {
    if (unlocked || !prefs.soundWanted) return;
    const handler = () => {
      void enableSound();
    };
    const opts = { once: true, capture: true } as const;
    window.addEventListener("pointerdown", handler, opts);
    window.addEventListener("keydown", handler, opts);
    return () => {
      window.removeEventListener("pointerdown", handler, opts);
      window.removeEventListener("keydown", handler, opts);
    };
  }, [prefs.soundWanted, unlocked, enableSound]);

  const disableSound = useCallback(() => {
    engine.stopMusic(1);
    setPlaying(false);
    setPrefs((p) => ({ ...p, soundWanted: false }));
  }, [engine]);

  const togglePlay = useCallback(() => {
    if (!unlocked) {
      void enableSound();
      return;
    }
    setPlaying((p) => {
      if (p) engine.stopMusic(1.2);
      return !p;
    });
  }, [unlocked, enableSound, engine]);

  const selectTrack = useCallback(
    (id: string) => {
      setOverrides((o) => ({ ...o, [sceneKey]: id }));
      if (!playing) setPlaying(true);
    },
    [sceneKey, playing],
  );

  const setScene = useCallback((s: Scene) => {
    setSceneState((prev) => (prev.deity === s.deity && prev.role === s.role ? prev : s));
  }, []);

  const api: AudioApi = {
    ...prefs,
    unlocked,
    playing,
    track,
    sceneTracks,
    enableSound,
    disableSound,
    togglePlay,
    selectTrack,
    setVolume: (v) => setPrefs((p) => ({ ...p, volume: v, muted: v === 0 ? p.muted : false })),
    toggleMute: () => setPrefs((p) => ({ ...p, muted: !p.muted })),
    toggleMusic: () => setPrefs((p) => ({ ...p, musicOn: !p.musicOn })),
    toggleSfx: () => setPrefs((p) => ({ ...p, sfxOn: !p.sfxOn })),
    sfx: (name, opts) => engine.sfx(name, opts),
    setScene,
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useAudio() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAudio must be used inside <AudioProvider>");
  return c;
}

/** Declare which soundscape a screen wants. */
export function useSoundscape(deity: string | null, role: TrackRole) {
  const { setScene } = useAudio();
  useEffect(() => {
    setScene({ deity, role });
  }, [deity, role, setScene]);
}
