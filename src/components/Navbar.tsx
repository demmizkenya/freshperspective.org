import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface NavbarProps {
  onOpenAdmin?: () => void;
  onRequestQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRequestQuote }) => {
  const { siteSettings } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const primaryNavLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Team', href: '#professionals' },
    { name: 'Projects', href: '#projects' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Adverts', href: '#brands-in-motion' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  const moreNavLinks = [
    { name: 'CEO Profile', href: '#executive-leadership' },
    { name: 'Leadership & Board', href: '#leadership' },
    { name: 'Insights & Articles', href: '#insights' },
    { name: 'Events & Summits', href: '#events' },
    { name: 'Publications', href: '#publications' },
    { name: 'FAQs', href: '#faqs' },
  ];

  const allMobileNavLinks = [
    { name: 'Home', href: '#home' },
    { name: 'CEO Profile', href: '#executive-leadership' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Team & Specialists', href: '#professionals' },
    { name: 'Projects & Portfolio', href: '#projects' },
    { name: 'Visual Gallery', href: '#gallery' },
    { name: 'Brands In Motion (Adverts)', href: '#brands-in-motion' },
    { name: 'Client Testimonials', href: '#testimonials' },
    { name: 'Leadership & Governance', href: '#leadership' },
    { name: 'Insights & Articles', href: '#insights' },
    { name: 'Events & Summits', href: '#events' },
    { name: 'Publications', href: '#publications' },
    { name: 'FAQs', href: '#faqs' },
    { name: 'Contact & Quote', href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      {/* Top micro bar */}
      <div className="bg-[#0B132B] text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-lime-400">
            Fresh Perspective Organization
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <a
            href="mailto:freshperspectiveorganization@gmail.com"
            className="hidden sm:inline hover:text-white"
          >
            freshperspectiveorganization@gmail.com
          </a>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <a
            href={siteSettings.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-lime-400"
          >
            +234 903 186 0768
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand with Dynamic Organization Logo and Name */}
        <a href="#home" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          {siteSettings.logoUrl ? (
            <img
              src={siteSettings.logoUrl}
              alt={siteSettings.orgName || 'Fresh Perspective Organization'}
              className="h-9 sm:h-11 w-auto max-w-[120px] sm:max-w-[160px] object-contain group-hover:opacity-90 transition-opacity shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#0B132B] text-lime-400 flex items-center justify-center font-black text-base shadow-sm shrink-0">
              FP
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-black text-xs sm:text-base md:text-lg text-[#0B132B] tracking-tight uppercase leading-tight">
              Fresh Perspective
            </span>
            <span className="text-[8px] sm:text-[10px] font-extrabold tracking-widest text-slate-600 uppercase">
              Organization
            </span>
          </div>
        </a>

        {/* Desktop Links - Clear, readable typography that never wraps or breaks */}
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-xs xl:text-sm font-bold text-slate-800">
          {primaryNavLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.href);
              }}
              className="hover:text-[#0B132B] hover:text-lime-700 py-1 transition-colors whitespace-nowrap"
            >
              {item.name}
            </a>
          ))}

          {/* More Dropdown for secondary pages */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              onMouseEnter={() => setMoreDropdownOpen(true)}
              className="hover:text-[#0B132B] hover:text-lime-700 py-1 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>More</span>
              <span className="text-[10px] opacity-70">▾</span>
            </button>

            {moreDropdownOpen && (
              <div
                onMouseLeave={() => setMoreDropdownOpen(false)}
                className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150"
              >
                {moreNavLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.href);
                    }}
                    className="block px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#0B132B] transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Action */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={onRequestQuote}
            className="bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm hover:shadow transition-all animate-quote-pulse whitespace-nowrap cursor-pointer"
          >
            Request a Quote
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <button
            onClick={onRequestQuote}
            className="text-xs font-black bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] px-3.5 py-1.5 rounded-md transition-all animate-quote-pulse tracking-tight whitespace-nowrap cursor-pointer"
          >
            Quote
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-700 font-bold text-sm border rounded cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            {allMobileNavLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.href);
                }}
                className="py-2 px-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestQuote();
              }}
              className="w-full bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] font-extrabold py-3 rounded-xl text-xs transition-all animate-quote-pulse cursor-pointer"
            >
              Request a Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
