# Research OS

A personal research operating system for tracking brands, founders, products, and market signals.

一个自动追踪品牌、人物、产品和行业事件的个人研究系统。把碎片信息转化为可复用的深度研究资产。

---

## Features

- **Apple-style Research Dashboard** — Clean, minimal UI with glass-morphism cards and strong typographic hierarchy
- **Daily Auto Research** — GitHub Actions automatically picks a watchlist item and generates a research report every day
- **Manual Research** — Trigger research on any subject via GitHub Actions workflow dispatch
- **Unread Indicators** — Reports you haven't opened yet show a "New" badge, tracked via localStorage
- **Research Detail Pages** — Each report includes: Origin Story, Initial Innovation, Breakout Moment, Customer Impact, Ecosystem Impact, Business Model, Competitive Landscape, What Worked, Risks, Lessons for Builders, and Final Judgment
- **Watchlist** — Queue of brands, founders, products, and industry events to research
- **Signal Feed** — Scan recent reports for key signals and trends

---

## Local Development

```bash
cd D:\Yuan\research-os
npm install
npm run dev
```

The app runs at `http://localhost:5173/research-os/`.

## Build

```bash
npm run build
```

Output goes to `dist/`.

---

## GitHub Pages Deployment

The project is configured to deploy to GitHub Pages at:

`https://USERNAME.github.io/research-os/`

If your repository name is NOT `research-os`, update `vite.config.ts`:

```ts
export default defineConfig({
  base: '/YOUR_REPO_NAME/',
})
```

A GitHub Actions workflow at `.github/workflows/deploy.yml` handles automatic deployment on each push to `main`.

---

## Daily Research Automation

A GitHub Actions workflow at `.github/workflows/daily-research.yml` runs daily at 8:00 UTC.

It:
1. Reads `public/data/watchlist.json` for research targets
2. Picks the highest-priority item not recently researched
3. Generates a structured research report (AI or mock)
4. Prepends it to `public/data/reports.json`
5. Commits and pushes the changes
6. GitHub Pages auto-deploys the updated site

### Enabling Real AI Research

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add repository secrets:
   - `OPENAI_API_KEY` — Your OpenAI API key
   - `SEARCH_API_KEY` — (Optional) Web search API key

Without API keys, daily research generates mock reports (placeholder data) so the pipeline stays green.

---

## Manual Research Generation

1. Go to your GitHub repository → Actions
2. Select **Manual Research** workflow
3. Click **Run workflow**
4. Fill in:
   - `subject` — Brand, person, product, company, or event name
   - `report_type` — `brand` | `founder` | `product` | `company` | `crowdfunding` | `industry_event`
   - `notes` — (Optional) Extra research directions
5. Click **Run workflow**

Or locally:

```bash
node scripts/generate-manual-report.mjs --subject "AEKE" --type "brand" --notes "Focus on Kickstarter strategy"
```

---

## Project Structure

```
research-os/
├─ package.json
├─ index.html
├─ vite.config.ts
├─ tsconfig.json
├─ README.md
├─ .gitignore
├─ .env.example
├─ public/
│  └─ data/
│     ├─ reports.json          # All research reports
│     ├─ watchlist.json        # Research queue
│     └─ daily-state.json      # Automation state
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ styles/
│  │  ├─ global.css
│  │  └─ report.css
│  ├─ components/
│  │  └─ ReportCard.tsx
│  ├─ pages/
│  │  ├─ HomePage.tsx
│  │  ├─ ReportPage.tsx
│  │  ├─ SignalsPage.tsx
│  │  └─ WatchlistPage.tsx
│  ├─ types/
│  │  └─ report.ts
│  └─ utils/
│     ├─ readStatus.ts
│     ├─ formatDate.ts
│     ├─ slugify.ts
│     └─ filters.ts
├─ scripts/
│  ├─ generate-daily-report.mjs
│  ├─ generate-manual-report.mjs
│  ├─ render-report-data.mjs
│  ├─ choose-research-target.mjs
│  ├─ validate-report.mjs
│  ├─ update-index-data.mjs
│  └─ lib/
│     ├─ ai-client.mjs
│     ├─ search-client.mjs
│     ├─ report-schema.mjs
│     ├─ prompt-builder.mjs
│     ├─ file-utils.mjs
│     └─ github-utils.mjs
└─ .github/
   └─ workflows/
      ├─ deploy.yml
      ├─ daily-research.yml
      └─ manual-research.yml
```

---

## Data Schema

See `src/types/report.ts` for the full `ResearchReport` TypeScript interface.

Each report contains:
- **Origin Story** — Why it was created, what problem it solved
- **Initial Innovation** — What was novel at launch
- **Breakout Moment** — When and why it took off
- **Customer Impact** — How it changed users
- **Ecosystem Impact** — Industry-level effects
- **Business Model** — Revenue, margins, channels
- **Competitive Landscape** — Rivals and positioning
- **What Worked** — Success factors with evidence
- **Risks** — Threats and their fixability
- **Lessons for Builders** — Actionable takeaways
- **Final Judgment** — Learnable, copyable, investable

---

## Roadmap

- [ ] Vercel Function for one-click web research trigger
- [ ] Real web search API integration
- [ ] PDF export
- [ ] Report bookmarking
- [ ] Multi-language reports
- [ ] Trend charts
- [ ] Competitive matrix visualization
- [ ] Industry map
- [ ] Email daily digest
- [ ] Research quality scoring
- [ ] Tag-based discovery

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | No | OpenAI API key for AI-generated reports |
| `SEARCH_API_KEY` | No | Web search API key for real-time research |

---

Built with Vite + React + TypeScript. Deployed on GitHub Pages.
