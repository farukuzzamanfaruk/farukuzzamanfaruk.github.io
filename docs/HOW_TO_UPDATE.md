# How to Update Your Website — Simple Guide

This guide is for you, not a developer. No coding needed. Just follow the
steps in order.

---

## The short version

1. Open the editor tool (in Chrome or Edge).
2. Give it permission to see your project folder.
3. Click the section you want to change, edit it, click Save.
4. Publish your changes so they go live.

That's it. Details below.

---

## Step 1: Open the editor tool

The editor ("admin panel") only works in **Google Chrome** or **Microsoft
Edge** — not Firefox, not Safari.

Open this link in Chrome or Edge:

**https://farukuzzamanfaruk.github.io/admin/**

You'll see a dark sidebar on the left and a button that says
**"📁 Open Project Folder"**.

---

## Step 2: Give it access to your project folder

1. Click **"📁 Open Project Folder"**.
2. A window pops up asking you to choose a folder. Select your project
   folder:
   `D:\ULL PhD\9. Web Development\FARUK Personal Portfolio`
3. Click **"Select Folder"** / **"Allow"** if your browser asks to confirm.

You only need to do this once per browser session. If you close the tab
and come back later, just repeat this step.

> This never uploads anything anywhere — it only reads/writes files on
> your own computer, in that folder.

---

## Step 3: Pick what you want to change

The left sidebar lists every part of your site:

| Sidebar item | What it controls |
|---|---|
| **Profile** | Your name, photo, tagline, objective, CV, emails, social links |
| **Education** | Your degrees |
| **Experience** | Your jobs/teaching roles |
| **Publications** | Your papers |
| **Awards & Honors** | Awards, certificates, their photos |
| **Gallery** | Conference/event photos |
| **Funded Projects** | Your research projects |
| **News & Updates** | The "latest news" cards on your site |
| **Skills** | Research interests, languages, frameworks |
| **Professional Service** | Committees, consultancy, etc. |

Click any item to open it.

---

## Step 4: Make your changes

**For Profile/Skills/Service** (a single form): just edit the text boxes
directly.

**For everything else** (a list — Education, Publications, Awards, etc.):
- To **add** something new: click **"+ Add new"**, fill in the form, click
  **"Save entry"**.
- To **change** something existing: find it in the table, click **Edit**,
  change the text, click **"Save entry"**.
- To **remove** something: find it in the table, click **Delete**, confirm.

**To add or change a photo** (Profile, Awards, Gallery): click **"Choose
File"** next to the photo field and pick any image from your computer —
it gets copied in automatically.

---

## Step 5: Save

Every form has a **Save** button — click it after each change. You'll see
a small confirmation message in the top-right corner.

You can make several changes across different sections before publishing
— you don't have to publish after every single edit.

---

## Step 6: Publish (make it go live)

Editing and saving only updates the files on your computer — your public
website won't change until you **publish**.

**Easiest way:** just tell Claude Code (in a terminal / this app), in
plain English:

> "Please publish my portfolio changes."

Claude will handle the rest and let you know once it's live (usually
live within 1–2 minutes, sometimes longer during GitHub's busier
periods).

**Or, do it yourself:** click **"📋 Copy publish commands"** in the
sidebar, open a terminal in your project folder, paste, and press Enter.
It runs three commands that save and upload your changes.

---

## Quick answers to common questions

**"I published a new paper — how do I add it?"**
→ Admin panel → **Publications** → **+ Add new**. Fill in Title, Authors
(wrap your own name in `**two asterisks**` so it's bold), Venue, Year,
etc. Save, then publish.

**"I want to post a news update."**
→ Admin panel → **News & Updates** → **+ Add new**. Newest entries should
go visually to the top automatically based on order — just add it and
it'll appear correctly.

**"I got a new award/certificate — how do I show it?"**
→ Admin panel → **Awards & Honors** → **+ Add new**. Fill in the title
and upload the certificate photo. Save, then publish.

**"I want to change my profile photo."**
→ Admin panel → **Profile** → click "Choose File" under Profile Photo →
pick the new photo. Save, then publish.

**"I want to update my CV."**
→ Replace the PDF file at `assets/cv/CV_FARUK.pdf` in your project folder
with your new CV (keep the same file name), then publish. (Or ask Claude
to do this for you — just hand over the new PDF.)

**"Something looks wrong on the live site after I published."**
→ Give it a minute or two — GitHub sometimes takes a little while to
update. If it's still wrong after 5 minutes, ask Claude to check.

---

## If you get stuck

Just ask Claude Code. You can say things like:
- "Add this new publication for me: [paste details]"
- "Update my CV with this new file"
- "Something's not showing up right on my website, can you check?"

You don't need to use the admin panel yourself at all if you'd rather
just hand Claude the new information — either way works.
