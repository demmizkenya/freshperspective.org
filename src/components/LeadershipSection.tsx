import React from 'react';
import { useData } from '../context/DataContext';

interface LeadershipSectionProps {
  onOpenAdminAddLeader?: () => void;
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({ onOpenAdminAddLeader }) => {
  const { leadership, isAdmin } = useData();
  const published = leadership.filter((l) => l.isPublished);

  return (
    <section id="leadership" className="py-20 md:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="max-w-3xl">
            <div className="inline-block text-xs sm:text-sm font-black uppercase tracking-wider text-lime-950 bg-lime-200 px-4 py-1.5 rounded-lg mb-3 border border-lime-300">
              Governance & Strategy
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-3">
              Organizational Leadership
            </h2>
            <p className="text-lg sm:text-xl text-slate-800 font-semibold leading-relaxed">
              Guiding Fresh Perspective Organization with integrity, client accountability, and strategic vision.
            </p>
          </div>

          {/* Admin-only button: HIDDEN from public visitors, only visible to authenticated admin */}
          {isAdmin && onOpenAdminAddLeader && (
            <button
              onClick={onOpenAdminAddLeader}
              className="bg-[#0B132B] hover:bg-slate-800 text-lime-400 font-bold px-4 py-2.5 rounded-xl text-xs inline-flex items-center gap-1.5 shrink-0 shadow-sm transition-all"
            >
              <span>+ Add Leader (Admin)</span>
            </button>
          )}
        </div>

        {published.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {published.map((leader) => (
              <div
                key={leader.id}
                className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center text-center shadow-xs hover:border-lime-400 hover:shadow-lg transition-all"
              >
                <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-200 mb-5 border-2 border-slate-300 shadow-xs">
                  {leader.photoUrl ? (
                    <img
                      src={leader.photoUrl}
                      alt={leader.fullName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-slate-500 font-bold">
                      Photo
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-black text-[#0B132B] mb-1">{leader.fullName}</h3>
                <span className="text-sm font-bold text-lime-800 uppercase tracking-wider block mb-3">
                  {leader.title}
                </span>
                {leader.bio && (
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                    {leader.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <h3 className="text-lg font-black text-[#0B132B] mb-2">
              Leadership Profiles In Curation
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Executive governance profiles and credentials will be displayed once published.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
