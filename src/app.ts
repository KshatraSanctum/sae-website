import {
  NEWS, EVENTS, COMPETITIONS, BEARERS,
  CORE_TEAM_MEMBERS,
  TEAM_SECTIONS, DEPARTMENTS, SPONSORS,
  FILTER_DEFS, SPONSOR_FILTER_DEFS,
  TAG_CLASSES, PAGES,
  type EventItem, type SponsorItem
} from './data';

// ===================== RENDER FUNCTIONS =====================

function renderNews(): void {
  const el = document.getElementById("newsGrid");
  if (!el) return;
  el.innerHTML = NEWS.map(n => `
  <div class="news-card">
    <div class="date mono">${n.date}</div>
    <h3>${n.title}</h3>
    <p>${n.body}</p>
  </div>`).join("");
}

function renderEvents(filter: string): void {
  const list: EventItem[] = filter === "all" ? EVENTS : EVENTS.filter(e => e.tag === filter);
  const el = document.getElementById("eventTimeline");
  if (!el) return;
  el.innerHTML = list.map(e => `
    <div class="tl-item">
      <div class="tl-card">
        <div class="tl-top">
          <span class="tl-tag ${TAG_CLASSES[e.tag]}">${e.tagLabel}</span>
          <span class="tl-term mono">${e.term}</span>
        </div>
        <h3>${e.title}</h3>
        <p>${e.body}</p>
        <div class="tl-loc mono">📍 ${e.loc}</div>
      </div>
    </div>`).join("");
}

function renderEventFilters(): void {
  const filtersEl = document.getElementById("eventFilters");
  if (!filtersEl) return;

  filtersEl.innerHTML = FILTER_DEFS.map((f, i) =>
    `<button class="chip ${i === 0 ? 'active' : ''}" data-filter="${f[0]}">${f[1]}</button>`).join("");

  const chips = document.querySelectorAll<HTMLButtonElement>(".chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      renderEvents(chip.dataset.filter || "all");
    });
  });

  renderEvents("all");
}

function renderCompetitions(): void {
  const el = document.getElementById("compGrid");
  if (!el) return;
  el.innerHTML = COMPETITIONS.map(c => `
  <div class="comp-card">
    <a href="#" class="comp-gallery-link" title="Gallery">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
    </a>
    <span class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${c.icon}</svg></span>
    <span class="team-of mono">${c.team}</span>
    <h3>${c.title}</h3>
    <p>${c.body}</p>
    <div class="badge mono">+ Add latest result</div>
  </div>`).join("");
}

function renderBearers(): void {
  const el = document.getElementById("bearerGrid");
  if (!el) return;
  el.innerHTML = BEARERS.map(b => `
  <div class="bearer-card">
    <span class="role-tag mono">${b.role}</span>
    <div class="avatar-row">
      ${b.names.map(n => `
        <div class="avatar-unit">
          <div class="avatar">＋</div>
          <span class="nm">${n}</span>
        </div>`).join("")}
    </div>
    <div class="social-row">
      <a href="#" aria-label="LinkedIn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="7" y1="10" x2="7" y2="17"/><circle cx="7" cy="7" r="0.6" fill="currentColor"/><path d="M11 17v-4.5c0-1.4 1-2.3 2.2-2.3 1.2 0 1.8.9 1.8 2.3V17"/></svg></a>
      <a href="#" aria-label="Email"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></a>
    </div>
  </div>`).join("");
}

function renderCoreTeam(): void {
  const el = document.getElementById("coreTeamGrid");
  if (!el) return;
  el.innerHTML = CORE_TEAM_MEMBERS.map((member, index) => `
    <article
      data-reveal
      class="team-card reveal-up group"
    >
      <div class="team-card-media">
        <img
          src="${member.image}"
          alt="${member.name}, ${member.post}"
          class="team-card-img"
          loading="lazy"
        />
        <div class="team-card-overlay"></div>
        <div class="team-card-badge-wrap">
          <span class="team-card-badge">0${index + 1}</span>
        </div>
      </div>
      <div class="team-card-info">
        <p class="team-card-discipline">${member.discipline}</p>
        <h3 class="team-card-name">${member.name}</h3>
        <div class="team-card-footer">
          <div>
            <p class="team-card-post-label">Club post</p>
            <p class="team-card-post">${member.post}</p>
          </div>
          <div class="team-card-socials">
            <a
              href="${member.linkedin || 'https://www.linkedin.com/'}"
              target="_blank"
              rel="noreferrer"
              class="team-social-btn"
              aria-label="${member.name} on LinkedIn"
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M8 10v7M8 7v.01M12 17v-4a3 3 0 0 1 6 0v4M12 10v7" />
              </svg>
            </a>
            <a
              href="${member.instagram || 'https://www.instagram.com/'}"
              target="_blank"
              rel="noreferrer"
              class="team-social-btn"
              aria-label="${member.name} on Instagram"
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </article>
  `).join("");
}

function renderTeamSections(): void {
  const el = document.getElementById("teamSections");
  if (!el) return;
  el.innerHTML = TEAM_SECTIONS.map(sec => `
  <div class="team-section">
    <div class="team-section-head">
      <h2>${sec.name}</h2>
      <span class="team-blurb">${sec.blurb}</span>
    </div>
    <div class="team-divider"></div>
    <div class="member-grid">
      ${sec.roles.map(role => `
        <div class="member-card">
          <div class="avatar">＋</div>
          <span class="nm">Add Name</span>
          <span class="role-tag mono">${role}</span>
        </div>`).join("")}
    </div>
  </div>`).join("");
}

function renderDepartments(): void {
  const el = document.getElementById("departmentSections");
  if (!el) return;
  el.innerHTML = DEPARTMENTS.map(sec => `
  <div class="team-section">
    <div class="team-section-head">
      <h2>${sec.name}</h2>
      <span class="team-blurb">${sec.blurb}</span>
    </div>
    <div class="team-divider"></div>
    <div class="member-grid">
      ${sec.roles.map(role => `
        <div class="member-card">
          <div class="avatar">＋</div>
          <span class="nm">Add Name</span>
          <span class="role-tag mono">${role}</span>
        </div>`).join("")}
    </div>
  </div>`).join("");
}

function renderSponsors(filter: string = "all"): void {
  const el = document.getElementById("sponsorGrid");
  if (!el) return;
  const list: SponsorItem[] = filter === "all" ? SPONSORS : SPONSORS.filter(s => {
    if (filter === "institutional") return s.tier === "institutional" || s.tier === "associate";
    return s.tier === filter;
  });

  el.innerHTML = list.map(s => `
    <div class="sponsor-card">
      <div class="sponsor-logo-box">
        <img src="${s.logo}" alt="${s.name} Logo" loading="lazy" class="sponsor-logo-img" />
      </div>
      <div class="sponsor-body">
        <span class="sponsor-tier mono">${s.tierLabel}</span>
        <h3>${s.name}</h3>
        <span class="sponsor-cat">${s.category}</span>
        <p>${s.description}</p>
      </div>
    </div>`).join("");
}

function renderSponsorFilters(): void {
  const filtersEl = document.getElementById("sponsorFilters");
  if (!filtersEl) return;

  filtersEl.innerHTML = SPONSOR_FILTER_DEFS.map((f, i) =>
    `<button class="chip ${i === 0 ? 'active' : ''}" data-sponsor-filter="${f[0]}">${f[1]}</button>`).join("");

  const chips = filtersEl.querySelectorAll<HTMLButtonElement>(".chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      renderSponsors(chip.dataset.sponsorFilter || "all");
    });
  });

  renderSponsors("all");
}

function renderYear(): void {
  const el = document.getElementById("yr");
  if (el) el.textContent = new Date().getFullYear().toString();
}

function initJoinForm(): void {
  const form = document.getElementById("joinForm") as HTMLFormElement | null;
  const successMsg = document.getElementById("joinSuccessMsg");
  const detailsText = document.getElementById("successDetailsText");
  const resetBtn = document.getElementById("resetJoinFormBtn");
  const scrollBtn = document.getElementById("scrollApplyBtn");

  if (scrollBtn) {
    scrollBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById("join-application");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  if (form) {
    form.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      const nameInput = document.getElementById("applicantName") as HTMLInputElement | null;
      const branchInput = document.getElementById("applicantBranch") as HTMLSelectElement | null;
      const crewInput = document.getElementById("applicantCrew") as HTMLSelectElement | null;

      const name = nameInput ? nameInput.value.trim() : "Applicant";
      const branch = branchInput ? branchInput.value : "";
      const crew = crewInput ? crewInput.value : "";

      if (detailsText) {
        detailsText.textContent = `Thank you, ${name}! Your application for ${crew || "our crew"} (${branch}) has been recorded. Our recruitment coordinators will review your submission and contact you via email and WhatsApp for the orientation session.`;
      }

      form.style.display = "none";
      if (successMsg) {
        successMsg.style.display = "block";
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (form) {
        form.reset();
        form.style.display = "block";
      }
      if (successMsg) {
        successMsg.style.display = "none";
      }
    });
  }
}

// ===================== RENDER ALL =====================

export function renderAll(): void {
  renderNews();
  renderEventFilters();
  renderCompetitions();
  renderBearers();
  renderCoreTeam();
  renderTeamSections();
  renderDepartments();
  renderSponsorFilters();
  renderYear();
  initJoinForm();
}

// ===================== HERO SCENES (src_ref) =====================

export function initHeroScenes(): void {
  const words = document.querySelectorAll<HTMLElement>('.slogan-word');
  const scenes = document.querySelectorAll<HTMLElement>('.hero-scene');
  const sloganContainer = document.getElementById('heroSlogan');

  if (!words.length || !scenes.length) return;

  function setActiveScene(key: string): void {
    scenes.forEach(scene => {
      scene.classList.toggle('is-active', scene.dataset.scene === key);
    });
    words.forEach(word => {
      const isActive = word.dataset.scene === key;
      word.classList.toggle('is-active', isActive);
      word.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  words.forEach(word => {
    const key = word.dataset.scene;
    if (!key) return;
    word.addEventListener('mouseenter', () => setActiveScene(key));
    word.addEventListener('focus', () => setActiveScene(key));
    word.addEventListener('click', () => setActiveScene(key));
  });

  if (sloganContainer) {
    sloganContainer.addEventListener('mouseleave', () => setActiveScene('build'));
  }
}

// ===================== SCROLL REVEAL (src_ref) =====================

export function initScrollReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px' }
  );

  elements.forEach((element) => observer.observe(element));
}

// ===================== ROUTER =====================

export function initRouter(): void {
  function showPage(id: string): void {
    if (id === "bearers") id = "team";
    if (!PAGES.includes(id)) id = "home";
    PAGES.forEach(p => {
      const pageEl = document.getElementById("page-" + p);
      if (pageEl) {
        const isActive = p === id;
        pageEl.classList.toggle("active", isActive);
        if (isActive && id !== "home") {
          pageEl.querySelectorAll<HTMLElement>("[data-reveal]").forEach(el => {
            el.classList.add("is-visible");
          });
        }
      }
    });
    document.querySelectorAll<HTMLElement>(".ref-nav-link").forEach(a => {
      a.classList.toggle("active", a.dataset.page === id);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigateTo(id: string): void {
    if (id === "bearers") id = "team";
    if (PAGES.includes(id)) {
      showPage(id);
    } else {
      showPage("home");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }

  // Handle data-page clicks
  document.querySelectorAll<HTMLElement>("[data-page]").forEach(el => {
    el.addEventListener("click", (e: Event) => {
      e.preventDefault();
      const id = el.dataset.page || "home";
      const targetHash = id === "bearers" ? "team" : id;
      try {
        history.pushState(null, "", "#" + targetHash);
      } catch (_) {
        try { location.hash = "#" + targetHash; } catch (_2) { /* noop */ }
      }
      navigateTo(targetHash);
    });
  });

  // Handle data-scroll anchor clicks on landing page
  document.querySelectorAll<HTMLElement>("[data-scroll]").forEach(el => {
    el.addEventListener("click", (e: Event) => {
      e.preventDefault();
      const targetId = el.dataset.scroll;
      if (!targetId) return;

      const homePage = document.getElementById("page-home");
      if (homePage && !homePage.classList.contains("active")) {
        showPage("home");
      }

      setTimeout(() => {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);
    });
  });

  window.addEventListener("popstate", () => {
    const hash = location.hash.replace("#", "") || "home";
    navigateTo(hash);
  });

  window.addEventListener("hashchange", () => {
    const hash = location.hash.replace("#", "") || "home";
    navigateTo(hash);
  });

  const initialHash = location.hash.replace("#", "") || "home";
  navigateTo(initialHash);
}

// ===================== MOBILE NAVIGATION (src_ref) =====================

export function initMobileNav(): void {
  const toggleBtn = document.getElementById('refMobileToggle');
  const mobileMenu = document.getElementById('refMobileMenu');

  if (!toggleBtn || !mobileMenu) return;
  const btn = toggleBtn;
  const menu = mobileMenu;

  let isOpen = false;

  function setMenuState(open: boolean): void {
    isOpen = open;
    btn.classList.toggle('is-open', isOpen);
    menu.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  }

  btn.addEventListener('click', (e: Event) => {
    e.stopPropagation();
    setMenuState(!isOpen);
  });

  // Close menu when a link inside mobile nav is clicked
  menu.addEventListener('click', (e: Event) => {
    const target = (e.target as HTMLElement).closest('a');
    if (target) {
      setMenuState(false);
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e: Event) => {
    if (isOpen && !menu.contains(e.target as Node) && !btn.contains(e.target as Node)) {
      setMenuState(false);
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setMenuState(false);
    }
  });
}
