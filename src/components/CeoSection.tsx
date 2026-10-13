import React from 'react';
import { useData } from '../context/DataContext';

interface CeoSectionProps {
  onOpenAdmin?: () => void;
  onOpenAdminCeo?: () => void;
}

export const CeoSection: React.FC<CeoSectionProps> = ({ onOpenAdmin, onOpenAdminCeo }) => {
  const handleOpen = onOpenAdmin || onOpenAdminCeo;
  const { siteSettings, isAdmin } = useData();
  const ceo = siteSettings.ceoProfile;

  const hasPhoto = Boolean(ceo?.photoUrl);
  const fullName = ceo?.fullName || 'Chief Executive Officer';
  const title = ceo?.title || 'Chief Executive Officer';
  const statement = ceo?.statement;

  return (
    <section id="executive-leadership" className="py-16 md:py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14 bg-slate-50/80 p-8 sm:p-12 rounded-2xl border border-slate-200">
          {/* CEO Photo Container */}
          <div className="w-full md:w-5/12 max-w-sm shrink-0">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-200 border-2 border-slate-300 shadow-sm flex items-center justify-center">
              {hasPhoto ? (
                <img
                  src={ceo!.photoUrl}
                  alt={fullName}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              ) : (
                <div className="text-center p-6 text-slate-500">
                  <div className="w-20 h-20 rounded-full bg-slate-300 mx-auto mb-4 flex items-center justify-center font-bold text-slate-600 text-lg">
                    CEO
                  </div>
                  <h4 className="text-sm font-bold text-[#0B132B] mb-1">
                    CEO Photograph
                  </h4>
                  <p className="text-xs text-slate-500">
                    To be added by administration
                  </p>
                </div>
              )}

              {/* Verified badge */}
              <div className="absolute bottom-3 left-3 bg-[#0B132B] text-lime-400 text-[11px] font-bold px-2.5 py-1 rounded">
                Executive Office
              </div>
            </div>
          </div>

          {/* CEO Bio / Message Container */}
          <div className="w-full md:w-7/12 flex flex-col justify-center">
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-lime-800 bg-lime-100 px-3 py-1 rounded mb-4 w-fit">
              Leadership
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight mb-1">
              {fullName}
            </h2>

            <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">
              {title}
            </p>

            <blockquote className="text-sm sm:text-base text-slate-700 leading-relaxed italic border-l-2 border-[#84cc16] pl-4 mb-6">
              {statement ||
                '“Our commitment at Fresh Perspective Organization is straightforward: timely delivery, uncompromising quality, and practical value for every client we serve.”'}
            </blockquote>

            <p className="text-xs text-slate-500 mb-6">
              Fresh Perspective Organization • Timely Delivery With Valuable Works Done
            </p>

            {isAdmin && (
              <div>
                <button
                  onClick={handleOpen}
                  className="inline-flex items-center text-xs font-bold bg-[#0B132B] text-lime-400 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Edit CEO Photo & Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
