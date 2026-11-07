# Contributing to SAE India · BIT Sindri

Welcome! We are thrilled that you are interested in contributing to the official web platform of **SAE India Collegiate Society, BIT Sindri**. 

Whether you are a 1st-year student adding your team member profile, a 2nd/3rd-year working on new features, or fixing a bug, this guide will walk you through the process step-by-step.

---

## 📌 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Quickstart: Setting Up Locally](#-quickstart-setting-up-locally)
3. [Git Workflow & Branching](#-git-workflow--branching)
4. [Common Contributions Guide](#-common-contributions-guide)
   - [1. Adding / Updating Team Members](#1-adding--updating-team-members)
   - [2. Adding Achievements or Milestones](#2-adding-achievements-or-milestones)
   - [3. Adding Upcoming or Past Events](#3-adding-upcoming-or-past-events)
   - [4. Adding Sponsors & Partners](#4-adding-sponsors--partners)
   - [5. Adding New Sections or Components (Swarm Build Registration)](#5-adding-new-sections-or-components-swarm-build-registration)
5. [Asset & Image Guidelines](#-asset--image-guidelines)
6. [Code Style & Verification](#-code-style--verification)
7. [Submitting a Pull Request (PR)](#-submitting-a-pull-request-pr)
8. [Getting Help & Mentorship](#-getting-help--mentorship)

---

## 🛠 Prerequisites

Before starting, make sure you have the following installed on your machine:

- **[Git](https://git-scm.com/)**: For version control.
- **[Node.js](https://nodejs.org/)**: Version 20.19+ or 22.12+ for the current Vite toolchain.
- **[Visual Studio Code](https://code.visualstudio.com/)** (or your favorite code editor).

---

## 🚀 Quickstart: Setting Up Locally

1. **Fork or Clone the Repository**:
   ```bash
   git clone https://github.com/saeindiabit-sindri/sae-website.git
   cd sae-website
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Local Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the site live.

---

## 🌿 Git Workflow & Branching

Always create a new branch for your work. **Do not commit directly to `main`**.

1. **Pull the latest changes**:
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a descriptive branch**:
   Use standard prefixes:
   - `feat/` for new features or data additions (e.g., `feat/add-batch-2k25`, `feat/baja-2024-milestone`)
   - `fix/` for bug fixes (e.g., `fix/navbar-mobile-toggle`)
   - `docs/` for documentation updates (e.g., `docs/update-readme`)
   - `style/` for CSS/styling adjustments

   ```bash
   git checkout -b feat/add-my-profile
   ```

3. **Commit with meaningful messages**:
   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat(team): add Batch 2K25 members`
   - `fix(track): resolve audio reset on pause`
   - `docs: update contribution guidelines`

---

## 📝 Common Contributions Guide

Most content updates do **not** require editing complex UI logic. Society data is grouped by domain under [`src/data/`](file:///Users/rahulkumar/saee/src/data/). See [`ARCHITECTURE.md`](file:///Users/rahulkumar/saee/ARCHITECTURE.md) before adding a new feature or service.

### 1. Adding / Updating Team Members

Open [`src/data/team.ts`](file:///Users/rahulkumar/saee/src/data/team.ts):

- **Office Bearers & Core Members:** Locate `CORE_TEAM_MEMBERS` or the corresponding batch array and append an entry:
  ```typescript
  {
    name: "Your Name",
    post: "Your Designation", // e.g., "Member", "Web Team Lead", "Design Lead"
    discipline: "Mechanical Engineering", // Optional
    image: "/team/your-name.webp",
    linkedin: "https://linkedin.com/in/your-profile",
    email: "your-email@example.com",
    instagram: "https://instagram.com/your-handle", // Optional
  }
  ```

- **General Batch Lists:** Add your name under the respective batch array in [`src/data/team.ts`](file:///Users/rahulkumar/saee/src/data/team.ts).

### 2. Adding Achievements or Milestones

To add an achievement to `/competitions`:

1. Place the achievement photo in `public/achievements/` (e.g., `baja-2024.webp`).
2. In [`src/data/competitions.ts`](file:///Users/rahulkumar/saee/src/data/competitions.ts), append an entry to `COMPETITION_MILESTONES`:
   ```typescript
   {
     id: "baja-2024",
     year: "2024",
     team: "Team Wonders",
     competition: "BAJA SAE INDIA 2024",
     category: "Off-Road", // 'Off-Road' | 'Formula' | 'Aerospace' | 'Clean Tech' | 'Innovation'
     categoryLabel: "Off-Road (mBAJA)",
     stat: "AIR 5",
     statLabel: "Endurance Race",
     copy: "Detailed write-up of the team's performance, hurdles overcome, and final position.",
     image: "/achievements/baja-2024.webp",
     imageAlt: "Team Wonders at BAJA SAE India 2024",
     highlight: "Top 5 National Endurance Finish"
   }
   ```

### 3. Adding Upcoming or Past Events

To add a workshop or event to `/events`:

1. Place the event banner or poster in `public/events/` (e.g., `solidworks-workshop.webp`).
2. Update the relevant page-owned event data with the title, date, venue, description, and registration link. Keep reusable content types in `src/data/types.ts`.

### 4. Adding Sponsors & Partners

1. Place the transparent sponsor logo in `public/sponsors/`.
2. Add the sponsor details into `SPONSORS` in [`src/data/sponsors.ts`](file:///Users/rahulkumar/saee/src/data/sponsors.ts) under the correct tier (`Title`, `Gold`, `Silver`, or `Technical Partner`).

### 5. Adding New Sections or Components (Swarm Build Registration)

The web platform features an interactive **Figma Multiplayer Swarm Build intro overlay** (`src/components/common/SwarmBuildOverlay.tsx`). It simulates developer cursors (`Isihin`, `Priya`, `Saurav`, `UI_Bot`, etc.) live-assembling headers, cards, and toolbars with dashed wireframes and W × H dimension badges.

> [!WARNING]
> **Why Registration is Mandatory**:
> When a visitor loads a page or navigates via React Router, the page starts with a clean, blank slate. The cursors then frame and reveal each element.
> - If you **forget to register** a new card or filter toolbar, it will **flash on screen before the animation** or remain permanently invisible at `opacity: 0`.

Whenever you add a new major section, card, banner, or filter toolbar, follow this **4-step registration checklist**:

1. **Add to Work Queue Selector:**
   Open [`src/components/common/SwarmBuildOverlay.tsx`](file:///Users/rahulkumar/saee/src/components/common/SwarmBuildOverlay.tsx) and add your element's class or ID into `STRUCTURAL_SELECTORS`:
   ```typescript
   // Example:
   '.my-new-feature-card',
   '.my-new-filter-bar',
   ```

2. **Add to Route Transition Blanking:**
   Open [`src/styles/swarm-build-overlay.css`](file:///Users/rahulkumar/saee/src/styles/swarm-build-overlay.css) and append your selector under `html.swarm-page-blank #mainContent`:
   ```css
   html.swarm-page-blank #mainContent .my-new-feature-card,
   html.swarm-page-blank #mainContent .my-new-filter-bar,
   ```

3. **Add to Initial Frame-Zero Blanking:**
   Open [`index.html`](file:///Users/rahulkumar/saee/index.html) and [`src/styles/swarm-build-overlay.css`](file:///Users/rahulkumar/saee/src/styles/swarm-build-overlay.css), and append your selector under `html.swarm-initial-blank`:
   ```css
   html.swarm-initial-blank .my-new-feature-card,
   html.swarm-initial-blank .my-new-filter-bar,
   ```

4. **Verify Reveal Styling:**
   In [`src/styles/swarm-build-overlay.css`](file:///Users/rahulkumar/saee/src/styles/swarm-build-overlay.css), ensure `.swarm-built` applies `opacity: 1 !important`:
   ```css
   .swarm-built.my-new-feature-card,
   .swarm-built .my-new-feature-card {
     opacity: 1 !important;
     transform: translate(0) !important;
   }
   ```

#### Testing Your New Component
- Start the dev server (`npm run dev`) and visit your page.
- Test **Hard Reload** (`Cmd + Shift + R` or `Ctrl + F5`): Confirm the page starts completely blank from frame zero, cursors draw dashed bounding boxes with W × H badges around your element, and it smoothly fades in.
- Test **Client-Side Navigation**: Click between nav links; ensure there is no flash of unhidden content (FOUC).
- Test **Scroll Build**: Scroll down slowly; elements below the fold should animate into view as they intersect the viewport.
- Test **Replay**: Click `Replay Build` in the footer telemetry strip to verify that the element re-animates cleanly.

---

## 🖼 Asset & Image Guidelines

High-resolution, uncompressed images make the site slow for mobile users. Please adhere to these rules before committing images:

- **Format:** Convert images to `.webp` format whenever possible (use free tools like Squoosh, Sharp, or CloudConvert).
- **File Size:** Keep portrait photos and banners under **150 KB** (ideally < 80 KB).
- **Dimensions:**
  - Team portraits: 400 × 500 px or square (1:1 ratio).
  - Achievement / Event banners: max 1200 px width.
- **Naming:** Use lowercase alphanumeric names with hyphens (e.g., `rahul-sharma.webp`, not `IMG_20261016_WA0023.jpg`).

---

## ✅ Code Style & Verification

Before submitting your changes, run this command in your terminal:

```bash
npm run build
```

`npm run build` runs `tsc` (TypeScript compiler) and `vite build`.
- If there are TypeScript type mismatches, missing imports, or syntax errors, the build will fail and tell you the exact line.
- **Make sure this command passes with 0 errors** before pushing!

For runtime configuration, copy `.env.example` to a local `.env` file when
needed. Never commit `.env` files or secrets; only explicitly public `VITE_`
values belong in the browser bundle.

### Manual QA for Visual Changes
- Test in both **Desktop** and **Mobile** viewports (using browser DevTools responsive view `Cmd + Option + I` or `F12`).
- Check that navigation bars, modals, and footer links operate smoothly.
- If editing the race track (`/track`), follow the manual verification steps in [`README.md`](file:///Users/rahulkumar/saee/README.md#🏁-quality-assurance--race-track-verification).

---

## 📤 Submitting a Pull Request (PR)

1. **Commit and push your branch**:
   ```bash
   git add .
   git commit -m "feat(team): add 2K25 member profiles"
   git push origin feat/add-my-profile
   ```

2. **Open a Pull Request**:
   - Go to the [SAE Website GitHub Repository](https://github.com/saeindiabit-sindri/sae-website).
   - Click on the green **Compare & pull request** button.
   - Set the base branch to `main`.
   - Provide a concise title and description:
     - What changes did you make?
     - Attach a screenshot or short video if you made UI/design changes.
     - Confirm that `npm run build` passed successfully.

3. **Code Review**:
   - Maintainers or senior technical team members will review your PR.
   - If changes are requested, don't worry! Simply make the requested edits on your local branch, commit, and push again. The PR updates automatically.

---

## 💬 Getting Help & Mentorship

Are you a junior student stuck on Git, TypeScript, or React? We are here to help!

- **Email:** [saeindia@bitsindri.ac.in](mailto:saeindia@bitsindri.ac.in)
- **Technical Heads & Seniors:** Reach out via the official SAE India BIT Sindri WhatsApp group or connect with the Technical Team leads.
- **Report Bugs:** Open an issue on GitHub describing the bug with steps to reproduce it.

Happy coding! Let's build something extraordinary together. 🏎️💨
