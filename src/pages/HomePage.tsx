import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { SubsystemExplorer } from '../components/home/SubsystemExplorer';
import { AboutTeaser } from '../components/home/AboutTeaser';
import { EventsTeaser } from '../components/home/EventsTeaser';
import { SponsorsTeaser } from '../components/home/SponsorsTeaser';
import { GlimpsesSection } from '../components/home/GlimpsesSection';
import { TeamTeaser } from '../components/home/TeamTeaser';
import { JoinTeaser } from '../components/home/JoinTeaser';

interface HomePageProps {
  isActive?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ isActive = true }) => {
  return (
    <section className={`page ${isActive ? 'active' : ''}`} id="page-home">
      <HeroSection />
      <SubsystemExplorer />
      <AboutTeaser />
      <EventsTeaser />
      <SponsorsTeaser />
      <GlimpsesSection />
      <TeamTeaser />
      <JoinTeaser />
    </section>
  );
};

export default HomePage;
