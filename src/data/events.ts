export interface EventItem {
  id: string;
  index: string;
  glyph: string;
  category: 'flagship' | 'competition' | 'workshop' | 'community';
  categoryLabel: string;
  dateBadge: string;
  fullDate: string;
  title: string;
  subtitle: string;
  status: 'conducted' | 'annual';
  statusText: string;
  image: string;
  venue: string;
  timing: string;
  shortDesc: string;
  longDesc: string;
  instagramUrl: string;
  specs: {
    label: string;
    value: string;
  }[];
}

export const ALL_EVENTS: EventItem[] = [
  {
    id: 'tvaran-tech-fest',
    index: '01 / 08',
    glyph: '✦',
    category: 'flagship',
    categoryLabel: 'Annual Flagship Fest',
    dateBadge: 'MAY 09–10',
    fullDate: 'May 09 — May 10, 2026',
    title: 'TECH FEST — TVARAN',
    subtitle: 'Annual Technical Fest of SAE INDIA BIT Sindri',
    status: 'annual',
    statusText: 'Conducted · Annual Flagship',
    image: '/events/TECH_FEST.jpeg',
    venue: 'BIT Sindri Campus & Arenas',
    timing: '2-Day Annual Fest',
    shortDesc:
      'TVARAN is the annual technical fest of SAE INDIA BIT Sindri, celebrating innovation, creativity, and engineering excellence through exciting competitions, technical challenges, and collaborative events.',
    longDesc:
      'TVARAN is the premier annual technical festival organized by SAE INDIA BIT Sindri. Celebrating hands-on creativity and competitive spirit, the fest hosts robotics obstacle arenas, mechanical build-offs, mobility case study challenges, and technical campus quests. It stands as our chapter’s defining annual celebration of engineering passion and teamwork.',
    instagramUrl:
      'https://www.instagram.com/reel/DYCLwnfT5Kw/?utm_source=ig_web_copy_link&psln=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    specs: [
      { label: 'Event Type', value: 'Flagship Multi-Track Technical Fest' },
      { label: 'Dates Held', value: '09th May 2026 – 10th May 2026' },
      { label: 'Host Chapter', value: 'SAE INDIA Collegiate Society BIT Sindri' },
      { label: 'Highlights', value: 'Robotics, Bike Build, EV Hackathons & Quests' },
    ],
  },
  {
    id: 'auto-clue-quest',
    index: '02 / 08',
    glyph: '⌁',
    category: 'competition',
    categoryLabel: 'Campus Challenge',
    dateBadge: 'MAY 09',
    fullDate: 'May 09, 2026',
    title: 'AUTO-CLUE QUEST',
    subtitle: 'Logical Thinking, Puzzles & Clue Hunt',
    status: 'conducted',
    statusText: 'Conducted at TVARAN',
    image: '/events/AUTO-CLUE_QUEST.jpeg',
    venue: 'Campus Grounds & Quad, BIT Sindri',
    timing: 'Full-Day Campus Quest',
    shortDesc:
      'AUTO-CLUE QUEST is an exciting campus challenge that combines quizzes, puzzles, and clue-solving to test participants’ logical thinking, teamwork, and problem-solving skills.',
    longDesc:
      'A thrilling treasure and intelligence quest hosted as part of TVARAN 2026. Participant teams raced across campus solving cryptic engineering puzzles, automotive riddles, and physical checkpoints, pushing their speed, teamwork, and analytical deduction to the limit.',
    instagramUrl:
      'https://www.instagram.com/p/DX7VrB8kqDO/?utm_source=ig_web_copy_link&cplk=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    specs: [
      { label: 'Category', value: 'Logic, Puzzles & Scavenger Quest' },
      { label: 'Date Held', value: '09th May 2026' },
      { label: 'Festival', value: 'TVARAN 2026' },
      { label: 'Focus', value: 'Analytical Deduction & Team Problem-Solving' },
    ],
  },
  {
    id: 'build-a-bike',
    index: '03 / 08',
    glyph: '⚙',
    category: 'competition',
    categoryLabel: 'Mechanical Challenge',
    dateBadge: 'MAY 09–10',
    fullDate: 'May 09 — May 10, 2026',
    title: 'BUILD A BIKE',
    subtitle: 'Bicycle Assembly & Performance Challenge',
    status: 'conducted',
    statusText: 'Conducted at TVARAN',
    image: '/events/BUILD_A_BIKE.jpeg',
    venue: 'Mechanical Fabrication Bay, BIT Sindri',
    timing: '2-Day Mechanical Arena',
    shortDesc:
      'BUILD A BIKE is an exciting mechanical challenge that tests participants’ technical knowledge, precision, and teamwork through bicycle assembly and performance tasks.',
    longDesc:
      'A true test of craftsmanship and mechanical problem-solving. Teams received disassembled components and were evaluated on assembly precision, drivetrain calibration, alignment, brake tuning, and live performance ride testing under time-attack conditions.',
    instagramUrl:
      'https://www.instagram.com/p/DX7Wmx0ExAy/?utm_source=ig_web_copy_link&srtk=MzRlODBiNWFlZA==',
    specs: [
      { label: 'Discipline', value: 'Mechanical Assembly & Precision Tuning' },
      { label: 'Dates Held', value: '09th May 2026 – 10th May 2026' },
      { label: 'Venue', value: 'Central Mechanical Fabrication Bay' },
      { label: 'Criteria', value: 'Build Speed, Mechanical Accuracy & Ride Stability' },
    ],
  },
  {
    id: 'technothon',
    index: '04 / 08',
    glyph: '⚡',
    category: 'competition',
    categoryLabel: 'EV Case Study',
    dateBadge: 'MAY 09',
    fullDate: 'May 09, 2026',
    title: 'TECHNOTHON',
    subtitle: 'India EV & Green Mobility Case Study Challenge',
    status: 'conducted',
    statusText: 'Conducted at TVARAN',
    image: '/events/TECHNOTHON.jpeg',
    venue: 'Seminar Hall, BIT Sindri',
    timing: 'Case Presentations & Jury Defense',
    shortDesc:
      'TECHNOTHON is a case study presentation competition focused on India’s EV and mobility industry, encouraging strategic insights and sustainable engineering solutions.',
    longDesc:
      'TECHNOTHON challenged participants to analyze the crucial bottlenecks facing India’s electric mobility revolution: battery chemistry economics, charging network infrastructure, thermal safety, and fleet electrification. Teams pitched research-backed frameworks to a panel of expert evaluators.',
    instagramUrl:
      'https://www.instagram.com/p/DX7U26Tkzbs/?utm_source=ig_web_copy_link&dlrf=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    specs: [
      { label: 'Theme', value: 'EV Ecosystem, Batteries & Sustainable Mobility' },
      { label: 'Date Held', value: '09th May 2026' },
      { label: 'Format', value: 'Executive Deck Presentation & Defense' },
      { label: 'Festival', value: 'TVARAN 2026' },
    ],
  },
  {
    id: 'dirt-drive',
    index: '05 / 08',
    glyph: '▰',
    category: 'competition',
    categoryLabel: 'Bot Obstacle Challenge',
    dateBadge: 'MAY 10',
    fullDate: 'May 10, 2026',
    title: 'DIRT DRIVE',
    subtitle: 'All-Terrain Wireless Bot Arena',
    status: 'conducted',
    statusText: 'Conducted at TVARAN',
    image: '/events/DRIT_DRIVE.jpeg',
    venue: 'Off-Road Obstacle Arena, BIT Sindri',
    timing: 'Track Heats & Final Shakedown',
    shortDesc:
      'TVARAN presents DIRT DRIVE, an exciting bot-based challenge that tests creativity, teamwork, and precision through demanding obstacle tracks and unique terrain hurdles.',
    longDesc:
      'Student-engineered rovers and bot prototypes took on extreme obstacle terrain featuring mud trenches, elevated ramps, rumble strips, and sharp hairpin curves. The challenge tested chassis rigidity, wireless radio responsiveness, high-torque drivetrain durability, and piloting agility.',
    instagramUrl:
      'https://www.instagram.com/p/DX7j3H0k_hc/?utm_source=ig_web_copy_link&cplk=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    specs: [
      { label: 'Track Type', value: 'Multi-Surface All-Terrain Obstacle Arena' },
      { label: 'Date Held', value: '10th May 2026' },
      { label: 'Hardware', value: 'Custom-Built Wired / Wireless Bots' },
      { label: 'Festival', value: 'TVARAN 2026' },
    ],
  },
  {
    id: 'orientation-2026',
    index: '06 / 08',
    glyph: '✦',
    category: 'community',
    categoryLabel: 'Induction & Welcome',
    dateBadge: 'SEP 11',
    fullDate: 'September 11, 2026',
    title: 'ORIENTATION — BATCH OF 2026',
    subtitle: 'Welcoming the Next Generation of Mobility Engineers',
    status: 'conducted',
    statusText: 'Successfully Completed',
    image: '/events/ORIENTATION.jpeg',
    venue: 'Deshpande Auditorium, BIT Sindri',
    timing: 'Interactive Induction Session',
    shortDesc:
      'SAE INDIA BIT Sindri warmly welcomed the Batch of 2026, inspiring new members to explore automotive engineering, embrace innovation, and join our chapter family.',
    longDesc:
      'A high-energy welcome address introducing freshman engineers to collegiate motorsports, UAV flight development, workshop safety, and the culture of pair-programming, manufacturing, and national SAE India competitions. Senior leaders showcased our fleet of BAJA buggies, Formula racecars, and aero platforms.',
    instagramUrl:
      'https://www.instagram.com/p/DcyfcVWR51u/?utm_source=ig_web_copy_link&mdxt=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    specs: [
      { label: 'Target Batch', value: 'Incoming Engineering Batch of 2026' },
      { label: 'Date Held', value: '11th September 2026' },
      { label: 'Venue', value: 'Campus Auditorium' },
      { label: 'Keynotes', value: 'Motorsports, Aero Division & Chapter Roadmap' },
    ],
  },
  {
    id: 'outreach-workshop',
    index: '07 / 08',
    glyph: '◒',
    category: 'workshop',
    categoryLabel: 'School Outreach Workshop',
    dateBadge: 'WORKSHOP',
    fullDate: 'School STEM & Automobile Outreach',
    title: 'OUTREACH AUTOMOTIVE WORKSHOP',
    subtitle: 'Saraswati Shishu Vidya Mandir, Tetulmari',
    status: 'conducted',
    statusText: 'Outreach Completed',
    image: '/events/workshop2.webp',
    venue: 'Saraswati Shishu Vidya Mandir, Tetulmari',
    timing: 'Technical Demonstration Sessions',
    shortDesc:
      'SAE INDIA BIT Sindri organized a workshop at Saraswati Shishu Vidya Mandir, Tetulmari, featuring technical demonstrations to promote automobile engineering awareness.',
    longDesc:
      'Demonstrating our commitment to STEM community education, senior chapter members conducted an interactive automotive workshop for high school students. The session featured hands-on teardown models, powertrain working principles, aerodynamic basics, and interactive discussions to inspire future engineers.',
    instagramUrl:
      'https://www.instagram.com/p/DRUxH8ykppe/?utm_source=ig_web_copy_link&exln=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    specs: [
      { label: 'Host School', value: 'Saraswati Shishu Vidya Mandir, Tetulmari' },
      { label: 'Focus', value: 'Automotive Mechanics & Science Fundamentals' },
      { label: 'Format', value: 'Working Hardware Demos & Q&A Interactive' },
      { label: 'Mentors', value: 'SAE INDIA BIT Sindri Technical Team' },
    ],
  },
  {
    id: 'vishwakarma-puja',
    index: '08 / 08',
    glyph: '✦',
    category: 'community',
    categoryLabel: 'Tradition & Celebration',
    dateBadge: 'SEP 17',
    fullDate: 'September 17, 2026',
    title: 'VISHWAKARMA POOJA CELEBRATION',
    subtitle: 'Blessings for Craftsmanship, Tools & Machinery',
    status: 'conducted',
    statusText: 'Celebrated at The Bay',
    image: '/events/Vishwakarma Pooja.jpeg',
    venue: 'Mechanical Fabrication Bay, BIT Sindri',
    timing: 'Annual Workshop Puja & Gathering',
    shortDesc:
      'Vishwakarma Puja was celebrated in the workshop with devotion and enthusiasm, seeking blessings for safety, prosperity, and success in all engineering endeavours.',
    longDesc:
      'A deeply cherished tradition in the life of SAE BIT Sindri. The entire society gathers in the mechanical workshop to clean, polish, and worship the machine tools, welding equipment, chassis rigs, and competition vehicles, honoring the divine architect and seeking blessings for safety and success in all upcoming national competitions.',
    instagramUrl:
      'https://www.instagram.com/reel/DdgdoDwztlu/?utm_source=ig_web_copy_link&vrfl=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    specs: [
      { label: 'Tradition', value: 'Annual Vishwakarma Jayanti' },
      { label: 'Date Held', value: '17th September 2026' },
      { label: 'Location', value: 'Central Mechanical Fabrication Bay' },
      { label: 'Community', value: 'Collegiate Members, Faculty & Alumni' },
    ],
  },
];
