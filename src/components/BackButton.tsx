import React, { useState, useEffect, useRef } from 'react';

/**
 * Friendly display labels for sections in the Fresh Perspective website
 */
const SECTION_NAMES: Record<string, string> = {
  home: 'Home',
  'executive-leadership': 'CEO & Leadership',
  about: 'About Us',
  services: 'Services',
  professionals: 'Professionals',
  projects: 'Projects',
  gallery: 'Gallery',
  'brands-in-motion': 'Brands In Motion',
  leadership: 'Leadership',
  insights: 'Insights',
  events: 'Events',
  publications: 'Publications',
  faqs: 'FAQs',
  contact: 'Contact & Quote',
  quote: 'Quote',
};

const VALID_SECTION_IDS = [
  'home',
  'executive-leadership',
  'about',
  'services',
  'professionals',
  'projects',
  'gallery',
  'brands-in-motion',
  'leadership',
  'insights',
  'events',
  'publications',
  'faqs',
  'contact',
  'quote',
];

/**
 * BackButton Component
 * Remembers the visitor's navigation history across pages/sections within the website.
 * Tapping Back returns to the previously visited section (e.g., Services -> About -> Home).
 * If no previous section exists, safely returns the user to the Home section instead of leaving the site.
 */
export const BackButton: React.FC = () => {
  // Navigation history stack of visited section IDs within the website
  const historyStackRef = useRef<string[]>([]);
  const currentSectionRef = useRef<string>('home');
  const isNavigatingBackRef = useRef<boolean>(false);

  // Reactive state to update button label & tooltip
  const [previousSection, setPreviousSection] = useState<string | null>(null);

  // Helper to record a new section visit
  const recordNavigation = (targetId: string) => {
    if (isNavigatingBackRef.current) return;

    const normalized = targetId === 'quote' ? 'contact' : targetId;
    if (!VALID_SECTION_IDS.includes(normalized)) return;

    const current = currentSectionRef.current;
    if (normalized === current) return;

    // Push previous section to history stack if not already duplicate
    const stack = [...historyStackRef.current];
    if (current && (stack.length === 0 || stack[stack.length - 1] !== current)) {
      stack.push(current);
    }

    historyStackRef.current = stack;
    currentSectionRef.current = normalized;

    const nextPrev = stack.length > 0 ? stack[stack.length - 1] : 'home';
    setPreviousSection(nextPrev);

    try {
      sessionStorage.setItem('fp_section_history', JSON.stringify(stack));
      sessionStorage.setItem('fp_current_section', normalized);
    } catch {
      // Storage unavailable or disabled, ref persists for the session
    }
  };

  // 1. Initialize history state on component mount
  useEffect(() => {
    try {
      const savedHistory = sessionStorage.getItem('fp_section_history');
      const savedCurrent = sessionStorage.getItem('fp_current_section');

      if (savedHistory && savedCurrent) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          historyStackRef.current = parsed;
          currentSectionRef.current = savedCurrent;
          setPreviousSection(parsed.length > 0 ? parsed[parsed.length - 1] : 'home');
          return;
        }
      }
    } catch {
      // Ignore
    }

    // Inspect initial URL hash if user landed on a deep section link (e.g., #gallery)
    const hash = window.location.hash.replace('#', '');
    const initialSection = VALID_SECTION_IDS.includes(hash)
      ? hash === 'quote'
        ? 'contact'
        : hash
      : 'home';

    if (initialSection !== 'home') {
      historyStackRef.current = ['home'];
      currentSectionRef.current = initialSection;
      setPreviousSection('home');
    } else {
      currentSectionRef.current = 'home';
      setPreviousSection(null);
    }
  }, []);

  // 2. Intercept internal anchor link clicks across navigation, hero, and footer
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a[href^="#"]');
      if (!target) return;

      const href = target.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.slice(1);
        if (targetId) {
          recordNavigation(targetId);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true });
    };
  }, []);

  // 3. Scroll observation to automatically track section changes as the visitor views content
  useEffect(() => {
    let scrollDebounceTimer: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (isNavigatingBackRef.current) return;

      if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
      }

      // Debounce so quick scrolling past sections doesn't flood history
      scrollDebounceTimer = setTimeout(() => {
        if (isNavigatingBackRef.current) return;

        const viewportCenter = window.innerHeight * 0.45;
        let activeSection = 'home';
        let closestDist = Infinity;

        for (const id of VALID_SECTION_IDS) {
          if (id === 'quote') continue;
          const element = document.getElementById(id);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Section intersects the active viewing area
            if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
              activeSection = id;
              break;
            }
            const dist = Math.abs(rect.top - 80);
            if (dist < closestDist && rect.top <= window.innerHeight && rect.bottom >= 0) {
              closestDist = dist;
              activeSection = id;
            }
          }
        }

        if (activeSection && activeSection !== currentSectionRef.current) {
          recordNavigation(activeSection);
        }
      }, 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
    };
  }, []);

  // 4. Primary Back navigation handler
  const handleBack = () => {
    isNavigatingBackRef.current = true;

    const stack = [...historyStackRef.current];
    let targetSection = 'home';

    if (stack.length > 0) {
      targetSection = stack.pop() || 'home';
      historyStackRef.current = stack;

      try {
        sessionStorage.setItem('fp_section_history', JSON.stringify(stack));
      } catch {
        // Ignore
      }
    } else {
      // If visitor has no previous section in history, return to Home
      targetSection = 'home';
    }

    currentSectionRef.current = targetSection;
    const nextPrev = stack.length > 0 ? stack[stack.length - 1] : (targetSection === 'home' ? null : 'home');
    setPreviousSection(nextPrev);

    try {
      sessionStorage.setItem('fp_current_section', targetSection);
    } catch {
      // Ignore
    }

    // Smoothly scroll to the previously visited section or Home
    const targetElement = document.getElementById(targetSection);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update hash gracefully without triggering browser reload
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', targetSection === 'home' ? '#' : `#${targetSection}`);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Release programmatic scroll lock after animation completes
    setTimeout(() => {
      isNavigatingBackRef.current = false;
    }, 900);
  };

  const targetLabel = previousSection ? SECTION_NAMES[previousSection] || previousSection : 'Home';

  return (
    <aside
      aria-label="Website Section Navigation"
      className="fixed bottom-6 right-6 z-40 flex items-center group select-none"
    >
      <button
        onClick={handleBack}
        type="button"
        aria-label={`Back to ${targetLabel}`}
        title={`Back to ${targetLabel}`}
        className="flex items-center gap-2 px-4 py-3 sm:px-4.5 sm:py-3 rounded-full bg-[#0B132B] hover:bg-slate-800 text-white border border-slate-700/80 shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 focus:outline-hidden focus:ring-3 focus:ring-lime-400 cursor-pointer"
      >
        {/* Left Arrow Icon */}
        <svg
          className="w-4 h-4 text-lime-400 group-hover:-translate-x-0.5 transition-transform duration-200 shrink-0"
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

        {/* Back Label */}
        <span className="font-extrabold text-xs sm:text-sm tracking-wide text-white group-hover:text-lime-400 transition-colors">
          Back
        </span>

        {/* Contextual previous section indicator on tablet and desktop */}
        {previousSection && (
          <span className="hidden sm:inline text-[11px] font-semibold text-slate-400 group-hover:text-lime-300 transition-colors max-w-[130px] truncate border-l border-slate-700/60 pl-2">
            to {targetLabel}
          </span>
        )}
      </button>
    </aside>
  );
};
