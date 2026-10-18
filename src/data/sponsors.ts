import type { SponsorItem } from './types';

export const SPONSORS: SponsorItem[] = [
  {
    name: "JK Tyre & Industries",
    category: "Tyre & Mobility Partner",
    tier: "technical",
    tierLabel: "Tyre Partner",
    logo: "/sponsors/jk-tyre.png",
    description: "High-performance all-terrain and track tyres engineered for BAJA, SUPRA, and hybrid endurance racing."
  },
  {
    name: "Dassault Systèmes",
    category: "CAD, PLM & Simulation",
    tier: "software",
    tierLabel: "Software Partner",
    logo: "/sponsors/dassault-systemes.png",
    description: "3DEXPERIENCE and SOLIDWORKS engineering software suite for end-to-end 3D design, simulation, and collaboration."
  },
  {
    name: "Tata Motors",
    category: "Automotive Conglomerate",
    tier: "industrial",
    tierLabel: "Industrial Partner",
    logo: "/sponsors/tata.svg",
    description: "Industry mentorship, automotive chassis design standards, and industrial-grade manufacturing support."
  },
  {
    name: "Altair Engineering",
    category: "CAE & Structural Optimization",
    tier: "software",
    tierLabel: "Software Partner",
    logo: "/sponsors/altair.svg",
    description: "HyperMesh and OptiStruct simulation tools for topology optimization, structural integrity, and lightweighting."
  },
  {
    name: "Ansys",
    category: "CFD & Multiphysics",
    tier: "software",
    tierLabel: "Software Partner",
    logo: "/sponsors/ansys.png",
    description: "Aerodynamic CFD modeling, thermal dissipation analysis, and structural FEA for vehicle wings and chassis."
  },
  {
    name: "Bharat Petroleum",
    category: "Fuels & Petrochemicals",
    tier: "energy",
    tierLabel: "Energy Partner",
    logo: "/sponsors/bharat-petroleum.png",
    description: "High-octane fuel and technical lubrication sponsorship powering dyno tests and on-track shakedowns."
  },
  {
    name: "Indian Oil Corporation",
    category: "Petroleum & SERVO Lubricants",
    tier: "energy",
    tierLabel: "Energy Partner",
    logo: "/sponsors/indian-oil.svg",
    description: "SERVO high-temperature engine oils, brake fluids, and track fueling for national competition heats."
  },
  {
    name: "TotalEnergies",
    category: "High-Performance Lubricants",
    tier: "energy",
    tierLabel: "Energy Partner",
    logo: "/sponsors/total.svg",
    description: "Specialized synthetic engine oils, brake fluids, and drivetrain lubricants formulated for endurance competitions."
  },
  {
    name: "Ricardo",
    category: "Powertrain & Drivetrain",
    tier: "technical",
    tierLabel: "Technical Partner",
    logo: "/sponsors/ricardo.svg",
    description: "World-class powertrain consultancy, gearbox analysis, and vehicle dynamic performance validation."
  },
  {
    name: "Hindustan Motors",
    category: "Automotive Engineering",
    tier: "industrial",
    tierLabel: "Industrial Partner",
    logo: "/sponsors/hindustan-motors.svg",
    description: "Pioneering Indian automotive expertise, transmission tooling, and vehicle manufacturing insights."
  },
  {
    name: "Jawa Motorcycles",
    category: "Two-Wheeler & Engine Systems",
    tier: "industrial",
    tierLabel: "Industrial Partner",
    logo: "/sponsors/jawa.png",
    description: "Legendary motorcycle brand providing powertrain tuning guidance, engine dynamics, and test support."
  },
  {
    name: "RJS Racing Equipment",
    category: "Safety & Driver Gear",
    tier: "technical",
    tierLabel: "Safety Equipment",
    logo: "/sponsors/rjs-racing.png",
    description: "FIA and SFI-certified racing harnesses, fire suits, and cockpit safety equipment protecting our drivers."
  },
  {
    name: "ONGC",
    category: "Corporate & PSU Patron",
    tier: "associate",
    tierLabel: "Corporate Partner",
    logo: "/sponsors/ongc.png",
    description: "Public sector energy enterprise backing student-led research in sustainable mobility and hybrid engineering."
  },
  {
    name: "AIEFA Engineers Vision",
    category: "Technical & GATE Mentorship",
    tier: "associate",
    tierLabel: "Academic Partner",
    logo: "/sponsors/aiefa.png",
    description: "Engineering training, aptitude guidance, and competitive exam skill-building for collegiate builders."
  },
  {
    name: "BIT Sindri",
    category: "Academic & Institutional Patron",
    tier: "institutional",
    tierLabel: "Institutional Patron",
    logo: "/sponsors/bit-sindri.png",
    description: "Our alma mater providing workshop fabrication bays, CNC machine tools, lab infrastructure, and faculty mentorship."
  }
];

export const SPONSOR_FILTER_DEFS: [string, string][] = [
  ["all", "All Sponsors"],
  ["software", "Software & CAD/CAE"],
  ["industrial", "Automotive & Industrial"],
  ["energy", "Energy & Fuels"],
  ["technical", "Technical & Safety"],
  ["institutional", "Institutional & Academic"]
];
