import React from 'react';
import { useData } from '../context/DataContext';

interface HeroProps {
  onRequestQuote: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRequestQuote, onExploreServices }) => {
  const { siteSettings } = useData();

  return (
    <section id="home" className="relative pt-16 pb-20 md:pt-24 md:pb-28 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Organization Name & Tagline */}
        <div className="inline-block bg-lime-200 text-[#0B132B] text-sm sm:text-base font-black tracking-wide uppercase px-5 py-2.5 rounded-full mb-6 border border-lime-300 shadow-sm">
          {siteSettings.tagline || 'Timely Delivery With Valuable Works Done'}
        </div>

        {/* Main Headline - Bold, commanding, readable from afar */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0B132B] tracking-tight leading-[1.1] mb-6">
          {siteSettings.heroHeadline || 'Creative, Consulting & Digital Solutions'}
        </h1>

        {/* Concise Description - High Contrast & Large Size */}
        <p className="text-xl sm:text-2xl md:text-3xl text-slate-900 max-w-4xl mx-auto mb-10 leading-relaxed font-semibold">
          {siteSettings.heroDescription ||
            'Helping brands, businesses, institutions, and events grow with professional creative services, corporate consulting, and modern digital execution.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={onRequestQuote}
            className="w-full sm:w-auto bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] font-extrabold px-9 py-4 rounded-xl text-base sm:text-lg shadow-md hover:shadow-lg transition-all animate-quote-pulse"
          >
            Request a Quote
          </button>
          <button
            onClick={onExploreServices}
            className="w-full sm:w-auto bg-[#0B132B] hover:bg-slate-800 text-white font-extrabold px-9 py-4 rounded-xl text-base sm:text-lg transition-all border-2 border-[#0B132B] hover:border-slate-700 shadow-md"
          >
            Explore Our Services
          </button>
        </div>

        {/* Core Pillars - Large, High Contrast */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left pt-8 border-t border-slate-200">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-300 shadow-2xs">
            <div className="text-base sm:text-lg font-black uppercase text-[#0B132B] mb-1">Timely Delivery</div>
            <div className="text-sm sm:text-base text-slate-800 font-bold">Guaranteed milestones</div>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-300 shadow-2xs">
            <div className="text-base sm:text-lg font-black uppercase text-[#0B132B] mb-1">Creative Quality</div>
            <div className="text-sm sm:text-base text-slate-800 font-bold">High craft excellence</div>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-300 shadow-2xs">
            <div className="text-base sm:text-lg font-black uppercase text-[#0B132B] mb-1">Consulting</div>
            <div className="text-sm sm:text-base text-slate-800 font-bold">Strategic guidance</div>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-300 shadow-2xs">
            <div className="text-base sm:text-lg font-black uppercase text-[#0B132B] mb-1">Digital Value</div>
            <div className="text-sm sm:text-base text-slate-800 font-bold">Sustainable growth</div>
          </div>
        </div>
      </div>
    </section>
  );
};
