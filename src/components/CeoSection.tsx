import React from 'react';
import { useData } from '../context/DataContext';

interface CeoSectionProps {
  onOpenAdmin?: () => void;
}

export const CeoSection: React.FC<CeoSectionProps> = ({ onOpenAdmin }) => {
  const { siteSettings, isAdmin } = useData();
  const ceo = siteSettings.ceoProfile;

  const hasPhoto = Boolean(ceo?.photoUrl);
  const fullName = ceo?.fullName || 'Chief Executive Officer';
  const title = ceo?.title || 'Chief Executive Officer & Founder';
  const statement = ceo?.statement;

  return (
    <section id="executive-leadership" className="py-20 md:py-28 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 bg-slate-50 p-8 sm:p-14 rounded-3xl border border-slate-200 shadow-xs">
          {/* CEO Photo Container */}
          <div className="w-full md:w-5/12 max-w-sm shrink-0">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-200 border-2 border-slate-300 shadow-md flex items-center justify-center">
              {hasPhoto ? (
                <img
                  src={ceo!.photoUrl}
                  alt={fullName}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              ) : (
                <div className="text-center p-8 text-slate-700">
                  <div className="w-24 h-24 rounded-full bg-slate-300 mx-auto mb-4 flex items-center justify-center font-black text-[#0B132B] text-2xl shadow-inner">
                    CEO
                  </div>
                  <h4 className="text-lg font-black text-[#0B132B] mb-1">
                    CEO Photograph
                  </h4>
                  <p className="text-sm text-slate-700 font-semibold">
                    Fresh Perspective Executive Office
                  </p>
                </div>
              )}

              {/* Verified badge */}
              <div className="absolute bottom-4 left-4 bg-[#0B132B] text-lime-400 text-xs font-black tracking-wide px-3.5 py-1.5 rounded-md shadow-md uppercase">
                Executive Leadership
              </div>
            </div>

            {/* Admin-only quick action button - STRICTLY HIDDEN from public visitors */}
            {isAdmin && onOpenAdmin && (
              <div className="mt-4 text-center">
                <button
                  onClick={onOpenAdmin}
                  className="bg-[#0B132B] hover:bg-slate-800 text-lime-400 font-extrabold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>✎ Edit CEO Profile & Photo (Admin)</span>
                </button>
              </div>
            )}
          </div>

          {/* CEO Bio / Message Container */}
          <div className="w-full md:w-7/12 flex flex-col justify-center">
            <div className="inline-block text-xs sm:text-sm font-black uppercase tracking-wider text-lime-950 bg-lime-200 px-4 py-1.5 rounded-lg mb-4 w-fit border border-lime-300">
              Executive Office
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0B132B] tracking-tight mb-2">
              {fullName}
            </h2>

            <p className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 uppercase tracking-wider mb-6">
              {title}
            </p>

            <blockquote className="text-xl sm:text-2xl md:text-3xl text-slate-900 leading-relaxed font-bold italic border-l-4 border-[#84cc16] pl-6 mb-8">
              {statement ||
                '“Our commitment at Fresh Perspective Organization is straightforward: timely delivery, uncompromising quality, and practical value for every client we serve.”'}
            </blockquote>

            <div className="pt-5 border-t border-slate-200">
              <p className="text-base sm:text-lg font-extrabold text-slate-800">
                Fresh Perspective Organization • Timely Delivery With Valuable Works Done
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
