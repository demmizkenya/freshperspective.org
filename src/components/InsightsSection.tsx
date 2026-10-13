import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Insight } from '../types';

interface InsightsSectionProps {
  onOpenAdminAddInsight?: () => void;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({ onOpenAdminAddInsight }) => {
  const { insights, isAdmin } = useData();
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  const published = insights.filter((i) => i.isPublished);

  return (
    <section id="insights" className="py-16 md:py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-lime-800 bg-lime-100 px-3 py-1 rounded mb-3">
              Insights
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight mb-2">
              Articles & Perspectives
            </h2>
            <p className="text-sm text-slate-600">
              Perspectives on digital innovation and strategic growth.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={onOpenAdminAddInsight}
              className="bg-[#0B132B] hover:bg-slate-800 text-lime-400 font-semibold px-4 py-2 rounded-lg text-xs"
            >
              + Write Article
            </button>
          )}
        </div>

        {published.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {published.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-lime-400 transition-colors"
              >
                <div>
                  {item.imageUrl && (
                    <div className="aspect-[16/9] bg-slate-200">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="font-bold text-lime-700 uppercase">
                        {item.category || 'Article'}
                      </span>
                      <span>•</span>
                      <span>{item.publishedDate || 'Recent'}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#0B132B] mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedInsight(item)}
                    className="text-xs font-bold text-[#0B132B] hover:text-lime-700"
                  >
                    Read Article →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-10 text-center max-w-md mx-auto">
            <h3 className="text-base font-bold text-[#0B132B] mb-1">Insights Channel Initializing</h3>
            <p className="text-xs text-slate-500 mb-4">
              Articles published by Fresh Perspective Organization will be posted here.
            </p>
          </div>
        )}
      </div>

      {/* Reader Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedInsight(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 font-bold text-sm"
            >
              ✕
            </button>

            <div className="text-xs text-slate-500 mb-2">
              <span className="font-bold text-lime-800 uppercase bg-lime-100 px-2 py-0.5 rounded">
                {selectedInsight.category}
              </span>
              <span className="ml-2">{selectedInsight.publishedDate}</span>
            </div>

            <h2 className="text-xl font-extrabold text-[#0B132B] mb-4">
              {selectedInsight.title}
            </h2>

            {selectedInsight.imageUrl && (
              <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4 bg-slate-100">
                <img
                  src={selectedInsight.imageUrl}
                  alt={selectedInsight.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-line">
              {selectedInsight.content || selectedInsight.summary}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
