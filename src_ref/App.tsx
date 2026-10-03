import { useEffect, useState, type ReactNode } from "react";
import clubLogo from "./assets/bit-sindri-sae-logo.png";

const heroImage =
  "https://images.unsplash.com/photo-1700770956485-87150c75ad65?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1800";

const heroScenes = {
  design: {
    label: "Design",
    image:
      "https://images.unsplash.com/photo-1595008382755-48b0d68865f6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1800",
    alt: "Automotive design displayed on an engineering workstation",
  },
  build: {
    label: "Build",
    image: heroImage,
    alt: "Student engineers working together around a car in a garage",
  },
  compete: {
    label: "Compete",
    image:
      "https://images.unsplash.com/photo-1690984651796-6bbb102fbf30?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1800",
    alt: "Race car moving at speed during a track competition",
  },
} as const;

type HeroScene = keyof typeof heroScenes;

type IconName =
  | "arrow"
  | "calendar"
  | "chevron"
  | "close"
  | "engine"
  | "menu"
  | "people"
  | "spark"
  | "trophy";

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    calendar: (
      <>
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="M18 6 6 18M6 6l12 12" />,
    engine: (
      <>
        <path d="M10 6h7l3 4v7h-3l-2 3H8l-2-3H3v-7h3l2-4h2Z" />
        <path d="M14 6V3h-4M3 12H1M21 12h2" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    people: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3-1.8 5.2L5 10l5.2 1.8L12 17l1.8-5.2L19 10l-5.2-1.8L12 3Z" />
        <path d="m5 16-.8 2.2L2 19l2.2.8L5 22l.8-2.2L8 19l-2.2-.8L5 16Z" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" />
        <path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a className="group flex items-center gap-3" href="#top" aria-label="SAE BIT Sindri home">
      <span
        className={`grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-2 ring-offset-2 ${
          light ? "ring-white/30 ring-offset-ink" : "ring-signal/70 ring-offset-paper"
        }`}
      >
        <img src={clubLogo} alt="" className="size-full object-cover transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
      </span>
      <span className="leading-none">
        <span
          className={`block font-display text-xl font-bold uppercase tracking-tight ${
            light ? "text-white" : "text-white"
          }`}
        >
          SAE BIT Sindri
        </span>
        <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.24em] text-signal">
          Collegiate Club
        </span>
      </span>
    </a>
  );
}

function ButtonLink({
  children,
  href,
  variant = "primary",
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "outline" | "light";
}) {
  const styles = {
    primary: "bg-signal text-white hover:bg-signal-dark border-signal",
    outline: "border-white text-white hover:bg-white hover:text-ink",
    light: "border-white/40 text-white hover:bg-white hover:text-ink",
  };

  return (
    <a
      className={`effect-shine inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden border px-6 text-xs font-extrabold uppercase tracking-[0.16em] transition-all duration-300 hover:-translate-y-0.5 ${styles[variant]}`}
      href={href}
    >
      {children}
    </a>
  );
}

const disciplines = [
  {
    number: "01",
    icon: "engine" as const,
    title: "Design & Build",
    copy: "Turn engineering fundamentals into working machines through CAD, fabrication, testing, and iteration.",
  },
  {
    number: "02",
    icon: "spark" as const,
    title: "Learn & Innovate",
    copy: "Explore mobility, EV systems, manufacturing, and emerging technologies with hands-on workshops.",
  },
  {
    number: "03",
    icon: "people" as const,
    title: "Lead Together",
    copy: "Build real-world leadership, teamwork, project management, and communication skills.",
  },
];

const events = [
  { date: "18", month: "AUG", type: "Workshop", title: "EV Powertrain Fundamentals", meta: "10:00 AM · Innovation Lab" },
  { date: "02", month: "SEP", type: "Tech Talk", title: "From Campus to Motorsport", meta: "3:30 PM · Main Auditorium" },
  { date: "14", month: "SEP", type: "Build Day", title: "Formula Student Open Garage", meta: "9:00 AM · SAE Workshop" },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeScene, setActiveScene] = useState<HeroScene>("build");

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="top" className="min-h-screen overflow-hidden bg-paper text-white">
      <header className="relative z-30 border-b border-white/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Brand />
          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary navigation">
            {["About", "What we do", "Events", "Team"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                className="text-xs font-bold uppercase tracking-[0.16em] text-white/65 transition-colors hover:text-signal"
              >
                {item}
              </a>
            ))}
            <ButtonLink href="#join">Join the club</ButtonLink>
          </nav>
          <button
            className="grid size-11 place-items-center border border-white/15 lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-white/10 bg-paper px-5 py-5 lg:hidden" aria-label="Mobile navigation">
            <div className="flex flex-col">
              {["About", "What we do", "Events", "Team"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-white/10 py-4 text-sm font-bold uppercase tracking-[0.14em]"
                >
                  {item}
                </a>
              ))}
              <div className="pt-5">
                <ButtonLink href="#join">Join the club</ButtonLink>
              </div>
            </div>
          </nav>
        )}
      </header>

      <main>
        <section className="relative min-h-[700px] bg-ink text-white lg:min-h-[760px]">
          {Object.entries(heroScenes).map(([key, scene]) => (
            <img
              key={key}
              src={scene.image}
              alt={activeScene === key ? scene.alt : ""}
              className={`hero-scene absolute inset-0 h-full w-full object-cover object-center ${
                activeScene === key ? "is-active" : ""
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/10" />
          <div className="tech-grid absolute inset-0 opacity-20" />
          <div className="ambient-glow absolute -right-40 top-20 size-[34rem] rounded-full bg-signal/20 blur-3xl" />
          <div className="relative mx-auto flex min-h-[700px] max-w-7xl items-end px-5 pb-16 pt-24 lg:min-h-[760px] lg:items-center lg:px-8 lg:pb-20">
            <div className="max-w-4xl">
              <div className="hero-enter hero-delay-1 mb-7 flex items-center gap-4">
                <span className="h-px w-12 bg-signal" />
                <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-white/75">
                  Engineering the future of mobility
                </p>
              </div>
              <h1
                className="slogan hero-enter hero-delay-2 flex flex-col items-start font-display text-7xl font-bold uppercase leading-[0.78] tracking-[-0.045em] sm:text-8xl lg:text-[8.5rem]"
                onMouseLeave={() => setActiveScene("build")}
              >
                {(Object.keys(heroScenes) as HeroScene[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onMouseEnter={() => setActiveScene(key)}
                    onFocus={() => setActiveScene(key)}
                    onClick={() => setActiveScene(key)}
                    className={`slogan-word relative transition-all duration-500 ${
                      activeScene === key ? "is-active text-signal" : "text-white"
                    }`}
                    aria-label={`Show ${heroScenes[key].label} background`}
                    aria-pressed={activeScene === key}
                  >
                    {heroScenes[key].label}
                    <span className="text-signal">.</span>
                  </button>
                ))}
              </h1>
              <p className="hero-enter hero-delay-3 mt-8 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                From the first line on screen to the final lap on track, we are a student-led community turning engineering ideas into machines that perform.
              </p>
              <div className="hero-enter hero-delay-4 mt-9 flex flex-wrap gap-3">
                <ButtonLink href="#join">Become a member <Icon name="arrow" /></ButtonLink>
                <ButtonLink href="#what-we-do" variant="light">Explore our work</ButtonLink>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 hidden border-l border-t border-white/20 bg-ink/70 px-9 py-6 backdrop-blur md:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">Affiliated with</p>
            <p className="mt-2 font-display text-2xl font-bold italic tracking-tight">SAEINDIA</p>
          </div>
        </section>

        <section id="about" className="border-b border-white/10 bg-surface">
          <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.15fr_0.85fr]">
            <div data-reveal className="reveal-up px-5 py-20 lg:px-8 lg:py-28">
              <p className="eyebrow">Who we are</p>
              <h2 className="mt-5 max-w-3xl font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
                More than a club.
                <br />
                <span className="text-signal">A proving ground.</span>
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-7 text-white/65">
                Velocity SAE brings ambitious students together to solve real engineering problems. From first sketch to final test run, every project is a chance to apply theory, challenge assumptions, and grow as a team.
              </p>
              <a
                href="#what-we-do"
                className="mt-8 inline-flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.17em] text-white underline decoration-signal decoration-2 underline-offset-8"
              >
                Discover our mission <Icon name="arrow" />
              </a>
            </div>
            <div data-reveal className="reveal-up reveal-delay grid grid-cols-2 border-t border-white/10 bg-paper lg:border-l lg:border-t-0">
              {[
                ["120+", "Active members"],
                ["08", "Technical teams"],
                ["16", "Projects completed"],
                ["06", "Years of making"],
              ].map(([value, label], index) => (
                <div key={label} className={`flex min-h-48 flex-col justify-end p-7 lg:p-9 ${index % 2 === 0 ? "border-r border-white/10" : ""} ${index < 2 ? "border-b border-white/10" : ""}`}>
                  <strong className="font-display text-5xl font-bold text-white lg:text-6xl">{value}</strong>
                  <span className="mt-2 text-[11px] font-bold uppercase tracking-[0.17em] text-white/45">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="what-we-do" className="bg-paper px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div data-reveal className="reveal-up flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">What we do</p>
                <h2 className="mt-5 font-display text-5xl font-bold uppercase leading-none tracking-tight sm:text-6xl">
                  Ideas into <span className="text-signal">impact.</span>
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-white/60">
                Real projects. Real deadlines. Real growth. Find the track that pushes you forward.
              </p>
            </div>
            <div className="discipline-grid mt-12 grid border-l border-t border-white/15 md:grid-cols-3">
              {disciplines.map((item) => (
                <article
                  key={item.number}
                  data-reveal
                  className="reveal-up group relative min-h-[390px] border-b border-r border-white/15 bg-surface p-8 transition-[background-color,transform,opacity] duration-500 hover:-translate-y-2 hover:bg-blue-deep hover:text-white lg:p-10"
                >
                  <div className="flex items-start justify-between">
                    <Icon name={item.icon} className="size-9 text-signal" />
                    <span className="font-display text-sm font-bold text-white/25 group-hover:text-white/40">{item.number}</span>
                  </div>
                  <div className="absolute inset-x-8 bottom-9 lg:inset-x-10">
                    <h3 className="font-display text-3xl font-bold uppercase tracking-tight">{item.title}</h3>
                    <p className="mt-4 text-sm leading-6 text-white/60 group-hover:text-white/70">{item.copy}</p>
                    <Icon name="arrow" className="mt-7 size-6 text-signal transition-transform group-hover:translate-x-2" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="events" className="bg-ink px-5 py-20 text-white lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div data-reveal className="reveal-up flex items-end justify-between">
              <div>
                <p className="eyebrow text-signal">On the calendar</p>
                <h2 className="mt-5 font-display text-5xl font-bold uppercase leading-none tracking-tight sm:text-6xl">Upcoming events</h2>
              </div>
              <Icon name="calendar" className="hidden size-10 text-white/25 sm:block" />
            </div>
            <div className="mt-12 border-t border-white/15">
              {events.map((event) => (
                <article key={event.title} data-reveal className="reveal-side group grid gap-6 border-b border-white/15 py-7 transition-all duration-500 hover:border-signal hover:bg-white/[0.02] sm:grid-cols-[100px_1fr_auto] sm:items-center lg:py-9">
                  <div className="flex items-end gap-2">
                    <span className="font-display text-5xl font-bold leading-none">{event.date}</span>
                    <span className="pb-1 text-[10px] font-extrabold tracking-[0.18em] text-signal">{event.month}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{event.type}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold uppercase tracking-wide">{event.title}</h3>
                    <p className="mt-2 text-xs text-white/45">{event.meta}</p>
                  </div>
                  <a href="#join" className="grid size-12 place-items-center border border-white/20 transition-colors group-hover:border-signal group-hover:bg-signal" aria-label={`View ${event.title}`}>
                    <Icon name="chevron" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="team" className="bg-surface px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div data-reveal className="reveal-up image-frame group relative min-h-[480px] overflow-hidden bg-ink">
              <img src={heroImage} alt="Club members working together in the garage" className="absolute inset-0 h-full w-full object-cover opacity-75 transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-signal">One team</p>
                  <p className="mt-2 font-display text-3xl font-bold uppercase text-white">Many disciplines</p>
                </div>
                <Icon name="trophy" className="size-10 text-white/60" />
              </div>
            </div>
            <div data-reveal className="reveal-up reveal-delay">
              <p className="eyebrow">Find your place</p>
              <h2 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
                You don&apos;t need to know everything.
                <span className="block text-signal">Just start.</span>
              </h2>
              <p className="mt-7 max-w-xl text-base leading-7 text-white/60">
                Whether you design, code, fabricate, manage, photograph, or simply want to learn, there is room for you here. Our senior members and faculty mentors help you build confidence one challenge at a time.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {["Vehicle Dynamics", "Powertrain", "Electronics", "Design", "Business", "Media"].map((skill) => (
                  <span key={skill} className="border border-white/15 bg-white/[0.02] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/65">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="join" className="relative overflow-hidden bg-signal px-5 py-20 text-white lg:px-8 lg:py-24">
          <div className="tech-grid absolute inset-0 opacity-10" />
          <div data-reveal className="reveal-up relative mx-auto flex max-w-7xl flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.23em] text-white/65">Ready to get started?</p>
              <h2 className="mt-5 max-w-4xl font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight sm:text-7xl">
                Build something that moves you.
              </h2>
            </div>
            <a href="mailto:saeclub@college.edu" className="inline-flex min-h-14 shrink-0 items-center justify-center gap-3 bg-white px-7 text-xs font-extrabold uppercase tracking-[0.16em] text-signal transition-colors hover:bg-ink hover:text-white">
              Join Velocity SAE <Icon name="arrow" />
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-ink px-5 py-12 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <Brand light />
            <p className="mt-6 max-w-sm text-xs leading-6 text-white/40">
              The SAE collegiate club of BIT Sindri, built by students who believe the best way to learn engineering is to engineer.
            </p>
          </div>
          <div className="text-left md:text-right">
            <a href="mailto:saeclub@college.edu" className="text-sm font-semibold text-white/75 hover:text-signal">saeclub@college.edu</a>
            <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/30">© 2025 SAE BIT Sindri · Made to move forward</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
