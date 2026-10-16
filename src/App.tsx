import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CeoSection } from './components/CeoSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ProfessionalsSection } from './components/ProfessionalsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { GallerySection } from './components/GallerySection';
import { LeadershipSection } from './components/LeadershipSection';
import { InsightsSection } from './components/InsightsSection';
import { EventsSection } from './components/EventsSection';
import { PublicationsSection } from './components/PublicationsSection';
import { FaqsSection } from './components/FaqsSection';
import { ContactAndQuoteSection } from './components/ContactAndQuoteSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { InquiriesAdminDashboard } from './components/InquiriesAdminDashboard';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { BackButton } from './components/BackButton';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isInquiriesAdminOpen, setIsInquiriesAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState('general');
  const [selectedQuoteService, setSelectedQuoteService] = useState('Graphic Design');

  const scrollToQuote = (serviceName?: string) => {
    if (serviceName) {
      setSelectedQuoteService(serviceName);
    }
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAdminWithTab = (tab: string) => {
    setAdminTab(tab);
    setIsAdminOpen(true);
  };

  return (
    <DataProvider>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-lime-200 selection:text-[#0B132B]">
        {/* Navigation Bar */}
        <Navbar
          onRequestQuote={() => scrollToQuote()}
        />

        {/* 1. Home / Hero */}
        <Hero
          onRequestQuote={() => scrollToQuote()}
          onExploreServices={scrollToServices}
        />

        {/* CEO Section (Directly follows landing page) */}
        <CeoSection onOpenAdmin={() => handleOpenAdminWithTab('ceo')} />

        {/* 2. About Us */}
        <AboutSection />

        {/* 3. Services Directory */}
        <ServicesSection
          onSelectServiceForQuote={(serviceTitle) => scrollToQuote(serviceTitle)}
        />

        {/* 4. Certified Professionals Directory */}
        <ProfessionalsSection
          onOpenAdminAddProf={() => handleOpenAdminWithTab('professionals')}
        />

        {/* 5. Projects & Portfolio */}
        <ProjectsSection
          onOpenAdminAddProject={() => handleOpenAdminWithTab('projects')}
        />

        {/* 6. Gallery & Visual Media */}
        <GallerySection
          onOpenAdminAddGallery={() => handleOpenAdminWithTab('gallery')}
        />

        {/* 7. Leadership & Governance */}
        <LeadershipSection
          onOpenAdminAddLeader={() => handleOpenAdminWithTab('leadership')}
        />

        {/* 8. Insights & Articles */}
        <InsightsSection />

        {/* 9. Events, Summits & Workshops */}
        <EventsSection />

        {/* 10. Publications & Whitepapers */}
        <PublicationsSection />

        {/* 11. Frequently Asked Questions */}
        <FaqsSection />

        {/* 12. Contact Us & Quote Submission System */}
        <ContactAndQuoteSection initialService={selectedQuoteService} />

        {/* Footer */}
        <Footer
          onOpenAdmin={() => handleOpenAdminWithTab('general')}
          onOpenInquiriesAdmin={() => setIsInquiriesAdminOpen(true)}
          onRequestQuote={() => scrollToQuote()}
        />

        {/* Floating WhatsApp Quick Action (Bottom-Left with Pulse Animation) */}
        <FloatingWhatsApp />

        {/* Back Navigation Button (Section & Page Navigation History) */}
        <BackButton />

        {/* Main Website Content Administrator Portal Modal */}
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          defaultTab={adminTab}
        />

        {/* Independent Dedicated Inquiries & Quotes Admin Panel */}
        <InquiriesAdminDashboard
          isOpen={isInquiriesAdminOpen}
          onClose={() => setIsInquiriesAdminOpen(false)}
        />
      </div>
    </DataProvider>
  );
}
