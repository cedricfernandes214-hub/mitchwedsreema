# Mitchell & Reema — Wedding Invitation

An online wedding invitation for Mitchell and Reema's wedding on **Saturday, 14 November 2026** in Goa.

- **Nuptial Mass:** 4:00 pm, St. Jerome's Church, Mapusa
- **Reception:** Joy & Celebration, Pillar

The page has a watercolour hero illustration, a live countdown, event cards with map links, a downloadable calendar file, and an RSVP form.

## Technologies

- Plain static HTML, CSS and JavaScript (no build step), published from `public/`
- Netlify Forms for RSVP collection (see submissions in the Netlify UI under **Forms → rsvp**)
- Netlify Image CDN for resizing the hero illustration (generated with Netlify AI Gateway)

## Running locally

```bash
netlify dev --port 8889
```

Or open `public/index.html` directly (RSVP submission and image CDN require Netlify).
