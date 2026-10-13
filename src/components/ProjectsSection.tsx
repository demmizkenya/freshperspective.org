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
    <section id="projects" className="py-16 md:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-lime-800 bg-lime-100 px-3 py-1 rounded mb-3">
              Portfolio
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight mb-2">
              Our Projects
            </h2>
            <p className="text-sm text-slate-600">
              Selected client works and technical deployments.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={onOpenAdminAddProject}
              className="bg-[#0B132B] hover:bg-slate-800 text-lime-400 font-semibold px-4 py-2 rounded-lg text-xs"
            >
              + Add Project
            </button>
          )}
        </div>

        {categories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
                  activeFilter === cat
                    ? 'bg-[#0B132B] text-white font-bold'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-lime-400 transition-colors shadow-xs"
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
                      <span className="absolute top-2 right-2 bg-lime-400 text-[#0B132B] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-lime-700 mb-1 block">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-[#0B132B] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  {item.projectUrl && (
                    <div className="pt-3 border-t border-slate-100">
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#0B132B] hover:text-lime-700"
                      >
                        View Project →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center max-w-md mx-auto">
            <h3 className="text-base font-bold text-[#0B132B] mb-1">Portfolio Awaiting Case Studies</h3>
            <p className="text-xs text-slate-500 mb-4">
              Verified client case studies will be displayed once published by the administration.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
