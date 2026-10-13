import React from 'react';
import { useData } from '../context/DataContext';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote }) => {
  const { services } = useData();
  const publishedServices = services.filter((s) => s.isPublished);

  return (
    <section id="services" className="py-16 md:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-block text-xs font-bold uppercase tracking-wider text-lime-800 bg-lime-100 px-3 py-1 rounded mb-3">
            Services
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight mb-2">
            Our Services
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Professional creative, corporate consulting, and digital solutions delivered on time.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {publishedServices.map((service, idx) => (
            <div
              key={service.id || idx}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-lime-400 transition-colors shadow-xs"
            >
              <div>
                <div className="text-xs font-mono font-bold text-lime-700 mb-2">
                  0{idx + 1}
                </div>

                <h3 className="text-lg font-bold text-[#0B132B] mb-2">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => onSelectServiceForQuote(service.title)}
                  className="w-full text-center text-xs font-bold text-[#0B132B] bg-slate-50 hover:bg-lime-100 border border-slate-200 hover:border-lime-300 py-2 rounded-lg transition-colors"
                >
                  Request a Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
