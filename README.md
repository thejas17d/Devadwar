# Devadwar — Digital Devotional Experience (MVP)

> **Working name.** "Devadwar" (देवद्वार, *Gateway of the Divine*) is a placeholder brand. Change it in one place: `src/config/brand.ts`. See `docs/BRANDING.md` for 20 evaluated alternatives.

An immersive, mobile-first devotional website: enter through a celestial gateway, choose a deity, hear that deity's own soundscape, choose a digital experience, optionally write a private Sankalp, and spend as long as you wish in a full-screen digital darshan, watched Aarti or **interactive Aarti** where you guide the lamp yourself.

This is an **independent digital devotional product**. It does not represent any temple, offer temple entry, priest-performed sevas, donations, or promise spiritual outcomes.

---

## Status at a glance

| Area | State |
|---|---|
| Celestial gateway, gallery, 10 deity environments | ✅ Built |
| Deity-specific music (30 tracks + 2 site tracks) | ✅ Original procedural compositions — no licence dependencies |
| ₹10 Darshan · ₹20 Darshan + Aarti · ₹30 Interactive Aarti | ✅ Built; prices in `src/config/packages.ts` |
| Private Sankalp + symbolic Prayer Box | ✅ Built; text never leaves the browser tab |
| Checkout | ✅ **DEMO ONLY** — no money moves; live gateway deliberately not enabled |
| Legal pages | ⚠️ Drafts — **must be reviewed by an Indian lawyer before launch** |
| Deity artwork | ⚠️ Original *symbolic emblems* as placeholders — commission final art (see `ASSET_LICENCES.md`) |
| Recorded mantras / human-performed music | ⚠️ Not included — slots + rights workflow ready |

---

## Run locally

Requirements: Node.js 20+ (tested on Node 26), npm.

```bash
npm install
cp .env.example .env.local        # then set DEMO_SIGNING_SECRET to a long random string
npm run dev                       # http://localhost:3000
```

Production build:

```bash
npm run build
npm start                         # http://localhost:3000
```

### Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) |
| `npm test` | Unit tests (Vitest) — pricing, gesture maths, payment signing, content validation, privacy checks, **offline-rendered audio level checks for every soundscape** |
| `npm run test:e2e` | End-to-end tests (Playwright) on desktop Chrome, Android Chrome (Pixel 7) and iPhone WebKit. Run `npm run build` first. First time: `npx playwright install webkit` |
| `node tests/visual/shots.mjs shots all` | Screenshots of every screen into `./shots` (needs a server on port 3123) |
| `node tests/visual/lowend.mjs` | Frame rate of every heavy screen on a simulated low-end phone (6× CPU throttle; server on 3123) |

---

## Configuration — no code changes needed

### Change the brand name / contact details
`src/config/brand.ts` — name, Devanagari name, tagline, intro, legal entity, support email, grievance officer, closing messages. Every page reads from here.

### Change prices or package contents
`src/config/packages.ts` — `pricePaise` (₹1 = 100 paise), name, tagline, features, `available`, capabilities. The server recomputes the amount from this file for every order; the browser never sends a price.

Rules baked into the tests: exactly three launch packages; copy may not contain outcome guarantees or link price to blessings.

### Add a deity
1. Copy `src/content/deities/shiva.json` to `src/content/deities/<slug>.json` and edit the text, mantra, theme colours and `theme.motif` (one of `kailash`, `temple-hall`, `ocean`, `vrindavan`, `sunrise`, `lotus-pond`, `river`, `hills`).
2. Artwork: put a licensed/commissioned image at `public/deities/<slug>/murti.webp` and set `"art": { "image": "/deities/<slug>/murti.webp", ... }`. Without an image, a respectful generic emblem (lotus + glow) is shown until one is drawn.
3. Audio (optional): add tracks with `"deity": "<slug>"` to `src/content/audio/tracks.json`. Without tracks, the gallery soundscape is used.
4. Restart/redeploy. Invalid files are skipped with a console error rather than breaking the site; `npm test` validates every file.

> Note: the site reads content at build/start time. Adding a deity is a *data-only* change, but it still needs a redeploy. Truly live editing needs a CMS — see `FUTURE_FEATURES.md`.

### Add or replace music
`src/content/audio/tracks.json`. Each track records `creator`, `rightsHolder`, `licence`, `usage` and `cleared`.
- **Procedural** tracks (`source.type: "procedural"`) are composed live from parameters: raga pitch-set, tonic, tempo, lead instrument (`bansuri`, `veena`, `nadaswaram`), percussion (`tabla`, `damaru`, `dholak`, `dhak`), bells, conch, seed. Change the numbers, get a new composition.
- **Recorded** tracks (`source.type: "file"`) point to `/public/audio/...`. **The player refuses any track with `cleared: false`**, and uncleared tracks are not even sent to the browser. Only set `cleared: true` once a written licence is on file (see `ASSET_LICENCES.md`).

---

## Deploying

This is a standard Next.js server app (it has API routes for orders/receipts), so deploy to a Node host — e.g. Vercel, Render, Railway, a VPS with `npm start` behind Nginx. **GitHub Pages / static hosting is not sufficient** once real payments exist (they require server-side order creation, signature verification and webhooks).

Set environment variables from `.env.example` on the host. Never commit `.env.local`.

Nothing has been pushed or deployed. Live payments are disabled by design (`PAYMENT_MODE=demo`) until you approve gateway onboarding — see `ARCHITECTURE.md › Payments`.

---

## Documentation

- `ARCHITECTURE.md` — stack decisions, structure, audio engine, animation, payments, security, performance, testing.
- `FUTURE_FEATURES.md` — research-based future catalogue (not approved; nothing here is built or priced for sale).
- `RESEARCH_NOTES.md` — sourced research: practices, deity sheets, sensitivities do-not-do list, Indian regulatory pointers.
- `ASSET_LICENCES.md` — every asset's origin and licence, plus the commissioning / licensing workflow.
- `docs/BRANDING.md` — 20 brand-name candidates with evaluation.
