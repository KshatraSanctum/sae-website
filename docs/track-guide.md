# Track Race Guide

This guide covers the interactive race experience at [`/track`](http://localhost:5173/track)
and the checks maintainers should perform after changing the race page.

## Requirements

- A desktop or laptop browser with a mouse or trackpad.
- A keyboard for the race start and keyboard shortcuts.
- WebGL for the 3D follower car. The circuit can still render if the car is unavailable.

Touch and small-screen devices receive the track's mobile/tablet advisory instead
of the full pointer-driven race experience.

## Starting a race

1. Open `http://localhost:5173/track` while the development server is running.
2. Find the highlighted **START ZONE** on the circuit.
3. Move the mouse or trackpad pointer into the zone and keep it there.
4. Press **Space** once to launch the car.
5. Keep the car within the track boundary and pass the checkpoints in order.

The start requires a fresh hover. Clicking, tapping, pressing Enter, or holding
Space before hovering the zone does not start a race.

## Controls

| Action | Control | Notes |
| --- | --- | --- |
| Start a race | Hover **START ZONE** + **Space** | The pointer must still be inside the zone when Space is pressed. |
| Drive | Mouse or trackpad | The 3D car follows the pointer while racing. |
| Expand/collapse race view | **F** or the fullscreen button | The shortcut is available on desktop race mode and ignores repeated or modified key presses. |
| Exit fullscreen | **Escape** | Works for both native fullscreen and the expanded fallback view. |
| Reset to grid | **R** or **Reset (R)** | Resets the current attempt. |
| Recover after a crash | **Try Again ↻** | Dismisses the persistent crash alert and prepares the car on the start grid. |
| Change tolerance | **Tolerance** button | Available while the race is on standby. |
| Toggle audio | **Audio On/Muted** button | Audio is procedural and can be muted without affecting the race. |

Toolbar controls keep their normal button behavior. For example, pressing
Space while a toolbar button is focused activates that button rather than
starting a race.

## Expanded view behavior

When the race view is expanded:

- The shared site header/footer and track leaderboard are hidden so the circuit gets the available space; the race header remains available for controls.
- The top 💡 start-help strip is hidden; the in-arena launch card and start-zone label remain available.
- Pressing **F** again collapses the view.
- Pressing **Escape** exits native fullscreen or the expanded fallback view.
- Entering or leaving the view resets an active attempt to the grid so the track coordinate mapping stays valid.

## Crash recovery

An off-track collision or invalid lap route returns the car to the grid and
shows a red crash alert. The alert remains visible until the user chooses
**Try Again ↻**, so the failure reason can be read.

After selecting **Try Again**:

1. The crash alert closes.
2. The car remains locked on the start grid.
3. Move back over the highlighted **START ZONE**.
4. Press **Space** to begin a fresh attempt.

## Manual verification checklist

Use this checklist for changes to `src/pages/TrackPage.tsx`,
`src/components/track/`, `src/styles/track.css`, or the track utilities.

### Launch and pointer safety

- The normal instruction above the arena emphasizes **pointer** and **Space**.
- Space starts only after the pointer enters and remains in the start zone.
- Leaving the zone, scrolling, resizing, switching tabs, or changing focus disarms the start.
- Clicking, tapping, Enter, or a repeated/modified Space press does not launch the race.

### Fullscreen and shortcuts

- Click **Expand (F)** and confirm the race view fills the available browser view.
- Press **F** on the page and confirm it toggles the same view.
- Confirm the top 💡 instruction is absent while expanded and returns after collapsing.
- Press **Escape** and confirm the view exits cleanly.
- Focus a toolbar button or link and press **F**; it must not unexpectedly toggle the view.
- Confirm entering or leaving the view resets an active attempt safely.

### Crash and retry

- Trigger an off-track crash and confirm the alert remains visible long enough to read.
- Confirm the alert contains a clickable **Try Again ↻** button.
- Click the button and verify the alert closes, the car is on the grid, and a fresh hover plus Space starts the next attempt.
- Repeat with an invalid checkpoint or route if the physics logic was changed.

### Persistence and responsive behavior

- Complete a valid lap and confirm the personal best survives a refresh.
- Confirm slower laps do not replace the personal best.
- Verify Standard and Pro personal bests remain separate.
- Check narrow desktop and landscape layouts for clipped controls or overlays.
- Check a touch/small-screen viewport for the mobile/tablet advisory instead of the desktop race controls.

## Troubleshooting

- **The car is unavailable:** Check WebGL support and the browser console. The SVG circuit and informational state should still render.
- **Space does nothing:** Move the pointer into the highlighted start zone, release modifier keys, and ensure focus is not inside a toolbar control or text field.
- **The race resets unexpectedly:** Check for scrolling, resizing, tab visibility changes, fullscreen transitions, or a route/checkpoint violation.
- **The leaderboard is unavailable:** The race remains playable locally. Configure the public Supabase values and deploy the race functions to enable authenticated submissions.

The repository has no automated browser test runner. Run `npm run build` for
TypeScript and production-bundle verification, then perform the relevant manual
checks above.
