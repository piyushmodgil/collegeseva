# CollegeSeva — v0.1 (starter)

A small, real, working version of a "CollegeBatch-style" portal, scoped to Bihar &amp; Jharkhand colleges. No build tools, no framework — just HTML/CSS/JS, so you can edit it directly in the GitHub web editor the same way you've worked before (like the `auj_orientation_2026` project).

## What's in this starter version

- Home page with search/filter by city, stream, and keyword
- College cards pulled from `data/colleges.json` (5 seed colleges — Amity Ranchi, BIT Mesra, NIT Patna, XLRI Jamshedpur, Patna University)
- "Send Enquiry" button on each card opens a lead-capture form
- Leads can be wired to save into a Google Sheet via a free Google Apps Script (same pattern as your orientation check-in system)

**Important:** every college in `colleges.json` has fee data marked `"VERIFY before publishing"` and `"verified": false`. I didn't have confirmed, current fee figures for all five, so I left them as placeholders rather than risk publishing wrong numbers on a live lead-gen site — that's the kind of mistake that erodes trust fast in this category. Fill in the real numbers (you already have Amity's) before this goes live, and flip `"verified": true` once a college's data is confirmed. The "Sample data" badge on a card disappears once you do.

## How to add or edit a college

Open `data/colleges.json` — it's a plain list, one block per college. Copy an existing block, change the values, save. No code needed beyond that.

## How to turn on lead capture (5 minutes)

1. Create a new Google Sheet. Rename the first tab to `Leads`. Add this header row:
   `Timestamp | Name | Phone | Email | Course | College ID | College Name`
2. In the Sheet: **Extensions → Apps Script**. Paste in the contents of `google-apps-script.gs`.
3. **Deploy → New deployment → Web app.** Set "Execute as: Me" and "Who has access: Anyone." Deploy and copy the URL it gives you.
4. Open `js/main.js`, find the line near the top:
   ```js
   const LEAD_ENDPOINT_URL = "";
   ```
   Paste your URL between the quotes.
5. Every enquiry submitted on the site will now land as a new row in your Sheet — same workflow you already used for the orientation check-in.

Until you do this, submissions just print to the browser console (open DevTools → Console to see them) so you can test the form without losing any real leads.

## How to publish it (same as your orientation site)

**Option A — GitHub Pages (free, matches your existing setup):**
1. Create a new repo under your GitHub account (`piyushmodgil`), e.g. `collegeseva`.
2. Upload all the files in this folder (keep the folder structure — `css/`, `js/`, `data/` subfolders).
3. Repo Settings → Pages → set source to the `main` branch, root folder.
4. Your site goes live at `piyushmodgil.github.io/collegeseva/`.

**Option B — Vercel (also free, you've used this before too):**
1. Push the same files to a GitHub repo.
2. Import the repo into Vercel as a new project — no build command needed (static site).
3. Vercel gives you a live URL immediately, and a custom domain later if you buy one.

## Suggested path to grow this ("small to big")

1. **Now:** 5–10 hand-picked Bihar/Jharkhand colleges, manually verified, lead form wired to your Sheet.
2. **Next:** move `colleges.json` to a published Google Sheet (CSV export URL) so you can add colleges from your phone without touching code at all — same idea as this JSON file, just editable from Sheets.
3. **Then:** add individual college detail pages (fees table, placement info, photos) instead of just cards.
4. **Later:** college comparison tool (2–3 colleges side by side), a review system, and — once there's real traffic — an "Advertise with us" page for colleges to pay for featured placement, which is exactly how CollegeBatch/KollegeApply monetize.

Each step only needs to happen once the previous one is actually working and you have a reason to grow it — no need to build all four stages up front.
