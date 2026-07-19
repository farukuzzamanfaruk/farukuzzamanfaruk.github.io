# Progress Log

Running log of what's been done on the portfolio build. Newest entries at the top.
See `PROJECT_PLAN.md` in this folder for the full plan and architecture.

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
