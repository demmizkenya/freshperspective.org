import React from 'react';
import { useData } from '../context/DataContext';

export const PublicationsSection: React.FC = () => {
  const { publications } = useData();
  const published = publications.filter((p) => p.isPublished);

  return (
    <section id="publications" className="py-20 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-block text-xs sm:text-sm font-extrabold uppercase tracking-wider text-lime-800 bg-lime-100 px-3.5 py-1.5 rounded-md mb-3">
            Research & Frameworks
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-3">
            Publications & Whitepapers
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed">
            Proprietary frameworks, operational guides, and industry analyses by our specialists.
          </p>
        </div>

        {published.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {published.map((pub) => (
              <div
                key={pub.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-7 flex flex-col justify-between hover:border-lime-400 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="text-xs font-black text-lime-800 uppercase tracking-wider mb-2.5">
                    {pub.publishedDate}
                  </div>
                  <h3 className="text-xl font-black text-[#0B132B] mb-3 leading-snug">{pub.title}</h3>
                  <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal mb-5">{pub.description}</p>
                </div>

                {pub.linkUrl && (
                  <div className="pt-4 border-t border-slate-200">
                    <a
                      href={pub.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-[#0B132B] hover:text-lime-700 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Access Document</span>
                      <span>→</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <h3 className="text-lg font-black text-[#0B132B] mb-2">
              Whitepapers In Review
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Curated strategic frameworks and technical publications will be published here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
