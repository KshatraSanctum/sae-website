// ===================== TYPE DEFINITIONS =====================

export interface NewsItem {
  date: string;
  title: string;
  body: string;
}

export interface EventItem {
  tag: string;
  tagLabel: string;
  term: string;
  title: string;
  body: string;
  loc: string;
}

export interface CompetitionItem {
  team: string;
  title: string;
  body: string;
  icon: string;
}

export interface BearerItem {
  role: string;
  names: string[];
}

export interface TeamSection {
  name: string;
  blurb: string;
  roles: string[];
}

export interface Department {
  name: string;
  blurb: string;
  roles: string[];
}

export interface SponsorItem {
  name: string;
  category: string;
  tier: string;
  tierLabel: string;
  logo: string;
  description: string;
}

// ===================== EDITABLE CONTENT DATA =====================

export const NEWS: NewsItem[] = [
  { date: "Tech Mahotsav", title: "Tvaran — our flagship SAE event — launches", body: "Tvaran kicks off as the chapter's flagship showcase under Tech Mahotsav, bringing design challenges and EV-focused activities to campus." },
  { date: "Recruitment", title: "Freshers induction opens for new crew members", body: "New recruits join the build floor — add your induction dates and application link here." },
  { date: "Workshop Recap", title: "Roll-cage &amp; chassis design session wrapped", body: "A hands-on look at frame fabrication and SAE rulebook constraints for first-time builders." }
];

export const EVENTS: EventItem[] = [
  { tag: "flagship", tagLabel: "Flagship", term: "Tech Mahotsav · Date TBA", title: "Tvaran", body: "The chapter's flagship event — design challenges, EV hackathon and hands-on builds open to the whole campus.", loc: "BIT Sindri Campus" },
  { tag: "workshop", tagLabel: "Workshop", term: "Odd Semester · Date TBA", title: "Chassis & Roll-Cage Design", body: "Hands-on session on frame fabrication, materials and the SAE rulebook constraints that shape every build.", loc: "SAE Workshop Bay" },
  { tag: "visit", tagLabel: "Industrial Visit", term: "Even Semester · Date TBA", title: "Manufacturing Plant Visit", body: "A look at production-line engineering and quality processes at an automotive manufacturing facility.", loc: "Off-Campus" },
  { tag: "workshop", tagLabel: "Workshop", term: "Even Semester · Date TBA", title: "EV Powertrain Tech Talk", body: "Covering motor selection, battery management and controller tuning for electric builds.", loc: "Seminar Hall" },
  { tag: "flagship", tagLabel: "Flagship", term: "Pre-Competition · Date TBA", title: "Test & Tune Camp", body: "Final shakedown runs and reliability checks before the team travels for competition.", loc: "Test Track" }
];

export const COMPETITIONS: CompetitionItem[] = [
  { team: "Team Wonders", title: "BAJA SAE India", body: "A single-seat, all-terrain off-road buggy built to survive endurance, hill-climb and maneuverability events on the toughest terrain.", icon: '<path d="M3 16h2l1.5-5h11L19 16h2M6 16a2 2 0 104 0 2 2 0 10-4 0zM14 16a2 2 0 104 0 2 2 0 10-4 0z"/>' },
  { team: "Team Spitfire", title: "SUPRA SAE India", body: "A Formula-style single-seater race car, engineered for acceleration, handling and track performance against teams nationwide.", icon: '<path d="M4 17l2-6 4-2h4l4 2 2 6M9 17a2 2 0 11-4 0M19 17a2 2 0 11-4 0"/>' },
  { team: "Team Wonders", title: "EFFICYCLE", body: "A human-and-electric hybrid vehicle challenge that tests efficiency, ergonomics and clever powertrain design.", icon: '<path d="M6 17a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18 17a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM8.5 14.5L12 8l3 4.5M12 8h4"/>' },
  { team: "Vayu", title: "Aerothon / UAV Challenge", body: "Our aero wing designs and flies drones for autonomous-flight and payload challenges — the reason a drone shares this page with a buggy.", icon: '<path d="M12 9a3 3 0 100 6 3 3 0 000-6zM5 5l3 3M19 5l-3 3M5 19l3-3M19 19l-3-3"/>' },
  { team: "Aerosoul,Wings of fire,Jatayu and Kamikaze", title: "LOM(IIT KGP)", body: "To design and build a cargo RC Plane", icon: '<path d="M9 7V4h6v3M5 7h14l-1 12H6L5 7zM9 12h6"/>' }
];

export const BEARERS: BearerItem[] = [
  { role: "Chairperson", names: ["Raj Aryan"] },
  { role: "Vice Chairperson", names: ["Pradeep Mistri", "Md. Sagir Ansari"] },
  { role: "Secretary", names: ["Ritu Raman"] },
  { role: "Joint Secretary", names: ["Bhumika Singh", "Roshan Kumar"] },
  { role: "Treasurer", names: ["Sumit Pandey"] },
  { role: "Joint Treasurer", names: ["Himanshu Shekar", "Amarjeet Kr. Prajapati"] },
  { role: "Logistics & Procurement Head", names: ["Aryan Ray", "Adarsh Kumar"] },
  { role: "Alumni In Charge", names: ["Vivek Mahto", "Sonam Kumari"] },
  { role: "Sponsorship & Fund Raising Head", names: ["Shubhanshu Jaiswal", "Shristi Kishor"] },
  { role: "Media & Graphics Head", names: ["Arshdul Quadri", "Roshni Kumari"] },
  { role: "Public Relation Officer", names: ["Laxmi Pahan", "Anupriya Kumari"] },
  { role: "Event Coordinator", names: ["Payal Kumari", "Mumtaj Ansari"] },
  { role: "Team Manager", names: ["Ayush Kr. Saw", "Rahul Kr. Mahto"] },
  { role: "Technical Head", names: ["Rahul Kr. Mahto"] },
  { role: "Electronics Head", names: ["Vivek Mahto"] },
  { role: "Design & CAE Head", names: ["Roshan Kumar", "Laxmi Pahan"] },
  { role: "Manufacturing Head", names: ["Aryan Ray", "Pradeep Mistri"] },
  { role: "Aviation Head", names: ["Sumit Pandey", "Ayush Kr. Saw"] },
  { role: "Braking Head", names: ["Bhumika Singh"] },
  { role: "Suspension & Steering Head", names: ["Md. Sagir Ansari"] },
  { role: "Powertrain Head", names: ["Arshdul Quadri"] },
  { role: "Add Role Title", names: ["Anupriya Kumari"] }
];

export const TEAM_SECTIONS: TeamSection[] = [
  { name: "Team Wonders", blurb: "BAJA & EFFICYCLE — off-road and hybrid vehicle builds.", roles: ["Team Captain", "Chassis Lead", "Suspension Lead", "Powertrain Lead", "Ergonomics Lead"] },
  { name: "Team Spitfire", blurb: "SUPRA — Formula-style race car engineering.", roles: ["Team Captain", "Aerodynamics Lead", "Drivetrain Lead", "Electronics Lead", "Manufacturing Lead"] },
  { name: "Vayu", blurb: "Aero & UAV wing — drone design and Aerothon entries.", roles: ["Flight Lead", "Airframe Lead", "Controls & Avionics", "Payload Systems"] },
  { name: "Robotics Wing", blurb: "Autonomous and remote-operated robotics builds.", roles: ["Robotics Lead", "Mechanical Design", "Embedded Systems", "Software & Vision"] }
];

export const DEPARTMENTS: Department[] = [
  { name: "Powertrain", blurb: "Engine, transmission, intake, exhaust, and cooling systems.", roles: ["Powertrain Lead", "Engine Specialist", "Transmission Engineer", "Cooling & Exhaust Lead"] },
  { name: "Braking", blurb: "Caliper selection, pedal box geometry, rotors, and master cylinders.", roles: ["Braking Lead", "Caliper & Rotor Designer", "Pedal Box Engineer", "Fluid Systems Specialist"] },
  { name: "Steering", blurb: "Steering columns, rack and pinion, steering geometry, and linkages.", roles: ["Steering Lead", "Column & Linkage Designer", "Rack & Pinion Engineer", "Geometry Analyst"] },
  { name: "Suspension", blurb: "Dampers, springs, wishbones, geometry, hubs, and uprights.", roles: ["Suspension Lead", "Suspension Geometry Lead", "Damper & Spring Engineer", "Upright & Hub Designer"] },
  { name: "Electronics", blurb: "Telemetry, DAQ, wiring harness, dashboard, sensors, and power distribution.", roles: ["Electronics Lead", "Wiring Harness Engineer", "Telemetry & DAQ Specialist", "Sensor & Dashboard Lead"] }
];

export const FILTER_DEFS: [string, string][] = [
  ["all", "All"],
  ["flagship", "Flagship"],
  ["workshop", "Workshops"],
  ["visit", "Visits"]
];

export const TAG_CLASSES: Record<string, string> = {
  workshop: "workshop",
  visit: "visit",
  flagship: "flagship",
  recruit: "recruit"
};

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

export const PAGES: string[] = [
  "home", "events", "competitions", "bearers", "team", "sponsors", "departments", "join"
];
