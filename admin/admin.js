/* Local admin panel — File System Access API only, no server, no build step.
   Grants access to the repo folder on disk and reads/writes data/*.json and
   assets/img/... directly. Chromium-only (Chrome/Edge) by design. */
(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  let rootHandle = null;

  // ---------------- Schema ----------------
  const SCHEMAS = {
    profile: {
      label: "Profile", type: "object", file: "data/profile.json",
      fields: [
        { key: "name", label: "Full Name", type: "text" },
        { key: "shortName", label: "Short Name", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "affiliation", label: "Affiliation", type: "text" },
        { key: "tagline", label: "Hero Tagline", type: "textarea" },
        { key: "objective", label: "Objective (About section)", type: "textarea" },
        { key: "location", label: "Location", type: "text" },
        { key: "photo", label: "Profile Photo", type: "image", folder: "assets/img/profile" },
        { key: "cvFile", label: "CV File Path", type: "text", hint: "Relative path to the CV PDF in the repo — usually leave as-is." },
        { key: "cvDriveLink", label: "CV Google Drive Link", type: "url" },
        { key: "emails.university", label: "University Email", type: "text" },
        { key: "emails.personal", label: "Personal Email", type: "text" },
        { key: "socials.googleScholar", label: "Google Scholar URL", type: "url" },
        { key: "socials.researchGate", label: "ResearchGate URL", type: "url" },
        { key: "socials.orcid", label: "ORCID URL", type: "url" },
        { key: "socials.linkedin", label: "LinkedIn URL", type: "url" },
        { key: "socials.facebook", label: "Facebook URL", type: "url" },
        { key: "socials.ruetProfile", label: "RUET Profile URL", type: "url" },
        { key: "supervisor.name", label: "Supervisor Name", type: "text" },
        { key: "supervisor.titleLine", label: "Supervisor Title", type: "textarea" },
        { key: "supervisor.website", label: "Supervisor Website", type: "url" },
        { key: "stats.teachingYears", label: "Stat: Teaching Years", type: "text" },
        { key: "stats.fundedProjects", label: "Stat: Funded Projects", type: "text" },
        { key: "stats.thesesSupervised", label: "Stat: Theses Supervised", type: "text" },
        { key: "lastUpdated", label: "Last Updated", type: "text", hint: "Shown in the site footer. Update this when you publish changes." },
      ],
    },
    education: {
      label: "Education", type: "list", file: "data/education.json", itemLabel: (i) => i.degree,
      fields: [
        { key: "period", label: "Period", type: "text", placeholder: "2025 – Ongoing" },
        { key: "degree", label: "Degree", type: "text" },
        { key: "org", label: "Institution", type: "text" },
        { key: "detail", label: "Detail (e.g. CGPA)", type: "text" },
        { key: "thesis", label: "Thesis Title", type: "text" },
        { key: "supervisor", label: "Supervisor", type: "text" },
        { key: "supervisorLink", label: "Supervisor Link", type: "url" },
      ],
    },
    experience: {
      label: "Experience", type: "list", file: "data/experience.json", itemLabel: (i) => i.role,
      fields: [
        { key: "period", label: "Period", type: "text" },
        { key: "role", label: "Role", type: "text" },
        { key: "type", label: "Type", type: "text", placeholder: "Full Time" },
        { key: "org", label: "Organization", type: "text" },
      ],
    },
    publications: {
      label: "Publications", type: "list", file: "data/publications.json", itemLabel: (i) => i.title,
      fields: [
        { key: "title", label: "Title", type: "textarea" },
        { key: "authorsDisplay", label: "Authors", type: "textarea", hint: "Wrap your own name in ** ** so it renders bold, e.g. **Faruk, Md Farukuzzaman**." },
        { key: "venue", label: "Venue", type: "text" },
        { key: "volume", label: "Volume", type: "text" },
        { key: "number", label: "Number", type: "text" },
        { key: "pages", label: "Pages", type: "text" },
        { key: "year", label: "Year", type: "number" },
        { key: "publisher", label: "Publisher", type: "text" },
        { key: "award", label: "Award (leave blank if none)", type: "text" },
      ],
    },
    awards: {
      label: "Awards & Honors", type: "list", file: "data/awards.json", itemLabel: (i) => i.title,
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "caption", label: "Caption", type: "textarea" },
        { key: "org", label: "Organization", type: "text" },
        { key: "date", label: "Date", type: "text" },
        { key: "image", label: "Photo", type: "image", folder: "assets/img/awards" },
      ],
    },
    gallery: {
      label: "Gallery", type: "list", file: "data/gallery.json", itemLabel: (i) => i.caption,
      fields: [
        { key: "caption", label: "Caption", type: "textarea" },
        { key: "org", label: "Organization / Event", type: "text" },
        { key: "date", label: "Date", type: "text" },
        { key: "image", label: "Photo", type: "image", folder: "assets/img/gallery" },
      ],
    },
    projects: {
      label: "Funded Projects", type: "list", file: "data/projects.json", itemLabel: (i) => i.name,
      fields: [
        { key: "name", label: "Project Name", type: "textarea" },
        { key: "role", label: "Role", type: "text" },
        { key: "duration", label: "Duration", type: "text" },
        { key: "funding", label: "Funding Amount", type: "text" },
        { key: "funder", label: "Funded By", type: "text" },
        { key: "status", label: "Status", type: "select", options: ["Ongoing", "Completed"] },
      ],
    },
    news: {
      label: "News & Updates", type: "list", file: "data/news.json", itemLabel: (i) => i.title,
      fields: [
        { key: "date", label: "Date", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "link", label: "Link", type: "url" },
      ],
    },
    skills: {
      label: "Skills", type: "object", file: "data/skills.json",
      note: "The spoken-languages list isn't edited here (rarely changes) — edit data/skills.json directly if needed.",
      fields: [
        { key: "researchInterests", label: "Research Interests (one per line)", type: "stringArray" },
        { key: "languages", label: "Programming Languages (one per line)", type: "stringArray" },
        { key: "frameworks", label: "Frameworks (one per line)", type: "stringArray" },
        { key: "interpersonal", label: "Interpersonal Skills (one per line)", type: "stringArray" },
      ],
    },
    service: {
      label: "Professional Service", type: "object", file: "data/service.json",
      note: "Management roles and training/workshops aren't edited here (rarely change) — edit data/service.json directly if needed.",
      fields: [
        { key: "committees", label: "Organizing Committees (one per line)", type: "stringArray" },
        { key: "consultancy", label: "Consultancy (one per line)", type: "stringArray" },
        { key: "supervision", label: "Supervision Note", type: "textarea" },
      ],
    },
  };

  const NAV_ORDER = ["profile", "education", "experience", "publications", "awards", "gallery", "projects", "news", "skills", "service"];

  // ---------------- FS helpers ----------------
  async function getFileHandleFromPath(relPath, create) {
    const parts = relPath.split("/").filter(Boolean);
    let dir = rootHandle;
    for (let i = 0; i < parts.length - 1; i++) {
      dir = await dir.getDirectoryHandle(parts[i], { create: !!create });
    }
    return dir.getFileHandle(parts[parts.length - 1], { create: !!create });
  }

  async function readJSON(relPath) {
    const fh = await getFileHandleFromPath(relPath, false);
    const file = await fh.getFile();
    return JSON.parse(await file.text());
  }

  async function writeJSON(relPath, obj) {
    const fh = await getFileHandleFromPath(relPath, true);
    const writable = await fh.createWritable();
    await writable.write(JSON.stringify(obj, null, 2) + "\n");
    await writable.close();
  }

  async function writeBinary(relPath, arrayBuffer) {
    const fh = await getFileHandleFromPath(relPath, true);
    const writable = await fh.createWritable();
    await writable.write(arrayBuffer);
    await writable.close();
  }

  function slugify(str) {
    return str.toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  // ---------------- Dot-path get/set ----------------
  function getPath(obj, path) {
    return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  }
  function setPath(obj, path, value) {
    const keys = path.split(".");
    let o = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      o[keys[i]] = o[keys[i]] || {};
      o = o[keys[i]];
    }
    o[keys[keys.length - 1]] = value;
  }

  // ---------------- Toast ----------------
  let toastTimer;
  function toast(msg, isError) {
    const t = $("#toast");
    t.textContent = msg;
    t.className = "toast show" + (isError ? " error" : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
  }

  // ---------------- Sidebar nav ----------------
  function buildNav() {
    const nav = $("#adminNav");
    nav.innerHTML = "";
    NAV_ORDER.forEach((key) => {
      const schema = SCHEMAS[key];
      const btn = document.createElement("button");
      btn.textContent = schema.label;
      btn.dataset.key = key;
      btn.addEventListener("click", () => openSection(key));
      nav.appendChild(btn);
    });
  }

  function setActiveNav(key) {
    $$("#adminNav button").forEach((b) => b.classList.toggle("active", b.dataset.key === key));
  }

  // ---------------- Field rendering ----------------
  function renderField(field, value) {
    const wrap = document.createElement("div");
    wrap.className = "field-group" + (field.type === "stringArray" ? " stringarray" : "");
    const label = document.createElement("label");
    label.textContent = field.label;
    wrap.appendChild(label);

    let input;
    if (field.type === "textarea" || field.type === "stringArray") {
      input = document.createElement("textarea");
      input.value = field.type === "stringArray" ? (Array.isArray(value) ? value.join("\n") : "") : (value || "");
    } else if (field.type === "select") {
      input = document.createElement("select");
      field.options.forEach((opt) => {
        const o = document.createElement("option");
        o.value = opt; o.textContent = opt;
        if (opt === value) o.selected = true;
        input.appendChild(o);
      });
    } else if (field.type === "image") {
      const imgWrap = document.createElement("div");
      imgWrap.className = "image-field";
      const preview = value
        ? Object.assign(document.createElement("img"), { src: "../" + value, alt: "" })
        : Object.assign(document.createElement("div"), { className: "no-thumb", textContent: "No photo" });
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      const hiddenValue = document.createElement("input");
      hiddenValue.type = "hidden";
      hiddenValue.value = value || "";
      hiddenValue.dataset.fieldKey = field.key;
      fileInput.addEventListener("change", async () => {
        const file = fileInput.files[0];
        if (!file) return;
        try {
          const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
          const relPath = `${field.folder}/${slugify(file.name)}.${ext}`;
          const buf = await file.arrayBuffer();
          await writeBinary(relPath, buf);
          hiddenValue.value = relPath;
          const newImg = Object.assign(document.createElement("img"), { src: URL.createObjectURL(file), alt: "" });
          imgWrap.replaceChild(newImg, imgWrap.firstChild);
          toast("Photo copied into " + relPath);
        } catch (err) {
          console.error(err);
          toast("Failed to save photo: " + err.message, true);
        }
      });
      imgWrap.appendChild(preview);
      imgWrap.appendChild(fileInput);
      wrap.appendChild(imgWrap);
      wrap.appendChild(hiddenValue);
      wrap.dataset.fieldKey = field.key;
      wrap.dataset.fieldType = field.type;
      return wrap;
    } else {
      input = document.createElement("input");
      input.type = field.type === "number" ? "number" : field.type === "url" ? "url" : "text";
      if (field.placeholder) input.placeholder = field.placeholder;
      input.value = value === undefined || value === null ? "" : value;
    }
    input.dataset.fieldKey = field.key;
    input.dataset.fieldType = field.type;
    wrap.appendChild(input);

    if (field.hint) {
      const hint = document.createElement("div");
      hint.className = "hint";
      hint.textContent = field.hint;
      wrap.appendChild(hint);
    }
    return wrap;
  }

  function collectFieldValue(fieldEl, field) {
    if (field.type === "image") {
      const hidden = fieldEl.querySelector('input[type="hidden"]');
      return hidden.value || null;
    }
    const input = fieldEl.querySelector("input, textarea, select");
    if (field.type === "stringArray") {
      return input.value.split("\n").map((s) => s.trim()).filter(Boolean);
    }
    if (field.type === "number") {
      return input.value === "" ? null : Number(input.value);
    }
    return input.value.trim() === "" ? (field.type === "url" ? null : "") : input.value;
  }

  // ---------------- Object-type section (profile, skills, service) ----------------
  async function openObjectSection(key) {
    const schema = SCHEMAS[key];
    const data = await readJSON(schema.file);
    const panel = $("#panel");
    panel.innerHTML = "";

    const head = document.createElement("div");
    head.className = "panel-head";
    head.innerHTML = `<div><h2>${schema.label}</h2>${schema.note ? `<p>${schema.note}</p>` : ""}</div>`;
    panel.appendChild(head);

    const form = document.createElement("form");
    form.id = "objectForm";
    schema.fields.forEach((field) => {
      form.appendChild(renderField(field, getPath(data, field.key)));
    });

    const actions = document.createElement("div");
    actions.className = "form-actions";
    actions.innerHTML = `<button type="submit" class="btn btn-primary">💾 Save changes</button>`;
    form.appendChild(actions);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      schema.fields.forEach((field) => {
        const fieldEl = field.type === "image" ? form.querySelector(`[data-field-key="${field.key}"][data-field-type="image"]`) : null;
        const wrapEl = fieldEl || $$(".field-group", form).find((w) => {
          const inp = w.querySelector("input, textarea, select");
          return inp && inp.dataset.fieldKey === field.key;
        });
        setPath(data, field.key, collectFieldValue(wrapEl, field));
      });
      try {
        await writeJSON(schema.file, data);
        toast(`${schema.label} saved.`);
      } catch (err) {
        console.error(err);
        toast("Save failed: " + err.message, true);
      }
    });

    panel.appendChild(form);
  }

  // ---------------- List-type section (education, publications, etc.) ----------------
  async function openListSection(key) {
    const schema = SCHEMAS[key];
    const items = await readJSON(schema.file);
    const panel = $("#panel");
    panel.innerHTML = "";

    const head = document.createElement("div");
    head.className = "panel-head";
    head.innerHTML = `<div><h2>${schema.label}</h2><p>${items.length} ${items.length === 1 ? "entry" : "entries"}.</p></div>`;
    const addBtn = document.createElement("button");
    addBtn.className = "btn btn-primary";
    addBtn.textContent = "+ Add new";
    addBtn.addEventListener("click", () => openItemForm(key, null));
    head.appendChild(addBtn);
    panel.appendChild(head);

    const hasImage = schema.fields.some((f) => f.type === "image");
    const table = document.createElement("table");
    table.className = "admin-table";
    table.innerHTML = `<thead><tr>${hasImage ? "<th></th>" : ""}<th>Entry</th><th></th></tr></thead>`;
    const tbody = document.createElement("tbody");
    items.forEach((item, idx) => {
      const tr = document.createElement("tr");
      const imgCell = hasImage
        ? `<td>${item.image ? `<img class="thumb" src="../${item.image}" alt="">` : `<div class="thumb"></div>`}</td>`
        : "";
      tr.innerHTML = `
        ${imgCell}
        <td>${window.__adminEscape(schema.itemLabel(item) || "(untitled)")}</td>
        <td class="actions">
          <button class="btn btn-sm btn-ghost" data-action="edit" data-idx="${idx}">Edit</button>
          <button class="btn btn-sm btn-ghost" data-action="delete" data-idx="${idx}">Delete</button>
        </td>`;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    panel.appendChild(table);

    table.addEventListener("click", async (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const idx = Number(btn.dataset.idx);
      if (btn.dataset.action === "edit") {
        openItemForm(key, idx);
      } else if (btn.dataset.action === "delete") {
        const label = schema.itemLabel(items[idx]) || "this entry";
        if (!confirm(`Delete "${label}"? This can't be undone here (though it's still in your git history once committed).`)) return;
        items.splice(idx, 1);
        try {
          await writeJSON(schema.file, items);
          toast("Entry deleted.");
          openListSection(key);
        } catch (err) {
          toast("Delete failed: " + err.message, true);
        }
      }
    });
  }

  async function openItemForm(key, idx) {
    const schema = SCHEMAS[key];
    const items = await readJSON(schema.file);
    const isNew = idx === null;
    const item = isNew ? {} : items[idx];

    const modal = $("#modal");
    modal.innerHTML = `<h3>${isNew ? "Add" : "Edit"} — ${schema.label}</h3>`;
    const form = document.createElement("form");
    schema.fields.forEach((field) => form.appendChild(renderField(field, item[field.key])));
    const actions = document.createElement("div");
    actions.className = "form-actions";
    actions.innerHTML = `
      <button type="submit" class="btn btn-primary">💾 Save entry</button>
      <button type="button" class="btn btn-ghost" id="modalCancel">Cancel</button>
    `;
    form.appendChild(actions);
    modal.appendChild(form);
    $("#modalOverlay").classList.add("open");

    $("#modalCancel").addEventListener("click", () => $("#modalOverlay").classList.remove("open"));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newItem = {};
      schema.fields.forEach((field) => {
        const fieldEl = field.type === "image"
          ? form.querySelector(`[data-field-key="${field.key}"][data-field-type="image"]`)
          : $$(".field-group", form).find((w) => {
              const inp = w.querySelector("input, textarea, select");
              return inp && inp.dataset.fieldKey === field.key;
            });
        newItem[field.key] = collectFieldValue(fieldEl, field);
      });
      if (isNew) items.push(newItem);
      else items[idx] = newItem;
      try {
        await writeJSON(schema.file, items);
        $("#modalOverlay").classList.remove("open");
        toast("Saved.");
        openListSection(key);
      } catch (err) {
        toast("Save failed: " + err.message, true);
      }
    });
  }

  $("#modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") e.currentTarget.classList.remove("open");
  });

  // ---------------- Section dispatch ----------------
  async function openSection(key) {
    setActiveNav(key);
    const schema = SCHEMAS[key];
    try {
      if (schema.type === "object") await openObjectSection(key);
      else await openListSection(key);
    } catch (err) {
      console.error(err);
      $("#panel").innerHTML = `<div class="empty-state"><h2>Couldn't load ${schema.label}</h2><p>${window.__adminEscape(err.message)}</p></div>`;
    }
  }

  // ---------------- Folder access ----------------
  $("#openFolderBtn").addEventListener("click", async () => {
    try {
      rootHandle = await window.showDirectoryPicker();
      // sanity check: confirm this looks like the right folder
      await rootHandle.getFileHandle("index.html");
      $("#folderStatus").textContent = "Connected: " + rootHandle.name;
      $("#folderStatus").classList.add("connected");
      buildNav();
      openSection("profile");
    } catch (err) {
      if (err.name !== "AbortError") {
        toast("Couldn't open that folder — make sure you selected the repo root (the folder containing index.html).", true);
        console.error(err);
      }
    }
  });

  $("#copyPublishBtn").addEventListener("click", async () => {
    const cmd = 'git add -A && git commit -m "Update portfolio content" && git push';
    try {
      await navigator.clipboard.writeText(cmd);
      toast("Copied to clipboard — run it in a terminal in your project folder.");
    } catch {
      toast(cmd, false);
    }
  });

  window.__adminEscape = function (str) {
    const d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
  };

  if (!window.showDirectoryPicker) {
    $("#unsupportedBanner").style.display = "block";
    $("#openFolderBtn").disabled = true;
  }
})();
