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
    <section id="gallery" className="py-16 md:py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-lime-800 bg-lime-100 px-3 py-1 rounded mb-3">
              Media
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight mb-2">
              Agency Gallery
            </h2>
            <p className="text-sm text-slate-600">
              Moments from our production studio, workshops, and client engagements.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={onOpenAdminAddGallery}
              className="bg-[#0B132B] hover:bg-slate-800 text-lime-400 font-semibold px-4 py-2 rounded-lg text-xs"
            >
              + Upload Image
            </button>
          )}
        </div>

        {published.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {published.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-pointer border border-slate-200 hover:border-lime-400 transition-colors"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || 'Gallery image'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white text-xs">
                  {item.category && (
                    <span className="text-[10px] font-bold uppercase text-lime-400 mb-1">
                      {item.category}
                    </span>
                  )}
                  <h4 className="font-bold line-clamp-1">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-10 text-center max-w-md mx-auto">
            <h3 className="text-base font-bold text-[#0B132B] mb-1">Gallery Awaiting Photos</h3>
            <p className="text-xs text-slate-500 mb-4">
              Photographs uploaded by the administrator will automatically appear here.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="max-w-3xl max-h-[90vh] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-3 right-3 z-10 text-white bg-black/70 hover:bg-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>
            <div className="flex-1 overflow-hidden flex items-center justify-center bg-black">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="p-3 bg-slate-900 text-white border-t border-slate-800 text-xs">
              {activeItem.category && (
                <span className="text-[10px] font-bold text-lime-400 uppercase block">
                  {activeItem.category}
                </span>
              )}
              <h3 className="font-bold text-white text-sm">{activeItem.title}</h3>
              {activeItem.caption && (
                <p className="text-slate-400 mt-1">{activeItem.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
