# Afro Heritage Consultancies (AHC) website

**Touching Minds, Educating Hearts.** The website for a Kenyan community education organization in Ngong. Visitors browse programs and events, see schedules, fees and seats left, and send an enrollment request in under two minutes. AHC staff manage every request from one admin page.

- **Frontend:** React (JSX) + Vite + React Router
- **Styling:** Tailwind CSS v4 (prefixed `tw:`) + Bootstrap 5.3 components
- **Icons:** Bootstrap Icons + Font Awesome (icon fonts)
- **Backend:** [json-server](https://github.com/typicode/json-server) 0.17 serving `db.json`

## Styling: Tailwind + Bootstrap together

- **Tailwind classes all start with `tw:`** (`tw:flex`, `tw:hover:bg-rust`, `tw:md:grid-cols-3`), so they never collide with Bootstrap class names. Write new Tailwind classes the same way.
- **Bootstrap** is loaded from SCSS (`src/styles/bootstrap.scss`) with only the parts the site uses: root variables, accordion, carousel, offcanvas, tooltip, close button, helpers and utilities. Bootstrap's Reboot is left out on purpose. It is placed in a CSS cascade layer, `@layer theme, base, bootstrap, components, utilities`, so Tailwind utilities override Bootstrap and Bootstrap components keep their own padding. Bootstrap JS (`bootstrap` + Popper) powers the mobile offcanvas menu, the "Life at AHC" carousel, the FAQ accordion and tooltips.
- **Icons:** `src/components/icons.jsx` maps names like `IcClock` to `<i class="bi bi-clock">` or `<i class="fa-brands fa-whatsapp">`. Add new icons there.
- **Dark / light mode:** the toggle in the navbar sets `data-theme` and `data-bs-theme` on `<html>` and remembers the choice in `localStorage` (`ahc-theme`). The default follows the device setting. Colours are CSS variables in `src/index.css` (`--ahc-*`), so most components switch automatically. Use `tw:dark:` for one-off dark styles. `night`, `paper` and `leaf` are fixed colours for areas that stay dark in both themes (footer, coworking panel).
- **Motion:** add `data-reveal` (or `data-reveal="left" | "right" | "zoom"`) to any element to slide it in on scroll. Hover helpers in `index.css`: `lift`, `nudge` (sliding arrow), `icon-pop`, `zoom`, `link-slide`, `slide-right`, `shine`. Motion switches off when the visitor has reduced motion turned on.

## Run it

```bash
npm install
npm run dev          # starts json-server (http://localhost:3001) and the site (http://localhost:5173)
```

| Script | What it does |
| --- | --- |
| `npm run dev` | API + website together |
| `npm run server` | json-server only (`db.json` on port 3001) |
| `npm run client` | Vite only (proxies `/api` → port 3001) |
| `npm run build` | Production build into `dist/` |
| `npm run reset-db` | Restore `db.json` from `db.seed.json` (wipes requests and messages) |

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home: program areas, featured programs, upcoming events, coworking space |
| `/programs` | Catalogue filtered by Education / Digital / Community, with search |
| `/programs/:slug` | Audience, schedule, duration, fee, seats left + enrollment form |
| `/events` | Upcoming and past events (hikes, photo walks, workshops, intakes) |
| `/enroll` | Enrollment request (`?program=<slug>` or `?event=<id>` preselects) |
| `/contact` | Contact form, WhatsApp, phone, map |
| `/about` | About AHC + privacy note |
| `/admin` | Staff dashboard (passcode) |

## Admin

Open `/admin` (also linked as "Staff login" in the footer). The default passcode is `ahc-admin`. To change it, set `VITE_ADMIN_PASSCODE` in a `.env` file:

```
VITE_ADMIN_PASSCODE=choose-something-long
```

The dashboard has:

- **Stats** that track the MVP success measures: requests in the last 8 weeks against the goal of 30, new requests, requests overdue (more than 24 h without a reply) and average first-response time.
- **Enrollment requests:** filter by status or program, search, move each request *new → contacted → enrolled*, add notes, call or WhatsApp with one click, delete, export to CSV. Marking a request *enrolled* reduces that program's seats left.
- **Messages:** read/unread, reply by WhatsApp or email.
- **Programs and Events:** add, edit, hide/show and delete.

> ⚠️ The passcode is only checked in the browser, and json-server has no authentication. Anyone who knows the API URL can read or change `db.json`. Put real authentication in front of the API before you publish real learner data.

## Data (`db.json`)

Collections: `programs`, `events`, `enrollments`, `messages`. `db.seed.json` is the clean starting copy.

**The fees, schedules and seat numbers in the seed data are placeholders.** Replace them with AHC's real details in the admin page or in `db.seed.json`. The coworking space details and the "Raise Smart, Raise Safe" workshop come from AHC's flyers.

json-server is started with `--fks _fk`, so deleting a program or event does **not** cascade-delete the enrollment requests that point to it.

## Deploying

Netlify only hosts the built React site (`netlify.toml` and `public/_redirects` are included). It cannot run json-server, so host the API somewhere that runs Node (for example Render or Railway: `npx json-server db.json --port $PORT --fks _fk`), then set this in Netlify's environment variables:

```
VITE_API_URL=https://your-api-host.example.com
```

Use a host with a persistent disk, or move the data to a real database later, so requests aren't lost when the server restarts.

## Out of scope (later phases)

M-Pesa payments, learner accounts, online classes/LMS, SMS reminders, blog.
