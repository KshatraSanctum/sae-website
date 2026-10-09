// ===================== TYPE DEFINITIONS =====================

export interface CompetitionItem {
  team: string;
  title: string;
  body: string;
  icon: string;
}

export interface CoreTeamMember {
  name: string;
  post: string;
  subPost?: string;
  discipline?: string;
  image: string;
  linkedin?: string;
  email?: string;
  instagram?: string;
  objectPosition?: string;
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

export const COMPETITIONS: CompetitionItem[] = [
  { team: "Team Wonders", title: "BAJA SAE India", body: "A single-seat, all-terrain off-road buggy built to survive endurance, hill-climb and maneuverability events on the toughest terrain.", icon: '<path d="M3 16h2l1.5-5h11L19 16h2M6 16a2 2 0 104 0 2 2 0 10-4 0zM14 16a2 2 0 104 0 2 2 0 10-4 0z"/>' },
  { team: "Team Spitfire", title: "SUPRA SAE India", body: "A Formula-style single-seater race car, engineered for acceleration, handling and track performance against teams nationwide.", icon: '<path d="M4 17l2-6 4-2h4l4 2 2 6M9 17a2 2 0 11-4 0M19 17a2 2 0 11-4 0"/>' },
  { team: "Team Wonders", title: "EFFICYCLE", body: "A human-and-electric hybrid vehicle challenge that tests efficiency, ergonomics and clever powertrain design.", icon: '<path d="M6 17a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18 17a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM8.5 14.5L12 8l3 4.5M12 8h4"/>' },
  { team: "Vayu", title: "Aerothon / UAV Challenge", body: "Our aero wing designs and flies drones for autonomous-flight and payload challenges — the reason a drone shares this page with a buggy.", icon: '<path d="M12 9a3 3 0 100 6 3 3 0 000-6zM5 5l3 3M19 5l-3 3M5 19l3-3M19 19l-3-3"/>' },
  { team: "Aerosoul,Wings of fire,Jatayu and Kamikaze", title: "LOM(IIT KGP)", body: "To design and build a cargo RC Plane", icon: '<path d="M9 7V4h6v3M5 7h14l-1 12H6L5 7zM9 12h6"/>' }
];

export const CORE_TEAM_MEMBERS: CoreTeamMember[] = [
  {
    name: "Raj Aryan",
    post: "Chairperson",
    image: "/team/raj_aryan.webp",
    linkedin: "https://www.linkedin.com/in/raj-aryan-32ba59287/",
    email: "raj1248aryan@gmail.com",
    objectPosition: "center 20%",
  },
  {
    name: "Ritu Raman",
    post: "Secretary",
    image: "/team/ritu_raman.webp",
    linkedin: "https://www.linkedin.com/in/rituraman16",
    email: "rituraman9x2015@gmail.com",
    objectPosition: "center 20%",
  },
  {
    name: "Md Sagir Ansari",
    post: "Vice Chairperson",
    subPost: "Steering & Suspension Head",
    image: "/team/sagir.webp",
    linkedin: "https://www.linkedin.com/in/md-sagir-ansari-ab1885292",
    email: "mdsagiransari90.2@gmail.com",
    objectPosition: "center 20%",
  },
  {
    name: "Roshan Kumar",
    post: "Joint Secretary",
    subPost: "Design & CAE Head",
    image: "/team/roshan_kumar.webp",
    linkedin: "https://www.linkedin.com/in/roshan-kumar-586522294",
    email: "roshan.meug.23@gmail.com",
    objectPosition: "center 20%",
  },
  {
    name: "Bhumika Kumari",
    post: "Joint Secretary",
    subPost: "Braking Head",
    image: "/team/bhumika.webp",
    linkedin: "https://www.linkedin.com/in/bhumika-kumari-7856a627b",
    email: "bhumika.kumari035@gmail.com",
    objectPosition: "center 20%",
  },
  {
    name: "Sumit Pandey",
    post: "Treasurer",
    subPost: "Aviation Head",
    image: "/team/sumit_pandey.webp",
    linkedin: "https://www.linkedin.com/in/sumitpandey2004",
    email: "sumit200pandey@gmail.com",
    objectPosition: "center 20%",
  },
  {
    name: "Rahul Kumar Mahto",
    post: "Technical Head",
    subPost: "Team Manager",
    image: "/team/rahul_kumar_mahto.webp",
    linkedin: "https://www.linkedin.com/in/isihin",
    email: "rahulkumarmahto334@gmail.com",
    objectPosition: "center 20%",
  },
  {
    name: "Vivek Mahto",
    post: "Alumni In-Charge",
    subPost: "Electronics Head",
    image: "/team/vivek_mahto.webp",
    linkedin: "https://www.linkedin.com/in/vivek-mahto-944055287",
    email: "01.vivekmahto@gmail.com",
    objectPosition: "center 20%",
  },
  {
    name: "Sonam Kumari",
    post: "Alumni In-Charge",
    image: "/team/sonam_kumari.webp",
    linkedin: "https://www.linkedin.com/in/sonam-kumari-840b41290",
    email: "sonamkri1211@gmail.com",
    objectPosition: "center 20%",
  },
  {
    name: "Adarsh Kumar",
    post: "Logistics & Procurement Head",
    image: "/team/adarash_kumar.webp",
    linkedin: "https://www.linkedin.com/in/adarsh-kumar-31681a294",
    email: "kumaradarsh0657@gmail.com",
    objectPosition: "center 20%",
  },
  {
    name: "Arshdul Quadri",
    post: "Media & Graphics Head",
    subPost: "Powertrain Head",
    image: "/team/arshadul.webp",
    linkedin: "https://www.linkedin.com/in/arshdul-quadri-9687ab282",
    email: "arshad30410@gmail.com",
    objectPosition: "center 20%",
  },
  {
    name: "Amarjeet Kumar Prajapati",
    post: "Joint Treasurer",
    subPost: "Powertrain Head",
    image: "/team/amarjeet.webp",
    linkedin: "https://www.linkedin.com/in/amarjeet-kumar-prajapati-7b9296304",
    email: "amarjeetbtps@gmail.com",
    objectPosition: "center 20%",
  },
  {
    name: "Anupriya Kumari",
    post: "Public Relations Officer (PRO)",
    subPost: "CFD Head",
    image: "/team/anupriya_kumari.webp",
    linkedin: "https://www.linkedin.com/in/anupriya-kumari-251b29290",
    email: "anupriyayadav705@gmail.com",
    objectPosition: "center 20%",
  },
  {
    name: "Ayush Kumar Saw",
    post: "Team Manager",
    subPost: "Aviation Head",
    image: "/team/ayush_kumar_saw.webp",
    linkedin: "https://www.linkedin.com/in/ayush-kumar-saw-ba162a291",
    email: "sawayushkumar1@gmail.com",
    objectPosition: "center 20%",
  },
];



export const DEPARTMENTS: Department[] = [
  { name: "Powertrain", blurb: "Engine, transmission, intake, exhaust, and cooling systems.", roles: ["Powertrain Lead", "Engine Specialist", "Transmission Engineer", "Cooling & Exhaust Lead"] },
  { name: "Braking", blurb: "Caliper selection, pedal box geometry, rotors, and master cylinders.", roles: ["Braking Lead", "Caliper & Rotor Designer", "Pedal Box Engineer", "Fluid Systems Specialist"] },
  { name: "Steering", blurb: "Steering columns, rack and pinion, steering geometry, and linkages.", roles: ["Steering Lead", "Column & Linkage Designer", "Rack & Pinion Engineer", "Geometry Analyst"] },
  { name: "Suspension", blurb: "Dampers, springs, wishbones, geometry, hubs, and uprights.", roles: ["Suspension Lead", "Suspension Geometry Lead", "Damper & Spring Engineer", "Upright & Hub Designer"] },
  { name: "Electronics", blurb: "Telemetry, DAQ, wiring harness, dashboard, sensors, and power distribution.", roles: ["Electronics Lead", "Wiring Harness Engineer", "Telemetry & DAQ Specialist", "Sensor & Dashboard Lead"] }
];



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


