import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  onOpenAdminAddGallery?: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onOpenAdminAddGallery }) => {
  const { galleryItems, isAdmin } = useData();
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const published = galleryItems.filter((item) => item.isPublished);

  return (
    <section id="gallery" className="py-20 md:py-28 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="max-w-3xl">
            <div className="inline-block text-xs sm:text-sm font-black uppercase tracking-wider text-lime-950 bg-lime-200 px-4 py-1.5 rounded-lg mb-3 border border-lime-300">
              Media & Production
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-3">
              Agency Visual Gallery
            </h2>
            <p className="text-lg sm:text-xl text-slate-800 font-semibold leading-relaxed">
              Moments from our production studio, client consultative workshops, and active project engagements.
            </p>
          </div>

          {/* Admin-only button: HIDDEN from public visitors, only visible to authenticated admin */}
          {isAdmin && onOpenAdminAddGallery && (
            <button
              onClick={onOpenAdminAddGallery}
              className="bg-[#0B132B] hover:bg-slate-800 text-lime-400 font-bold px-4 py-2.5 rounded-xl text-xs inline-flex items-center gap-1.5 shrink-0 shadow-sm transition-all"
            >
              <span>+ Add Gallery Photo (Admin)</span>
            </button>
          )}
        </div>

        {published.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {published.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative aspect-square bg-slate-100 rounded-2xl overflow-hidden cursor-pointer border border-slate-200 hover:border-lime-400 hover:shadow-lg transition-all"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || 'Gallery image'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-5 flex flex-col justify-end text-white">
                  {item.category && (
                    <span className="text-xs font-black uppercase text-lime-400 mb-1">
                      {item.category}
                    </span>
                  )}
                  {item.title && (
                    <h4 className="font-bold text-sm sm:text-base text-white line-clamp-2">
                      {item.title}
                    </h4>
                  )}
                  {item.caption && (
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <h3 className="text-lg font-black text-[#0B132B] mb-2">
              Visual Media In Curation
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Official agency photographs and behind-the-scenes visual media will appear here once published.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center font-bold text-lg"
            >
              ✕
            </button>
            <div className="max-h-[75vh] flex items-center justify-center bg-black">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title || 'Enlarged photo'}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>
            {(activeItem.title || activeItem.caption || activeItem.category) && (
              <div className="p-6 bg-[#0B132B] text-white border-t border-slate-800">
                {activeItem.category && (
                  <span className="text-xs font-black uppercase text-lime-400 mb-1.5 block">
                    {activeItem.category}
                  </span>
                )}
                {activeItem.title && (
                  <h3 className="text-xl font-bold mb-2">{activeItem.title}</h3>
                )}
                {activeItem.caption && (
                  <p className="text-sm text-slate-300 leading-relaxed">{activeItem.caption}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
