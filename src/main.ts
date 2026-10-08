import './styles/main.css';
import './styles/landing.css';
import './styles/intro.css';
import './styles/events.css'; // Connects your custom events styling
import { initIntro } from './intro';
import { renderAll, initRouter, initMobileNav, initHeroScenes, initScrollReveal } from './app';
import { initCarFollower3D } from './carFollower3D';

// Import your new custom Events UI logic
import { initEventsUI } from './events';

// Initialize intro animation
initIntro();

function startApp(): void {
  renderAll();
  initRouter();
  initMobileNav();
  initHeroScenes();
  initScrollReveal();
  initCarFollower3D();
  
  // Trigger your custom interactive JS
  initEventsUI();
}

// Initialize app after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}