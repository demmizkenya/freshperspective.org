import { SiteSettings, Service, FAQ, Testimonial, VisitorFeedback } from './types';

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
  deletedDefaultTestimonials: [],
  deletedDefaultFeedback: [],
  hiddenDefaultTestimonials: [],
  hiddenDefaultFeedback: [],
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

export const DEFAULT_VIDEO_ADVERTS = [
  {
    id: 'default-vid-1',
    title: 'Brands In Motion: Premium Visual Storytelling',
    description: 'High-impact commercial advertisements and motion graphics designed to elevate modern brands across digital, television, and social platforms.',
    category: 'Promotional Campaign',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
    duration: '0:15',
    order: 1,
    isPublished: true,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-vid-2',
    title: 'Next-Gen Digital Marketing & Client Growth',
    description: 'Comprehensive digital strategies, targeted performance campaigns, and measurable business growth solutions executed by Fresh Perspective Organization.',
    category: 'Digital Solutions',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    duration: '0:15',
    order: 2,
    isPublished: true,
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-vid-3',
    title: 'Corporate Identity & Brand Innovation Showcase',
    description: 'A curated spotlight showcasing strategic brand positioning, corporate consulting, and valuable creative works delivered with precision.',
    category: 'Brand Spotlight',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    duration: '0:15',
    order: 3,
    isPublished: true,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default-vid-4',
    title: 'Summit & Event Commercial Teaser',
    description: 'Captivating visual teaser campaigns for corporate summits, leadership conferences, business workshops, and landmark institutional events.',
    category: 'Event & Summits',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    duration: '0:15',
    order: 4,
    isPublished: true,
    featured: false,
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'default-test-1',
    name: 'Dr. Anthony Adeleke',
    title: 'Managing Director',
    organization: 'Apex Brand Ventures',
    quote:
      'Fresh Perspective Organization lived up to their motto with exceptional speed and precision. Their creative branding and video advertising elevated our regional product rollout beyond expectations.',
    service: 'Brand Video & Identity',
    rating: 5,
    isApproved: true,
    status: 'approved',
    createdAt: new Date('2026-01-15').toISOString(),
  },
  {
    id: 'default-test-2',
    name: 'Sarah Jenkins',
    title: 'Head of Communications',
    organization: 'Horizon Academic Institute',
    quote:
      'From bespoke graphic assets to responsive web development, their multidisciplinary team delivered every single milestone ahead of schedule with remarkable craft and attention to detail.',
    service: 'Web & Digital Media',
    rating: 5,
    isApproved: true,
    status: 'approved',
    createdAt: new Date('2026-02-10').toISOString(),
  },
  {
    id: 'default-test-3',
    name: 'Michael Okonjo',
    title: 'Convener & Executive Director',
    organization: 'Pan-African Leadership Forum',
    quote:
      'The commercial teaser videos and media coverage produced for our summit captured the exact energy we needed. Truly timely delivery with valuable works done.',
    service: 'Event Production & Videos',
    rating: 5,
    isApproved: true,
    status: 'approved',
    createdAt: new Date('2026-03-01').toISOString(),
  },
  {
    id: 'default-test-4',
    name: 'Dr. Clara Mensah',
    title: 'Operations Director',
    organization: 'St. Jude Healthcare Network',
    quote:
      'Their creative strategy, copywriting, and targeted social media campaigns helped our healthcare network scale engagement by over 200%. Unmatched professionalism and communication.',
    service: 'Digital Marketing & Copywriting',
    rating: 5,
    isApproved: true,
    status: 'approved',
    createdAt: new Date('2026-03-22').toISOString(),
  },
  {
    id: 'default-test-5',
    name: 'Engr. David O. Thorne',
    title: 'Chief Executive Officer',
    organization: 'Primefield Engineering & Logistics',
    quote:
      'Finding an agency that combines world-class creative talent with rigid adherence to delivery deadlines is rare. Fresh Perspective Organization sets the benchmark.',
    service: 'Corporate Consulting & Portal',
    rating: 5,
    isApproved: true,
    status: 'approved',
    createdAt: new Date('2026-04-05').toISOString(),
  },
  {
    id: 'default-test-6',
    name: 'Amina Bello',
    title: 'Founder & Creative Lead',
    organization: 'Velvet Bloom Lifestyle',
    quote:
      'Their motion graphics and product advertisements gave our retail brand a fresh, premium identity. Clients immediately noticed the upgrade in our visual presence and market authority.',
    service: 'Motion Graphics & Adverts',
    rating: 5,
    isApproved: true,
    status: 'approved',
    createdAt: new Date('2026-04-18').toISOString(),
  },
];

export const DEFAULT_FEEDBACK: VisitorFeedback[] = [
  {
    id: 'default-feed-1',
    name: 'Samuel K. Boateng',
    message: 'The website interface is very clean and informative. Navigating through the services and viewing the team roster was effortless.',
    category: 'Website Experience',
    isApproved: true,
    status: 'approved',
    createdAt: new Date('2026-04-02').toISOString(),
  },
  {
    id: 'default-feed-2',
    name: 'Chioma Nwosu',
    message: 'Great agency commitment to timely delivery. We appreciate the quick response from the quote inquiry team on WhatsApp.',
    category: 'Service Quality',
    isApproved: true,
    status: 'approved',
    createdAt: new Date('2026-04-10').toISOString(),
  },
];

