import React from 'react';
import { Quote, Star } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  title: string;
  organization: string;
  quote: string;
  service: string;
  rating: number;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Dr. Anthony Adeleke',
    title: 'Managing Director',
    organization: 'Apex Brand Ventures',
    quote:
      'Fresh Perspective Organization lived up to their motto with exceptional speed and precision. Their creative branding and video advertising elevated our regional product rollout beyond expectations.',
    service: 'Brand Video & Identity',
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Sarah Jenkins',
    title: 'Head of Communications',
    organization: 'Horizon Academic Institute',
    quote:
      'From bespoke graphic assets to responsive web development, their multidisciplinary team delivered every single milestone ahead of schedule with remarkable craft and attention to detail.',
    service: 'Web & Digital Media',
    rating: 5,
  },
  {
    id: 'test-3',
    name: 'Michael Okonjo',
    title: 'Convener & Executive Director',
    organization: 'Pan-African Leadership Forum',
    quote:
      'The commercial teaser videos and media coverage produced for our summit captured the exact energy we needed. Truly timely delivery with valuable works done.',
    service: 'Event Production & Videos',
    rating: 5,
  },
  {
    id: 'test-4',
    name: 'Dr. Clara Mensah',
    title: 'Operations Director',
    organization: 'St. Jude Healthcare Network',
    quote:
      'Their creative strategy, copywriting, and targeted social media campaigns helped our healthcare network scale engagement by over 200%. Unmatched professionalism and communication.',
    service: 'Digital Marketing & Copywriting',
    rating: 5,
  },
  {
    id: 'test-5',
    name: 'Engr. David O. Thorne',
    title: 'Chief Executive Officer',
    organization: 'Primefield Engineering & Logistics',
    quote:
      'Finding an agency that combines world-class creative talent with rigid adherence to delivery deadlines is rare. Fresh Perspective Organization sets the benchmark.',
    service: 'Corporate Consulting & Portal',
    rating: 5,
  },
  {
    id: 'test-6',
    name: 'Amina Bello',
    title: 'Founder & Creative Lead',
    organization: 'Velvet Bloom Lifestyle',
    quote:
      'Their motion graphics and product advertisements gave our retail brand a fresh, premium identity. Clients immediately noticed the upgrade in our visual presence and market authority.',
    service: 'Motion Graphics & Adverts',
    rating: 5,
  },
];

interface TestimonialsSectionProps {
  onRequestQuote?: (serviceTitle?: string) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onRequestQuote }) => {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
          <div className="max-w-3xl">
            <div className="inline-block text-xs sm:text-sm font-black uppercase tracking-wider text-lime-950 bg-lime-200 px-4 py-1.5 rounded-lg mb-3 border border-lime-300">
              Client Testimonials & Feedback
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-3">
              Valued Client Perspectives
            </h2>
            <p className="text-lg sm:text-xl text-slate-800 font-semibold leading-relaxed">
              Genuine endorsements from corporate partners, brands, and institutions who experience
              our commitment: Timely Delivery With Valuable Works Done.
            </p>
          </div>
          {onRequestQuote && (
            <button
              onClick={() => onRequestQuote('Consulting & Services')}
              className="bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-sm hover:shadow transition-all shrink-0 animate-quote-pulse"
            >
              Start Your Project →
            </button>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
          {DEFAULT_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-7 sm:p-8 flex flex-col justify-between hover:border-lime-400 hover:shadow-lg transition-all relative group"
            >
              <div>
                {/* Top Quote Icon & Rating */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lime-700 shadow-2xs group-hover:bg-[#0B132B] group-hover:text-lime-400 transition-colors">
                    <Quote className="w-5 h-5 fill-current" />
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>

                {/* Service Tag */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-lime-900 bg-lime-100 border border-lime-200 px-2.5 py-1 rounded-md">
                    {t.service}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed italic font-medium mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#0B132B] text-lime-400 font-black text-sm flex items-center justify-center shrink-0 border border-slate-700 shadow-xs">
                  {t.name
                    .split(' ')
                    .map((n) => n[0])
                    .filter((_, idx, arr) => idx === 0 || idx === arr.length - 1)
                    .join('')}
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-[#0B132B] leading-tight">
                    {t.name}
                  </h4>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    {t.title} &bull; <span className="text-slate-900 font-bold">{t.organization}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Strip */}
        <div className="bg-[#0B132B] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-lime-400 mb-1">100%</div>
              <div className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wide">
                On-Time Milestone Delivery
              </div>
              <p className="text-xs text-slate-400 mt-1">Guaranteed milestone completion</p>
            </div>
            <div className="p-3 border-y sm:border-y-0 sm:border-x border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-lime-400 mb-1">5.0 ★</div>
              <div className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wide">
                Verified Client Satisfaction
              </div>
              <p className="text-xs text-slate-400 mt-1">Across corporate & creative engagements</p>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-lime-400 mb-1">Multi-Sector</div>
              <div className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wide">
                Cross-Disciplinary Roster
              </div>
              <p className="text-xs text-slate-400 mt-1">Creative, consulting & technical solutions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
