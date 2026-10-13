import React from 'react';
import { useData } from '../context/DataContext';

interface FooterProps {
  onOpenAdmin: () => void;
  onRequestQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onRequestQuote }) => {
  const { siteSettings } = useData();
  const currentYear = new Date().getFullYear();
  const socialLinks = siteSettings.socialLinks;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B132B] text-slate-300 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded bg-lime-400 text-[#0B132B] flex items-center justify-center font-black text-xs">
                FP
              </div>
              <span className="text-base font-extrabold text-white tracking-tight uppercase">
                Fresh Perspective Organization
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed max-w-sm">
              Creative services, corporate consulting, and digital solutions. Timely delivery with valuable works done.
            </p>

            {/* Official Social Links */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Official Channels
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
              <li><a href="#executive-leadership" className="hover:text-white">CEO & Leadership</a></li>
              <li><a href="#about" className="hover:text-white">About Us</a></li>
              <li><a href="#services" className="hover:text-white">Services</a></li>
              <li><a href="#professionals" className="hover:text-white">Professionals</a></li>
              <li><a href="#projects" className="hover:text-white">Projects</a></li>
              <li><a href="#gallery" className="hover:text-white">Gallery</a></li>
              <li><a href="#insights" className="hover:text-white">Insights</a></li>
              <li><a href="#events" className="hover:text-white">Events</a></li>
              <li><a href="#publications" className="hover:text-white">Publications</a></li>
              <li><a href="#faqs" className="hover:text-white">FAQs</a></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
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

            <div className="space-y-2">
              <button
                onClick={onRequestQuote}
                className="w-full bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold py-2 px-3 rounded text-xs"
              >
                Request a Quote
              </button>
              <button
                onClick={onOpenAdmin}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-3 rounded text-xs"
              >
                Admin Portal
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {currentYear} Fresh Perspective Organization. All rights reserved.
          </div>
          <button onClick={scrollToTop} className="hover:text-slate-300">
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};
