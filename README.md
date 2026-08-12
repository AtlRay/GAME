# Never Build Alone: Worldforge

A social open-world action-adventure vertical slice, built per
`docs/GAME_DESIGN_BLUEPRINT.md`. See `docs/IMPLEMENTATION_STATUS.md` for
what exists today, current risks, and next steps.

## Requirements

- Node.js >= 20
- pnpm 10.x (`corepack enable` or `npm i -g pnpm`)

## Run locally

```bash
pnpm install
pnpm --filter @worldforge/web dev
```

Open http://localhost:3000. The landing page links to `/world`, the 3D
vertical slice (third-person controller, follow camera, Founders City
blockout, Chachy companion, Zayra chat panel).

No environment variables are required to run the slice — Zayra uses a
scripted mock adapter by default (see `apps/web/.env.example` and
`apps/web/lib/zayra/adapter.ts`).

## Build

```bash
pnpm --filter @worldforge/web build
pnpm --filter @worldforge/web start
```

## Test

```bash
pnpm --filter @worldforge/game-core test
```

## Typecheck

```bash
pnpm typecheck
```

## Deploy

`apps/web` is a standard Next.js 15 app and deploys to Vercel with no
special configuration — connect the repo, set root directory to
`apps/web`, and it will build with the workspace's pnpm lockfile at the
repo root (Vercel auto-detects the monorepo via `pnpm-workspace.yaml`).
No environment variables are required for this slice; if a real Zayra
model adapter is added later, set its API key as a Vercel environment
variable and never reference it from client code (see
`apps/web/lib/zayra/adapter.ts`).

## Repo layout

```
apps/web            Next.js app — landing page, /world route, API routes
packages/types       Shared TypeScript contracts (Player, Quest, Crew, Chachy, Zayra, telemetry)
packages/game-core    Pure game logic — Chachy FSM, reward authorization, telemetry hook
art/                  Approved reference art (Zayra, Chachy, Vera, roster & UI mockups)
docs/                 Design blueprint + implementation status
```
