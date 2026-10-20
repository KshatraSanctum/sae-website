# Codebase Architecture

This repository is a React/Vite single-page application. The structure is
intentionally incremental: content and UI can evolve independently, while
Supabase auth and race Edge Functions stay behind a typed API boundary.

## Ownership boundaries

```text
src/
├── components/       Reusable presentation components
│   ├── common/       Cross-page UI, metadata, error and loading states
│   ├── home/         Homepage sections
│   ├── intro/        Intro overlay presentation
│   ├── layout/       Navbar, footer and shared layout chrome
│   └── track/        Race HUD and responsive track presentation
├── config/           Runtime-safe configuration, routes and storage keys
├── data/             Static editorial content grouped by domain
├── hooks/            Reusable React state/effect logic
├── pages/            Route-level composition; avoid putting generic logic here
├── services/         I/O boundaries and provider adapters
│   └── api/          Typed request, auth, and race/leaderboard boundaries
├── styles/           Global and feature stylesheets
├── utils/            Framework-independent helpers and track utilities
└── carFollower3D.ts  Imperative Three.js integration (isolated browser boundary)
```

## Rules for new code

1. Keep editorial content in `src/data/<domain>.ts`; export it through
   `src/data/index.ts`.
2. Keep route-specific composition in `src/pages`. Move reusable state or DOM
   effects into `src/hooks` before adding more logic to a page.
3. Keep network calls in `src/services`. Components should receive typed data
   or call a service, not construct URLs or parse raw responses themselves.
4. Read `VITE_` configuration through `src/config/env.ts`. Never put secrets in
   Vite variables; Vite exposes them to the browser.
5. Use `src/utils/storage.ts` for browser storage because private browsing,
   blocked storage, and quota errors are valid runtime conditions.
6. Use integer milliseconds for race timings and preserve track/physics
   versions when adding persistent leaderboard records.
7. Prefer small named components and hooks over more conditional branches in a
   large page. Keep user-visible behavior stable while moving code.

## API boundary

`src/services/api/requestClient.ts` provides typed timeout, query, JSON parsing,
abort, and error handling. `leaderboardService.ts` defines the application
contract for leaderboard reads. `supabaseService.ts` provides the lazy shared
Supabase browser client and auth adapter: it supports Google OAuth, session
reads, sign-out, and auth-state subscriptions without constructing a client or
making a request until a method is explicitly called. `supabaseRaceService.ts`
uses that same client for the typed `start-race`, `submit-score`, and
`get-leaderboard` Edge Functions. Both services remain inert when the optional
Supabase environment variables are absent.

The deployable server boundary lives under `supabase/`: the migration owns
profiles, track rules, race sessions, score submissions, RLS, and the accepted
leaderboard view; Edge Functions own authenticated session creation, score
validation, and public leaderboard reads. The current React track page still
keeps local personal-best storage as a fallback, renders the leaderboard below
the race arena, and starts/submits a remote session only when a signed-in user
has configured the Supabase service.

When extending the race UI:

1. Keep authentication and score validation inside the provider/server boundary.
2. Inject the adapter into page or feature hooks rather than importing a
   provider SDK throughout the UI.
3. Keep local personal-best behavior as the offline fallback.

`VITE_SUPABASE_PUBLISHABLE_KEY` is the preferred browser-public key. The
runtime parser also accepts `VITE_SUPABASE_ANON_KEY` as a legacy alias and keeps
the existing `supabaseAnonKey` runtime property for current consumers. A URL
and public key must be supplied together; missing configuration is reported
when a Supabase service method is called.

## State management

State stays at the narrowest useful scope. Page workflows use domain hooks such
as `useJoinApplication`, modal effects use `useModalScrollLock`, and the track
page keeps high-frequency physics refs local to its feature. Introduce a global
store only when multiple unrelated routes truly share mutable state; do not
create global state for a value used by one page.

## Verification

The repository currently has no test runner. The required baseline check is:

```bash
npm run build
```

For race changes, also follow the manual checklist in `README.md`. Keep build
warnings separate from actual failures; Node/Vite compatibility and bundle-size
warnings may require toolchain work later but should not be hidden.
