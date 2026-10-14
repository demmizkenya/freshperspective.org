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
    <section id="professionals" className="py-20 md:py-28 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="max-w-3xl">
            <div className="inline-block text-xs sm:text-sm font-black uppercase tracking-wider text-lime-950 bg-lime-200 px-4 py-1.5 rounded-lg mb-3 border border-lime-300">
              Our Specialists
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-3">
              Our Team of Professionals
            </h2>
            <p className="text-lg sm:text-xl text-slate-800 font-semibold leading-relaxed">
              Multi-disciplinary talent providing verified creative craft, strategic corporate consulting, and reliable digital execution.
            </p>
          </div>

          {/* Admin-only button: HIDDEN from public visitors, only visible to authenticated admin */}
          {isAdmin && onOpenAdminAddProf && (
            <button
              onClick={onOpenAdminAddProf}
              className="bg-[#0B132B] hover:bg-slate-800 text-lime-400 font-bold px-4 py-2.5 rounded-xl text-xs inline-flex items-center gap-1.5 shrink-0 shadow-sm transition-all"
            >
              <span>+ Add Specialist (Admin)</span>
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 text-sm">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-bold text-sm ${
              selectedCategory === 'All'
                ? 'bg-[#0B132B] text-white shadow-sm'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            All Specialists ({published.length})
          </button>
          {PROFESSIONAL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-bold text-sm ${
                selectedCategory === cat
                  ? 'bg-[#0B132B] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Directory Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((prof) => (
              <div
                key={prof.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-lime-400 hover:shadow-lg transition-all"
              >
                {/* Photograph */}
                <div className="relative aspect-[4/3] bg-slate-200">
                  {prof.photoUrl ? (
                    <img
                      src={prof.photoUrl}
                      alt={prof.fullName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-slate-500 font-bold">
                      Photograph Pending
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-[#0B132B] text-lime-400 text-xs font-black px-2.5 py-1 rounded-md shadow-xs">
                    {prof.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-[#0B132B] text-lg sm:text-xl mb-1">
                      {prof.fullName}
                    </h3>
                    <p className="text-sm font-bold text-slate-700 mb-2">
                      {prof.title}
                    </p>
                    {prof.specialization && (
                      <p className="text-xs sm:text-sm text-slate-800 font-semibold italic mb-2.5">
                        Focus: {prof.specialization}
                      </p>
                    )}
                    <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed mb-4">
                      {prof.bio}
                    </p>
                  </div>

                  <div>
                    {prof.skills && prof.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {prof.skills.slice(0, 4).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-white border border-slate-300 text-slate-800 text-xs px-2.5 py-1 rounded-md font-bold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
                      <button
                        onClick={() => setSelectedProfModal(prof)}
                        className="font-bold text-[#0B132B] hover:text-lime-700 inline-flex items-center gap-1"
                      >
                        <span>View Profile</span>
                        <span>→</span>
                      </button>
                      {prof.portfolioUrl && (
                        <a
                          href={prof.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 hover:text-[#0B132B] text-xs font-bold underline"
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
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <h3 className="text-lg font-black text-[#0B132B] mb-2">
              Directory Awaiting Published Profiles
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Verified specialist profiles and genuine photographs will appear here once published by Fresh Perspective Organization.
            </p>
          </div>
        )}
      </div>

      {/* Profile Detail Lightbox Modal */}
      {selectedProfModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedProfModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                {selectedProfModal.photoUrl ? (
                  <img
                    src={selectedProfModal.photoUrl}
                    alt={selectedProfModal.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-bold">
                    No Photo
                  </div>
                )}
              </div>
              <div>
                <span className="text-xs font-extrabold text-lime-900 bg-lime-100 px-2.5 py-1 rounded-md">
                  {selectedProfModal.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0B132B] mt-1.5">
                  {selectedProfModal.fullName}
                </h3>
                <p className="text-sm font-bold text-slate-700">{selectedProfModal.title}</p>
              </div>
            </div>

            {selectedProfModal.specialization && (
              <div className="mb-4 text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-extrabold text-[#0B132B]">Domain Specialization: </span>
                {selectedProfModal.specialization}
              </div>
            )}

            <div className="mb-5">
              <h4 className="text-xs font-extrabold text-[#0B132B] uppercase tracking-wider mb-2">Biography</h4>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                {selectedProfModal.bio}
              </p>
            </div>

            {selectedProfModal.skills && selectedProfModal.skills.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-extrabold text-[#0B132B] uppercase tracking-wider mb-2">Skills & Competencies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfModal.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-800 text-xs px-3 py-1 rounded-md font-bold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedProfModal.portfolioUrl && (
              <div className="pt-4 border-t border-slate-200">
                <a
                  href={selectedProfModal.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-[#0B132B] hover:text-lime-700 inline-flex items-center gap-1.5"
                >
                  <span>Visit External Portfolio</span>
                  <span>→</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
