# Md Farukuzzaman Faruk — Research Portfolio

Single-page academic portfolio, published on GitHub Pages at
**https://farukuzzamanfaruk.github.io/**.

Plain HTML/CSS/JS — no framework, no build step. All content lives in
`data/*.json` and is rendered client-side, so updating content never means
touching code.

## Project layout

```
index.html              the site
assets/css/style.css    design system (colors, typography, components)
assets/js/data-loader.js  fetches data/*.json, renders every section
assets/js/main.js       nav, scroll-spy, dark mode, lightbox, publications
                        search/filter, the publications-per-year chart
assets/img/             profile photo, award/gallery photos, ULL logo
assets/cv/              the CV PDF
data/*.json             all site content — this is what you edit
admin/                  the local content-editing tool (see below)
docs/PROJECT_PLAN.md    the original build plan
docs/PROGRESS_LOG.md    running log of what's been built
scripts/                one-off Python scripts used to generate the
                        publications.json / assets/img content from
                        Resources/ — not part of the live site
```

## Viewing it locally

Any static file server works, e.g. from the project root:

```
py -m http.server 8000
```

then open `http://localhost:8000/`.

## Updating content — the admin panel

Open `admin/index.html` the same way (`http://localhost:8000/admin/`, or
directly at the published `https://farukuzzamanfaruk.github.io/admin/` —
both work) in **Chrome or Edge** (the File System Access API it relies on
isn't supported in Firefox/Safari). Opening the file directly with
`file://` will **not** work — it needs a real `http://` or `https://` URL.

1. Click **Open Project Folder** and select the repo's root folder (the
   one containing `index.html`) — your browser will ask you to confirm.
2. Pick a section from the sidebar (Profile, Education, Experience,
   Publications, Awards, Gallery, Funded Projects, News, Skills,
   Professional Service).
3. Edit fields directly, or use **+ Add new** / **Edit** / **Delete** for
   list-type sections. Photo fields let you choose a file from anywhere on
   disk — it's copied straight into `assets/img/...` and the JSON is
   updated to point at it.
4. Click **Save**. Changes are written straight to the `data/*.json` files
   (and any new image into `assets/img/...`) — nothing is uploaded
   anywhere, it all stays on your machine until you publish.
5. Click **Copy publish commands** in the sidebar, then run them in a
   terminal in the project folder (or just ask me to do it):
   ```
   git add -A && git commit -m "Update portfolio content" && git push
   ```
   GitHub Pages rebuilds automatically within a minute or two of the push.

**A few fields are intentionally not in the admin UI** because they rarely
change: `skills.json`'s spoken-languages list, and `service.json`'s
management-roles / training-workshops lists. Edit those two files directly
in a text editor if needed — the admin panel preserves them untouched when
you save other fields in the same section.

## Adding a new publication (example)

Admin panel → Publications → **+ Add new** → fill in Title, Authors,
Venue, Volume/Number/Pages, Year, Publisher. In the Authors field, wrap
your own name in `**double asterisks**` so it renders bold on the site,
e.g. `Smith, John; **Faruk, Md Farukuzzaman**; Lee, Amy`. Leave "Award"
blank unless the paper won one. Save, then publish as above.

## Tech notes

- No build step, no dependencies to install for the site itself.
- Publications count on the hero stat tile is derived live from
  `data/publications.json`'s length — it can never drift out of sync the
  way a hardcoded number could.
- The reveal-on-scroll animation is progressive enhancement: every element
  is visible by default; JavaScript only hides-then-reveals elements it
  successfully attaches to, so a JS failure never leaves content
  permanently invisible.
- Dark mode follows the OS preference by default and can be toggled
  manually (persisted in `localStorage`).
