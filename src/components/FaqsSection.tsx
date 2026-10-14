import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export const FaqsSection: React.FC = () => {
  const { faqs } = useData();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const published = faqs.filter((f) => f.isPublished);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-20 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block text-xs sm:text-sm font-black uppercase tracking-wider text-lime-950 bg-lime-200 px-4 py-1.5 rounded-lg mb-3 border border-lime-300">
            Inquiries & Clarifications
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl text-slate-800 font-semibold leading-relaxed">
            Direct answers regarding our project engagement models, delivery timelines, and quality assurances.
          </p>
        </div>

        {published.length > 0 ? (
          <div className="space-y-4">
            {published.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.id || idx}
                  className="bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-xs hover:border-lime-400 transition-all"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-black text-lg sm:text-xl text-[#0B132B]">
                      {faq.question}
                    </span>
                    <span className="font-mono text-xl text-slate-900 font-black">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-base sm:text-lg text-slate-800 leading-relaxed border-t border-slate-200 font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <h3 className="text-lg font-black text-[#0B132B] mb-2">
              FAQs Being Updated
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Standard client inquiries and policy answers will appear here once published.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
