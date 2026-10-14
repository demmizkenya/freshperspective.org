import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Insight } from '../types';

export const InsightsSection: React.FC = () => {
  const { insights } = useData();
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  const published = insights.filter((i) => i.isPublished);

  return (
    <section id="insights" className="py-20 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-block text-xs sm:text-sm font-extrabold uppercase tracking-wider text-lime-800 bg-lime-100 px-3.5 py-1.5 rounded-md mb-3">
            Industry Insights & Articles
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-3">
            Perspectives & Strategies
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed">
            Practical thought leadership on digital transformation, brand scaling, and creative innovation.
          </p>
        </div>

        {published.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {published.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-lime-400 hover:shadow-lg transition-all"
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

                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                      <span className="text-lime-800 uppercase tracking-wider">{item.category}</span>
                      <span>{item.publishedDate}</span>
                    </div>

                    <h3 className="text-xl font-black text-[#0B132B] mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-700 line-clamp-3 leading-relaxed mb-4">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => setSelectedInsight(item)}
                    className="text-sm font-bold text-[#0B132B] hover:text-lime-700 inline-flex items-center gap-1.5"
                  >
                    <span>Read Full Article</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <h3 className="text-lg font-black text-[#0B132B] mb-2">
              Articles In Preparation
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Thought leadership analyses and case reflections will be published here.
            </p>
          </div>
        )}
      </div>

      {/* Reader Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedInsight(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <span className="text-xs font-black uppercase tracking-wider text-lime-800 bg-lime-100 px-3 py-1 rounded-md">
              {selectedInsight.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B132B] mt-3 mb-2">
              {selectedInsight.title}
            </h2>
            <div className="text-xs text-slate-500 font-bold mb-6">
              Published: {selectedInsight.publishedDate}
            </div>

            {selectedInsight.imageUrl && (
              <div className="aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-slate-100 border border-slate-200">
                <img
                  src={selectedInsight.imageUrl}
                  alt={selectedInsight.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {selectedInsight.content || selectedInsight.summary}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
