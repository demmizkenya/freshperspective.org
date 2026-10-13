import React from 'react';
import { useData } from '../context/DataContext';

interface EventsSectionProps {
  onOpenAdminAddEvent?: () => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ onOpenAdminAddEvent }) => {
  const { events, isAdmin } = useData();
  const published = events.filter((e) => e.isPublished);

  return (
    <section id="events" className="py-16 md:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-lime-800 bg-lime-100 px-3 py-1 rounded mb-3">
              Schedule
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight mb-2">
              Events & Workshops
            </h2>
            <p className="text-sm text-slate-600">
              Interactive sessions, client webinars, and creative masterclasses.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={onOpenAdminAddEvent}
              className="bg-[#0B132B] hover:bg-slate-800 text-lime-400 font-semibold px-4 py-2 rounded-lg text-xs"
            >
              + Add Event
            </button>
          )}
        </div>

        {published.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {published.map((eventItem) => (
              <div
                key={eventItem.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
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
                  <div className="p-5">
                    <div className="text-xs font-bold text-lime-800 mb-2">
                      {eventItem.date} {eventItem.location && `• ${eventItem.location}`}
                    </div>
                    <h3 className="text-base font-bold text-[#0B132B] mb-2">{eventItem.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{eventItem.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center max-w-md mx-auto">
            <h3 className="text-base font-bold text-[#0B132B] mb-1">No Scheduled Events At Present</h3>
            <p className="text-xs text-slate-500 mb-4">
              Upcoming summits and workshops will be announced here once scheduled by the administration.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
