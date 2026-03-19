# ⛳ Memory Combine

**PGA Tour proximity benchmark app.** Play 18 shots across 6 randomly selected distances, score against scratch and Tour median benchmarks, and post to a live leaderboard.

Built with React + Vite + TypeScript + Tailwind CSS. Designed mobile-first for use at the range.

---

## Quick Start

```bash
cd memory-combine
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> **Leaderboard won't work locally** without running a local serverless function runtime (see below). The rest of the app works fully offline.

---

## .env Setup

Copy `.env.example` to `.env` (local dev reference only — these are server-side vars, not used by Vite directly):

```bash
cp .env.example .env
```

> ⚠️ **Never commit `.env` to source control.** These go in your hosting provider's environment variable settings.

---

## Google Sheets Leaderboard Setup

The leaderboard uses Google Sheets as a simple database, accessed via a serverless function (no private key exposed to the browser).

### Step 1 — Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **New Project**, name it (e.g. `memory-combine`)
3. Select the project

### Step 2 — Enable the Sheets API

1. In the left menu: **APIs & Services → Library**
2. Search for **Google Sheets API**
3. Click **Enable**

### Step 3 — Create a Service Account

1. Go to **APIs & Services → Credentials**
2. Click **+ Create Credentials → Service Account**
3. Give it a name (e.g. `memory-combine-bot`), click **Create and Continue**
4. Skip role assignment, click **Done**
5. Click on the new service account email to open it
6. Go to the **Keys** tab → **Add Key → Create new key → JSON**
7. Download the JSON file — keep it secret

The JSON file contains these fields you need:
```json
{
  "client_email": "memory-combine-bot@your-project.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

### Step 4 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Rename the first sheet tab to exactly: **`Leaderboard`**
3. Add headers in row 1:
   ```
   A1: Name   B1: Score   C1: Date   D1: RoundDetail
   ```
4. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_IS_YOUR_SHEET_ID`**`/edit`

### Step 5 — Share the Sheet with the Service Account

1. Click **Share** in the spreadsheet
2. Paste the service account email (from the JSON `client_email` field)
3. Set permission to **Editor**
4. Click **Send**

### Step 6 — Set Environment Variables

**Netlify:**
1. Go to Site settings → Environment variables
2. Add:
   - `GOOGLE_SHEETS_ID` = your sheet ID
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` = the `client_email` value
   - `GOOGLE_PRIVATE_KEY` = the full `private_key` value (including `-----BEGIN...-----END-----` and `\n` newlines — paste the raw string value from the JSON)

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add the same three variables

---

## Deploy

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy preview
netlify deploy --build

# Deploy to production
netlify deploy --build --prod
```

Or connect your GitHub repo to Netlify — it auto-deploys on push using `netlify.toml`.

**Build settings (auto-detected from netlify.toml):**
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel. The `api/sheets.ts` file is auto-detected as a serverless function.

---

## Local Dev with Leaderboard

To test the leaderboard locally:

**Netlify:**
```bash
npm install -g netlify-cli
netlify dev  # runs on :8888, proxies functions automatically
```
Leave `netlify dev` running and in another terminal: `npm run dev` (or just use `:8888` directly).

**Vercel:**
```bash
npm install -g vercel
vercel dev  # runs on :3000 with functions
```

---

## Scoring Formula

```
Points per shot = min( (ScratchBenchmark / UserProximity) × 50, 100 )
```

| Tier | Points | Color |
|------|--------|-------|
| Elite | 90–100 | 🟡 Gold |
| Strong | 75–89 | 🟢 Emerald |
| Solid | 60–74 | 🔵 Blue |
| Developing | < 60 | ⬜ Muted |

---

## Updating Distance Benchmarks

Edit `src/data/tourData.ts`. Each entry:

```typescript
{ yards: 120, tourMedian: 18.5, scratchBenchmark: 22.2, bucket: 'Mid' }
```

- `tourMedian` — Tour median proximity in feet (from @LouStagner PGA Tour data)
- `scratchBenchmark` — `tourMedian × 1.20`
- `bucket` — `'Wedges'` | `'Mid'` | `'Long'`

The round randomly picks 2 distances from each bucket, so there must be **at least 2 entries per bucket** to avoid errors.

---

## File Structure

```
src/
  components/
    HomePage.tsx          — Landing screen
    PlayerEntry.tsx       — Name entry
    RoundPlay.tsx         — Orchestrates active round
    ShotEntry.tsx         — Input for each shot
    ResultsCard.tsx       — Animated score reveal
    DistanceSummary.tsx   — 3-shot distance wrap-up
    RoundSummary.tsx      — Full round results + leaderboard submit
    Leaderboard.tsx       — All-time top 20
  data/
    tourData.ts           — Hardcoded distance/benchmark table
  hooks/
    useRound.ts           — All round state management
  services/
    sheetsService.ts      — API calls to /api/sheets
  types/
    index.ts              — Shared TypeScript types
  utils.ts                — Scoring helpers, tier colors

api/
  sheets.ts               — Vercel serverless function

netlify/functions/
  sheets.ts               — Netlify serverless function (same logic)
```

---

## Tech Stack

- [React 18](https://react.dev) + [Vite 5](https://vitejs.dev)
- [TypeScript 5](https://www.typescriptlang.org)
- [Tailwind CSS 3](https://tailwindcss.com)
- [Google Sheets API v4](https://developers.google.com/sheets/api)
- Deploy: [Netlify](https://netlify.com) or [Vercel](https://vercel.com)
