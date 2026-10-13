import React from 'react';
import { useData } from '../context/DataContext';

interface HeroProps {
  onRequestQuote: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRequestQuote, onExploreServices }) => {
  const { siteSettings } = useData();

  return (
    <section id="home" className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Organization Name & Tagline */}
        <div className="inline-block bg-lime-100 text-[#0B132B] text-xs font-bold px-3 py-1 rounded mb-6">
          {siteSettings.tagline || 'Timely Delivery With Valuable Works Done'}
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B132B] tracking-tight leading-tight mb-5">
          {siteSettings.heroHeadline || 'Creative, Consulting & Digital Solutions'}
        </h1>

        {/* Concise Description */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          {siteSettings.heroDescription ||
            'Helping brands, businesses, institutions, and events grow with professional creative services, corporate consulting, and modern digital execution.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <button
            onClick={onRequestQuote}
            className="w-full sm:w-auto bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-7 py-3 rounded-lg text-sm shadow-sm transition-all"
          >
            Request a Quote
          </button>
          <button
            onClick={onExploreServices}
            className="w-full sm:w-auto bg-[#0B132B] hover:bg-slate-800 text-white font-medium px-7 py-3 rounded-lg text-sm transition-all border border-slate-700"
          >
            Explore Our Services
          </button>
        </div>

        {/* Clean, Non-Icon Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left pt-6 border-t border-slate-200">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-[11px] font-bold uppercase text-[#0B132B]">Timely Delivery</div>
            <div className="text-xs text-slate-500">Guaranteed schedules</div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-[11px] font-bold uppercase text-[#0B132B]">Creative Quality</div>
            <div className="text-xs text-slate-500">Professional craft</div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-[11px] font-bold uppercase text-[#0B132B]">Consulting</div>
            <div className="text-xs text-slate-500">Practical guidance</div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-[11px] font-bold uppercase text-[#0B132B]">Digital Value</div>
            <div className="text-xs text-slate-500">Measurable impact</div>
          </div>
        </div>
      </div>
    </section>
  );
};
