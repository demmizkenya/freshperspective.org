import React from 'react';
import { useData } from '../context/DataContext';

export const AboutSection: React.FC = () => {
  const { siteSettings } = useData();

  const valuesList = (siteSettings.coreValues || 'Professionalism, creativity, integrity, collaboration, quality, and timely delivery.')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  return (
    <section id="about" className="py-20 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-block text-xs sm:text-sm font-black uppercase tracking-wider text-lime-950 bg-lime-200 px-4 py-1.5 rounded-lg mb-3 border border-lime-300">
            About Fresh Perspective
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-4">
            Fresh Perspective Organization
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-900 leading-relaxed font-semibold">
            {siteSettings.aboutText ||
              'A creative and digital solutions agency dedicated to helping brands, businesses, companies, schools, churches, hospitals, and events grow through professional services and strategic digital solutions.'}
          </p>
        </div>

        {/* Content Grid: Who We Are, Mission, Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {/* Who We Are */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-300 flex flex-col justify-between shadow-2xs hover:border-lime-400 hover:shadow-md transition-all">
            <div>
              <div className="text-base font-black text-lime-800 uppercase tracking-wider mb-2">01</div>
              <h3 className="text-2xl font-black text-[#0B132B] mb-3">Who We Are</h3>
              <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-semibold">
                {siteSettings.whoWeAre ||
                  'We are a team of professionals providing creative, technical, and digital services. We focus on quality, clear communication, timely delivery, and practical value for our clients.'}
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-300 flex flex-col justify-between shadow-2xs hover:border-lime-400 hover:shadow-md transition-all">
            <div>
              <div className="text-base font-black text-lime-800 uppercase tracking-wider mb-2">02</div>
              <h3 className="text-2xl font-black text-[#0B132B] mb-3">Our Mission</h3>
              <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-semibold">
                {siteSettings.mission ||
                  'To help brands and businesses achieve their goals through modern digital solutions, professional service delivery, effective communication, and sustainable growth.'}
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-300 flex flex-col justify-between shadow-2xs hover:border-lime-400 hover:shadow-md transition-all">
            <div>
              <div className="text-base font-black text-lime-800 uppercase tracking-wider mb-2">03</div>
              <h3 className="text-2xl font-black text-[#0B132B] mb-3">Our Vision</h3>
              <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-semibold">
                {siteSettings.vision ||
                  'To build a respected digital agency recognized for transforming brands and businesses through innovation, operational excellence, and measurable value.'}
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Strip */}
        <div className="bg-[#0B132B] text-white p-8 sm:p-10 rounded-2xl shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-2xl sm:text-3xl font-black text-white">Our Core Values</h3>
            <span className="text-sm font-extrabold text-lime-400 tracking-wide">
              Timely Delivery With Valuable Works Done
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {valuesList.map((val, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center shadow-xs"
              >
                <div className="font-extrabold text-sm sm:text-base text-slate-100">{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
