# Future Features — research-based catalogue

> **Status: proposals only.** Nothing here is built, priced for sale or approved. Per your instruction, **no additional paid products will be introduced without your approval.** Prices are *suggested experimental* ranges from your brief. Risk ratings and do-not-do rules come from `RESEARCH_NOTES.md` §4–§6.

Every future product keeps the MVP's rules: clearly digital and symbolic, no temple affiliation, no "performed on your behalf", no guaranteed outcomes, no link between price and blessings, and no countdowns or scarcity pressure.

## A. Devotional experiences (paid candidates)

| # | Concept | What the user does | Suggested price | Risk | Notes |
|---|---|---|---|---|---|
| 1 | **Mantra & Naam-Japa** | Count repetitions on a digital 108-bead mala with transliteration, meaning and pronunciation guidance; optional licensed chant | ₹10–₹20 | Low | Respect guru-bead logic (don't "cross" the sumeru bead). Pronunciation audio must be a licensed recording. Builds on the existing mantra overlay and audio engine. |
| 2 | **108 Names (Ashtottara) — Archana-inspired** | Read and listen to the deity's 108 names one by one, offering a flower per name | ₹20 | Low | Public-domain name lists, but verify the textual source and transliteration with a Sanskrit scholar. |
| 3 | **Abhishek-inspired visual** | A symbolic, artistic visual of water, milk and flowers over a generic emblem/linga | ₹30 | Medium | Never imply a real murti is being bathed or that a ritual is conducted. Avoid any identifiable temple murti. |
| 4 | **Morning Devotional (awakening)** | A dawn-themed experience: rising light, conch, morning raga (e.g. Bhairav), verses | ₹10–₹20 | Medium | Inspired by Suprabhatam traditions, but **do not use the name "Suprabhatam" in a way that evokes TTD's seva** and do not use TTD recordings. |
| 5 | **Festival experiences** | Dated environments for Diwali, Navratri (9 nights, one form per night), Janmashtami (midnight jhula), Maha Shivaratri (four-prahar vigil), Ganesh Chaturthi (ends in a respectful visarjan), Ram Navami, Hanuman Jayanti | ₹20–₹30 | Medium | Show "dates vary by region and panchang". 2027 dates in RESEARCH_NOTES §1.10 (some still to confirm). |
| 6 | **Katha reading** (e.g. Satyanarayan) | An illustrated, chaptered reading experience | TBD | Medium | It's a *reading*, not a puja performed for the user. |
| 7 | **Guided devotional reflection** | A verse, a short reflection and a private journal prompt | TBD / free | Low | Original writing; journal stays on device unless the user opts in. |
| ✗ | **"Kalyanotsavam"** | — | — | **High** | TTD sells an official virtual Kalyanotsavam. Not recommended; story format only, if at all. |

## B. Platform features (non-paid / enabling)

- **Commissioned deity artwork** (2D illustration or 3D murti as glTF). Drop-in via `art.image`; 3D would be lazy-loaded on the experience page only.
- **Licensed recordings**: mantras and human-performed instrumentals added as `file` tracks once cleared.
- **Languages**: Hindi, Tamil, Telugu, Kannada, Marathi, Bengali UI and deity text (i18n routes).
- **Saved preferences and favourites** (on device first; accounts only with explicit consent).
- **Optional reminders** for festivals or a daily darshan — opt-in only, easy unsubscribe, no guilt messaging.
- **"Revisit" without repurchase** within the same day (product decision needed).
- **PWA**: install to home screen, offline gateway and gallery.
- **CMS** for deities, festivals and audio, with a rights-approval gate (a track can't go live without a licence document).
- **Live payments** (see ARCHITECTURE §8) — requires your approval.
- **Privacy-preserving analytics** (aggregate page/step counts only; never Sankalp; no third-party trackers).
- **Gift a darshan** — needs careful copy so it never implies blessings are transferred for money.

## C. Ideas considered and rejected

- Leaderboards, streak shaming, or "unlock the god" gamification — disrespectful (RESEARCH_NOTES §4.5).
- Countdown "auspicious slots" or scarcity — dark patterns (CCPA 2023 guidelines).
- Sharing Sankalps publicly or a "wish wall" — conflicts with the privacy promise.
- Prasad or physical delivery — outside a digital product; implies ritual service.
