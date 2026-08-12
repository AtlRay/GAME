# Implementation Status

Last updated: 2026-08-12 (initial kickoff session)

## Repo audit (before this session)

The repository (`atlray/game`) had **zero commits and zero files** —
confirmed with `git status` / `git log` before writing anything. This
document reflects a from-scratch build, not a continuation of prior work.
This repo is **not connected** to any other Auto AI Technologies
project (Zayra Lovable app, chachy-hunter-core, the Vite/Vercel
rebuild) — no shared Supabase project, no shared state.

## What exists now

- `art/` — the approved reference art from this session's upload
  (Zayra, Chachy, Vera, roster-and-ui) copied in unchanged.
- `docs/GAME_DESIGN_BLUEPRINT.md` — the full blueprint, copied in unchanged.
- pnpm + Turborepo monorepo:
  - `packages/types` — shared contracts: `Player`, `Crew`, `Quest`,
    `PortalGame`, `OwnedAsset`, Chachy state/signal types, Zayra
    chat request/response types, telemetry event types (blueprint
    Section 24, 27, 28, 31).
  - `packages/game-core` — pure, framework-free game logic:
    - `ChachyStateMachine` / `nextChachyState`: deterministic FSM
      covering all 10 states from blueprint Section 28.
    - `authorizeReward`: the server-side choke point every reward
      path must call — denies unknown quests, incomplete objectives,
      and duplicate claims; only ever returns the *policy's* reward
      list, never anything client-supplied (blueprint Section 25).
    - `track`: a single telemetry hook other modules call instead of
      logging directly, with a swappable sink.
  - `apps/web` — Next.js 15, TypeScript strict, deployed as a normal
    Vercel app:
    - `/` — landing page.
    - `/world` — the vertical slice: R3F canvas, Rapier physics,
      third-person WASD character controller (dynamic rigid body,
      locked rotations, hull collider), a follow camera that orbits
      behind the player's facing direction, a greybox Founders City
      blockout (three rings of buildings with cyan/violet emissive
      accents, gold key light, cyan fill, fog — matching the mood of
      `art/roster-and-ui/03-ingame-ui-founders-city.png`, not final
      geometry), and a placeholder Chachy mesh wired live to the
      `ChachyStateMachine` (starts `SLEEP`→`IDLE`, follows on
      movement, an on-screen debug HUD button fires `enemyThreat` to
      demonstrate `ALERT` and `threatCleared` to return to `FOLLOW`).
    - `POST /api/zayra/chat` — server route handler behind a
      `ZayraAdapter` interface; the shipped `MockZayraAdapter` gives
      short, mode-tagged scripted responses (no model key required,
      none exposed to the client). The floating "Ask Zayra" panel in
      `/world` calls this route.
    - No secrets in client code; `.env.example` documents the one
      optional server-only variable a future real adapter would use.

## Tests run

`pnpm --filter @worldforge/game-core test` — **14/14 passing**:
- 9 tests on the Chachy FSM (every documented transition used in the
  demo path, plus proof that unhandled signals never move the state —
  "do not make Chachy teleport constantly").
- 5 tests on `authorizeReward` (unknown quest, incomplete objectives,
  already-claimed idempotency, successful grant, and a structural
  proof the function cannot echo back a client-supplied reward since
  the claim type has no `rewards` field).

`pnpm --filter @worldforge/web typecheck` and
`pnpm --filter @worldforge/web build` — both clean, strict mode
verified active via `tsc --showConfig` (Next.js's build-time note
about strict mode only inspects the immediate `tsconfig.json` file,
not its `extends` chain, so it under-reports — root cause checked and
confirmed a non-issue).

Manually smoke-tested against a production build (`next build` +
`next start`): `/` → 200, `/world` → 200,
`POST /api/zayra/chat` → correct scripted JSON response.

Not yet run: browser E2E, Lighthouse/perf budget, or a real multi-tab
proximity/social test (no realtime layer exists yet — see below).

## Open design question (flagged per kickoff instructions, not invented)

**Vera does not appear anywhere in `docs/GAME_DESIGN_BLUEPRINT.md`.**
The kickoff prompt describes her as "a discernment/truth character,
distinct from Zayra and Chachy" and explicitly says to flag this
rather than invent her gameplay function silently — so nothing in
this build gives Vera a mechanic, a route, a state machine, or a
scene presence. Her reference art (`art/vera/`) is in the repo and
untouched. This needs a design decision from Ray before Vera gets any
gameplay implementation: Is she a third companion (own FSM like
Chachy)? A Zayra-adjacent lore/hint voice? A Wild Grid-specific NPC?
The blueprint's zone/loop/social sections would all need a
corresponding addition once that's decided.

## Current risks

1. **No auth, no persistence, no DB.** `demo-player` is a hardcoded
   ID in the client; nothing survives a reload. Phase 0's
   auth/DB/CI items (blueprint Section 34) are not started.
2. **Companion state is client-only.** Fine for this placeholder demo
   (blueprint doesn't require Chachy's mood to be server-authoritative),
   but reward-adjacent Chachy behavior (rare-resource marking feeding
   real loot) will need to move behind `authorizeReward`-style checks
   once it affects drops.
3. **`authorizeReward` is a pure function with no caller yet.** It's
   unit-tested in isolation but not wired to a real quest-completion
   API route, DB, or idempotency store — that's next-task work, not
   done work.
4. **Zayra is fully scripted.** `MockZayraAdapter` is keyword-matched,
   not a model call. Swapping in a real model requires only a new
   `ZayraAdapter` implementation (interface is already isolated
   server-side per blueprint Section 27), but that adapter, its
   tool-permission layer, and moderation layer don't exist yet.
5. **Founders City is a procedural greybox, not art-directed
   geometry.** It captures the color/mood direction, not the final
   look — the art pipeline (blueprint Section 29, concept → GLB) hasn't
   started, so nothing here should be treated as final visual bar.
6. **No CI.** Tests and build are verified locally in this session
   only; there's no GitHub Actions workflow yet enforcing them on
   push/PR.
7. **Single-player only.** No realtime/presence layer, no
   friends/party/crew (blueprint Section 8, Phase 4) — the "join one
   other player" vertical-slice acceptance criterion (Section 33) is
   not met yet.

## Next 5 highest-value tasks

1. **Resolve the Vera design question with Ray**, then give her a
   minimal FSM + scene presence if she's meant to ship in the vertical
   slice, mirroring how Chachy's FSM was built.
2. **Wire `authorizeReward` to a real route + a real quest**, backed
   by Postgres/Supabase (even one hardcoded quest is enough to prove
   the server-authoritative path end-to-end, per blueprint Section 25).
3. **Add auth** (even a minimal email/session flow) so `Player` records
   are real instead of a hardcoded `demo-player` string, since
   everything else (crews, quests, rewards) depends on a real player ID.
4. **Add CI** (typecheck + `game-core` tests) on push/PR so this bar
   doesn't regress silently as more contributors/sessions touch the repo.
5. **Start the realtime presence layer** (even a minimal WebSocket
   "who else is in Founders City" list) — it's the prerequisite for
   the "join one other player" and "complete one public event"
   vertical-slice acceptance criteria (Section 33), and for Phase 4
   social work generally.
