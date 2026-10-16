import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface NavbarProps {
  onOpenAdmin?: () => void;
  onRequestQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRequestQuote }) => {
  const { siteSettings } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'CEO', href: '#executive-leadership' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Professionals', href: '#professionals' },
    { name: 'Projects', href: '#projects' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Adverts', href: '#brands-in-motion' },
    { name: 'Leadership', href: '#leadership' },
    { name: 'Insights', href: '#insights' },
    { name: 'Events', href: '#events' },
    { name: 'Publications', href: '#publications' },
    { name: 'FAQs', href: '#faqs' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand with Dynamic Organization Logo and Name */}
        <a href="#home" className="flex items-center gap-2.5 sm:gap-3 group">
          {siteSettings.logoUrl ? (
            <img
              src={siteSettings.logoUrl}
              alt={siteSettings.orgName || 'Fresh Perspective Organization'}
              className="h-10 sm:h-12 w-auto max-w-[140px] sm:max-w-[190px] object-contain group-hover:opacity-90 transition-opacity"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#0B132B] text-lime-400 flex items-center justify-center font-black text-base shadow-sm shrink-0">
              FP
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-black text-sm sm:text-base md:text-lg text-[#0B132B] tracking-tight uppercase leading-none">
              Fresh Perspective
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-slate-600 uppercase mt-0.5">
              Organization
            </span>
          </div>
        </a>

        {/* Desktop Links - Clear, readable typography */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-bold text-slate-800">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.href);
              }}
              className="hover:text-[#0B132B] hover:text-lime-700 py-1 transition-colors"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Action */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onRequestQuote}
            className="bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] font-extrabold px-5 py-2.5 rounded-xl text-sm shadow-sm hover:shadow transition-all animate-quote-pulse"
          >
            Request a Quote
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex xl:hidden items-center gap-2">
          <button
            onClick={onRequestQuote}
            className="text-xs font-black bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] px-3.5 py-1.5 rounded-md transition-all animate-quote-pulse tracking-tight"
          >
            Quote
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-700 font-bold text-sm border rounded"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.href);
                }}
                className="py-1.5 px-2 rounded text-slate-700 hover:bg-slate-100 font-medium"
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
              className="w-full bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] font-extrabold py-3 rounded-xl text-xs transition-all animate-quote-pulse"
            >
              Request a Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
