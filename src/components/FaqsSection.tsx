import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface FaqsSectionProps {
  onOpenAdminAddFaq?: () => void;
}

export const FaqsSection: React.FC<FaqsSectionProps> = ({ onOpenAdminAddFaq }) => {
  const { faqs, isAdmin } = useData();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const published = faqs.filter((f) => f.isPublished);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-16 md:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-block text-xs font-bold uppercase tracking-wider text-lime-800 bg-lime-100 px-3 py-1 rounded mb-3">
            FAQs
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600">
            Answers regarding our engagement models and delivery timelines.
          </p>
        </div>

        {published.length > 0 ? (
          <div className="space-y-3">
            {published.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.id || idx}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-bold text-sm text-[#0B132B]">
                      {faq.question}
                    </span>
                    <span className="font-mono text-sm text-slate-500 font-bold">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <h3 className="text-base font-bold text-[#0B132B] mb-1">No FAQs Published</h3>
            <p className="text-xs text-slate-500">
              Questions and answers will be available once configured by the admin.
            </p>
          </div>
        )}

        {isAdmin && (
          <div className="mt-6 text-center">
            <button
              onClick={onOpenAdminAddFaq}
              className="bg-[#0B132B] hover:bg-slate-800 text-lime-400 font-semibold px-4 py-2 rounded-lg text-xs"
            >
              Manage FAQs
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
