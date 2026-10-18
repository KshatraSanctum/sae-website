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
