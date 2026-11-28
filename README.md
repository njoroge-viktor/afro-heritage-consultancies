# Afro Heritage Consultancies (AHC) website

**Touching Minds, Educating Hearts.** The website for a Kenyan community education organization in Ngong. Visitors browse programs and events, see schedules, fees and seats left, and send an enrollment request in under two minutes. It is a **fully static site with no backend**: all data comes from `public/db.json`.

- **Frontend:** React (JSX) + Vite + React Router
- **Styling:** Tailwind CSS v4 (prefixed `tw:`) + Bootstrap 5.3 components
- **Icons:** Bootstrap Icons + Font Awesome (icon fonts)
- **Data:** `public/db.json`, read in the browser. No server, no API.

## Styling: Tailwind + Bootstrap together

- **Tailwind classes all start with `tw:`** (`tw:flex`, `tw:hover:bg-rust`, `tw:md:grid-cols-3`), so they never collide with Bootstrap class names. Write new Tailwind classes the same way.
- **Bootstrap** is loaded from SCSS (`src/styles/bootstrap.scss`) with only the parts the site uses: root variables, accordion, carousel, offcanvas, tooltip, close button, helpers and utilities. Bootstrap's Reboot is left out on purpose. It is placed in a CSS cascade layer, `@layer theme, base, bootstrap, components, utilities`, so Tailwind utilities override Bootstrap and Bootstrap components keep their own padding. Bootstrap JS (`bootstrap` + Popper) powers the mobile offcanvas menu, the "Life at AHC" carousel, the FAQ accordion and tooltips.
- **Icons:** `src/components/icons.jsx` maps names like `IcClock` to `<i class="bi bi-clock">` or `<i class="fa-brands fa-whatsapp">`. Add new icons there.
- **Dark / light mode:** the toggle in the navbar sets `data-theme` and `data-bs-theme` on `<html>` and remembers the choice in `localStorage` (`ahc-theme`). The default follows the device setting. Colours are CSS variables in `src/index.css` (`--ahc-*`), so most components switch automatically. Use `tw:dark:` for one-off dark styles. `night`, `paper` and `leaf` are fixed colours for areas that stay dark in both themes (footer, coworking panel).
- **Motion:** add `data-reveal` (or `data-reveal="left" | "right" | "zoom"`) to any element to slide it in on scroll. Hover helpers in `index.css`: `lift`, `nudge` (sliding arrow), `icon-pop`, `zoom`, `link-slide`, `slide-right`, `shine`. Motion switches off when the visitor has reduced motion turned on.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
npm run preview    # serve the production build locally
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home: program areas, featured programs, upcoming events, coworking space |
| `/programs` | Catalogue filtered by Education / Digital / Community, with search |
| `/programs/:slug` | Audience, schedule, duration, fee, seats left + enrollment form |
| `/events` | Upcoming and past events (hikes, photo walks, workshops, intakes) |
| `/past-papers` | Free downloads of revision papers, with search and filters |
| `/enroll` | Enrollment request (`?program=<slug>` or `?event=<id>` preselects) |
| `/contact` | Contact form, WhatsApp, phone, map |
| `/about` | About AHC + privacy note |
| `/admin` | Staff dashboard (passcode) |

## How data works (no backend)

All content lives in **`public/db.json`** with four collections: `programs`, `events`, `enrollments` and `messages`. The site fetches it like any other static file. `src/lib/api.js` answers the same queries json-server used to (`?active=true`, `_sort`, `_order`, `_limit`, `field_gte`), entirely in the browser.

A static file can't be written to, so:

| Action | Where it goes |
| --- | --- |
| A visitor sends an **enrollment request** or **contact message** | The form builds a WhatsApp message to AHC (+254 117 455 148) with all the details. Tapping **Send on WhatsApp** is what delivers it. A copy is also kept in that visitor's browser. |
| Staff **log a request** that arrived on WhatsApp/phone, change its status, add notes | Saved in that staff member's browser (`localStorage`) |
| Staff **add or edit programs/events** | Saved in that browser until published (see below) |

**To publish program/event changes:** Admin → **Export db.json** → replace `public/db.json` in the repo with the downloaded file → commit and redeploy. If `db.json` changes on the site, any older, unexported program/event edits in a browser are dropped so the published file always wins.

**Moving data between computers:** Export db.json on one, then **Import** it on the other. **Discard local changes** returns a browser to the published file.

**The fees, schedules and seat numbers in `db.json` are placeholders.** Replace them with AHC's real details. The coworking space details and the "Raise Smart, Raise Safe" workshop come from AHC's flyers.

## Photos and video

The client's photos and testimonial video are in `public/images/site/`, with `images-manifest.json` (size, placement and alt text for each file) as the source of truth. `src/lib/media.js` reads the manifest; `src/components/media.jsx` has `<Photo name="…">` (WebP with JPEG fallback, width/height and alt from the manifest, lazy unless `priority`) and `<TestimonialVideo>`.

- The photos are already sized, colour-corrected and **watermarked in the bottom-right corner**. Don't re-crop, re-colour or re-compress them, and keep overlays and text out of the bottom-right ~20%. When a photo is shown in a different shape, use the `KEEP_WATERMARK` positions in `media.js` so the corner stays in frame.
- Photos listed in `UNCONFIRMED` (in `media.js`) show only on the dev server, with an "Awaiting client confirmation" badge. Remove a photo from that list once the client confirms who is in it and the caption.
- Still needed from the client (search for `TODO(client)`): the Director's name and bio, the partner's and volunteer's names and consent, the graduate's identity, and impact figures for the book-donation section (`IMPACT`).

## Past papers

The documents are in `public/papers/<subject>/<form>/` and the catalogue is `public/papers.json` (it is separate from `db.json`, so admin export/import never touches it). To add one:

1. Put the file in the right folder, with a lowercase-and-hyphens name. Keep it small, since learners download on mobile data.
2. Add an entry to `public/papers.json` with a new `id`: `title`, `subject`, `level` (`Form 1` … `Form 4` or `Form 1–4`), `type` (`exam`, `questions`, `answers` or `notes`), `credit` (author or school, or `""`), `file`, `format`, `bytes` and `pages` (PDF page count, otherwise `null`). New subjects appear in the filter automatically.

Only add material AHC wrote or has permission to share. Leave out textbooks, KNEC papers, and anything with a copyright notice, publisher, website, school or author's name unless the owner has agreed. Papers waiting for permission can be kept in `held-papers/`, which Git ignores.

## Admin

Open `/admin` (also linked as "Staff login" in the footer). The default passcode is `ahc-admin`. To change it, set `VITE_ADMIN_PASSCODE` in a `.env` file (see `.env.example`) or in Netlify's environment variables, then rebuild.

The dashboard has:

- **Stats** that track the MVP success measures: requests in the last 8 weeks against the goal of 30, new requests, requests overdue (more than 24 h without a reply) and average first-response time. They count the requests logged in that browser.
- **Enrollment requests:** log WhatsApp/phone requests; filter, search, move each one *new → contacted → enrolled*, add notes, call or WhatsApp in one click, delete, export to CSV. Marking a request *enrolled* reduces that program's seats left (in that browser; export db.json to publish it).
- **Messages**, and **Programs and Events** (add, edit, hide/show, delete).
- **Export / Import db.json** and **Discard local changes.**

> ⚠️ The passcode only hides the dashboard; it is checked in the browser and is visible in the built JavaScript. That's acceptable here because there's no server holding private data: anything staff record stays in their own browser. Don't put private learner details into `public/db.json`, because everyone can read that file.

## Deploying (Netlify)

Connect the repo in Netlify. `netlify.toml` builds with `npm run build` and publishes `dist/`. `public/_redirects` sends every route to the React app, while static files like `/db.json` are still served directly. No environment variables are required (optionally set `VITE_ADMIN_PASSCODE`).

When you're ready to receive requests directly instead of over WhatsApp (for example with Netlify Forms, Netlify Functions + Blobs, or a hosted database), only `src/lib/api.js` and the two forms need to change.

## Out of scope (later phases)

M-Pesa payments, learner accounts, online classes/LMS, SMS reminders, blog.
