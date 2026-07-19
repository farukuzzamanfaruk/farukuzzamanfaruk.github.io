/* Fetches /data/*.json and renders every section of the single-page site.
   Pure vanilla JS, no build step: this file plus main.js are the entire client. */
(function () {
  "use strict";

  const ICONS = {
    mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
    scholar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>',
    researchgate: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.586 0c-.818 0-1.508.19-2.073.565a3.062 3.062 0 0 0-1.16 1.463 5.44 5.44 0 0 0-.328 1.87c.006.408.043.797.11 1.166a5 5 0 0 0-.61-.06 3.6 3.6 0 0 0-1.936.53 3.3 3.3 0 0 0-1.24 1.44c-.28.62-.42 1.34-.42 2.16v.5H10.5V24h3.44V9.634h.83c.02-.34.07-.66.15-.96h-.98v-1.4c0-.5.09-.87.28-1.11.19-.24.5-.36.94-.36.15 0 .3.01.44.03.15.02.3.05.45.09V4.03A4.7 4.7 0 0 0 14.87 4c-.62 0-1.15.12-1.6.36V2.9c.53-.24 1.15-.36 1.86-.36.62 0 1.15.1 1.6.3V0z"/></svg>',
    orcid: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12"/><g fill="#0B1F3A"><path d="M7.4 7.16c.5 0 .9-.4.9-.9s-.4-.9-.9-.9-.9.4-.9.9.4.9.9.9zM6.7 8.6h1.4V17H6.7V8.6zM9.9 8.6h3.3c3.15 0 4.53 2.25 4.53 4.2 0 2.13-1.67 4.2-4.5 4.2H9.9V8.6zm1.4 1.26v5.68h1.8c2.35 0 3.2-1.7 3.2-2.84 0-1.54-.98-2.84-3.25-2.84h-1.75z"/></g></svg>',
    linkedin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>',
    facebook: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z"/></svg>',
    web: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></svg>',
    cv: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
  };

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Renders **bold** markup after escaping everything else.
  function mdBold(str) {
    const escaped = escapeHtml(str);
    return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  async function loadJSON(path) {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return res.json();
  }

  // ---------------- Renderers ----------------

  function renderProfile(p, pubCount) {
    document.title = `${p.name} — ${p.title}`;
    document.getElementById("heroRole").textContent = `${p.title}, ${p.affiliation}`;
    document.getElementById("heroTagline").textContent = p.tagline;
    document.getElementById("heroPhoto").src = p.photo;
    document.getElementById("heroPhoto").alt = p.name;
    document.getElementById("aboutObjective").innerHTML = mdBold(p.objective);
    document.getElementById("footerTagline").textContent = `${p.title}, ${p.affiliation}.`;
    document.getElementById("year").textContent = new Date().getFullYear();
    if (p.lastUpdated) {
      document.getElementById("lastUpdated").textContent = `Last updated ${p.lastUpdated}`;
    }

    const actions = document.getElementById("heroActions");
    const cvBtn = `<a class="btn btn-primary" href="${escapeHtml(p.cvFile)}" target="_blank" rel="noopener">${ICONS.cv} Download CV</a>`;
    const scholarBtn = `<a class="btn btn-outline" href="${escapeHtml(p.socials.googleScholar)}" target="_blank" rel="noopener">${ICONS.scholar} Google Scholar</a>`;
    const emailBtn = `<a class="btn btn-outline" href="mailto:${escapeHtml(p.emails.university)}">${ICONS.mail} Email</a>`;
    actions.innerHTML = cvBtn + scholarBtn + emailBtn;

    document.getElementById("scholarLink").href = p.socials.googleScholar;

    const statGrid = document.getElementById("statGrid");
    const stats = [
      [pubCount, "Publications"],
      [p.stats.teachingYears, "Years Teaching"],
      [p.stats.fundedProjects, "Funded Projects"],
      [p.stats.thesesSupervised, "Theses Supervised"],
    ];
    statGrid.innerHTML = stats.map(([num, label]) =>
      `<div class="stat-tile"><div class="num">${escapeHtml(num)}</div><div class="label">${escapeHtml(label)}</div></div>`
    ).join("");

    // Supervisor card
    const sup = p.supervisor;
    document.getElementById("supervisorCard").innerHTML = `
      <div class="label">PhD Supervisor</div>
      <h4>${escapeHtml(sup.name)}</h4>
      <p>${escapeHtml(sup.titleLine)}</p>
      <a href="${escapeHtml(sup.website)}" target="_blank" rel="noopener">Visit lab website ${ICONS.arrow}</a>
    `;

    // Footer contact + socials
    document.getElementById("footerContact").innerHTML = `
      <a href="mailto:${escapeHtml(p.emails.university)}">${ICONS.mail} University Email</a>
      <a href="mailto:${escapeHtml(p.emails.personal)}">${ICONS.mail} Personal Email</a>
    `;
    const socialItems = [
      [p.socials.googleScholar, ICONS.scholar, "Google Scholar"],
      [p.socials.researchGate, ICONS.researchgate, "ResearchGate"],
      [p.socials.orcid, ICONS.orcid, "ORCID"],
      [p.socials.linkedin, ICONS.linkedin, "LinkedIn"],
      [p.socials.facebook, ICONS.facebook, "Facebook"],
      [p.socials.ruetProfile, ICONS.web, "RUET Profile"],
    ];
    document.getElementById("footerSocials").innerHTML = socialItems.map(([href, icon, label]) =>
      `<a href="${escapeHtml(href)}" target="_blank" rel="noopener">${icon} ${escapeHtml(label)}</a>`
    ).join("");
  }

  function renderResearchAndSkills(skills) {
    document.getElementById("researchPills").innerHTML = skills.researchInterests.map(r =>
      `<div class="pill"><span class="dot"></span>${escapeHtml(r)}</div>`
    ).join("");

    document.getElementById("skillLanguages").innerHTML = skills.languages.map(s => `<span class="tag">${escapeHtml(s)}</span>`).join("");
    document.getElementById("skillFrameworks").innerHTML = skills.frameworks.map(s => `<span class="tag">${escapeHtml(s)}</span>`).join("");
    document.getElementById("skillInterpersonal").innerHTML = skills.interpersonal.map(s => `<span class="tag">${escapeHtml(s)}</span>`).join("");
  }

  function renderTimeline(containerId, items, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = items.map(item => {
      if (type === "education") {
        const detailLine = item.detail ? `<div class="timeline-detail">${escapeHtml(item.detail)}</div>` : "";
        const thesisLine = item.thesis ? `<div class="timeline-detail"><strong>Thesis:</strong> ${escapeHtml(item.thesis)}</div>` : "";
        const supLine = item.supervisor
          ? `<div class="timeline-detail"><strong>Supervisor:</strong> ${item.supervisorLink ? `<a href="${escapeHtml(item.supervisorLink)}" target="_blank" rel="noopener">${escapeHtml(item.supervisor)}</a>` : escapeHtml(item.supervisor)}</div>`
          : "";
        return `<div class="timeline-item">
          <div class="timeline-period">${escapeHtml(item.period)}</div>
          <h3>${escapeHtml(item.degree)}</h3>
          <div class="timeline-org">${escapeHtml(item.org)}</div>
          ${detailLine}${thesisLine}${supLine}
        </div>`;
      }
      return `<div class="timeline-item">
        <div class="timeline-period">${escapeHtml(item.period)}</div>
        <h3>${escapeHtml(item.role)}</h3>
        <div class="timeline-org">${escapeHtml(item.org)} · ${escapeHtml(item.type)}</div>
      </div>`;
    }).join("");
  }

  function renderPublications(pubs, profile) {
    window.__PUBLICATIONS__ = pubs; // used by main.js for search/filter/chart
    const years = [...new Set(pubs.map(p => p.year).filter(Boolean))].sort((a, b) => b - a);
    const yearSelect = document.getElementById("pubYearFilter");
    yearSelect.innerHTML = '<option value="">All years</option>' + years.map(y => `<option value="${y}">${y}</option>`).join("");

    const journalCount = pubs.filter(p => !/conference|proceedings|symposium/i.test(p.venue)).length;
    const confCount = pubs.length - journalCount;
    const awarded = pubs.filter(p => p.award).length;
    document.getElementById("pubStatGrid").innerHTML = [
      [pubs.length, "Total Publications"],
      [confCount, "Conference Papers"],
      [journalCount, "Journals / Chapters"],
      [awarded, "Best Paper Award"],
    ].map(([num, label]) =>
      `<div class="stat-tile" style="background:var(--surface);border-color:var(--surface-border);"><div class="num" style="color:var(--accent-dark);">${num}</div><div class="label" style="color:var(--text-muted);">${escapeHtml(label)}</div></div>`
    ).join("");
  }

  function renderMediaGrid(containerId, items) {
    window.__MEDIA__ = window.__MEDIA__ || {};
    window.__MEDIA__[containerId] = items;
    const container = document.getElementById(containerId);
    container.innerHTML = items.map((item, i) => {
      const frame = item.image
        ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.caption)}" loading="lazy">`
        : `<div class="media-frame no-image">${ICONS.image}</div>`;
      const frameWrap = item.image ? `<div class="media-frame">${frame}</div>` : frame;
      return `<article class="card media-card reveal" data-idx="${i}" data-container="${containerId}" tabindex="${item.image ? 0 : -1}">
        ${frameWrap}
        <div class="media-body">
          ${item.org ? `<div class="media-org">${escapeHtml(item.org)}</div>` : ""}
          <div class="media-title">${escapeHtml(item.title || item.caption)}</div>
          ${item.title && item.caption !== item.title ? `<div class="media-date" style="margin-top:2px;">${escapeHtml(item.caption)}</div>` : ""}
          ${item.date ? `<div class="media-date">${escapeHtml(item.date)}</div>` : ""}
        </div>
      </article>`;
    }).join("");
  }

  function renderProjects(projects) {
    document.getElementById("projectList").innerHTML = projects.map(pr => `
      <div class="card project-item reveal">
        <div>
          <h3>${escapeHtml(pr.name)}</h3>
          <div class="project-meta">
            <span><strong>Role:</strong> ${escapeHtml(pr.role)}</span>
            <span><strong>Duration:</strong> ${escapeHtml(pr.duration)}</span>
            <span><strong>Funding:</strong> ${escapeHtml(pr.funding)}</span>
            <span><strong>Funded by:</strong> ${escapeHtml(pr.funder)}</span>
          </div>
        </div>
        <span class="status-badge ${pr.status === "Ongoing" ? "ongoing" : "completed"}">${escapeHtml(pr.status)}</span>
      </div>
    `).join("");
  }

  function renderService(service) {
    const committeesLi = service.committees.map(c => `<li>${escapeHtml(c)}</li>`).join("");
    const consultancyLi = service.consultancy.map(c => `<li>${escapeHtml(c)}</li>`).join("");
    const managementLi = service.management.map(m => `<li><strong>${escapeHtml(m.role)}</strong>, ${escapeHtml(m.org)} (${escapeHtml(m.period)})</li>`).join("");
    const trainingLi = service.trainingWorkshops.map(t => `<li><strong>${escapeHtml(t.title)}</strong>, ${escapeHtml(t.org)} — ${escapeHtml(t.date)}</li>`).join("");

    document.getElementById("serviceGrid").innerHTML = `
      <div class="service-block">
        <h3>Organizing Committees</h3>
        <ul>${committeesLi}</ul>
      </div>
      <div class="service-block">
        <h3>Management Roles</h3>
        <ul>${managementLi}</ul>
      </div>
      <div class="service-block">
        <h3>Consultancy</h3>
        <ul>${consultancyLi}<li>${escapeHtml(service.supervision)}</li></ul>
      </div>
      <div class="service-block">
        <h3>Training &amp; Workshops</h3>
        <ul>${trainingLi}</ul>
      </div>
    `;
  }

  function renderNews(news) {
    document.getElementById("newsList").innerHTML = news.map(n => `
      <div class="card news-item reveal">
        <div class="news-date">${escapeHtml(n.date)}</div>
        <div>
          <h3>${escapeHtml(n.title)}</h3>
          ${n.description ? `<p>${escapeHtml(n.description)}</p>` : ""}
          ${n.link ? `<a class="news-link" href="${escapeHtml(n.link)}" target="_blank" rel="noopener">Learn more ${ICONS.arrow}</a>` : ""}
        </div>
      </div>
    `).join("");
  }

  async function init() {
    try {
      const [profile, education, experience, publications, awards, gallery, projects, service, skills, news] = await Promise.all([
        loadJSON("data/profile.json"),
        loadJSON("data/education.json"),
        loadJSON("data/experience.json"),
        loadJSON("data/publications.json"),
        loadJSON("data/awards.json"),
        loadJSON("data/gallery.json"),
        loadJSON("data/projects.json"),
        loadJSON("data/service.json"),
        loadJSON("data/skills.json"),
        loadJSON("data/news.json"),
      ]);

      renderProfile(profile, publications.length);
      document.getElementById("teachingYearsNote").textContent = `(${profile.stats.teachingYears} years teaching)`;
      renderResearchAndSkills(skills);
      renderTimeline("educationTimeline", education, "education");
      renderTimeline("experienceTimeline", experience, "experience");
      renderPublications(publications, profile);
      renderMediaGrid("awardsGrid", awards.map(a => ({ ...a, title: a.title })));
      renderMediaGrid("galleryGrid", gallery.map(g => ({ ...g, title: g.caption })));
      renderProjects(projects);
      renderService(service);
      renderNews(news);

      document.dispatchEvent(new CustomEvent("site:data-ready"));
    } catch (err) {
      console.error("Failed to load site content:", err);
      document.querySelectorAll(".skeleton").forEach(elz => elz.textContent = "Failed to load content.");
    }
  }

  window.__escapeHtml = escapeHtml;
  window.__mdBold = mdBold;
  document.addEventListener("DOMContentLoaded", init);
})();
