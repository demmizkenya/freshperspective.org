import React, { useState } from 'react';
import {
  X,
  Shield,
  LogOut,
  Users,
  Briefcase,
  Layers,
  Image as ImageIcon,
  BookOpen,
  Calendar,
  FileDown,
  HelpCircle,
  Mail,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Upload,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  Phone,
  Database,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { uploadImageToStorage } from '../firebase';
import {
  PROFESSIONAL_CATEGORIES,
  Professional,
  Service,
  Project,
  GalleryItem,
  LeadershipMember,
  Insight,
  EventItem,
  Publication,
  FAQ,
  Inquiry,
} from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  defaultTab = 'inquiries',
}) => {
  const {
    currentUser,
    isAdmin,
    isAuthLoading,
    loginWithGoogle,
    loginWithEmailPassword,
    logoutUser,
    siteSettings,
    updateSiteSettings,
    saveCeoProfile,
    professionals,
    saveProfessional,
    deleteProfessional,
    services,
    saveService,
    deleteService,
    projects,
    saveProject,
    deleteProject,
    galleryItems,
    saveGalleryItem,
    deleteGalleryItem,
    leadership,
    saveLeadership,
    deleteLeadership,
    insights,
    saveInsight,
    deleteInsight,
    events,
    saveEvent,
    deleteEvent,
    publications,
    savePublication,
    deletePublication,
    faqs,
    saveFAQ,
    deleteFAQ,
    inquiries,
    fetchInquiries,
    updateInquiryStatus,
    deleteInquiry,
    seedBaselineData,
  } = useData();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Forms state
  // 1. Professional form
  const [profModalOpen, setProfModalOpen] = useState(false);
  const [editingProf, setEditingProf] = useState<Partial<Professional>>({
    fullName: '',
    title: '',
    category: PROFESSIONAL_CATEGORIES[0],
    specialization: '',
    bio: '',
    skills: [],
    photoUrl: '',
    photoPath: '',
    portfolioUrl: '',
    socialUrl: '',
    isPublished: true,
    order: 1,
  });
  const [skillsInput, setSkillsInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // 2. Service form
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service>>({
    title: '',
    description: '',
    imageUrl: '',
    imagePath: '',
    isPublished: true,
    order: 1,
  });

  // 3. Project form
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: 'Digital Solution',
    imageUrl: '',
    imagePath: '',
    projectUrl: '',
    isFeatured: false,
    isPublished: true,
  });

  // 4. Gallery form
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem>>({
    title: '',
    caption: '',
    category: 'Creative Production',
    imageUrl: '',
    imagePath: '',
    isPublished: true,
  });

  // 5. Leadership form
  const [leadershipModalOpen, setLeadershipModalOpen] = useState(false);
  const [editingLeadership, setEditingLeadership] = useState<Partial<LeadershipMember>>({
    fullName: '',
    title: '',
    bio: '',
    photoUrl: '',
    photoPath: '',
    isPublished: true,
  });

  // 6. Insight form
  const [insightModalOpen, setInsightModalOpen] = useState(false);
  const [editingInsight, setEditingInsight] = useState<Partial<Insight>>({
    title: '',
    summary: '',
    content: '',
    category: 'Strategy',
    imageUrl: '',
    imagePath: '',
    publishedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    isPublished: true,
  });

  // 7. Event form
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<EventItem>>({
    title: '',
    description: '',
    date: '',
    location: '',
    imageUrl: '',
    imagePath: '',
    isPublished: true,
  });

  // 8. Publication form
  const [pubModalOpen, setPubModalOpen] = useState(false);
  const [editingPub, setEditingPub] = useState<Partial<Publication>>({
    title: '',
    description: '',
    linkUrl: '',
    publishedDate: new Date().getFullYear().toString(),
    isPublished: true,
  });

  // 9. FAQ form
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQ>>({
    question: '',
    answer: '',
    category: 'General',
    isPublished: true,
    order: 1,
  });

  // 10. Site Settings form
  const [settingsForm, setSettingsForm] = useState(siteSettings);
  const [ceoForm, setCeoForm] = useState(
    siteSettings.ceoProfile || {
      fullName: '',
      title: 'Chief Executive Officer',
      statement: '',
      photoUrl: '',
      photoPath: '',
    }
  );

  // Admin login credentials (as requested by user)
  const [adminEmail, setAdminEmail] = useState('freshperspectiveorganization@gmail.com');
  const [adminPassword, setAdminPassword] = useState('fresh@org');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Sync settings when siteSettings update
  React.useEffect(() => {
    setSettingsForm(siteSettings);
    if (siteSettings.ceoProfile) {
      setCeoForm(siteSettings.ceoProfile);
    }
  }, [siteSettings]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[96vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#0B132B] text-white p-4 sm:px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-lime-400 text-[#0B132B] flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>Administrative Portal</span>
                <span className="text-[10px] bg-slate-800 text-lime-400 font-mono px-2 py-0.5 rounded border border-slate-700">
                  Cloud Firestore & Storage
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Fresh Perspective Organization Content Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-lime-400" />
                <span className="truncate max-w-[150px]">{currentUser.email}</span>
                <button
                  onClick={logoutUser}
                  className="ml-2 text-slate-400 hover:text-white"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {notification && (
          <div
            className={`p-3 text-xs flex items-center gap-2 justify-center shrink-0 ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-red-50 text-red-800 border-b border-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* Auth Barrier if not signed in or not authorized admin */}
        {!isAdmin ? (
          <div className="p-6 sm:p-10 max-w-md mx-auto my-auto flex-1 flex flex-col justify-center">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#0B132B] text-lime-400 mx-auto flex items-center justify-center font-bold text-lg mb-3">
                FP
              </div>
              <h3 className="text-xl font-bold text-[#0B132B]">
                Administrator Login
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter authorized credentials to manage Fresh Perspective Organization.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
                {loginError}
              </div>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoginError(null);
                setIsLoggingIn(true);
                try {
                  await loginWithEmailPassword(adminEmail, adminPassword);
                } catch (err: any) {
                  setLoginError(err.message || 'Login failed. Please verify credentials.');
                } finally {
                  setIsLoggingIn(false);
                }
              }}
              className="space-y-3.5 text-xs bg-slate-50 p-5 rounded-xl border border-slate-200 mb-4"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B] font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B] font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold py-2.5 rounded-lg text-xs transition-colors disabled:opacity-60"
              >
                {isLoggingIn ? 'Verifying...' : 'Sign In as Administrator'}
              </button>
            </form>

            <div className="relative text-center my-3">
              <span className="text-[11px] text-slate-400 bg-white px-2">or authenticate with Google</span>
            </div>

            <button
              onClick={loginWithGoogle}
              disabled={isAuthLoading}
              className="w-full bg-[#0B132B] hover:bg-slate-800 text-white font-medium py-2 rounded-lg text-xs transition-colors"
            >
              Sign In With Google
            </button>
          </div>
        ) : (
          /* Main Admin Area with Sidebar Navigation */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-3 space-y-1 overflow-y-auto shrink-0">
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'inquiries'
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-lime-400" />
                  <span>Inquiries & Quotes</span>
                </div>
                {inquiries.filter((i) => i.status === 'new').length > 0 && (
                  <span className="bg-lime-400 text-[#0B132B] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                    {inquiries.filter((i) => i.status === 'new').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('ceo')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'ceo'
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-lime-400" />
                  <span>CEO Profile & Photo</span>
                </div>
                <span className="text-[10px] font-mono text-lime-400">Executive</span>
              </button>

              <button
                onClick={() => setActiveTab('professionals')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'professionals'
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-lime-400" />
                  <span>Professionals & Photos</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">
                  {professionals.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'services'
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-lime-400" />
                  <span>Services Directory</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">
                  {services.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'projects'
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-lime-400" />
                  <span>Projects & Portfolio</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">
                  {projects.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4 text-lime-400" />
                  <span>Gallery & Media</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">
                  {galleryItems.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('leadership')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'leadership'
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-lime-400" />
                  <span>Leadership Profiles</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">
                  {leadership.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('insights')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'insights'
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-lime-400" />
                  <span>Insights / Articles</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">
                  {insights.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'events'
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-lime-400" />
                  <span>Events & Summits</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">
                  {events.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('publications')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'publications'
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileDown className="w-4 h-4 text-lime-400" />
                  <span>Publications</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">
                  {publications.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('faqs')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'faqs'
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-lime-400" />
                  <span>FAQs Manager</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">
                  {faqs.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('organization')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'organization'
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-lime-400" />
                  <span>Organization & Content</span>
                </div>
              </button>

              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={async () => {
                    if (window.confirm('Initialize and seed default baseline agency data into Firestore?')) {
                      setIsProcessing(true);
                      try {
                        await seedBaselineData();
                        showNotice('success', 'Baseline agency services, FAQs, and settings seeded to Firestore!');
                      } catch (e: any) {
                        showNotice('error', e.message || 'Seed failed');
                      } finally {
                        setIsProcessing(false);
                      }
                    }
                  }}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 bg-lime-100 hover:bg-lime-200 text-lime-900 border border-lime-300 py-2 px-3 rounded-lg text-xs font-bold transition-colors"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Seed Baseline Data</span>
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-white">
              {/* TAB: CEO PROFILE & PHOTOGRAPH */}
              {activeTab === 'ceo' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B132B]">CEO Profile & Photograph</h3>
                      <p className="text-xs text-slate-500">
                        This photograph and statement are displayed directly after the landing page. Upload photo to Firebase Storage and save to Firestore.
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setIsProcessing(true);
                      try {
                        await saveCeoProfile(ceoForm);
                        showNotice('success', 'CEO photograph and profile saved to Cloud Firestore!');
                      } catch (err: any) {
                        showNotice('error', err.message || 'Save failed');
                      } finally {
                        setIsProcessing(false);
                      }
                    }}
                    className="space-y-4 max-w-xl text-xs bg-slate-50 p-6 rounded-xl border border-slate-200"
                  >
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        CEO Photograph (Firebase Storage)
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-24 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-300 flex items-center justify-center">
                          {ceoForm.photoUrl ? (
                            <img src={ceoForm.photoUrl} alt="CEO" className="w-full h-full object-cover object-top" />
                          ) : (
                            <span className="text-[11px] text-slate-400 font-bold">No Photo</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setUploadProgress(0);
                                try {
                                  const res = await uploadImageToStorage(file, 'ceo', (pct) => {
                                    setUploadProgress(pct);
                                  });
                                  setCeoForm((prev) => ({
                                    ...prev,
                                    photoUrl: res.downloadUrl,
                                    photoPath: res.storagePath,
                                  }));
                                  setUploadProgress(null);
                                  showNotice('success', 'Photograph uploaded to Firebase Storage.');
                                } catch (err: any) {
                                  alert(err.message || 'Upload failed');
                                  setUploadProgress(null);
                                }
                              }
                            }}
                            className="text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0B132B] file:text-lime-400 hover:file:bg-slate-800"
                          />
                          {uploadProgress !== null && (
                            <div className="mt-2 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#84cc16] h-full transition-all"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          )}
                          <p className="text-[10px] text-slate-400 mt-1">
                            Permanent Firebase Storage download URL will be saved in Firestore.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={ceoForm.fullName}
                        onChange={(e) => setCeoForm({ ...ceoForm, fullName: e.target.value })}
                        placeholder="e.g. Micheal Chibuking"
                        className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Executive Title</label>
                      <input
                        type="text"
                        value={ceoForm.title}
                        onChange={(e) => setCeoForm({ ...ceoForm, title: e.target.value })}
                        placeholder="e.g. Chief Executive Officer & Founder"
                        className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Executive Statement / Message</label>
                      <textarea
                        rows={3}
                        value={ceoForm.statement}
                        onChange={(e) => setCeoForm({ ...ceoForm, statement: e.target.value })}
                        placeholder="Enter brief statement or quote to accompany photograph..."
                        className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-5 py-2.5 rounded text-xs transition-colors"
                    >
                      {isProcessing ? 'Saving to Firestore...' : 'Save CEO Profile to Firestore'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 1: INQUIRIES & QUOTES */}
              {activeTab === 'inquiries' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B132B]">Inquiry & Quote Requests</h3>
                      <p className="text-xs text-slate-500">
                        Visitor inquiries submitted to Cloud Firestore. Status is editable and persistent.
                      </p>
                    </div>
                    <button
                      onClick={fetchInquiries}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs flex items-center gap-1 font-semibold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {inquiries.length > 0 ? (
                    <div className="space-y-4">
                      {inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="border border-slate-200 rounded-xl p-5 hover:border-lime-300 transition-all bg-[#f8fafc]"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div>
                              <span className="font-bold text-[#0B132B] text-base">
                                {inq.fullName}
                              </span>
                              {inq.organization && (
                                <span className="text-xs text-slate-500 ml-2 font-medium">
                                  ({inq.organization})
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={inq.status}
                                onChange={(e) => updateInquiryStatus(inq.id!, e.target.value as any)}
                                className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                                  inq.status === 'new'
                                    ? 'bg-lime-100 text-lime-800 border-lime-300'
                                    : inq.status === 'reviewed'
                                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                                    : inq.status === 'contacted'
                                    ? 'bg-purple-100 text-purple-800 border-purple-300'
                                    : 'bg-slate-200 text-slate-700 border-slate-300'
                                }`}
                              >
                                <option value="new">Status: New</option>
                                <option value="reviewed">Status: Reviewed</option>
                                <option value="contacted">Status: Contacted</option>
                                <option value="completed">Status: Completed</option>
                              </select>

                              <button
                                onClick={() => {
                                  if (window.confirm('Delete this inquiry record from Firestore?')) {
                                    deleteInquiry(inq.id!);
                                  }
                                }}
                                className="text-slate-400 hover:text-red-600 p-1"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-600 mb-3 bg-white p-3 rounded-lg border border-slate-200">
                            <div>
                              <span className="font-semibold text-slate-800 block">Email:</span>
                              <a href={`mailto:${inq.email}`} className="text-blue-600 hover:underline">
                                {inq.email}
                              </a>
                            </div>
                            <div>
                              <span className="font-semibold text-slate-800 block">Phone / WhatsApp:</span>
                              {inq.phone ? (
                                <a
                                  href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:underline inline-flex items-center gap-1"
                                >
                                  <span>{inq.phone}</span>
                                </a>
                              ) : (
                                <span className="text-slate-400">Not provided</span>
                              )}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-800 block">Service:</span>
                              <span className="text-slate-800 font-medium">{inq.service}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-slate-800 block">Budget / Deadline:</span>
                              <span>{inq.budgetRange || 'Flexible'} • {inq.preferredDeadline || 'Flexible'}</span>
                            </div>
                          </div>

                          <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-3">
                            <span className="font-bold text-[#0B132B] block mb-1">Brief Description:</span>
                            <p className="whitespace-pre-line leading-relaxed">{inq.description}</p>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Submitted: {new Date(inq.createdAt).toLocaleString()}</span>
                            <div className="flex items-center gap-2">
                              <a
                                href={`mailto:${inq.email}?subject=Fresh Perspective Organization - Regarding Your Project Inquiry`}
                                className="bg-[#0B132B] hover:bg-slate-800 text-white px-3 py-1 rounded text-xs font-semibold inline-flex items-center gap-1"
                              >
                                <Mail className="w-3 h-3 text-lime-400" />
                                <span>Reply via Email</span>
                              </a>
                              {inq.phone && (
                                <a
                                  href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello ${encodeURIComponent(
                                    inq.fullName
                                  )}, thank you for contacting Fresh Perspective Organization.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs font-semibold inline-flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>Open WhatsApp</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-slate-300 rounded-xl">
                      <Mail className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-[#0B132B]">No Inquiries Yet</h4>
                      <p className="text-xs text-slate-500">
                        When visitors fill out the quote brief on the website, they will appear here in real time.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PROFESSIONALS DIRECTORY (ESSENTIAL FEATURE) */}
              {activeTab === 'professionals' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B132B]">
                        Professionals Directory & Photography
                      </h3>
                      <p className="text-xs text-slate-500">
                        Upload genuine photographs to Firebase Storage. Store and manage specialist profiles in Firestore.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingProf({
                          fullName: '',
                          title: '',
                          category: PROFESSIONAL_CATEGORIES[0],
                          specialization: '',
                          bio: '',
                          skills: [],
                          photoUrl: '',
                          photoPath: '',
                          portfolioUrl: '',
                          socialUrl: '',
                          isPublished: true,
                          order: professionals.length + 1,
                        });
                        setSkillsInput('');
                        setProfModalOpen(true);
                      }}
                      className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Specialist Profile</span>
                    </button>
                  </div>

                  {professionals.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {professionals.map((prof) => (
                        <div
                          key={prof.id}
                          className="border border-slate-200 rounded-xl overflow-hidden bg-[#f8fafc] flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative aspect-[16/10] bg-slate-200">
                              {prof.photoUrl ? (
                                <img
                                  src={prof.photoUrl}
                                  alt={prof.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <Users className="w-10 h-10" />
                                </div>
                              )}
                              <span className="absolute top-2 left-2 bg-[#0B132B] text-lime-400 text-[10px] font-bold px-2 py-0.5 rounded">
                                {prof.category}
                              </span>
                              <span
                                className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded ${
                                  prof.isPublished
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-amber-500 text-white'
                                }`}
                              >
                                {prof.isPublished ? 'Published' : 'Draft'}
                              </span>
                            </div>

                            <div className="p-4">
                              <h4 className="font-bold text-[#0B132B] text-base">{prof.fullName}</h4>
                              <p className="text-xs text-slate-500 font-medium mb-1">{prof.title}</p>
                              {prof.specialization && (
                                <p className="text-[11px] text-slate-600 italic mb-2">
                                  Focus: {prof.specialization}
                                </p>
                              )}
                              <p className="text-xs text-slate-600 line-clamp-2 mb-3">{prof.bio}</p>

                              {prof.skills && prof.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {prof.skills.map((s, idx) => (
                                    <span
                                      key={idx}
                                      className="bg-white border border-slate-200 text-[10px] px-1.5 py-0.5 rounded text-slate-700"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
                            <button
                              onClick={() => {
                                saveProfessional({
                                  ...prof,
                                  isPublished: !prof.isPublished,
                                });
                              }}
                              className="text-xs font-semibold text-slate-600 hover:text-[#0B132B] inline-flex items-center gap-1"
                            >
                              {prof.isPublished ? (
                                <>
                                  <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Unpublish</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Publish</span>
                                </>
                              )}
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingProf(prof);
                                  setSkillsInput((prof.skills || []).join(', '));
                                  setProfModalOpen(true);
                                }}
                                className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                                title="Edit Profile"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete specialist ${prof.fullName}?`)) {
                                    deleteProfessional(prof.id, prof.photoPath);
                                    showNotice('success', 'Specialist removed.');
                                  }
                                }}
                                className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded"
                                title="Delete Profile"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-slate-300 rounded-xl">
                      <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-[#0B132B]">No Professionals Added Yet</h4>
                      <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                        In accordance with the prompt guidelines, genuine team members and photographs are uploaded here directly.
                      </p>
                      <button
                        onClick={() => {
                          setEditingProf({
                            fullName: '',
                            title: '',
                            category: PROFESSIONAL_CATEGORIES[0],
                            specialization: '',
                            bio: '',
                            skills: [],
                            photoUrl: '',
                            photoPath: '',
                            portfolioUrl: '',
                            socialUrl: '',
                            isPublished: true,
                            order: 1,
                          });
                          setSkillsInput('');
                          setProfModalOpen(true);
                        }}
                        className="bg-[#0B132B] text-lime-400 px-4 py-2 rounded-lg text-xs font-bold"
                      >
                        Upload First Specialist
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SERVICES */}
              {activeTab === 'services' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B132B]">Services Directory</h3>
                      <p className="text-xs text-slate-500">
                        Manage agency offerings and descriptions displayed across the public portal.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingService({
                          title: '',
                          description: '',
                          imageUrl: '',
                          isPublished: true,
                          order: services.length + 1,
                        });
                        setServiceModalOpen(true);
                      }}
                      className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Service</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {services.map((svc) => (
                      <div
                        key={svc.id}
                        className="border border-slate-200 rounded-xl p-4 bg-[#f8fafc] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-[#0B132B] text-base">{svc.title}</h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                svc.isPublished
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {svc.isPublished ? 'Published' : 'Hidden'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{svc.description}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              saveService({ ...svc, isPublished: !svc.isPublished });
                            }}
                            className="p-1.5 text-slate-600 hover:text-[#0B132B] rounded text-xs font-semibold"
                          >
                            {svc.isPublished ? 'Hide' : 'Show'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingService(svc);
                              setServiceModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-200 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete service ${svc.title}?`)) {
                                deleteService(svc.id, svc.imagePath);
                              }
                            }}
                            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-slate-200 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PROJECTS & PORTFOLIO */}
              {activeTab === 'projects' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B132B]">Projects & Portfolio</h3>
                      <p className="text-xs text-slate-500">
                        Upload case studies and project imagery stored in Firebase Storage.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingProject({
                          title: '',
                          description: '',
                          category: 'Creative Design',
                          imageUrl: '',
                          projectUrl: '',
                          isFeatured: false,
                          isPublished: true,
                        });
                        setProjectModalOpen(true);
                      }}
                      className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Portfolio Item</span>
                    </button>
                  </div>

                  {projects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="border border-slate-200 rounded-xl overflow-hidden bg-[#f8fafc] flex flex-col justify-between"
                        >
                          <div>
                            {proj.imageUrl && (
                              <div className="aspect-[16/10] bg-slate-200">
                                <img
                                  src={proj.imageUrl}
                                  alt={proj.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="p-4">
                              <span className="text-[10px] font-bold text-lime-700 uppercase">
                                {proj.category}
                              </span>
                              <h4 className="font-bold text-[#0B132B] text-sm mt-1">{proj.title}</h4>
                              <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                                {proj.description}
                              </p>
                            </div>
                          </div>

                          <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                proj.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {proj.isPublished ? 'Live' : 'Draft'}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingProject(proj);
                                  setProjectModalOpen(true);
                                }}
                                className="p-1 text-slate-600 hover:text-blue-600"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Delete project?')) {
                                    deleteProject(proj.id, proj.imagePath);
                                  }
                                }}
                                className="p-1 text-slate-600 hover:text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-slate-300 rounded-xl text-slate-500 text-xs">
                      No portfolio projects created yet.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: GALLERY & MEDIA */}
              {activeTab === 'gallery' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B132B]">Gallery & Visual Media</h3>
                      <p className="text-xs text-slate-500">
                        Upload production photos and moments into Firebase Storage.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingGallery({
                          title: '',
                          caption: '',
                          category: 'Creative Production',
                          imageUrl: '',
                          imagePath: '',
                          isPublished: true,
                        });
                        setGalleryModalOpen(true);
                      }}
                      className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload Gallery Image</span>
                    </button>
                  </div>

                  {galleryItems.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {galleryItems.map((item) => (
                        <div
                          key={item.id}
                          className="border border-slate-200 rounded-xl overflow-hidden bg-white group relative aspect-square"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white text-xs">
                            <div>
                              <span className="text-[10px] text-lime-400 uppercase font-bold">
                                {item.category}
                              </span>
                              <h5 className="font-bold line-clamp-2 mt-1">{item.title}</h5>
                            </div>
                            <button
                              onClick={() => {
                                if (window.confirm('Delete image from Storage and Firestore?')) {
                                  deleteGalleryItem(item.id, item.imagePath);
                                }
                              }}
                              className="self-end bg-red-600 hover:bg-red-700 text-white p-1.5 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-slate-300 rounded-xl text-slate-500 text-xs">
                      No gallery images uploaded yet.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: LEADERSHIP */}
              {activeTab === 'leadership' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B132B]">Executive Leadership</h3>
                      <p className="text-xs text-slate-500">
                        Board members and executive directors profile management.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingLeadership({
                          fullName: '',
                          title: '',
                          bio: '',
                          photoUrl: '',
                          isPublished: true,
                        });
                        setLeadershipModalOpen(true);
                      }}
                      className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Leadership Member</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leadership.map((lead) => (
                      <div
                        key={lead.id}
                        className="border border-slate-200 rounded-xl p-4 bg-[#f8fafc] flex items-start gap-4"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 shrink-0">
                          {lead.photoUrl ? (
                            <img src={lead.photoUrl} alt={lead.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Users className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#0B132B] text-sm">{lead.fullName}</h4>
                          <span className="text-[11px] font-semibold text-lime-700 block mb-1">
                            {lead.title}
                          </span>
                          <p className="text-xs text-slate-600 line-clamp-2">{lead.bio}</p>

                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingLeadership(lead);
                                setLeadershipModalOpen(true);
                              }}
                              className="text-xs text-blue-600 font-semibold"
                            >
                              Edit
                            </button>
                            <span>•</span>
                            <button
                              onClick={() => {
                                if (window.confirm('Delete leadership member?')) {
                                  deleteLeadership(lead.id, lead.photoPath);
                                }
                              }}
                              className="text-xs text-red-600 font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: INSIGHTS & ARTICLES */}
              {activeTab === 'insights' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B132B]">Insights & Blog Articles</h3>
                      <p className="text-xs text-slate-500">
                        Publish thought leadership and digital strategy articles.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingInsight({
                          title: '',
                          summary: '',
                          content: '',
                          category: 'Strategy',
                          imageUrl: '',
                          publishedDate: new Date().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }),
                          isPublished: true,
                        });
                        setInsightModalOpen(true);
                      }}
                      className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Write New Article</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {insights.map((ins) => (
                      <div
                        key={ins.id}
                        className="border border-slate-200 rounded-xl p-4 bg-[#f8fafc] flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-lime-700 uppercase">
                              {ins.category}
                            </span>
                            <span className="text-xs text-slate-400">• {ins.publishedDate}</span>
                          </div>
                          <h4 className="font-bold text-[#0B132B] text-base">{ins.title}</h4>
                          <p className="text-xs text-slate-600 line-clamp-1">{ins.summary}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingInsight(ins);
                              setInsightModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-200 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete article?')) {
                                deleteInsight(ins.id, ins.imagePath);
                              }
                            }}
                            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-slate-200 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: EVENTS */}
              {activeTab === 'events' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B132B]">Events & Summits</h3>
                      <p className="text-xs text-slate-500">Schedule agency masterclasses and summits.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingEvent({
                          title: '',
                          description: '',
                          date: '',
                          location: '',
                          imageUrl: '',
                          isPublished: true,
                        });
                        setEventModalOpen(true);
                      }}
                      className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Event</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {events.map((evt) => (
                      <div
                        key={evt.id}
                        className="border border-slate-200 rounded-xl p-4 bg-[#f8fafc] flex items-center justify-between gap-4"
                      >
                        <div>
                          <span className="text-xs font-semibold text-lime-700 block">
                            {evt.date} • {evt.location}
                          </span>
                          <h4 className="font-bold text-[#0B132B] text-base">{evt.title}</h4>
                          <p className="text-xs text-slate-600">{evt.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingEvent(evt);
                              setEventModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-200 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete event?')) deleteEvent(evt.id, evt.imagePath);
                            }}
                            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-slate-200 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 9: PUBLICATIONS */}
              {activeTab === 'publications' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B132B]">Publications & Whitepapers</h3>
                      <p className="text-xs text-slate-500">Provide official downloads and links.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingPub({
                          title: '',
                          description: '',
                          linkUrl: '',
                          publishedDate: new Date().getFullYear().toString(),
                          isPublished: true,
                        });
                        setPubModalOpen(true);
                      }}
                      className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Publication</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {publications.map((pub) => (
                      <div
                        key={pub.id}
                        className="border border-slate-200 rounded-xl p-4 bg-[#f8fafc] flex items-center justify-between gap-4"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            {pub.publishedDate}
                          </span>
                          <h4 className="font-bold text-[#0B132B] text-base">{pub.title}</h4>
                          <p className="text-xs text-slate-600">{pub.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingPub(pub);
                              setPubModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-200 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete publication?')) deletePublication(pub.id);
                            }}
                            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-slate-200 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 10: FAQS */}
              {activeTab === 'faqs' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B132B]">Frequently Asked Questions</h3>
                      <p className="text-xs text-slate-500">Edit and add answers to common client questions.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingFaq({
                          question: '',
                          answer: '',
                          category: 'General',
                          isPublished: true,
                          order: faqs.length + 1,
                        });
                        setFaqModalOpen(true);
                      }}
                      className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="border border-slate-200 rounded-xl p-4 bg-[#f8fafc] flex items-start justify-between gap-4"
                      >
                        <div className="flex-1">
                          <h4 className="font-bold text-[#0B132B] text-sm mb-1">{faq.question}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingFaq(faq);
                              setFaqModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-200 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete FAQ?')) deleteFAQ(faq.id);
                            }}
                            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-slate-200 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 11: ORGANIZATION & ABOUT US CONTENT */}
              {activeTab === 'organization' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B132B]">
                        Organization Details & About Us Content
                      </h3>
                      <p className="text-xs text-slate-500">
                        Edit core headlines, mission, vision, core values, contact information, and verified social media channels.
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setIsProcessing(true);
                      try {
                        await updateSiteSettings(settingsForm);
                        showNotice('success', 'Organization and About Us settings successfully updated in Firestore!');
                      } catch (err: any) {
                        showNotice('error', err.message || 'Update failed');
                      } finally {
                        setIsProcessing(false);
                      }
                    }}
                    className="space-y-6 max-w-3xl"
                  >
                    <div className="bg-[#f8fafc] p-5 rounded-xl border border-slate-200 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B132B]">
                        Identity & Hero Section
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Organization Name
                          </label>
                          <input
                            type="text"
                            value={settingsForm.orgName}
                            onChange={(e) => setSettingsForm({ ...settingsForm, orgName: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Tagline / Motto
                          </label>
                          <input
                            type="text"
                            value={settingsForm.tagline}
                            onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Hero Headline
                        </label>
                        <input
                          type="text"
                          value={settingsForm.heroHeadline}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Hero Description
                        </label>
                        <textarea
                          rows={2}
                          value={settingsForm.heroDescription}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroDescription: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                        />
                      </div>
                    </div>

                    {/* About Us Pillars */}
                    <div className="bg-[#f8fafc] p-5 rounded-xl border border-slate-200 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B132B]">
                        About Us Pillars
                      </h4>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Main About Us Summary
                        </label>
                        <textarea
                          rows={2}
                          value={settingsForm.aboutText}
                          onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Who We Are
                        </label>
                        <textarea
                          rows={2}
                          value={settingsForm.whoWeAre}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whoWeAre: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Mission Statement
                        </label>
                        <textarea
                          rows={2}
                          value={settingsForm.mission}
                          onChange={(e) => setSettingsForm({ ...settingsForm, mission: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Vision Statement
                        </label>
                        <textarea
                          rows={2}
                          value={settingsForm.vision}
                          onChange={(e) => setSettingsForm({ ...settingsForm, vision: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Core Values (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={settingsForm.coreValues}
                          onChange={(e) => setSettingsForm({ ...settingsForm, coreValues: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                        />
                      </div>
                    </div>

                    {/* Contact & Social Links */}
                    <div className="bg-[#f8fafc] p-5 rounded-xl border border-slate-200 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B132B]">
                        Verified Contact & Social Media Channels
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Main Email Address
                          </label>
                          <input
                            type="email"
                            value={settingsForm.email}
                            onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            WhatsApp / Phone Link
                          </label>
                          <input
                            type="text"
                            value={settingsForm.whatsappUrl}
                            onChange={(e) => setSettingsForm({ ...settingsForm, whatsappUrl: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">Facebook URL</label>
                          <input
                            type="url"
                            value={settingsForm.socialLinks.facebook}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                socialLinks: { ...settingsForm.socialLinks, facebook: e.target.value },
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">Instagram URL</label>
                          <input
                            type="url"
                            value={settingsForm.socialLinks.instagram}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                socialLinks: { ...settingsForm.socialLinks, instagram: e.target.value },
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">LinkedIn URL</label>
                          <input
                            type="url"
                            value={settingsForm.socialLinks.linkedin}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                socialLinks: { ...settingsForm.socialLinks, linkedin: e.target.value },
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">TikTok URL</label>
                          <input
                            type="url"
                            value={settingsForm.socialLinks.tiktok}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                socialLinks: { ...settingsForm.socialLinks, tiktok: e.target.value },
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">X (Twitter) URL</label>
                          <input
                            type="url"
                            value={settingsForm.socialLinks.x}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                socialLinks: { ...settingsForm.socialLinks, x: e.target.value },
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">Telegram URL</label>
                          <input
                            type="url"
                            value={settingsForm.socialLinks.telegram}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                socialLinks: { ...settingsForm.socialLinks, telegram: e.target.value },
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">YouTube URL</label>
                          <input
                            type="url"
                            value={settingsForm.socialLinks.youtube}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                socialLinks: { ...settingsForm.socialLinks, youtube: e.target.value },
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-6 py-2.5 rounded-lg text-xs shadow-sm transition-all flex items-center gap-2"
                    >
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      <span>Save All Organization Changes to Firestore</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD / EDIT PROFESSIONAL WITH FIREBASE STORAGE IMAGE UPLOAD */}
      {profModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
              <h3 className="font-bold text-[#0B132B] text-base">
                {editingProf.id ? 'Edit Professional Specialist' : 'Add Professional Specialist'}
              </h3>
              <button onClick={() => setProfModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsProcessing(true);
                try {
                  const skills = skillsInput
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);

                  await saveProfessional({
                    ...editingProf,
                    skills,
                  });
                  setProfModalOpen(false);
                  showNotice('success', 'Professional specialist profile saved.');
                } catch (err: any) {
                  showNotice('error', err.message || 'Save failed');
                } finally {
                  setIsProcessing(false);
                }
              }}
              className="space-y-4 text-xs"
            >
              {/* Photo Upload to Firebase Storage */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Specialist Photograph (Firebase Storage)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                    {editingProf.photoUrl ? (
                      <img src={editingProf.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadProgress(0);
                          try {
                            const res = await uploadImageToStorage(file, 'professionals', (pct) => {
                              setUploadProgress(pct);
                            });
                            setEditingProf((prev) => ({
                              ...prev,
                              photoUrl: res.downloadUrl,
                              photoPath: res.storagePath,
                            }));
                            setUploadProgress(null);
                          } catch (err: any) {
                            alert(err.message || 'Upload failed');
                            setUploadProgress(null);
                          }
                        }
                      }}
                      className="text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0B132B] file:text-lime-400 hover:file:bg-slate-800"
                    />
                    {uploadProgress !== null && (
                      <div className="mt-2 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#84cc16] h-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                    <p className="text-[10px] text-slate-400 mt-1">
                      JPEG, PNG, WebP up to 8MB. Permanent Firebase Storage URL will be generated.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingProf.fullName}
                  onChange={(e) => setEditingProf({ ...editingProf, fullName: e.target.value })}
                  placeholder="e.g. David Eze"
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Professional Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProf.title}
                    onChange={(e) => setEditingProf({ ...editingProf, title: e.target.value })}
                    placeholder="e.g. Lead Software Engineer"
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={editingProf.category}
                    onChange={(e) => setEditingProf({ ...editingProf, category: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-medium"
                  >
                    {PROFESSIONAL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Domain Specialization</label>
                <input
                  type="text"
                  value={editingProf.specialization || ''}
                  onChange={(e) => setEditingProf({ ...editingProf, specialization: e.target.value })}
                  placeholder="e.g. Full-Stack Web Architecture & Cloud APIs"
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Biography *</label>
                <textarea
                  rows={3}
                  required
                  value={editingProf.bio}
                  onChange={(e) => setEditingProf({ ...editingProf, bio: e.target.value })}
                  placeholder="Provide brief background, verified credentials, and client delivery record..."
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. React, Node.js, UI/UX, SEO, Copywriting"
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Portfolio Link (Optional)</label>
                  <input
                    type="url"
                    value={editingProf.portfolioUrl || ''}
                    onChange={(e) => setEditingProf({ ...editingProf, portfolioUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Publication Status</label>
                  <select
                    value={editingProf.isPublished ? 'true' : 'false'}
                    onChange={(e) => setEditingProf({ ...editingProf, isPublished: e.target.value === 'true' })}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                  >
                    <option value="true">Published (Visible to Visitors)</option>
                    <option value="false">Draft (Admin Only)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProfModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-5 py-2 rounded"
                >
                  {isProcessing ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT SERVICE */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-[#0B132B] text-base mb-4">
              {editingService.id ? 'Edit Service' : 'Add Service'}
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveService(editingService);
                setServiceModalOpen(false);
                showNotice('success', 'Service saved to Firestore.');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded p-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-1.5 rounded"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PORTFOLIO PROJECT */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-[#0B132B] text-base mb-4">
              {editingProject.id ? 'Edit Project' : 'Add Project'}
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveProject(editingProject);
                setProjectModalOpen(false);
                showNotice('success', 'Project saved.');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cover Image (Firebase Storage)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const res = await uploadImageToStorage(f, 'projects');
                      setEditingProject((p) => ({ ...p, imageUrl: res.downloadUrl, imagePath: res.storagePath }));
                    }
                  }}
                  className="text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category *</label>
                <input
                  type="text"
                  required
                  value={editingProject.category}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">External Link (Optional)</label>
                <input
                  type="url"
                  value={editingProject.projectUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, projectUrl: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-3 py-1.5 border rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-1.5 rounded"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: GALLERY ITEM */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-[#0B132B] text-base mb-4">Upload Gallery Image</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingGallery.imageUrl) {
                  alert('Please upload an image file first.');
                  return;
                }
                await saveGalleryItem(editingGallery);
                setGalleryModalOpen(false);
                showNotice('success', 'Image added to Gallery.');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Photograph *</label>
                <input
                  type="file"
                  required={!editingGallery.imageUrl}
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const res = await uploadImageToStorage(f, 'gallery');
                      setEditingGallery((g) => ({ ...g, imageUrl: res.downloadUrl, imagePath: res.storagePath }));
                    }
                  }}
                  className="text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title / Caption</label>
                <input
                  type="text"
                  value={editingGallery.title || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                  placeholder="e.g. Strategy workshop session"
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={editingGallery.category || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                  placeholder="e.g. Studio, Events, Workshop"
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-3 py-1.5 border rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-1.5 rounded"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: LEADERSHIP */}
      {leadershipModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-[#0B132B] text-base mb-4">Leadership Member</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveLeadership(editingLeadership);
                setLeadershipModalOpen(false);
                showNotice('success', 'Leadership profile saved.');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Executive Photograph</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const res = await uploadImageToStorage(f, 'leadership');
                      setEditingLeadership((l) => ({ ...l, photoUrl: res.downloadUrl, photoPath: res.storagePath }));
                    }
                  }}
                  className="text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingLeadership.fullName}
                  onChange={(e) => setEditingLeadership({ ...editingLeadership, fullName: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Executive Title *</label>
                <input
                  type="text"
                  required
                  value={editingLeadership.title}
                  onChange={(e) => setEditingLeadership({ ...editingLeadership, title: e.target.value })}
                  placeholder="e.g. Managing Partner / Director"
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={editingLeadership.bio || ''}
                  onChange={(e) => setEditingLeadership({ ...editingLeadership, bio: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLeadershipModalOpen(false)}
                  className="px-3 py-1.5 border rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-1.5 rounded"
                >
                  Save Leader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: INSIGHT / BLOG */}
      {insightModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-[#0B132B] text-base mb-4">Article / Insight</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveInsight(editingInsight);
                setInsightModalOpen(false);
                showNotice('success', 'Article saved.');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editingInsight.title}
                  onChange={(e) => setEditingInsight({ ...editingInsight, title: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={editingInsight.category || ''}
                  onChange={(e) => setEditingInsight({ ...editingInsight, category: e.target.value })}
                  placeholder="e.g. Strategy, AI, Branding"
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Summary (Short) *</label>
                <textarea
                  rows={2}
                  required
                  value={editingInsight.summary}
                  onChange={(e) => setEditingInsight({ ...editingInsight, summary: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Content</label>
                <textarea
                  rows={6}
                  value={editingInsight.content || ''}
                  onChange={(e) => setEditingInsight({ ...editingInsight, content: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInsightModalOpen(false)}
                  className="px-3 py-1.5 border rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-1.5 rounded"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: EVENT */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-[#0B132B] text-base mb-4">Event / Summit</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveEvent(editingEvent);
                setEventModalOpen(false);
                showNotice('success', 'Event scheduled.');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    placeholder="e.g. Nov 15, 2026"
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingEvent.location || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    placeholder="e.g. Online Webinar"
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEventModalOpen(false)}
                  className="px-3 py-1.5 border rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-1.5 rounded"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 8: PUBLICATION */}
      {pubModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-[#0B132B] text-base mb-4">Publication / Whitepaper</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await savePublication(editingPub);
                setPubModalOpen(false);
                showNotice('success', 'Publication recorded.');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editingPub.title}
                  onChange={(e) => setEditingPub({ ...editingPub, title: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingPub.description || ''}
                  onChange={(e) => setEditingPub({ ...editingPub, description: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Link / URL</label>
                <input
                  type="url"
                  value={editingPub.linkUrl || ''}
                  onChange={(e) => setEditingPub({ ...editingPub, linkUrl: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPubModalOpen(false)}
                  className="px-3 py-1.5 border rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-1.5 rounded"
                >
                  Save Publication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 9: FAQ */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-[#0B132B] text-base mb-4">FAQ Item</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveFAQ(editingFaq);
                setFaqModalOpen(false);
                showNotice('success', 'FAQ saved.');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
                  className="px-3 py-1.5 border rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-1.5 rounded"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
