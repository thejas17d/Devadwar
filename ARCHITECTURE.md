# Architecture

## 1. Audit (starting point)

No devotional project existed on the machine (searched `Desktop`, `Desktop/Dev`, `Documents`, `OneDrive`), so this is a new project at `Desktop/Dev/Devadwar` with its own git repository. Nothing existing was overwritten.

## 2. Stack — and what was deliberately left out

| Choice | Why |
|---|---|
| **Next.js 16 (App Router) + React 19 + TypeScript** | Static generation for fast QR-scan first loads, plus server route handlers that a real payment gateway needs (order creation, signature verification, webhooks) without a second backend. |
| **Tailwind CSS 4** + a small hand-written design layer (`globals.css`) | Utilities for layout; ornate, reusable classes (`.btn-gold`, `.ornate`, `.parchment`, `.niche`, flames, curtains) for the visual language. |
| **SVG + CSS 3D + one Canvas 2D layer** for visuals | The gate doors are CSS 3D transforms; art is SVG (crisp at any DPI, tiny); flames/particles use Canvas 2D with DPR caps. |
| **Web Audio API** — custom engine, no library | Procedural synthesis means zero audio download and zero licence risk. |
| ❌ **Three.js / React Three Fiber** — *not used* | ~600 KB+ runtime and GPU cost on average Android phones, for scenes that don't need true 3D. Revisit only if commissioned 3D murtis arrive (as glTF + Draco, lazy-loaded on the experience page only). |
| ❌ **Framer Motion** — *not used* | Every transition here is CSS / requestAnimationFrame. Saves ~45 KB gzip on mobile. |
| ❌ Analytics / tracking scripts | None. If ever added, they must be privacy-preserving and can never receive Sankalp content. |

## 3. Structure

```
src/
  app/                       routes (App Router)
    page.tsx, HomeClient     celestial gateway
    deities/                 gallery + [slug] deity environment & package selection
    checkout/                confirmation + demo payment sheet
    experience/              full-screen darshan / aarti / sankalp
    complete/                closing screen
    about|contact|privacy|terms|refunds|disclaimer|grievance   legal drafts
    api/orders               POST create (demo) order — price from config
    api/payments/demo/confirm  POST simulate payment → signed demo receipt
    api/receipts/verify      POST verify receipt signature
    api/payments/webhook     disabled (501) — documented for go-live
  config/
    brand.ts                 brand + legal placeholders (single source)
    packages.ts              prices, features, capabilities, aarti pattern
  content/
    deities/*.json           one file per deity (validated)
    audio/tracks.json        audio rights manifest
  components/
    audio/                   AudioProvider (React state, prefs), AudioControls
    gateway/                 Gateway (pillars, torana, doors)
    deity/                   emblems (10 original SVG emblems), Shrine, DeityBackdrop, DeityArt
    experience/              AartiStage, FlameCanvas, AartiThali, SankalpRitual, PrayerBox
    visual/                  ParticleField, Clouds, Flame/Diya, Petals
    layout/                  SiteFooter, LegalPage
  lib/
    audio/instruments.ts     synthesised instruments
    audio/composer.ts        raga-aware generative composer + look-ahead scheduler
    audio/engine.ts          AudioContext, buses, crossfades, SFX
    aarti/gesture.ts         pure clockwise-circle tracking (unit tested)
    payments/                types, server signing (demo), gateway signature helpers, client session
    content.ts, validate.ts  content loading + validation
tests/
  unit/                      Vitest: core logic + offline audio rendering
  e2e/                       Playwright: journeys on 3 device profiles
  visual/                    screenshot + hydration tools
```

## 4. User journey & state

```
/  ──Enter──▶ /deities ──▶ /deities/[slug] ──choose pkg──▶ /checkout?deity&package
                                                            │  POST /api/orders (server prices it, HMAC-signs)
                                                            │  demo sheet → POST /api/payments/demo/confirm
                                                            ▼  signed receipt → sessionStorage
                                                       /experience  (verifies receipt with server)
                                                            curtain → [Sankalp] → darshan ⇄ aarti
                                                            Conclude ▶ clear session ▶ /complete
```

- **Selection** travels in the URL (shareable, survives refresh).
- **Receipt** (deity, package, demo ids, signature) lives in `sessionStorage` for the active visit only, cleared on *Conclude*.
- **Sankalp text** lives only in `SankalpRitual` component state. It is not sent to any API, not written to any storage, not logged, and is discarded as soon as it is "placed" in the box. Tests assert this (network interception + storage inspection + static source scan).
- **No timers end the experience.** The screen wake-lock is requested so long darshans aren't interrupted on phones.

## 5. Audio architecture

```
Composition (per track) ──▶ track gain (crossfade) ──▶ music bus ─┐
SFX (bells, gong, shankha) ─────────────────────────▶ sfx bus  ─┤
            └──────── sends ──▶ Convolver reverb (generated IR) ─┤
                                                     master ──▶ compressor ──▶ speakers
```

- The `AudioContext` is created **only inside a user gesture** (Enter / Enable sound / Open the curtain). Returning visitors who previously opted in start on their *first* tap, never on load. A Playwright test counts AudioContext constructions to prove this.
- Independent **music** and **effects** switches, volume, mute, play/pause and a per-deity track list; preferences in `localStorage`.
- Tab hidden → context suspended (battery); visible → resumed.
- iOS: `navigator.audioSession.type = "playback"` where supported so sound plays with the ringer switch off.
- **Instruments** (`instruments.ts`): Karplus–Strong tanpura (with jawari-like emphasis) and veena (with meend/gamaka via playbackRate automation), bansuri (sine core + breath noise + delayed vibrato), nadaswaram, shankha (conch), temple bell / ghanti / manjira (inharmonic partials), tabla bols, damaru, dholak, dhak, drone pad.
- **Composer** (`composer.ts`): seeded random-walk melodies over the raga's pitch-set that resolve on Sa/Pa; tanpura cycle; percussion thekas; bell layer; styles `celestial`, `ambient`, `mantra`, `aarti`. A look-ahead scheduler keeps timing tight; `start(at, false)` + `scheduleUntil(t)` render offline (used by tests; could export WAV/MP3 later).
- Each deity has three tracks (Darshan ambience, Mantra meditation, Aarti) in a characteristic raga: Shiva — Shivaranjani + damaru; Ganesha — Hamsadhwani + tabla; Krishna — Pahadi on bansuri; Vishnu — Kalyani on veena; Venkateswara — Mohanam with veena/nadaswaram; Durga — raga Durga + dhak + shankha; Hanuman — Jog + dholak; Lakshmi — Bhimpalasi; Saraswati — raga Saraswati on veena; Rama — Desh.
- The watched/interactive Aarti switches the soundscape to the deity's Aarti track and layers interaction bells (quarter-turn ghanti, round-complete temple bell).

## 6. Animation strategy

- CSS transforms/opacity only for big moves (door swing, zoom-through, curtain, parchment roll) → GPU-composited.
- One Canvas 2D for stars/motes per screen (DPR ≤ 1.5, counts scaled to screen area, paused off-screen / hidden tab).
- Aarti flame: Canvas 2D at the lamp position — layered bezier flames that **lean against the direction of motion**, embers, a short light trail; DPR and particle caps lowered on ≤4-core devices. The lamp is moved by writing `transform` directly in rAF (no React re-render per frame).
- `prefers-reduced-motion`: animations collapse, canvases render a still frame, petals disabled.
- Trig-derived SVG coordinates are rounded (`lib/num.ts`) so server and client render identical markup (no hydration mismatches).

## 7. Interactive Aarti

- Pointer Events with pointer capture + `touch-action: none` → identical on mouse, touch and pen; no page scroll while offering.
- The flame is positioned ~40 px above the finger so the finger never hides it.
- `lib/aarti/gesture.ts`: accumulates **clockwise** angular travel around the shrine centre; ignores counter-clockwise movement (no penalty), jitter near the centre and teleport jumps. 7 circles (configurable `aartiConfig.interactiveRounds`).
- **Accessible alternative:** "Offer a circle for me" animates one circle per tap (keyboard and switch-access friendly); progress is exposed as an ARIA progressbar and live text.
- Watched Aarti follows the widely taught pattern (feet ×4, navel ×2, face ×1, whole form ×7), configurable in `aartiConfig.watchedSequence`.

## 8. Payments

### Now: demo mode (`PAYMENT_MODE=demo`)
- `POST /api/orders` validates deity + package, takes the **amount from config**, returns an order HMAC-signed with `DEMO_SIGNING_SECRET`.
- `POST /api/payments/demo/confirm` verifies the signature, re-checks the current price and a 30-minute expiry, and returns a signed receipt with `status: "demo_completed"`. Tampered amounts/packages are rejected (unit + e2e tested).
- The UI states "DEMO MODE — no real payment is taken" on the page **and** in the payment sheet.

### Go-live checklist (requires your approval — not done)
1. Choose an RBI-authorised payment aggregator (e.g. Razorpay, Cashfree, PayU); complete KYC for the legal entity.
2. Add a database (e.g. Postgres) with `orders` and `payments` tables (status machine: `created → attempted → paid | failed | refunded`), idempotency on gateway event id.
3. `POST /api/orders`: create the gateway order server-side with the config amount; persist it.
4. Client: open the gateway checkout with the **order id only** (key id is public; secret stays server-side). Add the gateway's checkout origin to the CSP in `next.config.ts`.
5. `POST /api/payments/verify`: verify the payment signature server-side (`verifyGatewayPaymentSignature`, already implemented + tested) before issuing a receipt.
6. `/api/payments/webhook`: read the **raw body**, verify with `verifyGatewayWebhookSignature` (implemented + tested), then mark paid. Treat the webhook as the source of truth.
7. Replace the demo receipt with a server-issued, short-lived signed token tied to the order record.
8. GST invoicing, refund API, reconciliation; update Terms/Refunds/Privacy; lawyer + CA review.

## 9. Security

- Secrets only in server env (`.env.example`); nothing secret uses `NEXT_PUBLIC_`.
- Security headers + CSP in `next.config.ts` (`frame-ancestors 'none'`, no third-party origins, `Permissions-Policy` denies camera/mic/geo/payment).
- API input: content-type check, 4 KB body cap, strict id validation against config (including prototype-key safety), `Cache-Control: no-store`.
- HMAC comparisons use `timingSafeEqual`.
- Sankalp input sanitised (control and bidi-override characters stripped, length capped) and rendered as text only.
- Content files validated on load; artwork paths constrained to `/deities/`.
- Error page never renders error details.

## 10. Performance (mobile first)

- All pages statically generated except checkout/complete/API; deity pages pre-rendered.
- Fonts self-hosted via `next/font` with `display: swap`; four families including Devanagari.
- No image downloads for the art (SVG); no audio downloads (procedural).
- Canvas/particle budgets scale with screen size and device cores; animation loops pause when hidden.

### Low-end device optimisation (measured)
Measured with `node tests/visual/lowend.mjs` (Pixel 7 viewport, **6× CPU throttle** — Chrome DevTools' low-end-mobile simulation):

| Screen | Before | After |
|---|---|---|
| Gateway | 28 fps | 52 fps |
| Gallery | 27 fps | 58 fps |
| Deity page | 25 fps | 55 fps |
| Darshan | 18 fps | 44 fps |
| Interactive Aarti (dragging) | 6–9 fps | 48 fps |

What changed, and the rules to keep:
1. **Never call `getBoundingClientRect()` in a per-frame loop** after writing styles. That forces a synchronous layout. Aarti geometry is cached and invalidated on resize.
2. **No per-frame gradient creation on canvas.** Glows, trails and the flame body are pre-rendered sprites (`lib/sprites.ts`, `FlameCanvas`); lean and flicker are applied with transforms.
3. **No `backdrop-filter` over animated content.** It re-blurs every frame. Use opaque backgrounds instead.
4. **No `mix-blend-mode` / `filter` on continuously animated elements** (the CSS diya flames).
5. Ambient particles are capped at 30 fps. The zooming gateway layer is promoted with `will-change` only during the transition.

## 11. Testing

- **Unit (Vitest):** pricing config, outcome-claim copy guard, gesture maths, payment signing/tamper/expiry, gateway signature helpers, content + rights validation, uncleared-track refusal, Sankalp sanitisation, static privacy scan, and offline-rendered audio for all 32 procedural tracks (audible, no NaN, no clipping).
- **E2E (Playwright):** desktop Chrome, Android Chrome (Pixel 7), iPhone WebKit — no-autoplay, gateway → gallery, prices, deity switching, 404s, unticked acknowledgement, API tamper rejection, each package's capabilities, watched Aarti, interactive Aarti by drag and by accessible taps, Sankalp privacy (network + storage), skip, conclude clears session, no horizontal scroll, legal draft banners.

## 12. Future backend needs

Payments (above), optional accounts (saved favourites, reminders — with explicit consent), a CMS for deities/festivals/audio with a rights-approval step, privacy-preserving aggregate analytics (no Sankalp, no fingerprinting), transactional email for receipts, and an admin view for grievance tracking (48-hour acknowledgement SLA).
