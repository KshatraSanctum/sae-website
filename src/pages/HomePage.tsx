import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { DbcScrollShowcase } from '../components/common/DbcScrollShowcase';
import { AboutTeaser } from '../components/home/AboutTeaser';
import { EventsTeaser } from '../components/home/EventsTeaser';
import { SponsorsTeaser } from '../components/home/SponsorsTeaser';
import { GlimpsesSection } from '../components/home/GlimpsesSection';
import { TeamTeaser } from '../components/home/TeamTeaser';
import { JoinTeaser } from '../components/home/JoinTeaser';

interface HomePageProps {
  isActive: boolean;
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ isActive, onNavigate }) => {
  return (
    <section className={`page ${isActive ? 'active' : ''}`} id="page-home">
      <HeroSection onNavigate={onNavigate} />
      <DbcScrollShowcase />
      <AboutTeaser onNavigate={onNavigate} />
      <EventsTeaser onNavigate={onNavigate} />
      <SponsorsTeaser onNavigate={onNavigate} />
      <GlimpsesSection />
      <TeamTeaser onNavigate={onNavigate} />
      <JoinTeaser onNavigate={onNavigate} />
    </section>
  );
};
