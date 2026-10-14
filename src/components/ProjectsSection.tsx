import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface ProjectsSectionProps {
  onOpenAdminAddProject?: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenAdminAddProject }) => {
  const { projects, isAdmin } = useData();
  const [activeFilter, setActiveFilter] = useState('All');

  const published = projects.filter((p) => p.isPublished);
  const categories = ['All', ...Array.from(new Set(published.map((p) => p.category).filter(Boolean)))];

  const filtered = activeFilter === 'All'
    ? published
    : published.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-20 md:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="max-w-3xl">
            <div className="inline-block text-xs sm:text-sm font-black uppercase tracking-wider text-lime-950 bg-lime-200 px-4 py-1.5 rounded-lg mb-3 border border-lime-300">
              Portfolio & Client Work
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-3">
              Featured Projects & Solutions
            </h2>
            <p className="text-lg sm:text-xl text-slate-800 font-semibold leading-relaxed">
              Delivering measurable value and timely technical execution across diverse industries.
            </p>
          </div>

          {/* Admin-only button: HIDDEN from public visitors, only visible to authenticated admin */}
          {isAdmin && onOpenAdminAddProject && (
            <button
              onClick={onOpenAdminAddProject}
              className="bg-[#0B132B] hover:bg-slate-800 text-lime-400 font-bold px-4 py-2.5 rounded-xl text-xs inline-flex items-center gap-1.5 shrink-0 shadow-sm transition-all"
            >
              <span>+ Add Project (Admin)</span>
            </button>
          )}
        </div>

        {categories.length > 2 && (
          <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-8 text-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-bold transition-all text-sm ${
                  activeFilter === cat
                    ? 'bg-[#0B132B] text-white shadow-sm'
                    : 'bg-white text-slate-800 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-lime-400 hover:shadow-lg transition-all"
              >
                {item.imageUrl && (
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {item.isFeatured && (
                      <span className="absolute top-3 right-3 bg-lime-400 text-[#0B132B] text-xs font-black uppercase px-2.5 py-1 rounded-md shadow-xs">
                        Featured
                      </span>
                    )}
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-lime-800 mb-2 block">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-black text-[#0B132B] mb-2.5 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal mb-5">
                      {item.description}
                    </p>
                  </div>

                  {item.projectUrl && (
                    <div className="pt-4 border-t border-slate-100">
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-[#0B132B] hover:text-lime-700 inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>View Project Details</span>
                        <span>→</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <h3 className="text-lg font-black text-[#0B132B] mb-2">
              Portfolio In Production
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Verified client case studies and digital deployment showcases will appear here once published by Fresh Perspective Organization.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
