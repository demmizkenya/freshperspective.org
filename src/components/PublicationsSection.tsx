import React from 'react';
import { useData } from '../context/DataContext';

interface PublicationsSectionProps {
  onOpenAdminAddPub?: () => void;
}

export const PublicationsSection: React.FC<PublicationsSectionProps> = ({ onOpenAdminAddPub }) => {
  const { publications, isAdmin } = useData();
  const published = publications.filter((p) => p.isPublished);

  return (
    <section id="publications" className="py-16 md:py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-lime-800 bg-lime-100 px-3 py-1 rounded mb-3">
              Research
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight mb-2">
              Publications
            </h2>
            <p className="text-sm text-slate-600">
              Whitepapers, strategic frameworks, and industry guides.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={onOpenAdminAddPub}
              className="bg-[#0B132B] hover:bg-slate-800 text-lime-400 font-semibold px-4 py-2 rounded-lg text-xs"
            >
              + Add Publication
            </button>
          )}
        </div>

        {published.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {published.map((pub) => (
              <div
                key={pub.id}
                className="bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-lime-400 transition-colors"
              >
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">
                    {pub.publishedDate}
                  </div>
                  <h3 className="text-base font-bold text-[#0B132B] mb-2">{pub.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{pub.description}</p>
                </div>

                {pub.linkUrl && (
                  <div className="pt-3 border-t border-slate-200">
                    <a
                      href={pub.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#0B132B] hover:text-lime-700"
                    >
                      Access Document →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-10 text-center max-w-md mx-auto">
            <h3 className="text-base font-bold text-[#0B132B] mb-1">No Published Releases Yet</h3>
            <p className="text-xs text-slate-500 mb-4">
              Official research documents will be available for download here upon release.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
