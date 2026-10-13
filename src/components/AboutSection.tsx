import React from 'react';
import { useData } from '../context/DataContext';

export const AboutSection: React.FC = () => {
  const { siteSettings } = useData();

  const valuesList = (siteSettings.coreValues || 'Professionalism, creativity, integrity, collaboration, quality, and timely delivery.')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  return (
    <section id="about" className="py-16 md:py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-block text-xs font-bold uppercase tracking-wider text-lime-800 bg-lime-100 px-3 py-1 rounded mb-3">
            About Us
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight mb-3">
            Fresh Perspective Organization
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {siteSettings.aboutText ||
              'A creative and digital solutions agency helping brands, businesses, companies, schools, churches, hospitals, and events grow through professional services and strategic digital solutions.'}
          </p>
        </div>

        {/* Content Grid: Who We Are, Mission, Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Who We Are */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-lime-700 uppercase tracking-wider mb-2">01</div>
              <h3 className="text-lg font-bold text-[#0B132B] mb-2">Who We Are</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {siteSettings.whoWeAre ||
                  'We are a team of professionals providing creative, technical, and digital services. We focus on quality, clear communication, timely delivery, and practical value for our clients.'}
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-lime-700 uppercase tracking-wider mb-2">02</div>
              <h3 className="text-lg font-bold text-[#0B132B] mb-2">Our Mission</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {siteSettings.mission ||
                  'To help brands and businesses achieve their goals through modern digital solutions, professional service delivery, effective communication, and sustainable growth.'}
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-lime-700 uppercase tracking-wider mb-2">03</div>
              <h3 className="text-lg font-bold text-[#0B132B] mb-2">Our Vision</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {siteSettings.vision ||
                  'To build a respected digital agency recognized for transforming brands and businesses through innovation, operational excellence, and measurable value.'}
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Strip */}
        <div className="bg-[#0B132B] text-white p-6 sm:p-8 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-bold text-white">Our Core Values</h3>
            <span className="text-xs text-lime-400 font-semibold">
              Motto: Timely Delivery With Valuable Works Done
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {valuesList.map((val, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center"
              >
                <div className="font-semibold text-xs text-slate-200">{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
