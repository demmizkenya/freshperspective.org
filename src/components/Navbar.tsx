import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface NavbarProps {
  onOpenAdmin: () => void;
  onRequestQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onRequestQuote }) => {
  const { siteSettings, isAdmin } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'CEO', href: '#executive-leadership' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Professionals', href: '#professionals' },
    { name: 'Projects', href: '#projects' },
    { name: 'Gallery', href: '#gallery' },
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
          <button
            onClick={onOpenAdmin}
            className="bg-slate-800 hover:bg-slate-700 text-lime-400 px-2 py-0.5 rounded font-mono"
          >
            {isAdmin ? 'Admin Active' : 'Admin Login'}
          </button>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#home" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#0B132B] text-lime-400 flex items-center justify-center font-black text-sm">
            FP
          </div>
          <span className="font-extrabold text-sm sm:text-base text-[#0B132B] tracking-tight uppercase">
            Fresh Perspective
          </span>
        </a>

        {/* Desktop Links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-700">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.href);
              }}
              className="hover:text-[#0B132B] py-1"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Action */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onRequestQuote}
            className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-2 rounded-lg text-xs"
          >
            Request a Quote
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex xl:hidden items-center gap-2">
          <button
            onClick={onRequestQuote}
            className="text-xs font-bold bg-[#84cc16] text-[#0B132B] px-3 py-1.5 rounded"
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
              className="w-full bg-[#84cc16] text-[#0B132B] font-bold py-2 rounded text-xs"
            >
              Request a Quote
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full bg-slate-100 text-slate-800 font-semibold py-1.5 rounded text-xs"
            >
              {isAdmin ? 'Admin Portal (Logged In)' : 'Admin Login'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
