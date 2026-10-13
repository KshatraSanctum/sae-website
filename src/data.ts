// ===================== TYPE DEFINITIONS =====================

export interface CompetitionItem {
  team: string;
  title: string;
  body: string;
  icon: string;
}

export interface CompetitionMilestone {
  id: string;
  year: string;
  team: string;
  competition: string;
  category: 'Off-Road' | 'Formula' | 'Aerospace' | 'Clean Tech' | 'Innovation';
  categoryLabel: string;
  stat: string;
  statLabel: string;
  copy: string;
  image: string;
  imageAlt: string;
  highlight: string;
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

export const COMPETITION_MILESTONES: CompetitionMilestone[] = [
  {
    id: "baja-2011",
    year: "2011",
    team: "Team “Wonders”",
    competition: "BAJA SAE INDIA 2011",
    category: "Off-Road",
    categoryLabel: "Off-Road (ATV)",
    stat: "2nd Prize",
    statLabel: "Safest Vehicle Category",
    copy: "Team “WONDERS” secured Second Prize in the Safest Vehicle Category (BAJA SAE INDIA 2011), demonstrating our commitment to safety, innovation, and engineering excellence. This achievement reflects our teamwork, technical expertise, and dedication to developing a safe and reliable vehicle.",
    image: "/achievements/sae india baja 2011.webp",
    imageAlt: "Team Wonders at BAJA SAE India 2011",
    highlight: "National Safety Trophy Winner"
  },
  {
    id: "supra-2012",
    year: "2012",
    team: "Team “Speedy Avengers”",
    competition: "SUPRA SAE INDIA 2012",
    category: "Formula",
    categoryLabel: "Formula Student",
    stat: "Sole Qualifier",
    statLabel: "Representing Bihar & Jharkhand",
    copy: "Team “Speedy Avengers” proudly represented Bihar and Jharkhand, becoming the only team from both states to qualify for the main event (Supra 2012). This achievement showcased our engineering excellence, dedication, teamwork, and passion for motorsports.",
    image: "/achievements/supra sae 2012.webp",
    imageAlt: "Team Speedy Avengers at SUPRA SAE India 2012",
    highlight: "State Representation Milestone"
  },
  {
    id: "quad-torc-2014",
    year: "2014",
    team: "Team “Quad Quarks”",
    competition: "QUAD TORC 2014",
    category: "Off-Road",
    categoryLabel: "All-Terrain Quad",
    stat: "6th / 150",
    statLabel: "All-India Standing",
    copy: "Team “Quad Quarks” achieved an outstanding 6th position among 150 teams from across the country at QUAD TORC 2014. This achievement showcased our engineering skills, innovation, and teamwork.",
    image: "/achievements/quad torc 2014.webp",
    imageAlt: "Team Quad Quarks at QUAD TORC 2014",
    highlight: "Top 6 National Standing"
  },
  {
    id: "baja-2015",
    year: "2015",
    team: "Team “Incredibles”",
    competition: "BAJA SAE INDIA 2015",
    category: "Off-Road",
    categoryLabel: "Off-Road (mBAJA)",
    stat: "Main Event",
    statLabel: "NATRAX Indore Finalist",
    copy: "Team “Incredibles” made its mark by becoming the only team from Bihar and Jharkhand to qualify for the main event (BAJA SAE INDIA 2015) at NATRAX, Indore. This milestone highlighted our team’s perseverance, engineering capabilities, and determination to compete at the national level.",
    image: "/achievements/baja sae india 2015.webp",
    imageAlt: "Team Incredibles at BAJA SAE India 2015",
    highlight: "Sole State Qualifier at NATRAX"
  },
  {
    id: "supra-2016",
    year: "2016",
    team: "Team “Wonders”",
    competition: "SUPRA SAE INDIA 2016",
    category: "Formula",
    categoryLabel: "Formula Student",
    stat: "2nd Prize",
    statLabel: "Safest Vehicle Category",
    copy: "Team “Wonders” earned Second Prize in the Safest Vehicle Category at SUPRA SAE India 2016. This achievement reflected our commitment to safety-focused design, robust engineering, and innovation in student motorsports.",
    image: "/achievements/supra sae india 2016.webp",
    imageAlt: "Team Wonders at SUPRA SAE India 2016",
    highlight: "National Safety Trophy Winner"
  },
  {
    id: "supra-2017",
    year: "2017",
    team: "Team “Spitfire”",
    competition: "SUPRA SAE INDIA 2017",
    category: "Formula",
    categoryLabel: "Formula Student",
    stat: "19th Place",
    statLabel: "National Main Event Finish",
    copy: "Team “Spitfire” secured an impressive 19th-place finish at SUPRA SAE India 2017, competing against teams from across the country. The result marked another milestone in our journey of designing, building, and racing an indigenous formula-style vehicle.",
    image: "/achievements/2017 supra sae.webp",
    imageAlt: "Team Spitfire at SUPRA SAE India 2017",
    highlight: "Top 20 Formula Student Finish"
  },
  {
    id: "supra-2019",
    year: "2019",
    team: "Team “Spitfire”",
    competition: "SUPRA SAE INDIA 2019",
    category: "Formula",
    categoryLabel: "Formula Student",
    stat: "Top 50",
    statLabel: "Technical Inspection Qualified",
    copy: "Team “Spitfire” earned a place among the top 50 teams to qualify for technical inspection (SUPRA SAE INDIA 2019). This milestone reflected the precision of our vehicle design and brought us one step closer to competing on the national stage.",
    image: "/achievements/supra sae india 2019.webp",
    imageAlt: "Team Spitfire at SUPRA SAE India 2019",
    highlight: "Scrutineering Clearance"
  },
  {
    id: "ebaja-2020",
    year: "2020",
    team: "Team “Wonders”",
    competition: "E-BAJA SAE INDIA 2020",
    category: "Clean Tech",
    categoryLabel: "Electric Mobility",
    stat: "26th Rank",
    statLabel: "Virtual Stage Standing",
    copy: "Team “Wonders” secured an impressive 26th rank in the virtual event of E-BAJA SAE India 2020. This achievement highlighted our ability to adapt to digital competition while showcasing our vehicle design and engineering concepts.",
    image: "/achievements/e baja 2020.webp",
    imageAlt: "Team Wonders at E-BAJA SAE India 2020",
    highlight: "EV Design Transition"
  },
  {
    id: "efficycle-2020",
    year: "2020",
    team: "Team “Wonders”",
    competition: "Effi-Cycle 2020",
    category: "Clean Tech",
    categoryLabel: "Hybrid Mobility",
    stat: "AIR 18",
    statLabel: "All-India Rank Overall",
    copy: "Team “Wonders” secured an AIR-18 position at Effi-Cycle 2020, showcasing its innovative approach to sustainable mobility. The achievement reflected our commitment to energy-efficient design and eco-friendly engineering solutions.",
    image: "/achievements/efficycle 2021.webp",
    imageAlt: "Team Wonders at Effi-Cycle",
    highlight: "All-India Top 20 Standing"
  },
  {
    id: "autosparx-2021",
    year: "2021",
    team: "Teams “Vidojas” & “Trailblazers-V”",
    competition: "Vahaan Hackathon 2021 (AUTOSPARX)",
    category: "Innovation",
    categoryLabel: "Automotive Innovation",
    stat: "1st Place",
    statLabel: "Hackathon Champions",
    copy: "Teams “Vidojas” and “Trailblazers-V” secured 1st place in the Vahaan Hackathon 2021 (AUTOSPARX), showcasing excellence in automotive design and creative problem-solving. Their winning concepts highlighted innovative styling, design precision, and a forward-thinking approach to vehicle aesthetics.",
    image: "/achievements/Autosparx 2021.webp",
    imageAlt: "Teams Vidojas and Trailblazers-V at Vahaan Hackathon 2021",
    highlight: "National 1st Place Victory"
  },
  {
    id: "aerothon-2023",
    year: "2023",
    team: "Team “Vayu”",
    competition: "Aerothon 2023",
    category: "Aerospace",
    categoryLabel: "Aerospace & UAV",
    stat: "Rank 24",
    statLabel: "National Finals Qualifier",
    copy: "Team “Vayu” secured an impressive 24th rank at Aerothon 2023, earning a place in the finals. This achievement marked a significant step in our journey of UAV innovation, flight-system development, and aerospace engineering.",
    image: "/achievements/aerothon 2023.webp",
    imageAlt: "Team Vayu at Aerothon 2023",
    highlight: "National UAV Finals Debut"
  },
  {
    id: "nac-2023",
    year: "2023",
    team: "Teams “Jatayu” & “Pushpak”",
    competition: "National Aeromodelling Competition 2023",
    category: "Aerospace",
    categoryLabel: "Aeromodelling",
    stat: "Finalists",
    statLabel: "Both Teams in National Finals",
    copy: "At the National Aeromodelling Competition 2023, our teams “Jatayu” and “Pushpak” successfully secured places in the finals. Their performance reflected our growing expertise in aircraft design, aeromodelling, and practical aerospace engineering.",
    image: "/achievements/National aeromodelling competetion 2023.webp",
    imageAlt: "Teams Jatayu and Pushpak at National Aeromodelling Competition 2023",
    highlight: "Dual-Team Finals Qualification"
  },
  {
    id: "lom-2025",
    year: "2025",
    team: "Teams “Jatayu” & “Minos”",
    competition: "Laws of Motion 2025 (IIT Kharagpur)",
    category: "Aerospace",
    categoryLabel: "Aeromodelling",
    stat: "Finalists",
    statLabel: "Final Round at IIT Kharagpur",
    copy: "Teams “Jatayu” and “Minos” successfully secured places in the final round of Laws of Motion 2025. Their achievement highlighted their aeromodelling expertise, innovative aircraft designs, and dedication to turning engineering concepts into practical flying models.",
    image: "/achievements/Laws of Motion 2025.webp",
    imageAlt: "Teams Jatayu and Minos at Laws of Motion 2025",
    highlight: "IIT Kharagpur Finalists"
  },
  {
    id: "lom-2026",
    year: "2026",
    team: "Teams “Wayuyaan” & “Kamikaze”",
    competition: "Laws of Motion / National Aero Championship",
    category: "Aerospace",
    categoryLabel: "Aeromodelling & Flight",
    stat: "Top Finalists",
    statLabel: "Competition Top-Performing Teams",
    copy: "Our teams “Wayuyaan” and “Kamikaze” proudly secured places in the finals, emerging as two of the competition’s top-performing teams. Their performance showcased exceptional technical skills, innovative aircraft designs, and strong teamwork. Both teams demonstrated remarkable precision, creativity, and problem-solving abilities throughout the competition. Their achievement reflects our growing excellence in aeromodelling and aerospace engineering.",
    image: "/achievements/lom 2026.webp",
    imageAlt: "Teams Wayuyaan and Kamikaze at National Aero Championship",
    highlight: "Top-Performing Flight Finalists"
  }
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
export const BATCH_2K24_MEMBERS: CoreTeamMember[] = [
  {
    name: "Sujal Kumar",
    post: "Member",
    image: "/team/sujal_kumar.webp",
    linkedin: "https://www.linkedin.com/in/sujal-yadav-06ab94312",
    email: "",
    objectPosition: "center 20%",
  },
  {
    name: "Prahlad Bhagat",
    post: "Member",
    image: "/team/prahlad_bhagat.webp",
    linkedin: "https://www.linkedin.com/in/prahlad-bhagat-597bb4339",
    email: "",
    objectPosition: "center 20%",
  },
  {
    name: "Deepak Kumar Yadav",
    post: "Member",
    image: "/team/deepak_kumar_yadav.webp",
    linkedin: "https://www.linkedin.com/in/deepak-kumar-yadav-13ab00338",
    email: "",
    objectPosition: "center 20%",
  },
  {
    name: "Karan Mahto",
    post: "Member",
    image: "/team/karan_mahto.webp",
    linkedin: "https://www.linkedin.com/in/karan-mahto-08a2b831b",
    email: "",
    objectPosition: "center 20%",
  },
  {
    name: "Aniket Raj",
    post: "Member",
    image: "/team/aniket_raj.webp",
    linkedin: "https://www.linkedin.com/in/aniket-raj-399993329",
    email: "",
    objectPosition: "center 20%",
  },
  {
    name: "Subham Mohanty",
    post: "Member",
    image: "/team/subham_mohanty.webp",
    linkedin: "https://www.linkedin.com/in/subham-mohanty-481870324",
    email: "",
    objectPosition: "center 20%",
  },
  {
    name: "Siddharth Kumar",
    post: "Member",
    image: "/team/siddharth_kumar.webp",
    linkedin: "https://www.linkedin.com/in/siddharth-gupta-53b13032a",
    email: "",
    objectPosition: "center 20%",
  },
  {
    name: "Rohit Kumar",
    post: "Member",
    image: "/team/rohit_kumar.webp",
    linkedin: "https://www.linkedin.com/in/rohit-kumar-64339a279",
    email: "",
    objectPosition: "center 20%",
  },
  {
    name: "Lucky Chatterjee",
    post: "Member",
    image: "/team/lucky_chatterjee.webp",
    linkedin: "https://www.linkedin.com/in/lucky-chatterjee",
    email: "",
    objectPosition: "center 20%",
  },
  {
    name: "Hardik Kumar Gupta",
    post: "Member",
    image: "/team/hardik_kumar_gupta.webp",
    linkedin: "https://www.linkedin.com/in/hardik-kumar-gupta-1a1589339",
    email: "",
    objectPosition: "center 20%",
  },
  {
    name: "Pankaj Kumar",
    post: "Member",
    image: "/team/pankaj_kumar.webp",
    linkedin: "https://www.linkedin.com/in/pankaj-kumar-b9713a339",
    email: "",
    objectPosition: "center 20%",
  },
  {
    name: "Mado Tudu",
    post: "Member",
    image: "/team/mado_tudu.webp",
    linkedin: "https://www.linkedin.com/in/mado-tudu-a6705a36a",
    email: "",
    objectPosition: "center 20%",
  },
  {
    name: "Punam Kumari",
    post: "Member",
    image: "/team/punam_kumari.webp",
    linkedin: "https://www.linkedin.com/in/punam-kumari-9b0733340",
    email: "",
    objectPosition: "center 20%",
  },
  {
    name: "Nishi Priya",
    post: "Member",
    image: "/team/nishi_priya.webp",
    linkedin: "https://www.linkedin.com/in/nishi-priya-108a87361",
    email: "",
    objectPosition: "center 20%",
  },
  {
    name: "Prince Kumar Mahto",
    post: "Member",
    image: "/team/prince_kumar_mahto.webp",
    linkedin: "https://www.linkedin.com/in/prince-kumar-069a29325",
    email: "",
    objectPosition: "center 20%",
  },
  {
    name: "Raj Kumar",
    post: "Member",
    image: "/team/raj_kumar.webp",
    linkedin: "https://www.linkedin.com/in/raj-kumar-843058377",
    email: "",
    objectPosition: "center 20%",
  },
  {
    name: "Yash Srivastava",
    post: "Member",
    image: "/team/yash_srivastava.webp",
    linkedin: "www.linkedin.com/in/yash-srivastava-247121359",
    email: "",
    objectPosition: "center 20%",
  }
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


