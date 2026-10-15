import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import './styles/main.css';
import './styles/landing.css';
import './styles/intro.css';
import './styles/events.css';
import './styles/competitions.css';

import { IntroOverlay } from './components/intro/IntroOverlay';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileScrollTrack } from './components/layout/MobileScrollTrack';
import { RouteMetadata } from './components/common/RouteMetadata';
import { ScrollToTop } from './components/common/ScrollToTop';
import { RouteLoadingFallback } from './components/common/RouteLoadingFallback';

import { initCarFollower3D, CarFollower3D } from './carFollower3D';

// Synchronously import HomePage for instant first-paint without lazy-loading lag
import { HomePage } from './pages/HomePage';

// Code-split secondary route components for performance and optimal loading
const AboutPage = React.lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const CompetitionsPage = React.lazy(() => import('./pages/CompetitionsPage').then((m) => ({ default: m.CompetitionsPage })));
const EventsPage = React.lazy(() => import('./pages/EventsPage').then((m) => ({ default: m.EventsPage })));
const TeamPage = React.lazy(() => import('./pages/TeamPage').then((m) => ({ default: m.TeamPage })));
const SponsorsPage = React.lazy(() => import('./pages/SponsorsPage').then((m) => ({ default: m.SponsorsPage })));
const DepartmentsPage = React.lazy(() => import('./pages/DepartmentsPage').then((m) => ({ default: m.DepartmentsPage })));
const JoinPage = React.lazy(() => import('./pages/JoinPage').then((m) => ({ default: m.JoinPage })));
const TrackPage = React.lazy(() => import('./pages/TrackPage').then((m) => ({ default: m.TrackPage })));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Observer for triggering reveal animations across client-side route changes
const ScrollRevealObserver: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    let io: IntersectionObserver | null = null;

    const scanAndObserve = () => {
      const elements = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)');
      if (!elements.length) return;

      if (!io) {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io?.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
        );
      }

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If element is already inside the viewport or near the top, reveal immediately
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-visible');
        } else {
          io?.observe(el);
        }
      });
    };

    // Scan immediately
    scanAndObserve();

    // Additional scheduled scans for any animations or image loads
    const t1 = setTimeout(scanAndObserve, 50);
    const t2 = setTimeout(scanAndObserve, 200);
    const t3 = setTimeout(scanAndObserve, 500);

    // Watch for dynamic DOM insertions
    const mutObserver = new MutationObserver(() => {
      scanAndObserve();
    });
    mutObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      mutObserver.disconnect();
      if (io) {
        io.disconnect();
      }
    };
  }, [location.pathname]);

  return null;
};

// Seamless fallback handler for legacy hash bookmarks (e.g. /#competitions -> /competitions)
const LegacyHashRedirector: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const cleanHash = location.hash.replace('#', '').trim();
      const legacyRouteMap: Record<string, string> = {
        about: '/about',
        competitions: '/competitions',
        achievements: '/achievements',
        events: '/events',
        team: '/team',
        bearers: '/team',
        sponsors: '/sponsors',
        departments: '/departments',
        join: '/join',
        track: '/track',
        circuit: '/track',
        race: '/track',
      };

      if (legacyRouteMap[cleanHash]) {
        navigate(legacyRouteMap[cleanHash], { replace: true });
      }
    }
  }, [location, navigate]);

  return null;
};

// App layout wrapper containing shared navigation, 3D cursor car, and page routes
const AppLayout: React.FC = () => {
  // Initialize 3D Car Follower
  useEffect(() => {
    let carInstance: CarFollower3D | null = null;
    const timer = setTimeout(() => {
      carInstance = initCarFollower3D();
    }, 120);

    return () => {
      clearTimeout(timer);
      if (carInstance) {
        carInstance.destroy();
      }
    };
  }, []);

  return (
    <>
      <RouteMetadata />
      <ScrollToTop />
      <ScrollRevealObserver />
      <LegacyHashRedirector />

      <IntroOverlay />
      <Navbar />

      <main id="mainContent">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/achievements" element={<CompetitionsPage />} />
            <Route path="/competitions" element={<CompetitionsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/bearers" element={<Navigate to="/team" replace />} />
            <Route path="/sponsors" element={<SponsorsPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/join" element={<JoinPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/circuit" element={<Navigate to="/track" replace />} />
            <Route path="/race" element={<Navigate to="/track" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <MobileScrollTrack />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
