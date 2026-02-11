# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Toolkits is a multilingual web toolbox ("digital toolbox to solve paper-cuts in daily life") built with Next.js App Router. It hosts 44+ independent tool apps (e.g., color picker, GIF maker, base64 converter) in a modular architecture. Also ships as native iOS/Android apps via Capacitor.

## Commands

- `pnpm dev` — Start dev server (Turbopack)
- `pnpm build` — Production build (Turbopack)
- `pnpm start` — Serve production build on port 4000
- `pnpm test` — Run Jest tests
- `pnpm test:unit` — Run Jest tests (verbose)
- `pnpm build:cap` — Build for Capacitor native apps (sets `CAPACITOR_BUILD=true`, runs `cap sync`)
- `pnpm i18n:update` — Sync i18n translations from spreadsheet

## Architecture

### Routing

Next.js App Router with locale prefix: `src/app/[lang]/[route]/page.tsx`. Supported locales: `zh-CN`, `en-US`, `en-HK`, `zh-TW`.

### Modular App/Tool System

Each tool lives in `src/apps/<app_id>/` with this structure:
- `index.tsx` — Tool UI component (default export)
- `README.en-US.md` — English metadata (frontmatter: name, icon, description, channel, keywords, etc.)
- `README.zh-CN.md` — Chinese metadata

Apps are registered in `src/utils/appEntry.ts` as `next/dynamic` imports with `ssr: false`. The dynamic route `/[lang]/app/[id]` loads apps by ID. App metadata is parsed server-side from README frontmatter via `gray-matter` in `src/utils/appData.server.ts`.

### Adding a New App

1. Create `src/apps/<snake_case_id>/index.tsx` with the tool UI
2. Create `README.en-US.md` and `README.zh-CN.md` with frontmatter metadata (name, status, icon, description, channel, keywords, seoOptimizedDescription)
3. Add a dynamic import entry in `src/utils/appEntry.ts`
4. Icons: use existing icons from `public/icon/` or the dynamic icon API at `src/app/api/icon/`

### Key Directories

- `src/components/` — Shared React components (MUI v7-based)
- `src/contexts/` — React Context providers (colorMode, locale, account, action, appBar, sidebar)
- `src/data/` — i18n translations, channel definitions, external app data
- `src/utils/Services/` — External service integrations (Supabase, OpenAI)
- `src/utils/Hooks/` — Custom React hooks
- `src/app/api/` — API routes (AI, payments, feedback, icons, Telegram, stock)
- `types/` — TypeScript type definitions

### Path Aliases

```
@/components/* → src/components/*
@/contexts/*   → src/contexts/*
@/apps/*       → src/apps/*
@/utils/*      → src/utils/*
@/hooks/*      → src/hooks/*
@/data/*       → src/data/*
@/packages/*   → packages/*
@/types/*      → types/*
```

## Code Style

- UI framework: MUI v7
- Formatting: Prettier with tabs, tabWidth 4, bracketSpacing true
- TypeScript strict mode is off
- Next.js config ignores TS build errors in production
