import React from 'react';
import { useData } from '../context/DataContext';

export const EventsSection: React.FC = () => {
  const { events } = useData();
  const published = events.filter((e) => e.isPublished);

  return (
    <section id="events" className="py-20 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-block text-xs sm:text-sm font-extrabold uppercase tracking-wider text-lime-800 bg-lime-100 px-3.5 py-1.5 rounded-md mb-3">
            Schedule & Workshops
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-3">
            Events & Summits
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed">
            Interactive sessions, client corporate webinars, and creative technical masterclasses.
          </p>
        </div>

        {published.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {published.map((eventItem) => (
              <div
                key={eventItem.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between hover:border-lime-400 hover:shadow-lg transition-all"
              >
                <div>
                  {eventItem.imageUrl && (
                    <div className="aspect-[16/9] bg-slate-100">
                      <img
                        src={eventItem.imageUrl}
                        alt={eventItem.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-xs sm:text-sm font-black text-lime-900 bg-lime-100 px-3 py-1 rounded-md w-fit mb-3">
                      {eventItem.date} {eventItem.location && `• ${eventItem.location}`}
                    </div>
                    <h3 className="text-xl font-black text-[#0B132B] mb-2 leading-snug">
                      {eventItem.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
                      {eventItem.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <h3 className="text-lg font-black text-[#0B132B] mb-2">
              Upcoming Schedule Being Finalized
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Upcoming client masterclasses, industry webinars, and strategy summits will be posted here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
