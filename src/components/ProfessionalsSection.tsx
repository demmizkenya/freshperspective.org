import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PROFESSIONAL_CATEGORIES, Professional } from '../types';

interface ProfessionalsSectionProps {
  onOpenAdminAddProf?: () => void;
}

export const ProfessionalsSection: React.FC<ProfessionalsSectionProps> = ({ onOpenAdminAddProf }) => {
  const { professionals, isAdmin } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProfModal, setSelectedProfModal] = useState<Professional | null>(null);

  const published = professionals.filter((p) => p.isPublished);

  const filtered = selectedCategory === 'All'
    ? published
    : published.filter((p) => p.category === selectedCategory);

  return (
    <section id="professionals" className="py-16 md:py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-lime-800 bg-lime-100 px-3 py-1 rounded mb-3">
              Team Directory
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight mb-2">
              Our Professionals
            </h2>
            <p className="text-sm text-slate-600">
              Specialists providing creative, technical, and consulting solutions.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={onOpenAdminAddProf}
              className="bg-[#0B132B] hover:bg-slate-800 text-lime-400 font-semibold px-4 py-2 rounded-lg text-xs"
            >
              + Add Professional
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-8 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors font-medium ${
              selectedCategory === 'All'
                ? 'bg-[#0B132B] text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({published.length})
          </button>
          {PROFESSIONAL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors font-medium ${
                selectedCategory === cat
                  ? 'bg-[#0B132B] text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Directory Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((prof) => (
              <div
                key={prof.id}
                className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-lime-400 transition-colors"
              >
                {/* Real Photograph */}
                <div className="relative aspect-[4/3] bg-slate-200">
                  {prof.photoUrl ? (
                    <img
                      src={prof.photoUrl}
                      alt={prof.fullName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                      Photograph Pending
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-[#0B132B] text-lime-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    {prof.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[#0B132B] text-base mb-0.5">
                      {prof.fullName}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mb-2">
                      {prof.title}
                    </p>
                    {prof.specialization && (
                      <p className="text-xs text-slate-600 italic mb-2">
                        {prof.specialization}
                      </p>
                    )}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {prof.bio}
                    </p>
                  </div>

                  <div>
                    {prof.skills && prof.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {prof.skills.slice(0, 3).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-white border border-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setSelectedProfModal(prof)}
                        className="font-bold text-[#0B132B] hover:text-lime-700"
                      >
                        View Profile →
                      </button>
                      {prof.portfolioUrl && (
                        <a
                          href={prof.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-[#0B132B] text-[11px]"
                        >
                          Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-10 text-center max-w-md mx-auto">
            <h3 className="text-base font-bold text-[#0B132B] mb-1">
              Directory Awaiting Published Profiles
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Verified specialist profiles and photographs will be displayed once uploaded by the administrator.
            </p>
            {isAdmin && (
              <button
                onClick={onOpenAdminAddProf}
                className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-2 rounded text-xs"
              >
                Add Specialist Profile
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProfModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedProfModal(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 font-bold text-sm"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                {selectedProfModal.photoUrl ? (
                  <img
                    src={selectedProfModal.photoUrl}
                    alt={selectedProfModal.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                    No Photo
                  </div>
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold text-lime-800 bg-lime-100 px-2 py-0.5 rounded">
                  {selectedProfModal.category}
                </span>
                <h3 className="text-lg font-bold text-[#0B132B] mt-1">
                  {selectedProfModal.fullName}
                </h3>
                <p className="text-xs text-slate-500">{selectedProfModal.title}</p>
              </div>
            </div>

            {selectedProfModal.specialization && (
              <div className="mb-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="font-bold text-[#0B132B]">Focus: </span>
                {selectedProfModal.specialization}
              </div>
            )}

            <div className="mb-4">
              <h4 className="text-xs font-bold text-[#0B132B] uppercase mb-1">Biography</h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {selectedProfModal.bio}
              </p>
            </div>

            {selectedProfModal.skills && selectedProfModal.skills.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-bold text-[#0B132B] uppercase mb-1">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedProfModal.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-800 text-[10px] px-2 py-0.5 rounded font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedProfModal.portfolioUrl && (
              <div className="pt-3 border-t border-slate-200">
                <a
                  href={selectedProfModal.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#0B132B] hover:text-lime-700"
                >
                  Visit External Portfolio →
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
