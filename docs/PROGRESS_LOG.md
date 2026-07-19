# Progress Log

Running log of what's been done on the portfolio build. Newest entries at the top.
See `PROJECT_PLAN.md` in this folder for the full plan and architecture.

---

## 2026-07-19 — Post-launch corrections (round 2)

- **Publications ordering, take two**: round 1's authorship-first sort
  meant the 10-item preview never showed recent papers (Faruk is rarely
  first author on the newer collaborative work), so the user asked for
  latest-year visibility back. Swapped the sort key to
  `(year desc, authorPosition asc)` — preview now always leads with the
  newest year, author position only breaks ties within a year. Added a
  small "First Author" badge on qualifying papers so that signal is still
  visible even when they're not at the top of the list.
- **Justified prose paragraphs** site-wide (`text-align: justify` +
  `hyphens: auto` + `text-align-last: left`): the About/Objective text,
  section intro paragraphs, hero tagline/role, supervisor blurb, news
  descriptions, footer tagline, timeline detail lines, and media
  (award/gallery) captions. Deliberately left citation-style text
  (publication title/authors/venue) and bulleted lists ragged-right —
  standard convention for those, and justify tends to look worse on
  irregular short segments like semicolon-separated author lists.
  Verified at both desktop and mobile widths — hyphenation keeps it
  clean, no visible gap artifacts.
- Also removed a dead/invalid CSS rule left over from earlier editing.

---

## 2026-07-19 — Post-launch corrections (round 1)

User-requested fixes after reviewing the live site:

- Added a standalone **CV** pill to the nav bar (opens the PDF in a new
  tab) so it's findable at a glance, without scrolling.
- Renamed the hero's "Download CV" button to **"View CV"**.
- **Publications default ordering changed**: `build_publications.py` now
  computes an `authorPosition` field (his index in the author list) and
  sorts by `(authorPosition asc, year desc)` instead of pure year-desc.
  His 5 first-author papers (including the Best Paper Award winner) now
  lead the list, then 2nd-author papers newest-first, etc. — this is what
  shows in the 10-item preview before "show all".
- **Awards & Honors**: removed the "University Merit Scholarship" entry;
  reordered the remaining 4 latest-first (Award of Excellence 2026 → VC
  Research Award FY21-22 → Foundation Training 2020 → IEEE Best Paper
  2019).
- **Funded Projects**: marked the fake-news GRU project "Completed",
  duration set to "July 2024 – June 2025" (was "Ongoing").
- **Gallery**: shortened the ULL-campus photo's caption (was redundantly
  repeating "University of Louisiana at Lafayette" in both the org line
  and the caption).
- **News & Updates**: moved the Spring 2026 Award of Excellence entry to
  the top (was 2nd).
- **Service**: fixed `trainingWorkshops` order in `service.json` — the
  2020 training was listed before the 2021 workshop; swapped so latest is
  first, consistent with every other list on the site.
- Re-verified with Playwright (nav CV link/target, hero button text,
  publications preview order, awards/gallery/news order, project status) —
  all pass, 0 console errors, mobile nav still renders correctly with the
  added CV pill.

---

## 2026-07-19 — Phase 6: published live 🎉

- User created the GitHub account `farukuzzamanfaruk` and supplied a
  Personal Access Token (used once for auth, never persisted to memory or
  git config — see `[[github_portfolio_account]]` in the memory system for
  why, and for the non-secret account reference).
- Renamed local branch `master` → `main`, created the
  `farukuzzamanfaruk/farukuzzamanfaruk.github.io` repo via the GitHub API,
  pushed via a one-off authenticated URL (no token written to disk),
  added `origin` remote (no embedded credentials) with upstream tracking.
- GitHub Pages auto-enabled on push (source: `main` branch, `/` root).
  First build took a few minutes (normal for a brand-new account/domain).
- **Verified live**: https://farukuzzamanfaruk.github.io/ returns 200,
  renders identically to local testing (checked with Playwright — 0
  console errors), CV PDF and admin panel both resolve, `data/*.json`
  fetches correctly.
- The portfolio is live and fully editable going forward via
  `admin/index.html` (works both locally and directly from the published
  `/admin/` URL, per the design).

---

## 2026-07-19 — Phases 3–8: site built, tested, and ready to publish

- Built the full single-page site (`index.html`, `assets/css/style.css`,
  `assets/js/data-loader.js`, `assets/js/main.js`): all 13 sections render
  client-side from `data/*.json`, sticky nav with scroll-spy, dark mode
  (OS-preference default + manual toggle, persisted), lightbox gallery,
  publications search/filter/pagination, and a publications-per-year bar
  chart (built per the `dataviz` skill's method — single-hue accent color,
  hover tooltips, sparing direct labels, hairline gridlines).
- Built the local admin panel (`admin/index.html`, `admin.css`, `admin.js`):
  a schema-driven engine renders add/edit/delete forms for every content
  type using the browser's File System Access API — no server, no OAuth,
  no third-party account. Verified end-to-end with a mocked directory
  handle (writes correct JSON, preserves untouched nested fields like
  `service.json`'s management roles).
- **QA pass with Playwright** (installed `playwright` + Chromium via `py -m
  pip`/`py -m playwright install`) caught and fixed three real bugs:
  1. Reveal-on-scroll elements were `opacity:0` unconditionally — content
     below the fold would stay permanently invisible if JS ever failed to
     run. Fixed with progressive enhancement (visible by default; JS
     opts elements into the hide-then-fade-in treatment itself).
  2. Mobile nav menu was collapsing to the header's own 72px height
     instead of covering the viewport — `backdrop-filter` on `.site-nav`
     was becoming the containing block for the fixed-position mobile
     overlay. Fixed by disabling the filter at mobile widths.
  3. Lightbox had no focus management — keyboard/screen-reader users
     never got moved into the dialog. Added `role="dialog"`, focus-on-open
     (close button), a one-element focus trap, and focus-return-on-close.
  4. `--text-faint` and the on-navy accent color both failed WCAG AA
     contrast (2.45:1 and 4.41:1 respectively, need ≥4.5:1) — recomputed
     both light/dark variants to pass with margin (verified with a small
     contrast-ratio script), and added a dedicated `--accent-on-navy`
     token for accent-colored text on the navy hero/footer.
  5. Fixed a data drift: `profile.json`'s `stats.publications` (67, a
     static count copied from the CV) didn't match the actual
     `publications.json` length (70, from the authoritative Google
     Scholar CSV export). The hero stat tile now derives the count live
     from `publications.json` so this can't happen again.
- Confirmed with the user: GitHub account `farukuzzamanfaruk` has been
  created. Waiting on a Personal Access Token from that account to create
  the `farukuzzamanfaruk.github.io` repo and push (Phase 6) — everything
  else is ready to go the moment that lands.
- Wrote `README.md` (local dev, admin panel usage, publishing workflow).

**Next up:** Phase 6 (create repo, push, enable Pages, verify live) once
the PAT arrives; then final live-site verification.

---

## 2026-07-18 — Phase 1: Scaffolding complete

- Read and extracted content from `Resources/`: CV PDF (all sections), Google Scholar
  CSV (67 publications), ULL info, links (Scholar/ResearchGate/ORCID/LinkedIn/Facebook/
  RUET profile/lab site), profile photo, ULL logo.
- Confirmed with user: GitHub username/domain = `farukuzzamanfaruk` →
  `farukuzzamanfaruk.github.io` (checked availability via GitHub API — `faruk`,
  `farukuzzaman`, `faaruk` are all taken).
- Confirmed with user: content-editing approach = local admin panel using the browser's
  File System Access API (no OAuth/server needed).
- Confirmed with user: color palette = Navy & Slate + muted Teal accent.
- Confirmed with user: phone number omitted from public site.
- `git init` in the project folder (global git identity already set: faaruk007 /
  faarukuzzaman@gmail.com — reused, not changed).
- Created folder structure: `assets/{css,js,img/{profile,awards,gallery,logos},cv}`,
  `data/`, `docs/`, `admin/`, `scripts/`.
- Created `.gitignore` (excludes `Resources/` and `Claude Code Prompts/` from the repo —
  they're local working material, not part of the published site) and `.nojekyll`.
- Wrote `docs/PROJECT_PLAN.md` (this plan) and this file.

**Next up:** Phase 2 — build `/data/*.json` content files from the CV + CSV + photos,
and copy/resize images into `assets/img/...`.

**Open item:** Faruk's CV mentioned a Google Drive link for the CV but didn't paste the
actual URL — `profile.json`'s `cvDriveLink` field will be left `null` until he provides
it (can be added anytime via the admin panel, no code change needed).
