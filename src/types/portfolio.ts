export interface PersonalInfo {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  tagline: string;
  showTagline: boolean;
  location: string;
  email: string;
  bio: string;
  avatarUrl: string;
  avatarBackUrl?: string;
  quoteImageUrl: string;
  quote: string;
  values: string[];
}

export interface SocialLink {
  platform: "github" | "linkedin" | "email" | "external";
  url: string;
  isVisible: boolean;
  order: number;
}

export interface NavItem {
  id: string;
  label: string;
  iconKey: "user" | "wrench" | "briefcase" | "folder-open" | "graduation-cap" | "mail" | "book-open";
}

export interface SkillCategory {
  key: string;
  label: string;
  description: string;
  iconKey: "code2" | "palette" | "brain";
  skills: string[];
  isVisible: boolean;
  order: number;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  current: boolean;
  bullets: string[];
  isVisible: boolean;
  order: number;
}

export interface Project {
  title: string;
  subtitle: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
  bullets: string[];
  imageUrl: string;
  link: string;
  destinationType?: "external" | "detail";
  slug?: string;
  embedVideoUrl?: string;
  videoFileUrl?: string;
  isFeatured: boolean;
  isVisible: boolean;
  order: number;
}

export interface Achievement {
  title: string;
  period: string;
}

export interface Activity {
  title: string;
  type: string;
  description: string;
  period: string;
}

export interface Education {
  university: string;
  location: string;
  degree: string;
  expectedGraduation: string;
  thesis: {
    title: string;
    bullets: string[];
    isVisible: boolean;
  };
  coursework: string[];
  achievements: Achievement[];
  activities: Activity[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  navItems: NavItem[];
  socialLinks: SocialLink[];
  skillCategories: SkillCategory[];
  experiences: Experience[];
  projects: Project[];
  education: Education;
  contactInfo: ContactInfo;
}
