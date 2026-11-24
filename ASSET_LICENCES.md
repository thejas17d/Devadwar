# Asset Licences & Rights Register

Rule: **nothing ships unless we can show a right to use it commercially.** Every asset is listed here. Audio rights are also tracked per track in `src/content/audio/tracks.json`, and the player refuses any track with `cleared: false`.

## 1. Current inventory

### Visual art — all original, created in-house for this project
| Asset | Location | Origin | Rights |
|---|---|---|---|
| Celestial gateway (pillars, torana, doors, kalashas) | `src/components/gateway/Gateway.tsx` | Hand-authored SVG code | Owned |
| 10 deity emblems (attribute-based, symbolic) | `src/components/deity/emblems.tsx` | Hand-authored SVG code | Owned — **placeholders until commissioned art** |
| Shrine / prabhavali, diyas, toran, prayer box, aarti thali | `src/components/deity/Shrine.tsx`, `src/components/experience/*` | Hand-authored SVG/CSS | Owned |
| Environment motifs (Kailash, ocean, hills, etc.), clouds, particles, flames | `DeityBackdrop.tsx`, `visual/*`, `FlameCanvas.tsx` | Code-generated | Owned |
| Favicon | `src/app/icon.svg` | Hand-authored | Owned |

No photographs, clip art, temple imagery, temple logos or third-party illustrations are used.

### Audio — all original procedural compositions
| Asset | Origin | Rights |
|---|---|---|
| 32 soundscapes (home, gallery, and 3 per deity × 10) | Generated live in the browser by `src/lib/audio/*` from parameters in `tracks.json` (raga, tonic, tempo, instruments, seed) | Owned outright — no samples, no recordings |
| SFX (temple bell, ghanti, manjira, gong, shankha, chime) | Synthesised in code | Owned |

Ragas are traditional musical frameworks and are not themselves copyrightable; the specific generated compositions are original.

### Fonts — SIL Open Font License 1.1 (commercial use permitted; self-hosted via `next/font`)
| Font | Use |
|---|---|
| Cormorant Garamond | Display headings |
| EB Garamond | Body text |
| Tiro Devanagari Sanskrit | Devanagari (deity names, mantras) |
| Kalam | Handwritten Sankalp (Latin + Devanagari) |

### Text
- Mantras (Devanagari + transliteration) are traditional, public-domain texts. Meanings and deity descriptions are original writing.
- Legal pages are original drafts (pending lawyer review).

### Software dependencies
Next.js (MIT), React (MIT), Tailwind CSS (MIT). Dev-only: TypeScript (Apache-2.0), Vitest (MIT), Playwright (Apache-2.0), node-web-audio-api (BSD-3-Clause).

## 2. Template slot (shows the workflow)
`shiva-mantra-recorded` in `tracks.json` is a **disabled** example of a recorded chant: `cleared: false`, placeholders for creator, rights holder and licence. It is filtered out server-side and never reaches the browser.

## 3. Commissioning / licensing checklist

### Artwork (illustration or 3D)
- [ ] Written **assignment of copyright** (Copyright Act 1957, s.18–19) or an exclusive commercial licence covering web, app, ads and merchandise, worldwide and perpetual.
- [ ] Artist's warranty of originality: no tracing of temple murtis, photographs or other artists' work.
- [ ] Moral-rights waiver/consent where possible (s.57), and an agreed credit line.
- [ ] Iconography review: correct attributes and vahanas, respectful depiction (RESEARCH_NOTES §2, §4).
- [ ] Deliverables: layered source plus WebP/AVIF exports (≤ 300 KB for the hero), or glTF + Draco for 3D (≤ 2 MB).
- [ ] Record the entry in §1 and set `art.image` in the deity JSON.

### Music & mantra recordings
A recording can involve **three separate rights**. Clear all of them:
1. **Composition** — traditional/public domain, or a licence from the composer or publisher.
2. **Lyrics/text** — mantras are traditional; modern bhajan lyrics need a licence.
3. **Sound recording + performers' rights** (s.38): the producer's master rights and the vocalists' or instrumentalists' consent.

- [ ] Commission as work-for-hire with an assignment of all three, **or** license from a library whose terms explicitly allow commercial streaming on a website or app.
- [ ] Check whether public-performance or communication-to-public licensing (e.g. IPRS / PPL / Novex) applies to your use; take legal advice.
- [ ] **Never** download from YouTube, Spotify, Instagram or similar.
- [ ] Store the signed licence PDF, then fill `creator`, `rightsHolder`, `licence` and `usage` in `tracks.json`, and set `cleared: true` last.
- [ ] Encode as AAC/Opus at about 96–128 kbps, loudness-normalised (around −18 LUFS, matching the procedural tracks).

## 4. Things never to use
Temple logos or seals (including TTD's), photographs of specific temple murtis, live darshan feeds, film devotional songs, other platforms' artwork, and fonts without a web/commercial licence.
