import React from 'react';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl =
    'https://wa.me/2349031860768?text=Hello%20Fresh%20Perspective%20Organization%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.';

  return (
    <aside
      aria-label="Direct WhatsApp Support"
      className="fixed bottom-6 left-6 z-50 flex items-center group"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Fresh Perspective Organization on WhatsApp: +2349031860768"
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-hidden focus:ring-4 focus:ring-emerald-300"
      >
        {/* Pulsing ring animation */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-75 animate-ping pointer-events-none" />

        {/* Outer glowing border */}
        <span className="absolute -inset-0.5 rounded-full bg-white/30 pointer-events-none" />

        {/* Official WhatsApp SVG Icon */}
        <svg
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="currentColor"
          className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 drop-shadow-xs"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.33C9.36 7.33 9.09 7.39 8.87 7.63C8.65 7.87 8.03 8.45 8.03 9.63C8.03 10.81 8.89 11.95 9.01 12.11C9.13 12.27 10.7 14.7 13.1 15.74C13.67 15.99 14.12 16.14 14.47 16.25C15.05 16.44 15.57 16.41 16 16.35C16.47 16.28 17.44 15.76 17.65 15.17C17.85 14.58 17.85 14.07 17.79 13.97C17.73 13.87 17.57 13.81 17.32 13.69C17.07 13.57 15.86 12.97 15.63 12.89C15.4 12.81 15.24 12.77 15.07 13.01C14.91 13.25 14.44 13.81 14.3 13.97C14.16 14.13 14.02 14.15 13.77 14.03C13.52 13.91 12.48 13.56 11.24 12.46C10.28 11.61 9.63 10.55 9.44 10.23C9.25 9.91 9.42 9.73 9.55 9.61C9.66 9.5 9.8 9.32 9.93 9.18C10.05 9.04 10.09 8.94 10.18 8.78C10.26 8.62 10.22 8.48 10.16 8.36C10.1 8.24 9.65 7.13 9.53 7.33Z" />
        </svg>

        {/* Subtle online activity indicator */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-lime-300 border-2 border-white rounded-full" />
      </a>

      {/* Hover pill tooltip */}
      <div className="hidden sm:flex items-center ml-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-[#0B132B] text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-lg border border-slate-700 whitespace-nowrap">
          <span className="text-lime-400 font-extrabold mr-1">Chat on WhatsApp</span>
          <span className="text-slate-300 text-[11px]">+234 903 186 0768</span>
        </div>
      </div>
    </aside>
  );
};
