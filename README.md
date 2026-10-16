# SAE India · BIT Sindri

Official web platform of the **SAE India Collegiate Society, BIT Sindri** — fostering innovation, engineering excellence, and hands-on learning in automotive and aerospace engineering.

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646C99?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-3D-black?logo=three.js&logoColor=white)](https://threejs.org/)

---

## 🏎️ Features & Pages

- **Interactive 3D Elements & Follower** — Interactive car cursor and custom canvas physics powered by Three.js.
- **Race Track Challenge (`/track`)** — Autódromo Interlagos-inspired circuit simulation with synthesized Web Audio engine sound, fullscreen mode, and local personal best records.
- **Competitions & Achievements (`/competitions`)** — Complete timeline of milestones across BAJA SAE, SUPRA SAE, Effi-Cycle, Quad Torc, and UAV challenges.
- **Team Directory (`/team`)** — Dynamic member directory with randomized display for latest batches and executive hierarchy.
- **Events & Workshops (`/events`)** — CAD workshops, manufacturing masterclasses, and automotive seminars.
- **Sponsors & Partners (`/sponsors`)** — Tiered industry partner showcase.
- **Recruitment & Membership (`/join`)** — Information and entry portal for aspiring collegiate engineers.

---

## 🛠️ Tech Stack

- **Frontend Core:** [React 19](https://react.dev/), [React Router v7](https://reactrouter.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Graphics & Audio:** [Three.js](https://threejs.org/), HTML5 Canvas, Web Audio API
- **Styling:** Modular CSS3 with custom responsive layouts

---

## 💻 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/saeindiabit-sindri/sae-website.git
cd sae-website

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```text
sae-website/
├── public/                 # Static assets (logos, achievement images, team photos)
│   ├── achievements/       # Milestone photos & trophies
│   ├── events/             # Workshop and event banners
│   ├── sponsors/           # Corporate and partner logos
│   └── team/               # Team member portrait images
├── src/
│   ├── components/         # Reusable layout and page section components
│   │   ├── common/         # Route metadata, scroll handlers, fallback loaders
│   │   ├── home/           # Homepage teaser components
│   │   ├── intro/          # Animated splash / intro overlay
│   │   └── layout/         # Navbar, Footer, Mobile scroll track
│   ├── hooks/              # Custom React hooks (e.g., useTrackFullscreen)
│   ├── pages/              # Primary route pages (Home, Track, Team, etc.)
│   ├── styles/             # Modular CSS stylesheets
│   ├── utils/              # Track physics, audio synthesis, circuit geometry
│   ├── carFollower3D.ts    # Three.js 3D follower canvas logic
│   ├── data.ts             # Central data source for milestones, team, and events
│   ├── App.tsx             # Root router and route configuration
│   └── main.tsx            # Application entry point
├── vercel.json             # SPA rewrite configuration
└── vite.config.ts          # Vite build config
```

> [!TIP]
> **Updating Society Content**: To update team members, milestones, sponsors, or competition entries, edit [`src/data.ts`](file:///Users/rahulkumar/saee/src/data.ts). See [`CONTRIBUTING.md`](file:///Users/rahulkumar/saee/CONTRIBUTING.md) for detailed guidelines.

---

## 🏁 Quality Assurance & Race Track Verification

Automated browser visual tests are not configured. Run `npm run build` to verify TypeScript types and bundling. Before deploying changes affecting the race view (`/track`), perform these manual QA checks:

1. **Launch Sequence:** Hover over the highlighted **START ZONE**, then press **Space**. The launch sequence should trigger once. Clicking, tapping, Enter, or holding Space before entering the zone must not start a race.
2. **Hover Invariance:** Leaving the zone before pressing Space must keep the race on standby. After Reset, scrolling, resizing, or switching tabs, move onto the zone again to establish a fresh hover.
3. **Control Isolation:** Focusing a toolbar button and pressing Space must activate only that control. Moving back onto the start zone restores normal hover-and-Space flow.
4. **Responsive Layouts:** Verify narrow screens — guidance cards must clear the car/start zone, and the instruction strip must stay above the arena without shifting the circuit.
5. **Fullscreen Mode:** Expand and collapse the race view (including exiting with `Escape`). Controls and car must remain visible, and changing view mode should safely reset the current attempt.
6. **Local Persistence:** Complete a lap and refresh: personal best records must persist locally in `localStorage`, slower laps must not overwrite it, and Standard/Pro records must remain separated.

---

## 🤝 Contributing

We welcome contributions from all society members, especially juniors eager to learn and build!

Please read our [**Contributing Guide (CONTRIBUTING.md)**](file:///Users/rahulkumar/saee/CONTRIBUTING.md) to get started with:
- Setting up your local environment
- Git workflow & branch naming conventions
- How to add your profile, achievements, or events to `src/data.ts`
- Image compression and asset guidelines
- Submitting your Pull Request

---

## 📬 Contact & Connect

Stay updated with SAE India BIT Sindri:

- **Email:** [saeindia@bitsindri.ac.in](mailto:saeindia@bitsindri.ac.in)
- **LinkedIn:** [SAE India BIT Sindri](https://in.linkedin.com/company/saeindia-bit-sindri)
- **Instagram:** [@sae_bit_sindri](https://www.instagram.com/sae_bit_sindri/)
- **YouTube:** [@saeindiabitsindri1180](https://www.youtube.com/@saeindiabitsindri1180)
- **Facebook:** [SaeBITSindri](https://www.facebook.com/SaeBITSindri/)
- **GitHub:** [saeindiabit-sindri](https://github.com/saeindiabit-sindri)

**Campus Address:**  
BIT Sindri, Dhanbad, Jharkhand – 828123, India

---

*Built with passion by the SAE India BIT Sindri Technical Team.*
