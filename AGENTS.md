# AGENTS.md

Static single-page wedding invitation for Mitchell & Reema (14 Nov 2026, Goa).

## Structure
- `public/index.html` — the whole page (hero, events, Our Story timeline, entourage, gallery, RSVP form). All event details live here.
- `public/styles.css` — styles; palette in CSS variables at the top (paper, ink, gold, rose, leaf).
- `public/main.js` — countdown (target 2026-11-14 16:00 IST) and AJAX RSVP submission.
- `public/music.js` — soft instrumental (Pachelbel's Canon, synthesised with Web Audio, no audio file); started by the floating "Play music" button since browsers block autoplay.
- `public/mitchell-reema-wedding.ics` — calendar file; keep in sync with event times in the HTML (times stored in UTC, IST = UTC+5:30).
- `public/img/church.png` — AI-generated watercolour; always reference it via `/.netlify/images?url=/img/church.png&w=…&fm=webp`.
- `public/img/couple.jpg`, `love-1..6.jpg` — placeholder Unsplash photos for the gallery until the couple sends their own; serve via Image CDN like church.png.
- `netlify.toml` — publishes `public/`, no build command.

## Conventions / decisions
- No framework or build step on purpose — keep it a static page.
- RSVP uses Netlify Forms (`name="rsvp"`, honeypot `bot-field`); the form must stay in static HTML for build-time detection. Forms were enabled via the netlify-forms skill's `enable.cjs`.
- Venue spelling "Pillar" follows the couple's wording.
- Day schedule ("How the day unfolds") lives in the events section: 3:30 arrival … 9:00 first dance. Reception starts 7 pm; the .ics has church 4:00–6:15 pm and reception 7 pm–midnight IST (end time assumed).
- Fonts: Pinyon Script (names/headings), Cormorant Garamond (body), Jost (small caps labels).
- The Our Story timeline uses placeholder wording until the couple sends real milestones/dates.
- Entourage surname is spelled "Fernanes" as supplied by the couple (unconfirmed).
