import './styles/main.css';
import './styles/landing.css';
import './styles/intro.css';
import { initIntro } from './intro';
import { renderAll, initRouter, initMobileNav, initHeroScenes, initScrollReveal } from './app';

// Initialize intro animation
initIntro();

function startApp(): void {
  renderAll();
  initRouter();
  initMobileNav();
  initHeroScenes();
  initScrollReveal();
}

// Initialize app after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}


