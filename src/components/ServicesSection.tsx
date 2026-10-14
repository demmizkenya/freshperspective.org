import React from 'react';
import { useData } from '../context/DataContext';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote }) => {
  const { services } = useData();
  const publishedServices = services.filter((s) => s.isPublished);

  return (
    <section id="services" className="py-20 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-block text-xs sm:text-sm font-black uppercase tracking-wider text-lime-950 bg-lime-200 px-4 py-1.5 rounded-lg mb-3 border border-lime-300">
            Core Agency Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-3">
            Our Professional Services
          </h2>
          <p className="text-lg sm:text-xl text-slate-800 font-semibold leading-relaxed">
            Professional creative craft, corporate consulting, and strategic digital solutions delivered on time.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedServices.map((service, idx) => (
            <div
              key={service.id || idx}
              className="bg-white rounded-2xl border border-slate-300 p-8 flex flex-col justify-between hover:border-lime-400 hover:shadow-lg transition-all"
            >
              <div>
                <div className="text-base font-mono font-black text-lime-800 mb-3">
                  0{idx + 1}
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-[#0B132B] mb-3 leading-snug">
                  {service.title}
                </h3>
                <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal mb-8">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => onSelectServiceForQuote(service.title)}
                  className="w-full text-center text-base font-extrabold text-[#0B132B] bg-[#74C01E] hover:bg-[#65A30D] border border-lime-500/40 hover:border-lime-600 py-3.5 rounded-xl transition-all shadow-sm hover:shadow animate-quote-pulse"
                >
                  Request a Quote →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
