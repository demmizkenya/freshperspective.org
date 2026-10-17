import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenInquiriesAdmin: () => void;
  onRequestQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenInquiriesAdmin,
  onRequestQuote,
}) => {
  const { siteSettings, isAdmin, isInquiriesAdmin } = useData();
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const adminDropdownRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();
  const socialLinks = siteSettings.socialLinks;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setIsAdminDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAdminDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B132B] text-slate-300 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {siteSettings.logoUrl ? (
                <img
                  src={siteSettings.logoUrl}
                  alt={siteSettings.orgName || 'Fresh Perspective Organization'}
                  className="h-10 sm:h-12 w-auto max-w-[200px] object-contain brightness-105"
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-lime-400 text-[#0B132B] flex items-center justify-center font-black text-sm">
                    FP
                  </div>
                  <span className="text-lg font-black text-white tracking-tight uppercase">
                    Fresh Perspective Organization
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed max-w-md font-normal">
              Creative services, corporate consulting, and digital solutions. Timely delivery with valuable works done.
            </p>

            {/* Official Social Links */}
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-lime-400 mb-3">
                Official Channels & Handles
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded"
                >
                  Facebook
                </a>
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded"
                >
                  Instagram
                </a>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded"
                >
                  LinkedIn
                </a>
                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded"
                >
                  TikTok
                </a>
                <a
                  href={socialLinks.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded"
                >
                  X (Twitter)
                </a>
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded"
                >
                  Telegram
                </a>
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded"
                >
                  YouTube
                </a>
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div className="text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#home" className="hover:text-white">Home</a></li>
              <li><a href="#executive-leadership" className="hover:text-white">CEO Profile</a></li>
              <li><a href="#about" className="hover:text-white">About Us</a></li>
              <li><a href="#services" className="hover:text-white">Services</a></li>
              <li><a href="#professionals" className="hover:text-white">Team & Specialists</a></li>
              <li><a href="#projects" className="hover:text-white">Projects & Portfolio</a></li>
              <li><a href="#gallery" className="hover:text-white">Visual Gallery</a></li>
              <li><a href="#brands-in-motion" className="hover:text-white text-lime-400 font-semibold">Brands In Motion (Adverts)</a></li>
              <li><a href="#testimonials" className="hover:text-white">Client Testimonials</a></li>
              <li><a href="#leadership" className="hover:text-white">Leadership & Governance</a></li>
              <li><a href="#insights" className="hover:text-white">Insights & Articles</a></li>
              <li><a href="#events" className="hover:text-white">Events & Summits</a></li>
              <li><a href="#publications" className="hover:text-white">Publications</a></li>
              <li><a href="#faqs" className="hover:text-white">FAQs</a></li>
              <li><a href="#contact" className="hover:text-white">Contact & Quote</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Contact</h4>
            <div className="space-y-2 text-slate-400 mb-6">
              <div>
                <a
                  href="mailto:freshperspectiveorganization@gmail.com"
                  className="hover:text-white break-all"
                >
                  freshperspectiveorganization@gmail.com
                </a>
              </div>
              <div>
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  +234 903 186 0768
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={onRequestQuote}
                className="w-full bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] font-extrabold py-3 px-4 rounded-xl text-xs transition-all shadow-sm hover:shadow animate-quote-pulse"
              >
                Request a Quote
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {currentYear} Fresh Perspective Organization. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            {/* Discreet Admin Login Dropdown */}
            <div className="relative" ref={adminDropdownRef}>
              <button
                type="button"
                onClick={() => setIsAdminDropdownOpen((prev) => !prev)}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-800/60"
                aria-expanded={isAdminDropdownOpen}
                aria-label="Staff and admin portal access"
              >
                <span>Portal Access</span>
                <span className="text-[9px] opacity-75">
                  {isAdminDropdownOpen ? '▲' : '▼'}
                </span>
              </button>

              {isAdminDropdownOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-56 bg-[#0B132B] border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 text-xs">
                  <div className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-800 mb-1">
                    Staff & Portal Access
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminDropdownOpen(false);
                      onOpenInquiriesAdmin();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800/80 text-slate-200 font-semibold text-xs flex items-center justify-between transition-colors group mb-1"
                  >
                    <div>
                      <div className="text-white font-bold text-xs flex items-center gap-1.5">
                        <span>Inquiries & Quotes</span>
                        {isInquiriesAdmin && (
                          <span className="w-1.5 h-1.5 rounded-full bg-lime-400" title="Active"></span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {isInquiriesAdmin ? 'Portal Active (Manage Quotes)' : 'Client Inquiries Manager'}
                      </div>
                    </div>
                    <span className="text-[#74C01E] group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminDropdownOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800/80 text-slate-200 font-semibold text-xs flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="text-white font-bold text-xs flex items-center gap-1.5">
                        <span>Website Content</span>
                        {isAdmin && (
                          <span className="w-1.5 h-1.5 rounded-full bg-lime-400" title="Active"></span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {isAdmin ? 'Main Admin Active' : 'CMS & Site Administration'}
                      </div>
                    </div>
                    <span className="text-[#74C01E] group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>
              )}
            </div>

            <button onClick={scrollToTop} className="hover:text-slate-300 transition-colors">
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

