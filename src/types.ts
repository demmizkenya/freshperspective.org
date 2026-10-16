export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  x: string;
  telegram: string;
  youtube: string;
  whatsapp: string;
  email: string;
}

export interface CeoProfile {
  fullName?: string;
  title?: string;
  statement?: string;
  photoUrl?: string;
  photoPath?: string;
  updatedAt?: string;
}

export interface SiteSettings {
  orgName: string;
  tagline: string;
  heroHeadline: string;
  heroDescription: string;
  aboutText: string;
  whoWeAre: string;
  mission: string;
  vision: string;
  coreValues: string;
  email: string;
  phone: string;
  whatsappUrl: string;
  socialLinks: SocialLinks;
  ceoProfile?: CeoProfile;
  logoUrl?: string;
  logoPath?: string;
  updatedAt?: string;
}

export const PROFESSIONAL_CATEGORIES = [
  'Content Creator',
  'Software Engineer',
  'Digital Marketer',
  'Affiliate Marketer',
  'Team Worker / Project Collaborator',
  'AI Specialist',
  'Copywriter',
  'Video Editor',
  'Social Media Manager',
  'Graphic Designer',
] as const;

export type ProfessionalCategory = typeof PROFESSIONAL_CATEGORIES[number];

export interface Professional {
  id: string;
  fullName: string;
  title: string;
  category: ProfessionalCategory | string;
  specialization: string;
  bio: string;
  skills: string[];
  photoUrl?: string;
  photoPath?: string;
  portfolioUrl?: string;
  socialUrl?: string;
  order: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imagePath?: string;
  order: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  imagePath?: string;
  projectUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: string;
  imageUrl: string;
  imagePath?: string;
  isPublished: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadershipMember {
  id: string;
  fullName: string;
  title: string;
  bio: string;
  photoUrl?: string;
  photoPath?: string;
  order: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Insight {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  imageUrl?: string;
  imagePath?: string;
  publishedDate: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  imagePath?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Publication {
  id: string;
  title: string;
  description: string;
  linkUrl?: string;
  publishedDate: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type InquiryStatus = 'new' | 'in_progress' | 'responded' | 'completed' | 'reviewed' | 'contacted';

export interface Inquiry {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  service: string;
  description: string;
  budgetRange?: string;
  preferredDeadline?: string;
  status: InquiryStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export const VIDEO_ADVERT_CATEGORIES = [
  'Promotional Campaign',
  'Brand Spotlight',
  'Product Showcase',
  'Corporate Services',
  'Event & Summits',
  'Digital Solutions',
  'Commercial Marketing',
  'Client Story',
] as const;

export type VideoAdvertCategory = typeof VIDEO_ADVERT_CATEGORIES[number] | string;

export interface VideoAdvert {
  id: string;
  title: string;
  description: string;
  category: VideoAdvertCategory;
  videoUrl: string;
  videoPath?: string;
  thumbnailUrl?: string;
  thumbnailPath?: string;
  duration?: string;
  order: number;
  isPublished: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

