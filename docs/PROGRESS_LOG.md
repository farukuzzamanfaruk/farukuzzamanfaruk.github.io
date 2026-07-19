# Progress Log

Running log of what's been done on the portfolio build. Newest entries at the top.
See `PROJECT_PLAN.md` in this folder for the full plan and architecture.

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
