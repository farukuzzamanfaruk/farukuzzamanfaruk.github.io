/* Nav, scroll-spy, mobile menu, dark mode, reveal-on-scroll, lightbox,
   publications search/filter, and the publications-per-year bar chart. */
(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------------- Dark mode ---------------- */
  const THEME_KEY = "faruk-portfolio-theme";
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");
  const iconMoon = $("#themeIconMoon");
  const iconSun = $("#themeIconSun");

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      iconMoon.style.display = "none";
      iconSun.style.display = "";
    } else {
      root.setAttribute("data-theme", "light");
      iconMoon.style.display = "";
      iconSun.style.display = "none";
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) applyTheme(savedTheme);
  else applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
    if (window.__renderPubChart) window.__renderPubChart(); // recolor chart for theme
  });

  /* ---------------- Mobile nav ---------------- */
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");
  navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

  /* ---------------- Scroll-spy ---------------- */
  const sections = $$("main section, header.hero, footer#contact");
  const navMap = new Map($$("#navLinks a").map(a => [a.getAttribute("href").slice(1), a]));
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = navMap.get(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        $$("#navLinks a.active").forEach(a => a.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
  sections.forEach(s => s.id && spyObserver.observe(s));

  /* ---------------- Reveal on scroll ----------------
     Elements are visible by default (see CSS); JS opts them into the
     hidden-then-fade-in treatment by adding reveal-pending right before
     observing them, so a JS failure never leaves content permanently hidden. */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: "0px 0px -10% 0px" });
  function observeReveals() {
    $$(".reveal:not(.reveal-pending):not(.visible)").forEach(el => {
      el.classList.add("reveal-pending");
      revealObserver.observe(el);
    });
  }

  /* ---------------- Back to top ---------------- */
  const backToTop = $("#backToTop");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 640);
  }, { passive: true });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------------- Lightbox ---------------- */
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxCaption = $("#lightboxCaption");
  const lightboxCloseBtn = $("#lightboxClose");
  let lastFocusedBeforeLightbox = null;

  function openLightbox(src, caption, triggerEl) {
    lastFocusedBeforeLightbox = triggerEl || document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = caption || "";
    lightboxCaption.textContent = caption || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    lightboxCloseBtn.focus();
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    lightboxImg.src = "";
    if (lastFocusedBeforeLightbox && lastFocusedBeforeLightbox.focus) lastFocusedBeforeLightbox.focus();
    lastFocusedBeforeLightbox = null;
  }
  // Only one focusable element inside (the close button) -- keep focus pinned there
  // so Tab/Shift+Tab never escapes to the page behind the overlay.
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      lightboxCloseBtn.focus();
    }
  });
  $("#lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".media-card");
    if (!card) return;
    const containerId = card.dataset.container;
    const idx = Number(card.dataset.idx);
    const item = window.__MEDIA__ && window.__MEDIA__[containerId] && window.__MEDIA__[containerId][idx];
    if (item && item.image) openLightbox(item.image, item.caption, card);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest && e.target.closest(".media-card");
    if (!card) return;
    e.preventDefault();
    card.click();
  });

  /* ---------------- Publications: search, filter, pagination ---------------- */
  const PAGE_SIZE = 10;
  let pubSearchTerm = "";
  let pubYearTerm = "";
  let pubShowAll = false;

  function getFilteredPubs() {
    const pubs = window.__PUBLICATIONS__ || [];
    return pubs.filter(p => {
      if (pubYearTerm && String(p.year) !== pubYearTerm) return false;
      if (pubSearchTerm) {
        const hay = `${p.title} ${p.authorsDisplay} ${p.venue}`.toLowerCase();
        if (!hay.includes(pubSearchTerm)) return false;
      }
      return true;
    });
  }

  function renderPubList() {
    const list = $("#pubList");
    const filtered = getFilteredPubs();
    const visible = pubShowAll ? filtered : filtered.slice(0, PAGE_SIZE);

    if (!filtered.length) {
      list.innerHTML = `<div class="pub-empty">No publications match your search.</div>`;
      $("#pubMoreWrap").style.display = "none";
      return;
    }

    list.innerHTML = visible.map(p => `
      <article class="card pub-item reveal visible">
        <div class="pub-top">
          <div class="pub-year">${p.year || "—"}</div>
          ${p.authorPosition === 1 ? `<span class="pub-badge">First Author</span>` : ""}
        </div>
        <div class="pub-title">${window.__escapeHtml(p.title)}</div>
        <div class="pub-authors">${window.__mdBold(p.authorsDisplay)}</div>
        <div class="pub-venue">${window.__escapeHtml([p.venue, p.publisher].filter(Boolean).join(" · "))}${p.pages ? ", pp. " + window.__escapeHtml(p.pages) : ""}</div>
        ${p.award ? `<div class="pub-award">🏆 ${window.__escapeHtml(p.award)}</div>` : ""}
      </article>
    `).join("");

    const moreWrap = $("#pubMoreWrap");
    if (!pubShowAll && filtered.length > PAGE_SIZE) {
      moreWrap.style.display = "flex";
      $("#pubMoreBtn").textContent = `Show all ${filtered.length} publications`;
    } else {
      moreWrap.style.display = "none";
    }
  }

  $("#pubSearch").addEventListener("input", (e) => {
    pubSearchTerm = e.target.value.trim().toLowerCase();
    pubShowAll = false;
    renderPubList();
  });
  $("#pubYearFilter").addEventListener("change", (e) => {
    pubYearTerm = e.target.value;
    pubShowAll = false;
    renderPubList();
  });
  $("#pubMoreBtn").addEventListener("click", () => {
    pubShowAll = true;
    renderPubList();
  });

  /* ---------------- Publications-per-year bar chart ----------------
     Single series (magnitude over time) -> one accent hue, no legend needed.
     Mark spec: bars <=24px thick, 4px rounded data-end / square baseline,
     hairline recessive gridlines, hover tooltip, sparing direct labels (max only). */
  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function renderPubChart() {
    const svg = $("#pubChart");
    const wrap = svg.closest(".pub-chart-wrap");
    const pubs = window.__PUBLICATIONS__ || [];
    if (!pubs.length || !wrap) return;

    const counts = {};
    pubs.forEach(p => { if (p.year) counts[p.year] = (counts[p.year] || 0) + 1; });
    const years = Object.keys(counts).map(Number).sort((a, b) => a - b);
    const values = years.map(y => counts[y]);
    const maxVal = Math.max(...values);
    const niceMax = Math.ceil(maxVal / 5) * 5 || 5;

    const width = wrap.clientWidth || 800;
    const height = 200;
    const padding = { top: 24, right: 16, bottom: 28, left: 34 };
    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    const accent = cssVar("--accent") || "#0D9488";
    const gridColor = cssVar("--surface-border") || "#E2E8F0";
    const textMuted = cssVar("--text-muted") || "#475569";

    const band = plotW / years.length;
    const barW = Math.min(24, band * 0.55);

    const yTicks = 4;
    let gridSvg = "";
    for (let i = 0; i <= yTicks; i++) {
      const v = (niceMax / yTicks) * i;
      const y = padding.top + plotH - (v / niceMax) * plotH;
      gridSvg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${gridColor}" stroke-width="1"/>`;
      gridSvg += `<text x="${padding.left - 8}" y="${y + 4}" font-size="11" fill="${textMuted}" text-anchor="end" font-family="var(--font-mono)">${Math.round(v)}</text>`;
    }

    let barsSvg = "";
    years.forEach((year, i) => {
      const v = counts[year];
      const barH = (v / niceMax) * plotH;
      const x = padding.left + i * band + (band - barW) / 2;
      const y = padding.top + plotH - barH;
      const isMax = v === maxVal;
      barsSvg += `
        <g class="pub-bar-g" data-year="${year}" data-count="${v}" tabindex="0" style="cursor:pointer;">
          <rect x="${x}" y="${y}" width="${barW}" height="${Math.max(barH, 2)}" rx="4" ry="4" fill="${accent}" opacity="0.92"/>
          <rect x="${x}" y="${padding.top + plotH - 2}" width="${barW}" height="2" fill="${accent}"/>
          ${isMax ? `<text x="${x + barW / 2}" y="${y - 8}" font-size="12" font-weight="700" fill="${textMuted}" text-anchor="middle">${v}</text>` : ""}
          <text x="${x + barW / 2}" y="${height - 8}" font-size="11" fill="${textMuted}" text-anchor="middle" font-family="var(--font-mono)">${year}</text>
          <rect x="${padding.left + i * band}" y="${padding.top}" width="${band}" height="${plotH}" fill="transparent"/>
        </g>`;
    });

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.innerHTML = gridSvg + barsSvg;

    // Tooltip
    let tip = wrap.querySelector(".chart-tooltip");
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "chart-tooltip";
      tip.style.cssText = "position:absolute;pointer-events:none;background:var(--navy);color:#fff;padding:6px 10px;border-radius:6px;font-size:12px;font-weight:600;opacity:0;transition:opacity 120ms ease;transform:translate(-50%,-120%);z-index:5;white-space:nowrap;";
      wrap.style.position = "relative";
      wrap.appendChild(tip);
    }
    $$(".pub-bar-g", svg).forEach(g => {
      const show = (evt) => {
        const rect = g.querySelector("rect");
        const box = rect.getBoundingClientRect();
        const wrapBox = wrap.getBoundingClientRect();
        tip.textContent = `${g.dataset.year}: ${g.dataset.count} publication${g.dataset.count === "1" ? "" : "s"}`;
        tip.style.left = (box.left - wrapBox.left + box.width / 2) + "px";
        tip.style.top = (box.top - wrapBox.top) + "px";
        tip.style.opacity = "1";
        rect.setAttribute("opacity", "1");
      };
      const hide = () => {
        tip.style.opacity = "0";
        g.querySelector("rect").setAttribute("opacity", "0.92");
      };
      g.addEventListener("pointerenter", show);
      g.addEventListener("pointermove", show);
      g.addEventListener("pointerleave", hide);
      g.addEventListener("focus", show);
      g.addEventListener("blur", hide);
    });
  }
  window.__renderPubChart = renderPubChart;

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderPubChart, 150);
  });

  /* ---------------- Kick off once data is loaded ---------------- */
  document.addEventListener("site:data-ready", () => {
    renderPubList();
    renderPubChart();
    observeReveals();
  });

  // In case sections were already rendered before listeners attached (fast cache)
  document.addEventListener("DOMContentLoaded", observeReveals);
})();
