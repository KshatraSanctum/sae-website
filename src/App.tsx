import React, { useState, useEffect, useCallback } from 'react';
import './styles/main.css';
import './styles/landing.css';
import './styles/intro.css';
import './styles/events.css';

import { IntroOverlay } from './components/intro/IntroOverlay';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileScrollTrack } from './components/layout/MobileScrollTrack';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CompetitionsPage } from './pages/CompetitionsPage';
import { EventsPage } from './pages/EventsPage';
import { TeamPage } from './pages/TeamPage';
import { SponsorsPage } from './pages/SponsorsPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { JoinPage } from './pages/JoinPage';

import { initCarFollower3D, CarFollower3D } from './carFollower3D';

const VALID_PAGES = [
  'home',
  'about',
  'competitions',
  'events',
  'team',
  'sponsors',
  'departments',
  'join',
];

export const App: React.FC = () => {
  const getInitialPage = (): string => {
    let hash = window.location.hash.replace('#', '').trim();
    if (hash === 'bearers') hash = 'team';
    return VALID_PAGES.includes(hash) ? hash : 'home';
  };

  const [currentPage, setCurrentPage] = useState<string>(getInitialPage);

  const navigateTo = useCallback((pageOrId: string) => {
    let target = pageOrId;
    if (target === 'bearers') target = 'team';

    if (VALID_PAGES.includes(target)) {
      setCurrentPage(target);
      try {
        history.pushState(null, '', '#' + target);
      } catch (_) {
        window.location.hash = '#' + target;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // In-page section anchor (e.g. 'dbcShowcase', 'home-about', 'join-application')
      setCurrentPage('home');
      try {
        history.pushState(null, '', '#' + target);
      } catch (_) {
        window.location.hash = '#' + target;
      }
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    }
  }, []);

  // Listen to hashchange & popstate
  useEffect(() => {
    const handleHashChange = () => {
      let hash = window.location.hash.replace('#', '').trim();
      if (hash === 'bearers') hash = 'team';
      if (VALID_PAGES.includes(hash)) {
        setCurrentPage(hash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Initialize 3D Car Follower
  useEffect(() => {
    let carInstance: CarFollower3D | null = null;
    const timer = setTimeout(() => {
      carInstance = initCarFollower3D();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (carInstance) {
        carInstance.destroy();
      }
    };
  }, []);

  // Scroll Reveal Observer
  useEffect(() => {
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

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [currentPage]);

  return (
    <>
      <IntroOverlay />
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />
      <main>
        <HomePage isActive={currentPage === 'home'} onNavigate={navigateTo} />
        <AboutPage isActive={currentPage === 'about'} onNavigate={navigateTo} />
        <CompetitionsPage isActive={currentPage === 'competitions'} />
        <EventsPage isActive={currentPage === 'events'} />
        <TeamPage isActive={currentPage === 'team'} onNavigate={navigateTo} />
        <SponsorsPage isActive={currentPage === 'sponsors'} />
        <DepartmentsPage isActive={currentPage === 'departments'} />
        <JoinPage isActive={currentPage === 'join'} />
      </main>
      <Footer onNavigate={navigateTo} />
      <MobileScrollTrack />
    </>
  );
};
export default App;
