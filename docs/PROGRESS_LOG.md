# Progress Log

Running log of what's been done on the portfolio build. Newest entries at the top.
See `PROJECT_PLAN.md` in this folder for the full plan and architecture.

---

## 2026-09-29 — CV: made the Best Paper Award bullet clickable

Honors & Memberships → Awards → "IEEE Bangladesh Section Best Paper
Award..." bullet now links to RUET's own news post recognizing the award
(https://www.ruet.ac.bd/news-and-event/icecte-2019-best-paper-award-won-by-cse-faculty-member,
stripped of a `?utm_source=chatgpt.com` tracking param the user's pasted
link carried). Verified the page resolves (HTTP 200) and actually
mentions the award and his name before linking it. Edited in
`assets/CV-Latex-Template/CV_FARUK.tex`; recompiled clean, verified
against the rendered page image.

---

## 2026-09-29 — CV: added Portfolio link to the header

Added a third contact link, "Portfolio" (→ `farukuzzamanfaruk.github.io`),
next to Google Scholar and LinkedIn in the CV header — same line, same
icon/spacing style. Reused the existing globe icon (no dedicated
portfolio/website icon in the template's asset set). Edited in
`assets/CV-Latex-Template/CV_FARUK.tex`, recompiled clean (0 errors, 0
overfull/underfull, still 9 pages), verified against the rendered page
image before publishing.

---

## 2026-09-29 — CV: added 2 missing publications, recovered a real LaTeX source

The CV's Publications list had 67 entries; Google Scholar (verified directly
from the profile's raw HTML — "Articles 1–69", not an estimate) has 69.
Cross-checked `Resources/Google Scholar All Publications/*.csv` and
`data/publications.json` too — the website already had all 69 GS papers
(plus one, the K-mer/DNA-methylation paper, that's on the CV and in the
CSV but curiously isn't in GS's current listing — left alone, out of
scope). Only the CV PDF was behind, missing both 2026 book chapters in
*Machine Learning for Healthcare Informatics*:
- "Large Ensemble of Transfer-Learned Models for Plant Disease Recognition
  from Diverse Leaf Images" (author position 4/9) — inserted as new #6
- "Preventing Skin Cancer through Improved Skin Lesion Recognition..."
  (author position 7/8) — inserted as new #8

Placement follows the site's own sort rule (year desc, author-position
asc) and keeps items 1–5 (sole/first-authored papers) undisturbed, per
user instruction. Items 6–67 renumbered to 9–69 accordingly. Author lists
for the two new entries were pulled from Google Scholar's own citation
detail pages, not guessed.

**This is also the first CV edit done from a real, editable source**
instead of hand-patching the compiled PDF (used for the two prior CV
fixes above — that approach doesn't scale to structural changes like
inserting entries mid-list, which reflows everything after). The user
provided their original LaTeX template (a customized "1.5-column-cv",
Roboto fonts, navy accent — `assets/CV-Latex-Template/main.tex`, kept
untouched as reference). Rebuilt the CV's actual content on top of it,
unchanged macros/styling, as `assets/CV-Latex-Template/CV_FARUK.tex`:
- Header switched to centered/no-photo (matches the current live CV;
  the template's original left-photo layout was for an older draft).
- All other content (Objectives, Work Experience, Education, Skills,
  Publications ×69, Training, Honors, Supervision, Funded Projects)
  transcribed from the current PDF's own text — not retyped from memory —
  via `pdftotext`, programmatically split into individual entries, and
  cleaned of PDF-justification line-wrap hyphenation artifacts (e.g.
  "Pre- dict" → "Predict") while preserving genuine compound hyphens
  (e.g. "EEG-Based", "ResNet-101").
- Compiles clean with XeLaTeX (MiKTeX): 0 errors, 0 overfull/underfull
  box warnings, 9 pages (was 8). Verified against the rendered page
  images, not just the log.

**For future CV edits**: edit `assets/CV-Latex-Template/CV_FARUK.tex` and
recompile with `xelatex CV_FARUK.tex` (run twice to settle references),
then copy the resulting PDF to `Resources/CV/CV_FARUK.pdf` and
`assets/cv/CV_FARUK.pdf`. No more raw PDF content-stream patching needed.
Build artifacts (`.aux`/`.log`/`.out`/`.pdf` in that folder) are now
gitignored — only the `.tex` files and icon/photo assets are tracked.

**Not touched / left as-is:** the "Resposibily" typo (→ "Responsibility")
in all four Funded Projects entries — a real typo, but outside what was
asked; flagging in case it should be fixed next.

---

## 2026-09-29 — CV correction: Assistant Professor end date

Work-experience entry "Assistant Professor, RUET" said `Jul 2022 – Jul
2025`; corrected to `Jul 2022 – Aug 2025` in both `data/experience.json`
(rendered on the live site) and `assets/cv/CV_FARUK.pdf` (page 1, same
content-stream-patch approach as the 2026-09-21 fix, since the LaTeX
source still isn't available). Verified via `pdftotext` and a rendered
page image; only that one date changed, layout otherwise identical.

---

## 2026-09-21 — CV correction: Funded Project [4] duration

Funded Project [4] (Fake News Identification / multi-layer GRU) in
`assets/cv/CV_FARUK.pdf` said `Duration: Ongoing`; corrected to
`Duration: July 2024 to June 2025 (Completed)`, matching the wording of
projects [1]–[3]. `data/projects.json` already had this right, so no data
change was needed.

**How it was done (no LaTeX source available):** the CV was compiled with
MiKTeX/dvipdfmx and the `.tex` source isn't in this repo or on disk, so the
text was patched directly in the PDF's page-8 content stream with pikepdf.
Text is stored as hex glyph IDs (glyph = ASCII − 0x1C in the Roboto-Light
subset); all needed glyphs (`J u l y 0 2 4 5 t o n e C m p d ( )`) were
already in the embedded subset. Verified with `pdftotext` (only that one
line differs across all 8 pages) and a rendered check. `Resources/CV/` and
`assets/cv/` copies are identical.

**Caveat:** if the CV is ever recompiled from the original LaTeX source,
that source needs the same one-line fix or the change reverts. Left as-is
(not corrected): the "Resposibily" typo in all four funded-project entries.

---

## 2026-07-19 — Mobile/tablet compatibility audit

User asked whether the site is fully compatible with phones and tablets.
Rather than assume, audited the live site with Playwright across 8 real
device profiles (iPhone SE, 15/16 Pro, 17 Pro Max, Pixel 8, Galaxy S24,
iPad Mini, iPad Air/Pro 11, standard iPad) in both orientations —
checking horizontal overflow, nav hamburger open/close, lightbox
tap-to-open, and touch target sizes.

Found and fixed three real bugs, all specific to phone-width viewports
(<=430px):
1. `#pubStatGrid`'s inline `grid-template-columns:repeat(4,1fr)` beat the
   responsive `@media (max-width:700px)` 2-column rule (inline > media-
   query'd class), so 2 of its 4 tiles rendered off-screen on phones.
   Removed the inline override.
2. The page was horizontally scrollable on phones: the closed mobile nav
   is a `position:fixed` panel pushed off-canvas with
   `transform:translateX(100%)`, but Chromium still counts a transformed
   fixed element's box toward the document's scrollable width. Added
   `overflow-x:hidden` on html/body as the standard guard.
3. Theme-toggle (38px) and mobile nav-toggle (40px) were slightly under
   the 44x44px minimum recommended touch target size — bumped both.

**Testing gotcha worth remembering**: Playwright's `is_mobile`/`has_touch`
context options silently clamp narrow viewport widths to ~484px in this
environment's headless Chromium (confirmed: identical request differs
only by that flag, 375px stayed 375px without it, became 484px with it) —
a testing-environment artifact, not a real browser behavior. Use plain
`viewport={width,height}` contexts with `.click()` instead of `.tap()`
for trustworthy mobile-width testing here.

Re-audited after fixing: 0 overflow, 0 console errors, all interactions
working across all 16 device/orientation combinations.

---

## 2026-07-19 — "Last updated" now auto-stamps itself

The footer's "Last updated" date was a manually-maintained field in
`profile.json` — user asked for it to update itself automatically.
Added `.githooks/pre-commit` (a git hook, not a page script): on every
`git commit`, it rewrites `profile.json`'s `lastUpdated` to today's date
and folds that into the same commit. Set `git config core.hooksPath
.githooks` on this checkout so it's active. This covers every editing
path uniformly (admin panel, direct JSON edits, Claude-made commits) —
whatever triggers a commit triggers the stamp, so there's no per-workflow
special-casing needed. Verified: committed the hook itself, watched
`lastUpdated` flip from 2026-07-18 to 2026-07-19 in that same commit.

---

## 2026-07-19 — User's first self-service edit via the admin panel + a bug it exposed

- Faruk made his first edits himself through `admin/index.html`: new
  profile photo (in front of the ULL fountain logo), added "Signal
  Processing" to research interests, corrected a publication's publisher.
  Tried to publish via the "Copy publish commands" button's `&&`-chained
  command in VS Code's integrated terminal — that's PowerShell 5.1 by
  default on Windows, which doesn't support `&&` (Bash/PowerShell-7+
  only). Told him to run the three commands on separate lines instead;
  Claude published this round directly.
- **Found and fixed a real admin-panel bug** while reviewing the diff:
  editing a list item rebuilt it from an empty object using only the
  fields the form exposes, silently dropping anything not in the schema
  — here, `publications.json`'s `authorPosition` (which drives the
  "First Author" badge) vanished from the one entry he edited. Root
  cause: `admin.js`'s item-save handler did `const newItem = {}` instead
  of merging into the existing item.
  - Fixed: now starts from `{ ...item }` so unlisted fields survive.
  - Exposed `authorPosition` as an actual editable field on the
    Publications form (was invisible/uneditable before — the direct
    cause of the bug being possible at all) with a hint explaining it.
  - Added an optional per-schema `sort` comparator, applied after every
    list add/edit/delete; publications now auto-resort to
    `(year desc, authorPosition asc)` so entries never need manual
    placement.
  - Standardized empty text fields to save as `null` (was inconsistently
    `""` for text vs `null` for url fields).
  - Dropped the unused `id` field from publications entirely (grepped —
    never read anywhere in `assets/js/`); removed it from
    `build_publications.py` too so regeneration doesn't reintroduce it.
  - Restored the dropped `authorPosition: 4` on the affected entry.
- Verified with the mocked-filesystem admin test: editing an item now
  preserves `authorPosition` and shows it pre-filled in the form; full
  site smoke test still 0 console errors; new profile photo crops
  cleanly into the circular hero frame.

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
