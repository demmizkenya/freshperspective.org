import React from 'react';
import { useData } from '../context/DataContext';

interface LeadershipSectionProps {
  onOpenAdminAddLeader?: () => void;
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({ onOpenAdminAddLeader }) => {
  const { leadership, isAdmin } = useData();
  const published = leadership.filter((l) => l.isPublished);

  return (
    <section id="leadership" className="py-16 md:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-lime-800 bg-lime-100 px-3 py-1 rounded mb-3">
              Governance
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight mb-2">
              Leadership
            </h2>
            <p className="text-sm text-slate-600">
              Guiding Fresh Perspective Organization with integrity and strategic vision.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={onOpenAdminAddLeader}
              className="bg-[#0B132B] hover:bg-slate-800 text-lime-400 font-semibold px-4 py-2 rounded-lg text-xs"
            >
              + Add Leader
            </button>
          )}
        </div>

        {published.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {published.map((leader) => (
              <div
                key={leader.id}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-xs"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 mb-4 border border-slate-300">
                  {leader.photoUrl ? (
                    <img
                      src={leader.photoUrl}
                      alt={leader.fullName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-bold">
                      Photo
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#0B132B] mb-0.5">{leader.fullName}</h3>
                <span className="text-xs font-semibold uppercase text-lime-800 mb-3">
                  {leader.title}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">{leader.bio}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center max-w-md mx-auto">
            <h3 className="text-base font-bold text-[#0B132B] mb-1">Leadership Profiles Managed via Admin</h3>
            <p className="text-xs text-slate-500 mb-4">
              Executive profiles are published securely through the administrative portal.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
