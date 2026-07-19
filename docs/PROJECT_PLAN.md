# MD Farukuzzaman Faruk — Personal Research Portfolio: End-to-End Build Plan

_This is the living copy of the approved implementation plan. See `PROGRESS_LOG.md` in
this same folder for the current state of the build._

## Context

Faruk is a PhD student in Computer Science (Deep Learning / Deep Learning Systems
Optimization) at the University of Louisiana at Lafayette. He needs a research-grade,
single-page, professionally-designed portfolio published for free on GitHub Pages, built
from source material already collected in `Resources/` (CV, Google Scholar publication
list, award/participation photos, professional links, ULL branding). The site must be
editable forever after (new publications, news, awards, photos) **without touching code**,
via a GUI.

**Decisions confirmed with the user:**
- Domain: **`farukuzzamanfaruk.github.io`** (verified available; `faruk`, `farukuzzaman`,
  `faaruk` are all taken by other people).
- Content-editing GUI: **Local Admin Panel** using the browser's File System Access API
  (no OAuth app, no server, no third-party account — Chrome/Edge only).
- Palette: **Navy & Slate + muted Teal accent** (off-white bg `#F8FAFC`, navy text/header
  `#0F172A`/`#0B1F3A`, teal accent `#0D9488`, slate-gray muted text `#475569`).
- Phone number: **omitted** from the public site (email + research/social links only).

## Content Inventory (extracted from `Resources/`)

- **CV** (`CV_FARUK.pdf`): objective, 4 work-experience entries (7+ yrs teaching), 3
  education entries (PhD ongoing/MSc/BSc with thesis titles + supervisors), skills
  (C/C++/Python/PHP/Java/JS, PyTorch/TensorFlow), 67 publications, 2 trainings/workshops,
  2 awards + merit scholarship, consultancy (Rajshahi WASA), 2 organizing-committee roles,
  supervision of 15+ theses, 2 management roles, 4 UGC-funded projects.
- **Google Scholar CSV** (67 rows): authoritative structured publication data
  (Authors, Title, Publication, Volume, Number, Pages, Year, Publisher).
- **Photos**: 1 profile headshot; 4 award/certificate images (IEEE Best Paper Award
  ICECTE 2019, VC Research Award FY2021-22, Foundation Training certificate, Award of
  Excellence ULL Spring 2026); 7 professional-participation photos (RUET convocation 2019,
  ULL orientation Fall 2025, Industry-Academia meet 2023, ICCIT 2022, ICECTE 2022/2023/2024,
  "Infront of ULL Logo"). Filenames are the captions.
- **Links**: Google Scholar, ResearchGate, ORCID, LinkedIn, Facebook, RUET profile page,
  ULL supervisor (Dr. Li Chen) lab site, ULL email (`md-farukuzzaman.faruk1@louisiana.edu`).
- **ULL logo** (`ULL Logo.png`) for institutional branding.

## Site Architecture

**Stack:** Plain static HTML5/CSS3/vanilla JS — no framework, no build step. Content is
externalized into JSON files under `/data/`, fetched at runtime and rendered into the DOM.
This is the simplest thing that (a) deploys to GitHub Pages with zero CI, (b) lets the
admin panel edit content by writing plain JSON/image files with no rebuild required.

```
farukuzzamanfaruk.github.io/        (this folder is the git repo root)
├── index.html                      single-page site, anchor-nav sections
├── admin/
│   ├── index.html                  local admin panel (forms, File System Access API)
│   ├── admin.css
│   └── admin.js
├── assets/
│   ├── css/style.css                design system (CSS variables, components)
│   ├── js/main.js                   nav, scroll-spy, lightbox, mobile menu, dark mode
│   ├── js/data-loader.js            fetch()s /data/*.json, renders each section
│   ├── img/profile/, img/awards/, img/gallery/, img/logos/
│   └── cv/CV_FARUK.pdf
├── data/
│   ├── profile.json  education.json  experience.json  publications.json
│   ├── awards.json  gallery.json  projects.json  service.json
│   ├── skills.json  news.json
├── docs/
│   ├── PROJECT_PLAN.md             (this file)
│   └── PROGRESS_LOG.md             (running log of what's been done + next steps)
├── scripts/publish.ps1              helper: git add/commit/push in one command
├── .nojekyll                        disable Jekyll processing on GitHub Pages
├── .gitignore                       excludes Resources/ (raw source dump) from the repo
└── README.md                        how to run locally, edit content, publish
```

`Resources/` stays local only (`.gitignore`d) — it's raw source material; everything
needed for the live site is copied/cleaned into `assets/` and `data/`.

## Page Sections (single page, sticky clickable nav → smooth-scroll to anchors)

1. **Hero** — name, "PhD Student in Computer Science · Deep Learning & Systems
   Optimization", ULL + School of Computing & Informatics, profile photo, buttons
   (Download CV, Google Scholar, LinkedIn, Email).
2. **About / Objective** — CV objective statement verbatim.
3. **Research Interests** — DL, DL systems optimization, ML, LLMs, medical imaging;
   link to PhD supervisor Dr. Li Chen's lab site.
4. **Education** — timeline: PhD (ongoing, supervisor linked), MSc (thesis+supervisor,
   CGPA 3.92), BSc (thesis, CGPA 3.90, rank 3/106).
5. **Experience** — timeline: GTA (ULL, current), Assistant Professor (RUET), Lecturer
   (RUET), Lecturer (Varendra Univ.); "7+ years teaching" stat callout.
6. **Publications** — stat tiles (67 total, journal vs. conference count, Best Paper
   Award badge) + a small publications-per-year bar chart (built per the `dataviz` skill
   guidance to match the navy/teal palette) + searchable/filterable/sortable full list
   (client-side JS filter by year/keyword), his name bolded in each author string, the
   1x IEEE Bangladesh Section Best Paper Award entry (K-mer DNA Methylation, ICECTE 2019)
   flagged with a badge. Link out to full Google Scholar profile.
7. **Awards & Honors** — CV list (Best Paper Award, Merit Scholarship) merged with the
   4 award/certificate photos, one consistent card component (fixed aspect-ratio image,
   caption, date/org, lightbox on click) reused identically across every entry.
8. **Funded Projects** — 4 UGC-funded projects (role, dates, funding amount).
9. **Professional Service** — organizing-committee roles, consultancy, management
   (Deputy Director Students' Welfare; Assistant Provost), thesis supervision (15+).
10. **Gallery** — the 7 participation photos, same card/lightbox component as Awards.
11. **News / Updates** — chronological cards (PhD start Fall 2025, Award of Excellence
    Spring 2026, latest publications) — the section this site is built to make trivial
    to append to via the admin panel.
12. **Skills** — languages/frameworks/interpersonal, badge style.
13. **Contact / Footer** — ULL email + personal email, Scholar/ResearchGate/ORCID/
    LinkedIn/Facebook/RUET-profile icons, last-updated date (auto from `profile.json`).

## Data Schemas (`/data/*.json`) — drives both the site render and the admin forms

- `profile.json`: name, title, tagline, objective, emails{ull, personal}, socials{...},
  photoPath, cvPath, cvDriveLink (nullable — left empty until Faruk supplies it),
  lastUpdated.
- `publications.json`: array of `{id, authorsRaw, authorsHighlighted, title, venue,
  volume, number, pages, year, publisher, award|null}` — built from the CSV (authoritative
  structured fields), cross-checked against the CV text to set the one `award` flag.
- `education.json` / `experience.json`: array of `{period, role, org, location, detail,
  supervisor|null, supervisorLink|null}`.
- `awards.json` / `gallery.json`: array of `{image, caption, date|null, org|null}` — one
  shared renderer/card component for both, images resized/compressed on import.
- `projects.json`: array of `{name, role, duration, funding, funder, status}`.
- `service.json`: `{committees[], consultancy[], management[], supervision}`.
- `skills.json`: `{languages[], frameworks[], interpersonal[]}`.
- `news.json`: array of `{date, title, description, link|null}`, newest first.

## Local Admin Panel (`admin/index.html`)

- "Open Project Folder" → `window.showDirectoryPicker()` grants the browser one-time
  access to the repo folder (works from a `localhost` dev server **or** from the
  deployed `https://farukuzzamanfaruk.github.io/admin/` page itself — both are secure
  contexts; a double-clicked `file://` won't work, so README documents `npx serve .`
  or `python -m http.server` as the local option).
- Left-nav sections mirroring the JSON files above; each list-type section shows a
  table of existing entries with Edit/Delete, and an "+ Add" form matching that schema.
  Image-bearing entries include a file picker that copies the chosen file into the
  correct `assets/img/...` folder via the same File System Access handle.
- "Save" pretty-prints and writes straight back to `data/*.json` — no rebuild needed,
  since `data-loader.js` reads them at page-load time.
- A "Copy publish commands" button copies `git add -A && git commit -m "Update content" && git push`
  to the clipboard for convenience.
- Chromium-only by design (Faruk's own tool, not public-facing functionality); noted
  clearly in README.

## Implementation Phases

1. **Scaffolding** — `git init` this folder, `.gitignore` (excludes `Resources/`),
   create `docs/PROJECT_PLAN.md` + `docs/PROGRESS_LOG.md`, set up the dynamic task list.
2. **Content modeling** — build all `/data/*.json` from the CV + CSV + photo filenames;
   copy/resize/rename images into `assets/img/...`; copy CV PDF into `assets/cv/`.
3. **Design system** — `assets/css/style.css`: CSS variables for the palette, type scale
   (a serif/editorial heading font + clean sans body, via Google Fonts), timeline/card/
   badge/lightbox components, sticky nav with scroll-spy, responsive breakpoints, optional
   dark-mode via `prefers-color-scheme`.
4. **Markup + rendering** — `index.html` skeleton with section anchors;
   `assets/js/data-loader.js` (fetch + render each section) and `assets/js/main.js`
   (smooth-scroll nav, scroll-spy active link, mobile hamburger, lightbox, publications
   search/filter, dark-mode toggle). Publications-per-year chart built using the
   `dataviz` skill.
5. **Admin panel** — build `admin/index.html` + `admin.js` per the design above; test
   add/edit/delete on each content type end-to-end.
6. **Git & GitHub Pages publishing** — confirm the `farukuzzamanfaruk` GitHub account
   exists (Faruk creates it if not); create the `farukuzzamanfaruk.github.io` repo
   (empty, no auto-README); add remote, first commit, push to `main`; verify GitHub
   Pages serves it at `https://farukuzzamanfaruk.github.io/`.
7. **QA & polish** — mobile responsiveness, color-contrast (WCAG AA) check, alt text on
   every image (from captions), image compression pass, full proofread against the CV.
8. **Handover** — `README.md` (run locally / use admin panel / publish updates / add a
   new publication or news item); final `docs/PROGRESS_LOG.md` update with a
   known-follow-ups list (e.g., Google Drive CV link still blank — add anytime via the
   admin panel's `cvDriveLink` field).

## Verification

- Open `index.html` via a local static server and click through every nav item; confirm
  all 13 sections render from JSON with no console errors.
- Resize to mobile width; confirm nav collapses and all grids/timelines stack cleanly.
- Open `admin/index.html`, grant folder access, add a dummy news item and a dummy
  publication, confirm `data/news.json`/`data/publications.json` update on disk and the
  site reflects it on next load; delete the dummy entries.
- After publishing: load `https://farukuzzamanfaruk.github.io/` in a browser and confirm
  it matches the local version (CV download works, all external links resolve, images
  load, lightbox works).
