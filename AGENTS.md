# AGENTS.md — tyketik

## Repo snapshot
Fresh [TanStack Start](https://tanstack.com/start) scaffold. No CI, no tests written, no Supabase/AI/face-detection code yet. Deployment target: **Netlify**.

---

## Package manager
**npm** — lockfile is `package-lock.json`. Ignore the `"pnpm"` key in `package.json`; it is a vestigial scaffold artifact. Always use `npm`.

---

## Developer commands

| Purpose | Command |
|---|---|
| Dev server (port 3000) | `npm run dev` |
| Production build | `npm run build` |
| Preview build | `npm run preview` |
| Lint | `npm run lint` |
| Format | `npm run format` |
| Lint + format + import sort | `npm run check` |
| Tests (single-pass) | `npm run test` |
| Typecheck only | `npx tsc --noEmit` |

No typecheck npm script exists — use `npx tsc --noEmit` directly.

---

## TanStack Start — key quirks

- Uses **`@tanstack/react-start/plugin/vite`** (not Vinxi). The older Vinxi-based docs/examples do not apply.
- Routing is **file-based** under `src/routes/`. Adding a file auto-generates a route.
- **`src/routeTree.gen.ts` is auto-generated** — never edit it. It is excluded from Biome and VSCode file-search intentionally.
- Server functions (RPC): use `createServerFn()` from `@tanstack/react-start`. These run only on the server and generate type-safe client stubs automatically.
- Router is created in `src/router.tsx` via `createTanStackRouter()`.
- Root shell (HTML, `<head>`, devtools overlay) lives in `src/routes/__root.tsx`.

---

## Path aliases

Both `#/*` and `@/*` resolve to `./src/*` (set in both `tsconfig.json` and `vite.config.ts` via `resolve.tsconfigPaths`).

---

## TypeScript

- Version **6** — bleeding-edge; some third-party typings may lag.
- `strict: true`, `noUnusedLocals`, `noUnusedParameters` — unused imports/vars are errors.
- `verbatimModuleSyntax: true` — type-only imports **must** use `import type`.
- `allowImportingTsExtensions: true` — `.tsx` extension is allowed in imports.
- `noEmit: true` — tsc never emits; Vite handles transpilation.

---

## Linting & formatting — Biome v2

- **No ESLint, no Prettier.** Biome handles both.
- Indent: **tabs**. Quotes: **double**.
- Import organization runs automatically on save (VSCode `codeActionsOnSave`).
- `biome.json` excludes `src/routeTree.gen.ts` and `src/styles.css` — do not add Biome overrides for those files.
- Run `npm run check` before committing; it combines lint + format + import-sort.

---

## Styling — Tailwind CSS v4

- No `tailwind.config.*` file — Tailwind v4 is configured entirely through the Vite plugin and CSS.
- Entry: `src/styles.css` (`@import "tailwindcss"`). This file is excluded from Biome.
- `@tailwindcss/typography` plugin is installed for prose styling.

---

## Testing — Vitest 4

- Runs with **jsdom** environment and `@testing-library/react`.
- No `vitest.config.*` — config inherits from `vite.config.ts`.
- `npm run test` is single-pass (no watch). Use `npx vitest` for watch mode.
- No tests exist yet — write tests alongside new features.

---

## Deployment — Netlify

- `netlify.toml` + `@netlify/vite-plugin-tanstack-start` adapter handle SSR via Netlify Functions.
- `npm run build` produces `dist/client/` (static) and Netlify Functions (SSR).
- Environment variables must be set in Netlify Site settings for production. No `.env.example` file exists — create one when adding env vars.

---

## Planned integrations (not yet implemented)

### Supabase
- Install: `npm install @supabase/supabase-js`
- Required env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and optionally `SUPABASE_SERVICE_ROLE_KEY` (server-only).
- Use `createServerFn()` for any server-side Supabase calls to avoid leaking the service-role key to the client.
- Supabase Auth helpers for TanStack: `@supabase/ssr` (preferred over `@supabase/auth-helpers-*`).

### Face & eye detection
- Primary candidate: **MediaPipe** (`@mediapipe/tasks-vision`) — Google's browser-native WASM model; no server round-trip needed.
- Fallback / alternative: `face-api.js` or `@vladmandic/face-api` for older model support.
- These are client-side only — keep detection logic in client components, not server functions.
- WASM assets are large; lazy-load the detector module and use dynamic `import()`.

### AI / LLM integration
Priority order per project plan:

1. **GitHub Copilot token** — use the `openai`-compatible endpoint (`https://api.githubcopilot.com`) with the `openai` SDK; set `baseURL` and pass the Copilot token as `apiKey`.
2. **Google Generative AI** — `@google/generative-ai` or `@ai-sdk/google` (Vercel AI SDK).
3. **Claude / Anthropic** — `@anthropic-ai/sdk` or `@ai-sdk/anthropic`.
4. **OpenCode** — self-hosted or API; integrate as needed.

Use the [Vercel AI SDK](https://sdk.vercel.ai) (`ai` package) as the unified abstraction layer — it supports all four providers through a consistent interface and integrates well with TanStack Start via `createServerFn()` for streaming.

Keep all API keys server-side inside `createServerFn()` or Netlify environment variables. Never expose keys in client bundles.

---

## Key file map

```
src/
├── router.tsx            # Router factory — createTanStackRouter()
├── routeTree.gen.ts      # AUTO-GENERATED — do not edit
├── routes/
│   ├── __root.tsx        # HTML shell, <head>, devtools
│   └── index.tsx         # "/" route
└── styles.css            # Tailwind v4 entry — excluded from Biome
```
