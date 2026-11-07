# Codebase Architecture

This repository is a React/Vite single-page application. The structure is
intentionally incremental: content and UI can evolve independently, while
Supabase auth and race Edge Functions stay behind a typed API boundary.

## Ownership boundaries

```text
src/
├── components/       Reusable presentation components
│   ├── common/       Cross-page UI, metadata, SwarmBuildOverlay, error & loading states
│   ├── home/         Homepage sections (Hero, Subsystems, Teasers, Glimpses)
│   ├── intro/        Legacy intro overlay presentation (inactive, preserved)
│   ├── layout/       Navbar, footer, and shared layout chrome
│   └── track/        Race HUD and responsive track presentation
├── config/           Runtime-safe configuration, routes and storage keys
├── data/             Static editorial content grouped by domain
├── hooks/            Reusable React state/effect logic
├── pages/            Route-level composition; avoid putting generic logic here
├── services/         I/O boundaries and provider adapters
│   └── api/          Typed request, auth, and race/leaderboard boundaries
├── styles/           Global and feature stylesheets (main, landing, swarm-build-overlay)
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
8. When creating new route pages or adding major structural elements (cards,
   filter toolbars, headers, hero banners), register their selectors with the
   Swarm Build system (see below) to ensure zero-flash blanking and smooth
   assembly.

## Swarm Build Overlay & DOM Synchronization Architecture

The Swarm Build overlay (`src/components/common/SwarmBuildOverlay.tsx`) simulates a team of multiplayer Figma designers assembling the website live. To maintain pristine visual polish, prevent layout shift, and avoid any Flash of Unstyled/Unhidden Content (FOUC), the system follows a strict 3-phase synchronization lifecycle:

### 1. Frame-Zero Blanking Phase
- **Initial Hard Reloads:** An inline `<script>` in `index.html` attaches `html.swarm-initial-blank` before DOM nodes parse. CSS in `index.html` forces target elements to `opacity: 0 !important` while keeping layout dimensions intact (`getBoundingClientRect()` returns exact pixel sizes).
- **Client-Side Route Changes:** `SwarmBuildOverlay` attaches `html.swarm-page-blank` to `<html>` on pathname transitions. Stylesheet rules in `src/styles/swarm-build-overlay.css` blanket-hide all structural elements under `#mainContent`.
- **Fail-Safe Release:** A 2200ms timeout automatically removes blanking classes to guarantee no content remains trapped if an unexpected error occurs.

### 2. Work Queue & Construction Choreography Phase
- `scanPageElements()` queries the DOM using `STRUCTURAL_SELECTORS`.
- **Viewport Elements:** Found elements inside the viewport are queued into a rhythmic 110ms staggered wave. Available Figma cursors (`Isihin`, `Priya`, `Saurav`, `UI_Bot`, etc.) are assigned to targets.
- **Below-the-Fold Elements:** Observed via `IntersectionObserver`. When scrolled into view, an agent cursor glides over and constructs them on demand.
- **Wireframe Simulation:** An active cursor interpolates to the target's top-left origin, drags a temporary 1.5px dashed bounding box in the cursor's signature color to the bottom-right corner, and displays a dynamic `width × height` badge.

### 3. Reveal & Visibility Contract Phase
- Once the drag completes (480ms for cards, 580ms for headings), `revealElementSafely()` is invoked:
  - Removes `.swarm-build-hidden`.
  - Attaches `.swarm-built`, which smoothly transitions `opacity: 1 !important` over 350ms using Apple-style cubic-bezier curves.
  - Automatically activates ancestor and descendant `[data-reveal]` and `.reveal-up` elements with `.is-visible` so child content is never hidden by parent scroll-reveal wrappers.

### Developer Protocol: Registering New UI Elements
When you introduce a new card, header, filter toolbar, or section:
1. **`SwarmBuildOverlay.tsx`:** Add the element's class or ID selector to `STRUCTURAL_SELECTORS`.
2. **`swarm-build-overlay.css`:** Add the selector under both `html.swarm-initial-blank` and `html.swarm-page-blank #mainContent`.
3. **`index.html`:** Add the selector to the `<style>` block under `html.swarm-initial-blank`.
4. **Reveal Rules:** In `swarm-build-overlay.css`, ensure `.swarm-built <your-selector>` has `opacity: 1 !important` and `transform: translate(0) !important`.

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
