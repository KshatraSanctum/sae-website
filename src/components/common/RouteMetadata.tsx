import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteMeta {
  title: string;
  description: string;
}

const ROUTE_META_MAP: Record<string, RouteMeta> = {
  '/': {
    title: 'SAE India · BIT Sindri | Collegiate Society of Automotive Engineers',
    description: 'The official collegiate mobility chapter of BIT Sindri. Designing national-tier championship racecars, aerodynamic drones, and future mobility solutions.',
  },
  '/about': {
    title: 'About Us · SAE India BIT Sindri',
    description: 'Our story, mission, faculty mentorship, and industrial training across automotive and aerospace engineering at BIT Sindri.',
  },
  '/achievements': {
    title: 'Achievements & Milestones · SAE India BIT Sindri',
    description: 'Explore our competitive legacy across 14 milestones including national podiums at BAJA, SUPRA, Quad Torc, Aerothon, and Effi-Cycle.',
  },
  '/competitions': {
    title: 'Competitions & Achievements · SAE India BIT Sindri',
    description: 'National engineering championships and collegiate racing competitions competed by SAE BIT Sindri.',
  },
  '/events': {
    title: 'Events & Workshops · SAE India BIT Sindri',
    description: 'Annual automotive workshops, orientation sessions, guest tech lectures, and Tvaran tech fest hosted by SAE BIT Sindri.',
  },
  '/team': {
    title: 'Our Team & Office Bearers · SAE India BIT Sindri',
    description: 'Meet the student engineers, office bearers, technical leads, and crew members behind SAE BIT Sindri.',
  },
  '/bearers': {
    title: 'Our Team & Office Bearers · SAE India BIT Sindri',
    description: 'Meet the student engineers, office bearers, technical leads, and crew members behind SAE BIT Sindri.',
  },
  '/sponsors': {
    title: 'Sponsors & Industry Partners · SAE India BIT Sindri',
    description: 'Our industry leaders, technical partners, and institutional sponsors fueling our collegiate racing and innovation.',
  },
  '/departments': {
    title: 'Departments & Chapter Domains · SAE India BIT Sindri',
    description: 'Explore the technical, fabrication, powertrain, aerodynamics, electronics, and management departments of SAE BIT Sindri.',
  },
  '/join': {
    title: 'Join Us · SAE India BIT Sindri',
    description: 'Apply to join SAE India BIT Sindri. Hands-on fabrication, vehicle design, telemetry, avionics, and operations opportunities.',
  },
  '/track': {
    title: 'Autódromo José Carlos Pace (Interlagos) · SAE India BIT Sindri',
    description: 'Drive the Interlagos-inspired Formula Student circuit and set a personal lap time in the SAE BIT Sindri browser experience.',
  },
};

export const RouteMetadata: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const meta = ROUTE_META_MAP[location.pathname] || {
      title: 'SAE India · BIT Sindri',
      description: 'Official Collegiate Society of Automotive Engineers at BIT Sindri.',
    };

    document.title = meta.title;

    let descTag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.name = 'description';
      document.head.appendChild(descTag);
    }
    descTag.content = meta.description;
  }, [location.pathname]);

  return null;
};
