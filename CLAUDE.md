# CLAUDE.md

Personal research portfolio for **Md Farukuzzaman Faruk**, PhD student in
Computer Science (Deep Learning / DL Systems Optimization) at the
University of Louisiana at Lafayette. Live at
**https://farukuzzamanfaruk.github.io/**.

Full history/reasoning: `docs/PROJECT_PLAN.md` (original architecture) and
`docs/PROGRESS_LOG.md` (running build log — read this first to see what
was done last). User-facing instructions: `docs/HOW_TO_UPDATE.md`.

## Stack

Plain HTML/CSS/JS. **No build step, no framework, no dependencies.**
Content lives in `data/*.json`, fetched at runtime and rendered by
`assets/js/data-loader.js` + `assets/js/main.js` into `index.html`.

- `assets/css/style.css` — design system (Navy/Slate + Teal accent, all
  CSS variables at the top). `--accent-on-navy` exists specifically for
  accent-colored text on the navy hero/footer (plain `--accent` fails
  WCAG AA contrast there).
- `admin/` — a local content editor using the browser's File System
  Access API (Chrome/Edge only, needs `http(s)://` not `file://`). Schema
  for every content type lives in `admin/admin.js` (`SCHEMAS` object).
- `scripts/build_publications.py` — regenerates `data/publications.json`
  from the Google Scholar CSV in `Resources/` (gitignored, local-only
  source material). Re-run this if the CSV changes; don't hand-edit the
  sort order.
- `Resources/` and `.claude/` are gitignored — never expect them on the
  live site or in the repo.
- `.githooks/pre-commit` — auto-stamps `data/profile.json`'s
  `lastUpdated` (shown in the footer) to today's date on every commit,
  regardless of what changed or who's committing. Already active on this
  checkout (`git config core.hooksPath .githooks`). **If the repo is ever
  freshly cloned onto another machine, re-run that one config command** —
  `core.hooksPath` is a per-clone local setting, not something cloning
  picks up automatically.

## Content/design conventions (established via user feedback — don't re-litigate)

- **Ordering: latest-first everywhere**, with one exception —
  **Publications sorts by `(year desc, authorPosition asc)`**, i.e.
  newest year first, author-position only breaks ties within a year.
  (An authorship-first sort was tried and rejected: it hid recent papers
  from the preview.) Papers where he's first author get a "First Author"
  badge instead, so that signal isn't lost.
- **Prose gets justified**: `text-align: justify; hyphens: auto;
  text-align-last: left;` on narrative paragraphs (Objective, section
  intros, hero text, captions, news descriptions). **Not** applied to
  citation-style text (publication title/authors/venue) or bulleted
  lists — those stay ragged-left, which is the more standard convention.
- CV: nav has a standalone "CV" pill (opens PDF in new tab); hero button
  says "View CV" (not "Download CV").
- When a data fix is small (add a news item, reorder a list, fix a typo),
  just edit the relevant `data/*.json` directly — no need to route
  through the admin panel yourself.

## Workflow for any change

1. Edit `data/*.json` (or CSS/JS/HTML) directly.
2. **Test locally before pushing**: `py -m http.server 8000` from the
   project root, then check in a browser (or drive it with Playwright —
   `py -m playwright install chromium` if not already installed). Check
   for console errors.
3. Commit, then push with:
   ```
   git push "https://farukuzzamanfaruk@github.com/farukuzzamanfaruk/farukuzzamanfaruk.github.io.git" main:main
   ```
   (credential is cached locally under that username already — don't add
   it to global git config or overwrite the machine's other cached
   GitHub identity, `faaruk007`, used for unrelated work).
4. GitHub Pages auto-deploys on push to `main`. Usually ~30s, but has
   occasionally taken several minutes — that's a slow build queue, not an
   error (check `https://api.github.com/repos/farukuzzamanfaruk/farukuzzamanfaruk.github.io/pages/builds/latest`
   if unsure, and check githubstatus.com before assuming it's stuck).
5. Verify live with a cache-busted fetch
   (`curl "https://farukuzzamanfaruk.github.io/data/....json?nocache=$(date +%s)"`)
   before telling the user it's done.
6. Update `docs/PROGRESS_LOG.md` with what changed.
