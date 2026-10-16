import React from 'react';

/**
 * BackButton Component
 * Allows users to return to the previous page using the browser's history functionality (window.history.back()).
 * If no previous page exists, handles gracefully without causing errors.
 * Styled in an unobtrusive, accessible position matching the Fresh Perspective design language.
 */
export const BackButton: React.FC = () => {
  const handleBack = () => {
    try {
      if (typeof window !== 'undefined' && window.history) {
        // If previous history entries exist in the current session
        if (window.history.length > 1) {
          window.history.back();
        } else if (typeof document !== 'undefined' && document.referrer) {
          // If navigated directly from an external referrer
          window.location.href = document.referrer;
        } else {
          // Graceful fallback when no previous page exists: smooth scroll to top/home without error
          const homeElement = document.getElementById('home');
          if (homeElement) {
            homeElement.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }
    } catch (error) {
      // Gracefully prevent any uncaught exceptions
      console.warn('Navigation history back handled gracefully:', error);
    }
  };

  return (
    <aside
      aria-label="Navigation Controls"
      className="fixed bottom-6 right-6 z-40 flex items-center"
    >
      <button
        onClick={handleBack}
        type="button"
        aria-label="Return to previous page"
        title="Return to previous page"
        className="group flex items-center gap-2 px-4 py-3 sm:px-4.5 sm:py-3 rounded-full bg-[#0B132B] hover:bg-slate-800 text-white border border-slate-700/80 shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 focus:outline-hidden focus:ring-3 focus:ring-lime-400 cursor-pointer"
      >
        {/* Left Arrow Icon */}
        <svg
          className="w-4 h-4 text-lime-400 group-hover:-translate-x-0.5 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>

        {/* Button Label */}
        <span className="font-extrabold text-xs sm:text-sm tracking-wide text-white group-hover:text-lime-400 transition-colors">
          Back
        </span>
      </button>
    </aside>
  );
};
