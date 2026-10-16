import React, { useState, useRef, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { VideoAdvert } from '../types';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Film,
  Sparkles,
  Clock,
  Tag,
  Loader2,
  Plus,
} from 'lucide-react';

interface VideoAdvertsSectionProps {
  onOpenAdminAddVideo?: () => void;
  onRequestQuote?: (serviceTitle?: string) => void;
}

export const VideoAdvertsSection: React.FC<VideoAdvertsSectionProps> = ({
  onOpenAdminAddVideo,
  onRequestQuote,
}) => {
  const { videoAdverts, isAdmin, isLoading } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTheaterVideo, setActiveTheaterVideo] = useState<VideoAdvert | null>(null);

  // Filter only published videos for public visitors
  const publishedVideos = useMemo(() => {
    return videoAdverts
      .filter((v) => v.isPublished)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [videoAdverts]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    publishedVideos.forEach((v) => {
      if (v.category) set.add(v.category);
    });
    return Array.from(set);
  }, [publishedVideos]);

  // Filter by active category
  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'all') return publishedVideos;
    return publishedVideos.filter((v) => v.category === selectedCategory);
  }, [publishedVideos, selectedCategory]);

  return (
    <section
      id="brands-in-motion"
      className="py-20 md:py-28 bg-[#f8fafc] border-b border-slate-200 relative overflow-hidden"
    >
      {/* Decorative subtle ambient backdrop */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-lime-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-lime-950 bg-lime-200 px-4 py-1.5 rounded-lg mb-3 border border-lime-300 shadow-2xs">
              <Film className="w-4 h-4 text-[#0B132B]" />
              <span>Commercial & Video Adverts</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-3">
              Brands In Motion
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-800 font-semibold leading-relaxed">
              Watch professional commercial advertisements, marketing campaigns, product showcases,
              and promotional video productions crafted by Fresh Perspective Organization.
            </p>
          </div>

          {/* Admin shortcut button (only visible to authenticated administrator) */}
          {isAdmin && onOpenAdminAddVideo && (
            <button
              onClick={onOpenAdminAddVideo}
              className="bg-[#0B132B] hover:bg-slate-800 text-lime-400 font-bold px-4 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 shrink-0 shadow-sm hover:shadow transition-all border border-slate-700 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Upload Video Advert (Admin)</span>
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#0B132B] text-lime-400 shadow-sm border border-[#0B132B]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Adverts ({publishedVideos.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0B132B] text-lime-400 shadow-sm border border-[#0B132B]'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && videoAdverts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-lime-600 animate-spin mb-3" />
            <p className="text-sm font-bold text-slate-600">Loading Brands In Motion adverts...</p>
          </div>
        ) : filteredVideos.length > 0 ? (
          /* Video Advertisements Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredVideos.map((video) => (
              <VideoAdvertCard
                key={video.id}
                video={video}
                onWatch={() => setActiveTheaterVideo(video)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Film className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#0B132B] mb-2">
              No Video Advertisements in this Category
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              New commercial campaigns and promotional video advertisements are currently being
              produced. Switch to &ldquo;All Adverts&rdquo; or check back soon.
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-5 py-2.5 bg-[#0B132B] hover:bg-slate-800 text-lime-400 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                View All Video Adverts
              </button>
            )}
          </div>
        )}

        {/* Call to Action Bar */}
        <div className="mt-14 bg-[#0B132B] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-lime-400 text-xs font-bold tracking-wide uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Custom Commercial Production</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Need a High-Impact Video Advertisement for Your Brand?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              We script, direct, produce, and edit broadcast-grade commercial advertisements, promotional
              social campaigns, and product motion graphics with guaranteed timely delivery.
            </p>
          </div>
          {onRequestQuote && (
            <button
              onClick={() => onRequestQuote('Commercial & Video Adverts')}
              className="bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] font-extrabold px-6 py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer animate-quote-pulse"
            >
              Request Advert Quote
            </button>
          )}
        </div>
      </div>

      {/* Theater / Full-Screen Video Modal */}
      {activeTheaterVideo && (
        <VideoTheaterModal
          video={activeTheaterVideo}
          onClose={() => setActiveTheaterVideo(null)}
          onRequestQuote={onRequestQuote}
        />
      )}
    </section>
  );
};

/**
 * Individual Video Advertisement Card with Thumbnail & Controls
 */
interface VideoAdvertCardProps {
  video: VideoAdvert;
  onWatch: () => void;
}

const VideoAdvertCard: React.FC<VideoAdvertCardProps> = ({ video, onWatch }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const toggleInlinePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlayingInline) {
      videoRef.current.pause();
      setIsPlayingInline(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlayingInline(true);
      }).catch((err) => {
        console.warn('Playback note:', err);
        // Fall back to opening theater modal
        onWatch();
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Video Container (16:9 ratio) */}
      <div className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer select-none">
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          preload="metadata"
          playsInline
          muted={isMuted}
          onEnded={() => setIsPlayingInline(false)}
          className="w-full h-full object-cover"
        />

        {/* Video Overlays when not playing */}
        {!isPlayingInline && (
          <div
            onClick={onWatch}
            className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors flex items-center justify-center p-4"
          >
            {/* Play Button with pulse glow */}
            <div className="relative flex items-center justify-center">
              <span className="absolute -inset-2 rounded-full bg-lime-400/40 animate-ping pointer-events-none" />
              <button
                type="button"
                aria-label={`Play advertisement: ${video.title}`}
                className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] flex items-center justify-center shadow-xl group-hover:scale-110 active:scale-95 transition-all duration-200"
              >
                <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-[#0B132B] ml-1" />
              </button>
            </div>

            {/* Category Badge */}
            {video.category && (
              <div className="absolute top-3 left-3 bg-[#0B132B]/85 backdrop-blur-xs text-lime-400 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-slate-700 shadow-sm flex items-center gap-1.5">
                <Tag className="w-3 h-3" />
                <span>{video.category}</span>
              </div>
            )}

            {/* Duration Badge */}
            {video.duration && (
              <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
                <Clock className="w-3 h-3 text-lime-400" />
                <span>{video.duration}</span>
              </div>
            )}
          </div>
        )}

        {/* Inline Playback Mini-Controls Bar */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-xs px-2.5 py-1.5 rounded-lg text-white text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleInlinePlay}
              className="p-1 hover:text-lime-400 transition-colors"
              title={isPlayingInline ? 'Pause' : 'Quick Play'}
            >
              {isPlayingInline ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleMute}
              className="p-1 hover:text-lime-400 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={onWatch}
            className="flex items-center gap-1 text-[11px] font-bold text-lime-400 hover:text-lime-300 transition-colors"
            title="Watch in Theater Player"
          >
            <span>Theater Mode</span>
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold text-lime-700 bg-lime-50 border border-lime-200 px-2.5 py-0.5 rounded-md text-[11px]">
              {video.category || 'Commercial Advert'}
            </span>
            {video.featured && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                Featured Campaign
              </span>
            )}
          </div>

          <h3
            onClick={onWatch}
            className="text-lg sm:text-xl font-bold text-[#0B132B] group-hover:text-lime-700 transition-colors cursor-pointer line-clamp-2 leading-snug mb-2"
          >
            {video.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        </div>

        {/* Bottom Action */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onWatch}
            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0B132B] hover:text-lime-700 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current text-lime-600" />
            <span>Watch Full Advert</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400">
            Fresh Perspective
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Theater Modal Player for Full-Resolution Viewing
 */
interface VideoTheaterModalProps {
  video: VideoAdvert;
  onClose: () => void;
  onRequestQuote?: (serviceTitle?: string) => void;
}

const VideoTheaterModal: React.FC<VideoTheaterModalProps> = ({
  video,
  onClose,
  onRequestQuote,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [durationStr, setDurationStr] = useState('0:00');

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    if (dur > 0) {
      setProgress((cur / dur) * 100);
      setCurrentTimeStr(formatTime(cur));
      setDurationStr(formatTime(dur));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekPercent = parseFloat(e.target.value);
    const targetTime = (seekPercent / 100) * (videoRef.current.duration || 0);
    videoRef.current.currentTime = targetTime;
    setProgress(seekPercent);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullScreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if ((videoRef.current as any).webkitRequestFullscreen) {
      (videoRef.current as any).webkitRequestFullscreen();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-[#0B132B] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col my-auto">
        {/* Modal Top Header */}
        <div className="p-4 sm:px-6 flex items-center justify-between border-b border-slate-800 shrink-0 text-white">
          <div className="flex items-center gap-3 truncate mr-4">
            <span className="text-xs font-bold text-lime-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
              {video.category || 'Advert'}
            </span>
            <h3 className="text-base sm:text-lg font-bold truncate text-white">
              {video.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close Theater Player"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* HD Video Player */}
        <div className="relative aspect-video bg-black flex items-center justify-center group/player">
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            autoPlay
            playsInline
            controls={false}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Center Play Overlay when paused */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-[#74C01E] text-[#0B132B] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-[#0B132B] ml-1" />
              </div>
            </div>
          )}

          {/* Interactive Player Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 text-white flex flex-col gap-2">
            {/* Scrubber slider */}
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleSeek}
              aria-label="Video Seek Bar"
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#74C01E]"
            />

            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="hover:text-lime-400 transition-colors p-1 cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="hover:text-lime-400 transition-colors p-1 cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
                </button>

                <span className="font-mono text-slate-300 text-[11px]">
                  {currentTimeStr} / {durationStr}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-lime-400 font-bold hidden sm:inline">
                  Brands In Motion HD
                </span>
                <button
                  type="button"
                  onClick={toggleFullScreen}
                  className="hover:text-lime-400 transition-colors p-1 cursor-pointer"
                  title="Full Screen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Description & Action */}
        <div className="p-5 sm:p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
          <div className="max-w-xl">
            <h4 className="font-bold text-sm text-lime-400 mb-1">
              Campaign Brief & Synopsis
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {video.description}
            </p>
          </div>

          {onRequestQuote && (
            <button
              onClick={() => {
                onClose();
                onRequestQuote('Commercial & Video Adverts');
              }}
              className="bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] font-extrabold px-5 py-2.5 rounded-xl text-xs whitespace-nowrap shadow-md transition-all shrink-0 cursor-pointer"
            >
              Commission Similar Advert
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
