# UNO House Rules

A static, mobile-first React SPA for picking, customising, printing and PNG-exporting your favourite UNO house rules. Settle the family arguments by *committing your rules to a printed page*, and ideally laminate it as well.

Four tabs, one master rule library:

- **Setup** — Setup and main objectives (deck composition, dealing, action card meanings, scoring).
- **Official** — Official rule set.
- **Neja's** — Rules I force my friends to play, strategic but fast paced.
- **Custom** — start from Official or Neja's, change anything, add your own rules. Auto-saves to `sessionStorage`.

Both export buttons live on every tab:

- **PNG** — generates a poster-quality image (rendered at 880px).
- **Print** — opens the browser print dialog so you can pin a copy to the fridge or save as PDF.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- `html-to-image` for PNG export
- No backend, no router. Custom selections + user-added options live in `sessionStorage`.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static dist/ ready to deploy
npm run preview  # preview the built bundle
```

## Editing the rules

All rule content lives in JSON, no code changes required:

- `src/data/setup.json` — Setup tab content.
- `src/data/ruleLibrary.json` — the master list of categories and options. Each category is either `exclusive: true` (radio behaviour) or `exclusive: false` (multi-select). Each option needs a stable `id` and `text`.
- `src/data/presets.json` — which option `id`s are pre-ticked for the Official and Neja's presets.

Add an option to a category: append a new `{ "id": "category.something", "text": "..." }` to its `options` array. To pre-tick it in a preset, add the id to that preset's `selectedIds`.

Users can also add their own options at runtime via the Custom tab — those persist to `sessionStorage` (key: `uno:custom`) and survive a "Reset to Official / Neja's" so you can re-tick them later.

## Deploying to Vercel

Vercel auto-detects Vite — there's no `vercel.json` and no extra config needed.

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and **Import Git Repository**.
3. Pick `uno-house-rules`. Framework preset will say **Vite**, build command `npm run build`, output directory `dist`. Click **Deploy**.
4. Future pushes to `main` auto-deploy to production. Pull-request branches get preview URLs for free.

Because the app uses `useState` for tabs (no client-side routing), every request hits `index.html` naturally — no SPA rewrite rules needed.

## Project layout

```
src/
├── data/             # ruleLibrary.json, presets.json, setup.json
├── types/            # rules.ts (RuleLibrary, Preset, CustomState, …)
├── hooks/            # useSessionState
├── components/       # Tabs, Checklist, RuleOptionCard, ExportBar, SetupSheet
├── pages/            # SetupPage, OfficialPage, NejasPage, CustomPage
├── App.tsx
├── main.tsx
└── index.css         # Tailwind v4 theme tokens + zine base styles
```

## Out of scope (by design)

- No login, no cloud sync, no shareable links.
- Custom selections clear when you close the tab. Use PNG/Print to immortalise a rule sheet you love.

Long live (organised) UNO chaos.
