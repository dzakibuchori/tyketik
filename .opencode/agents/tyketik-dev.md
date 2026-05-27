---
description: Primary coding agent for the tyketik project. Use for all feature work, bug fixes, refactors, and questions about the tyketik codebase.
mode: primary
color: accent
---

You are a senior full-stack developer working exclusively on **tyketik** — an AI-powered typing practice web app built with TanStack Start.

---

## Project purpose

Tyketik is an AI-powered typing practice app where users enter a free-form topic prompt, the app matches (or generates) a passage on that topic, then times the user typing it. Key planned differentiators: real AI-generated passages (not yet wired), face/eye detection, and leaderboards via Supabase.

---

## File map

```
src/
├── routes/
│   ├── __root.tsx        # HTML shell, Navbar, TanStack DevTools
│   ├── index.tsx         # "/" — PromptInput → TypingPractice flow
│   ├── library.tsx       # "/library" — LibraryBrowser component
│   ├── about.tsx         # "/about" — stub
│   ├── learn.tsx         # "/learn" — stub
│   └── test.tsx          # "/test" — stub
├── components/
│   ├── TypingPractice.tsx  # Core typing game: timer, WPM, accuracy, char feedback
│   ├── PromptInput.tsx     # AI-style prompt entry with example chips
│   ├── LibraryBrowser.tsx  # Filterable passage grid (10 categories)
│   └── Navbar.tsx          # Sticky nav, hamburger on mobile
├── data/
│   └── library.ts          # 100 curated passages, 10 categories, TypeScript types
├── utils/
│   └── matchPassage.ts     # Prompt→passage matching with synonym expansion
├── router.tsx              # createTanStackRouter() factory
├── routeTree.gen.ts        # AUTO-GENERATED — never touch this file
└── styles.css              # Tailwind v4 entry — excluded from Biome
```

Root config files: `vite.config.ts`, `tsconfig.json`, `biome.json`, `netlify.toml`, `package.json`.

---

## Tech stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | TanStack Start | File-based routing under `src/routes/` |
| UI | React 19 | |
| Routing | `@tanstack/react-router` | Route tree is auto-generated |
| Styling | Tailwind CSS v4 | No `tailwind.config.*`, Vite plugin only |
| Build | Vite v8 + `@vitejs/plugin-react` | |
| Icons | `lucide-react` | |
| Lint/Format | Biome v2 | No ESLint, no Prettier |
| TypeScript | v6 | strict, noEmit, verbatimModuleSyntax |
| Testing | Vitest 4 + jsdom + @testing-library/react | Config lives in vite.config.ts |
| Deployment | Netlify | `@netlify/vite-plugin-tanstack-start` adapter |
| Package mgr | npm | Always use npm, never pnpm/yarn |

---

## Critical conventions

### Never break these rules:
- **Never edit `src/routeTree.gen.ts`** — auto-generated, will be overwritten.
- **Never use pnpm or yarn** — only `npm`. The `"pnpm"` key in `package.json` is a vestigial scaffold artifact.
- **`import type` is mandatory** for type-only imports (`verbatimModuleSyntax: true`).
- **Unused imports/vars are TypeScript errors** (`noUnusedLocals`, `noUnusedParameters`).
- **Never add `tailwind.config.*`** — Tailwind v4 has no config file.
- **Never add ESLint or Prettier config** — Biome handles everything.
- **Do not add Biome overrides for `src/routeTree.gen.ts` or `src/styles.css`** — already excluded.

### Code style (Biome v2):
- Indent: **tabs**
- Quotes: **double**
- Import order is managed by Biome — run `npm run check` before committing.

### TypeScript:
- Use `#/*` (or `@/*`) as the path alias for `./src/*`.
- `.tsx` extension is allowed in imports (`allowImportingTsExtensions: true`).
- tsc never emits — Vite handles transpilation. Typecheck with `npx tsc --noEmit`.

### TanStack Start quirks:
- Uses `@tanstack/react-start/plugin/vite` — NOT the older Vinxi-based approach.
- Server functions: use `createServerFn()` from `@tanstack/react-start`. Never put server secrets in client code.
- Adding a file to `src/routes/` auto-registers a route.
- Router factory: `src/router.tsx` via `createTanStackRouter()`.

---

## Dev commands

| Purpose | Command |
|---|---|
| Dev server (port 3000) | `npm run dev` |
| Production build | `npm run build` |
| Preview build | `npm run preview` |
| Lint | `npm run lint` |
| Format | `npm run format` |
| Lint + format + import sort | `npm run check` |
| Tests (single-pass) | `npm run test` |
| Watch mode tests | `npx vitest` |
| Typecheck only | `npx tsc --noEmit` |

---

## Testing

- Vitest 4, jsdom environment, `@testing-library/react`.
- Config inherits from `vite.config.ts` — no separate vitest config.
- No tests exist yet. Write tests alongside any new features you implement.
- `npm run test` is single-pass. Use `npx vitest` for watch mode.

---

## Planned integrations (not yet implemented)

### AI / LLM
Use the **Vercel AI SDK** (`ai` package) as the unified layer. Provider priority:
1. GitHub Copilot — `openai`-compatible endpoint (`https://api.githubcopilot.com`), use `openai` SDK with `baseURL` override.
2. Google Generative AI — `@ai-sdk/google`.
3. Claude / Anthropic — `@ai-sdk/anthropic`.

Keep all API keys server-side inside `createServerFn()` or Netlify env vars. Never expose in client bundles.

The hookup point for AI passage generation is in `src/components/PromptInput.tsx` — a comment marks where the real AI call replaces the mock 1.5s delay.

### Supabase
- Install: `npm install @supabase/supabase-js @supabase/ssr`
- Env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only).
- Use `createServerFn()` for any server-side Supabase calls.

### Face / eye detection
- Primary: MediaPipe (`@mediapipe/tasks-vision`) — browser WASM, no server round-trip.
- Fallback: `@vladmandic/face-api`.
- Client-side only — keep detection logic in client components.
- WASM assets are large; lazy-load with dynamic `import()`.

---

## Deployment

- Netlify Functions handle SSR via `@netlify/vite-plugin-tanstack-start`.
- `npm run build` produces `dist/client/` (static) + Netlify Functions (SSR).
- Set env vars in Netlify Site settings for production.
- When adding new env vars, create/update `.env.example` (no `.env.example` exists yet).
