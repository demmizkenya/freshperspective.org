import { SiteSettings, Service, FAQ } from './types';

export const AUTHORIZED_ADMIN_EMAILS = [
  'danielowino233@gmail.com',
  'freshperspectiveorganization@gmail.com',
];

export const DEFAULT_SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/share/19DdJcZDxF/',
  instagram: 'https://www.instagram.com/chibukingtechnology',
  linkedin: 'https://www.linkedin.com/company/fresh-prespective/',
  tiktok: 'https://www.tiktok.com/@fresh.perspective7',
  x: 'https://x.com/MChibuking',
  telegram: 'https://t.me/FreshPerspectiv',
  youtube: 'https://youtube.com/@michealchibuking?si=QYxm6mnDs865i90e',
  whatsapp: 'https://wa.me/2349031860768',
  email: 'mailto:freshperspectiveorganization@gmail.com',
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  orgName: 'Fresh Perspective Organization',
  tagline: 'Timely Delivery With Valuable Works Done',
  heroHeadline: 'Creative, Consulting & Digital Solutions',
  heroDescription:
    'Fresh Perspective Organization helps brands, businesses, institutions, and events grow through professional creative services and modern digital solutions.',
  aboutText:
    'Fresh Perspective Organization is a creative and digital solutions agency dedicated to helping brands, businesses, companies, schools, churches, hospitals, and events grow through professional services and strategic digital solutions.',
  whoWeAre:
    'A multidisciplinary team providing creative, technical, and digital services with focus on quality, clear communication, timely delivery, and practical value.',
  mission:
    'To help brands and businesses achieve their goals through modern digital solutions, professional service delivery, and sustainable growth.',
  vision:
    'To build a respected digital agency recognized for innovation, operational excellence, and measurable value.',
  coreValues:
    'Professionalism, creativity, integrity, collaboration, quality, and timely delivery.',
  email: 'freshperspectiveorganization@gmail.com',
  phone: '+234 903 186 0768',
  whatsappUrl: 'https://wa.me/2349031860768',
  socialLinks: DEFAULT_SOCIAL_LINKS,
  logoUrl: '',
  logoPath: '',
  ceoProfile: {
    fullName: '',
    title: 'Chief Executive Officer',
    statement: '',
    photoUrl: '',
    photoPath: '',
  },
};

export const DEFAULT_SERVICES: Omit<Service, 'id'>[] = [
  {
    title: 'Graphic Design',
    description:
      'High-impact corporate brand identities, bespoke marketing collateral, editorial layouts, and vector assets crafted with precision.',
    order: 1,
    isPublished: true,
  },
  {
    title: 'Content Creation',
    description:
      'Audience-centric digital media, thought leadership content, and multi-format creative assets that engage target demographics.',
    order: 2,
    isPublished: true,
  },
  {
    title: 'Web Development',
    description:
      'Robust, responsive, and performance-tuned web applications and portals built on cutting-edge modern architectures.',
    order: 3,
    isPublished: true,
  },
  {
    title: 'Digital Marketing',
    description:
      'Data-driven performance campaigns, omnichannel acquisition, search optimization, and conversion-focused growth strategies.',
    order: 4,
    isPublished: true,
  },
  {
    title: 'Social Media Management',
    description:
      'Consistent organic audience building, content scheduling, community moderation, and brand sentiment monitoring across major networks.',
    order: 5,
    isPublished: true,
  },
  {
    title: 'Copywriting',
    description:
      'Compelling sales copy, corporate narratives, technical documentation, and conversion-engineered scripts that drive concrete actions.',
    order: 6,
    isPublished: true,
  },
  {
    title: 'Video Editing',
    description:
      'Cinematic post-production, motion graphics, corporate reels, and high-retention short-form edits tailored for digital platforms.',
    order: 7,
    isPublished: true,
  },
  {
    title: 'AI Photography',
    description:
      'Advanced prompt-engineered commercial product imagery, conceptual brand visuals, and generative aesthetics aligned with brand style.',
    order: 8,
    isPublished: true,
  },
  {
    title: 'Virtual Assistant Services',
    description:
      'Structured operational support, project coordination, workflow management, and executive digital administrative assistance.',
    order: 9,
    isPublished: true,
  },
];

export const DEFAULT_FAQS: Omit<FAQ, 'id'>[] = [
  {
    question: 'What types of organizations do you serve?',
    answer:
      'Fresh Perspective Organization works with brands, businesses, companies, educational institutions, healthcare centers, religious organizations, and event organizers seeking professional digital execution and creative solutions.',
    category: 'General',
    order: 1,
    isPublished: true,
  },
  {
    question: 'How does your team guarantee timely delivery?',
    answer:
      'Our motto is "Timely Delivery With Valuable Works Done." Every engagement begins with defined milestones, transparent project roadmaps, and dedicated specialist teams to ensure strict adherence to deadlines.',
    category: 'Process',
    order: 2,
    isPublished: true,
  },
  {
    question: 'How do I request a quote or start a project?',
    answer:
      'You can submit a project brief through our online Quote and Inquiry form, reach out via our direct WhatsApp channel (+234 903 186 0768), or send an email to freshperspectiveorganization@gmail.com.',
    category: 'Engagement',
    order: 3,
    isPublished: true,
  },
  {
    question: 'Can you work on custom multi-disciplinary campaigns?',
    answer:
      'Yes. Our multidisciplinary roster spans software engineers, content creators, copywriters, digital marketers, and video editors, enabling us to deliver integrated end-to-end campaigns under a unified management structure.',
    category: 'Services',
    order: 4,
    isPublished: true,
  },
];
