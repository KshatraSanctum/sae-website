# SAE India BIT Sindri

Welcome to the official repository of **SAE India Collegiate Society, BIT Sindri**.

## About

SAE India BIT Sindri is a student-run collegiate society dedicated to fostering innovation, engineering excellence, and hands-on learning in the field of automotive and aerospace engineering.

## 🚀 What We Do

- **Design & Build** — Vehicles and systems for national-level competitions
- **Workshops & Events** — Hands-on sessions on CAD, manufacturing, and emerging tech
- **Community** — A network of passionate engineers pushing boundaries

## 🛠️ Tech Stack

- TypeScript
- Vite
- Vanilla CSS & HTML5

## 💻 Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Race Track Verification

There is no configured automated test or lint script. `npm run build` checks
TypeScript and creates the production bundle; it does not verify browser input
or visual placement. Open `/track` on the development or preview server and
perform these manual checks before shipping race-view changes:

1. Keep the pointer over the highlighted **START ZONE**, then press **Space**.
   The launch sequence should run once. Clicking, tapping, Enter, or holding
   Space before entering the zone must not start a race.
2. Leave the zone before pressing Space: the race must stay on standby. After
   Reset, scrolling, resizing, or switching tabs, move onto the zone again to
   establish a fresh hover.
3. Focus a toolbar control and press Space: only that control should activate.
   Moving back onto the start zone should allow the normal hover-and-Space flow.
4. Check normal and narrow layouts: the guidance card must clear the car/start
   zone, and the instruction strip must stay above the arena without shifting
   the circuit when the race starts.
5. Expand and collapse the race view, including exiting with Escape. Controls
   and the car should remain visible, the fullscreen guidance card should stay
   centered, and changing views should safely reset the attempt.
6. Complete a valid lap and refresh: the personal best should persist locally,
   slower laps should not replace it, and Standard/Pro records should remain
   separate. Fullscreen changes and resets must not erase those records.

## 📬 Contact

Stay connected with us for updates and events!

---

*Built with passion by SAE India BIT Sindri*
