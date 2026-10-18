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
  Film,
  Video,
  Play,
  Pause,
  ArrowUp,
  ArrowDown,
  Quote,
  MessageSquare,
  Check,
  Clock,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { uploadImageToStorage, uploadVideoToStorage, captureVideoThumbnail } from '../firebase';
import {
  PROFESSIONAL_CATEGORIES,
  Professional,
  Service,
  Project,
  GalleryItem,
  VideoAdvert,
  VIDEO_ADVERT_CATEGORIES,
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
    videoAdverts,
    saveVideoAdvert,
    deleteVideoAdvert,
    reorderVideoAdverts,
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
    allTestimonials,
    publishTestimonial,
    hideTestimonial,
    approveTestimonial,
    rejectTestimonial,
    deleteTestimonial,
    allFeedbackList,
    publishFeedback,
    hideFeedback,
    approveFeedback,
    rejectFeedback,
    deleteFeedback,
    seedBaselineData,
  } = useData();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [testimonialFilter, setTestimonialFilter] = useState<'all' | 'published' | 'hidden' | 'pending'>('all');
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'published' | 'hidden' | 'pending'>('all');
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

  // 4b. Video Advertisements ("Brands In Motion") form
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Partial<VideoAdvert>>({
    title: '',
    description: '',
    category: 'Promotional Campaign',
    videoUrl: '',
    videoPath: '',
    thumbnailUrl: '',
    thumbnailPath: '',
    duration: '',
    isPublished: true,
    featured: false,
  });
  const [videoInputMode, setVideoInputMode] = useState<'file' | 'url'>('file');
  const [videoUploadProgress, setVideoUploadProgress] = useState<number | null>(null);
  const [videoThumbUploadProgress, setVideoThumbUploadProgress] = useState<number | null>(null);
  const [previewVideoItem, setPreviewVideoItem] = useState<VideoAdvert | null>(null);

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

  // Admin login credentials (securely empty by default - never visible to visitors)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [logoUploadProgress, setLogoUploadProgress] = useState<number | null>(null);
  const [galleryUploadProgress, setGalleryUploadProgress] = useState<number | null>(null);
  const [isCeoUploading, setIsCeoUploading] = useState(false);

  // Sync settings when siteSettings update
  React.useEffect(() => {
    setSettingsForm(siteSettings);
    if (siteSettings.ceoProfile) {
      setCeoForm(siteSettings.ceoProfile);
    }
  }, [siteSettings]);

  // Revalidate authentication session on browser navigation / pageshow
  React.useEffect(() => {
    const revalidate = () => {
      const hasSession = sessionStorage.getItem('fp_admin_session') === 'true';
      if (!hasSession && !currentUser) {
        logoutUser();
      }
    };
    window.addEventListener('pageshow', revalidate);
    window.addEventListener('popstate', revalidate);
    return () => {
      window.removeEventListener('pageshow', revalidate);
      window.removeEventListener('popstate', revalidate);
    };
  }, [currentUser]);

  // Securely end session and return to home page
  const handleLogout = async () => {
    try {
      await logoutUser();
      showNotice('success', 'You have been securely logged out.');
      onClose();
      const homeEl = document.getElementById('home');
      if (homeEl) {
        homeEl.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

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

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all border border-rose-500/50 cursor-pointer"
                title="Log out of Administrator Session"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Admin Modal"
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
                  placeholder="Enter administrator email"
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
                  placeholder="Enter password"
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
                onClick={() => setActiveTab('logo')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'logo'
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4 text-lime-400" />
                  <span>Organization Logo</span>
                </div>
                <span className="text-[10px] font-mono text-lime-400">
                  {siteSettings.logoUrl ? 'Active' : 'Pending'}
                </span>
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
                onClick={() => setActiveTab('videos')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'videos'
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Film className="w-4 h-4 text-lime-400" />
                  <span>Brands In Motion (Adverts)</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">
                  {videoAdverts.length}
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
                onClick={() => setActiveTab('testimonials')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'testimonials'
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Quote className="w-4 h-4 text-lime-400" />
                  <span>Testimonials</span>
                </div>
                {allTestimonials.filter((t) => !t.isApproved && t.status !== 'hidden' && t.status !== 'rejected').length > 0 ? (
                  <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-full" title="Pending review">
                    {allTestimonials.filter((t) => !t.isApproved && t.status !== 'hidden' && t.status !== 'rejected').length}
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px] font-mono">
                    {allTestimonials.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('feedback')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'feedback'
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-lime-400" />
                  <span>Visitors Feedback</span>
                </div>
                {allFeedbackList.filter((f) => !f.isApproved && f.status !== 'hidden' && f.status !== 'rejected').length > 0 ? (
                  <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-full" title="Pending review">
                    {allFeedbackList.filter((f) => !f.isApproved && f.status !== 'hidden' && f.status !== 'rejected').length}
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px] font-mono">
                    {allFeedbackList.length}
                  </span>
                )}
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

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-2.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer mt-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Logout Administrator</span>
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
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (!file.type.startsWith('image/') && !/\.(jpe?g|png|webp|svg|heic|heif)$/i.test(file.name)) {
                                  showNotice('error', 'Please select a valid image file from device (JPEG, PNG, WebP, SVG).');
                                  e.target.value = '';
                                  return;
                                }
                                setIsCeoUploading(true);
                                setUploadProgress(20);
                                try {
                                  const res = await uploadImageToStorage(file, 'ceo', (pct) => {
                                    setUploadProgress(pct);
                                  });
                                  const updated = {
                                    ...ceoForm,
                                    photoUrl: res.downloadUrl,
                                    photoPath: res.storagePath,
                                  };
                                  setCeoForm(updated);
                                  await saveCeoProfile(updated);
                                  setUploadProgress(null);
                                  setIsCeoUploading(false);
                                  showNotice('success', 'CEO photograph uploaded and saved permanently to Cloud Firestore!');
                                } catch (err: any) {
                                  showNotice('error', err.message || 'Upload failed. Please try another image.');
                                  setUploadProgress(null);
                                  setIsCeoUploading(false);
                                } finally {
                                  e.target.value = '';
                                }
                              }
                            }}
                            className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0B132B] file:text-lime-400 hover:file:bg-slate-800 cursor-pointer"
                          />
                          {isCeoUploading && (
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                                <span>Processing & uploading photo...</span>
                                <span>{uploadProgress || 20}%</span>
                              </div>
                              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#84cc16] h-full transition-all duration-300"
                                  style={{ width: `${uploadProgress || 20}%` }}
                                />
                              </div>
                            </div>
                          )}
                          <p className="text-[11px] text-slate-500 mt-1.5">
                            Select any image from your device gallery. Optimized automatically and saved to Cloud Firestore.
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

              {/* TAB: ORGANIZATION LOGO MANAGEMENT */}
              {activeTab === 'logo' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B132B]">Organization Logo Management</h3>
                      <p className="text-xs text-slate-500">
                        Upload and update the official organization logo stored permanently in Firebase. Displayed dynamically in the header navigation, footer, and brand touchpoints.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 max-w-2xl text-xs bg-slate-50 p-6 rounded-xl border border-slate-200">
                    {/* Live Preview on Light & Dark Backgrounds */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-2">Live Logo Preview</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Light preview */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center min-h-[140px]">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Header Navigation Preview (White Background)
                          </span>
                          {siteSettings.logoUrl ? (
                            <img
                              src={siteSettings.logoUrl}
                              alt="Organization Logo"
                              className="max-h-14 w-auto object-contain"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-9 h-9 rounded-lg bg-[#0B132B] text-lime-400 flex items-center justify-center font-black text-sm">
                                FP
                              </div>
                              <span className="font-extrabold text-sm text-[#0B132B] tracking-tight uppercase">
                                Fresh Perspective
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Dark preview */}
                        <div className="bg-[#0B132B] p-5 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center min-h-[140px]">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Footer Preview (Navy Background)
                          </span>
                          {siteSettings.logoUrl ? (
                            <img
                              src={siteSettings.logoUrl}
                              alt="Organization Logo"
                              className="max-h-14 w-auto object-contain brightness-105"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded bg-lime-400 text-[#0B132B] flex items-center justify-center font-black text-xs">
                                FP
                              </div>
                              <span className="font-extrabold text-sm text-white tracking-tight uppercase">
                                Fresh Perspective Organization
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Upload controls */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Upload / Replace Organization Logo
                        </label>
                        <p className="text-[11px] text-slate-500 mb-3">
                          Select your logo (PNG with transparent background, SVG, or high-resolution JPEG). The logo will be permanently saved to Firebase Storage and synchronized across the website.
                        </p>
                        <input
                          type="file"
                          accept="image/*,.svg"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (!file.type.startsWith('image/') && !/\.(jpe?g|png|webp|svg|heic|heif)$/i.test(file.name)) {
                                showNotice('error', 'Please select a valid image file (PNG, SVG, JPEG, WebP).');
                                e.target.value = '';
                                return;
                              }
                              setLogoUploadProgress(20);
                              try {
                                const res = await uploadImageToStorage(file, 'branding', (pct) => {
                                  setLogoUploadProgress(pct);
                                });
                                await updateSiteSettings({
                                  logoUrl: res.downloadUrl,
                                  logoPath: res.storagePath,
                                });
                                setLogoUploadProgress(null);
                                showNotice('success', 'Official organization logo uploaded and saved permanently to Cloud Firestore!');
                              } catch (err: any) {
                                showNotice('error', err.message || 'Logo upload failed. Please try another file.');
                                setLogoUploadProgress(null);
                              } finally {
                                e.target.value = '';
                              }
                            }
                          }}
                          className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0B132B] file:text-lime-400 hover:file:bg-slate-800 cursor-pointer"
                        />
                        {logoUploadProgress !== null && (
                          <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                              <span>Uploading organization logo...</span>
                              <span>{logoUploadProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#84cc16] h-full transition-all duration-300"
                                style={{ width: `${logoUploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {siteSettings.logoUrl && (
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4" />
                            <span>Active Logo Configured in Firestore</span>
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm('Reset to default Fresh Perspective Organization monogram?')) {
                                try {
                                  await updateSiteSettings({
                                    logoUrl: '',
                                    logoPath: '',
                                  });
                                  showNotice('success', 'Logo reset to default brand monogram.');
                                } catch (err: any) {
                                  showNotice('error', err.message || 'Reset failed');
                                }
                              }
                            }}
                            className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Remove Logo & Reset to Default
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
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

              {/* TAB 5b: VIDEO ADVERTISEMENTS ("BRANDS IN MOTION") */}
              {activeTab === 'videos' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-[#0B132B]">Brands In Motion — Video Advertisements</h3>
                        <span className="text-[10px] bg-lime-100 text-lime-900 font-extrabold px-2 py-0.5 rounded-full border border-lime-300">
                          {videoAdverts.length} Videos
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Upload and manage commercial video advertisements, marketing campaigns, and promotional showcases.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingVideo({
                          title: '',
                          description: '',
                          category: 'Promotional Campaign',
                          videoUrl: '',
                          videoPath: '',
                          thumbnailUrl: '',
                          thumbnailPath: '',
                          duration: '',
                          isPublished: true,
                          featured: false,
                        });
                        setVideoInputMode('file');
                        setVideoUploadProgress(null);
                        setVideoThumbUploadProgress(null);
                        setVideoModalOpen(true);
                      }}
                      className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-4 py-2.5 rounded-lg text-xs inline-flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload Video Advert</span>
                    </button>
                  </div>

                  {videoAdverts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {videoAdverts
                        .slice()
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((video, idx) => (
                          <div
                            key={video.id}
                            className={`border rounded-xl p-4 bg-white shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                              video.isPublished ? 'border-slate-200' : 'border-amber-300 bg-amber-50/20'
                            }`}
                          >
                            <div>
                              {/* Video Preview thumbnail with play overlay */}
                              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 mb-3 group">
                                <video
                                  src={video.videoUrl}
                                  poster={video.thumbnailUrl}
                                  preload="metadata"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => setPreviewVideoItem(video)}
                                    className="w-10 h-10 rounded-full bg-[#74C01E] text-[#0B132B] flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                                    title="Preview Video Playback"
                                  >
                                    <Play className="w-5 h-5 fill-[#0B132B] ml-0.5" />
                                  </button>
                                </div>
                                {video.duration && (
                                  <span className="absolute bottom-2 right-2 bg-black/75 text-white font-mono text-[10px] px-1.5 py-0.5 rounded font-bold">
                                    {video.duration}
                                  </span>
                                )}
                                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  video.isPublished
                                    ? 'bg-lime-400 text-[#0B132B]'
                                    : 'bg-amber-400 text-amber-950'
                                }`}>
                                  {video.isPublished ? 'Published' : 'Draft / Unpublished'}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-bold text-lime-800 bg-lime-50 px-2 py-0.5 rounded text-[10px] border border-lime-200">
                                  {video.category || 'Commercial Advert'}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  Order #{video.order || idx + 1}
                                </span>
                              </div>

                              <h4 className="font-bold text-sm text-[#0B132B] line-clamp-1 mb-1">
                                {video.title}
                              </h4>
                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                {video.description}
                              </p>
                            </div>

                            {/* Actions toolbar */}
                            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                {/* Move Up */}
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    const sorted = [...videoAdverts].sort((a, b) => (a.order || 0) - (b.order || 0));
                                    if (idx > 0) {
                                      const prevId = sorted[idx - 1].id;
                                      const curId = sorted[idx].id;
                                      const reordered = sorted.map((v) => v.id);
                                      reordered[idx - 1] = curId;
                                      reordered[idx] = prevId;
                                      reorderVideoAdverts(reordered);
                                    }
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-[#0B132B] disabled:opacity-30 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="Move Up in Display Order"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                {/* Move Down */}
                                <button
                                  type="button"
                                  disabled={idx === videoAdverts.length - 1}
                                  onClick={() => {
                                    const sorted = [...videoAdverts].sort((a, b) => (a.order || 0) - (b.order || 0));
                                    if (idx < sorted.length - 1) {
                                      const nextId = sorted[idx + 1].id;
                                      const curId = sorted[idx].id;
                                      const reordered = sorted.map((v) => v.id);
                                      reordered[idx + 1] = curId;
                                      reordered[idx] = nextId;
                                      reorderVideoAdverts(reordered);
                                    }
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-[#0B132B] disabled:opacity-30 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="Move Down in Display Order"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                {/* Toggle Publish */}
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await saveVideoAdvert({
                                      id: video.id,
                                      isPublished: !video.isPublished,
                                    });
                                    showNotice('success', video.isPublished ? 'Video unpublished.' : 'Video published on website!');
                                  }}
                                  className={`p-1.5 rounded transition-colors text-xs inline-flex items-center gap-1 cursor-pointer ${
                                    video.isPublished
                                      ? 'text-emerald-700 hover:bg-emerald-50'
                                      : 'text-amber-700 hover:bg-amber-50'
                                  }`}
                                  title={video.isPublished ? 'Click to Unpublish' : 'Click to Publish'}
                                >
                                  {video.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                  <span className="text-[10px] font-bold">{video.isPublished ? 'Live' : 'Hidden'}</span>
                                </button>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setPreviewVideoItem(video)}
                                  className="p-1.5 text-slate-600 hover:text-lime-700 hover:bg-slate-100 rounded transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                  title="Preview Video"
                                >
                                  <Play className="w-3 h-3" />
                                  <span>Preview</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingVideo(video);
                                    setVideoInputMode('file');
                                    setVideoUploadProgress(null);
                                    setVideoThumbUploadProgress(null);
                                    setVideoModalOpen(true);
                                  }}
                                  className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                  title="Edit Video Details"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (window.confirm(`Permanently delete video advertisement "${video.title}"?`)) {
                                      try {
                                        await deleteVideoAdvert(video.id, video.videoPath, video.thumbnailPath);
                                        showNotice('success', 'Video advertisement deleted from Firestore and Storage.');
                                      } catch (e: any) {
                                        showNotice('error', e.message || 'Failed to delete video.');
                                      }
                                    }
                                  }}
                                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                  title="Delete Video Advert"
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
                      No video advertisements uploaded yet. Click &ldquo;Upload Video Advert&rdquo; to add your first commercial campaign.
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

              {/* TAB 12: TESTIMONIALS - CONTENT MANAGEMENT */}
              {activeTab === 'testimonials' && (
                <div>
                  {(() => {
                    const isItemPublished = (item: { isApproved: boolean; status?: string }) =>
                      item.isApproved === true || item.status === 'published' || item.status === 'approved';

                    const isItemHidden = (item: { isApproved: boolean; status?: string }) =>
                      !item.isApproved && (item.status === 'hidden' || item.status === 'rejected');

                    const isItemPending = (item: { isApproved: boolean; status?: string }) =>
                      !item.isApproved && item.status !== 'hidden' && item.status !== 'rejected';

                    const allCount = allTestimonials.length;
                    const pendingCount = allTestimonials.filter(isItemPending).length;
                    const publishedCount = allTestimonials.filter(isItemPublished).length;
                    const hiddenCount = allTestimonials.filter(isItemHidden).length;

                    const filtered = allTestimonials.filter((item) => {
                      if (testimonialFilter === 'published') return isItemPublished(item);
                      if (testimonialFilter === 'hidden') return isItemHidden(item);
                      if (testimonialFilter === 'pending') return isItemPending(item);
                      return true;
                    });

                    return (
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
                          <div>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-lime-700 mb-1">
                              <span>Content Management</span>
                              <span>&bull;</span>
                              <span>Testimonials</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#0B132B] flex items-center gap-2">
                              <Quote className="w-5 h-5 text-lime-600" />
                              <span>Testimonials Management</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                              Manage client and visitor testimonials individually. Use the action buttons to <strong className="text-emerald-700">Publish</strong> to the website, <strong className="text-slate-700">Hide</strong> from public view, or permanently <strong className="text-rose-700">Delete</strong>.
                            </p>
                          </div>

                          {/* Filter buttons */}
                          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                            <button
                              type="button"
                              onClick={() => setTestimonialFilter('all')}
                              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                testimonialFilter === 'all'
                                  ? 'bg-[#0B132B] text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              All ({allCount})
                            </button>
                            <button
                              type="button"
                              onClick={() => setTestimonialFilter('published')}
                              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                testimonialFilter === 'published'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-emerald-800 hover:bg-emerald-100/60'
                              }`}
                            >
                              Published ({publishedCount})
                            </button>
                            <button
                              type="button"
                              onClick={() => setTestimonialFilter('hidden')}
                              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                testimonialFilter === 'hidden'
                                  ? 'bg-slate-700 text-white shadow-xs'
                                  : 'text-slate-700 hover:bg-slate-200/60'
                              }`}
                            >
                              Hidden ({hiddenCount})
                            </button>
                            <button
                              type="button"
                              onClick={() => setTestimonialFilter('pending')}
                              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                testimonialFilter === 'pending'
                                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                                  : 'text-amber-800 hover:bg-amber-100/60'
                              }`}
                            >
                              Pending Review ({pendingCount})
                            </button>
                          </div>
                        </div>

                        {/* Testimonial items list */}
                        {filtered.length === 0 ? (
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center text-slate-500 max-w-md mx-auto">
                            <Quote className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                            <h4 className="font-bold text-sm text-slate-700">No Testimonials Found</h4>
                            <p className="text-xs text-slate-500 mt-1">
                              {testimonialFilter === 'pending'
                                ? 'There are no pending testimonials awaiting administrative review.'
                                : testimonialFilter === 'published'
                                ? 'No testimonials are currently published in this category.'
                                : testimonialFilter === 'hidden'
                                ? 'No hidden testimonials found.'
                                : 'No testimonials match the selected filter.'}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {filtered.map((item) => (
                              <div
                                key={item.id}
                                className={`p-5 rounded-2xl border transition-all ${
                                  isItemPublished(item)
                                    ? 'bg-white border-emerald-200 shadow-xs'
                                    : isItemHidden(item)
                                    ? 'bg-slate-50/80 border-slate-200'
                                    : 'bg-amber-50/40 border-amber-300 shadow-sm'
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                  <div>
                                    <div className="flex items-center flex-wrap gap-2 mb-1">
                                      <h4 className="font-black text-sm text-[#0B132B]">
                                        {item.name}
                                      </h4>

                                      {/* Current Status Badge */}
                                      {isItemPublished(item) ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                                          <Check className="w-3 h-3 text-emerald-600" />
                                          <span>Published</span>
                                        </span>
                                      ) : isItemHidden(item) ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-200 border border-slate-300 px-2 py-0.5 rounded-full">
                                          <EyeOff className="w-3 h-3 text-slate-500" />
                                          <span>Hidden</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-900 bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-full">
                                          <Clock className="w-3 h-3 text-amber-600" />
                                          <span>Pending Review</span>
                                        </span>
                                      )}

                                      {item.service && (
                                        <span className="text-[10px] font-semibold text-lime-800 bg-lime-100 px-2 py-0.5 rounded-md">
                                          {item.service}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-slate-600 font-medium">
                                      {item.title && <span>{item.title}</span>}
                                      {item.title && item.organization && <span> &bull; </span>}
                                      {item.organization && <span className="font-bold text-slate-800">{item.organization}</span>}
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                                    {/* Rating Stars */}
                                    <div className="flex items-center gap-0.5">
                                      {[...Array(item.rating || 5)].map((_, i) => (
                                        <span key={i} className="text-amber-400 text-xs">★</span>
                                      ))}
                                    </div>

                                    {/* 3 Administrative Action Buttons: Publish, Hide, Delete */}
                                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                      {/* 1. Publish */}
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          try {
                                            await publishTestimonial(item.id);
                                            showNotice('success', `Testimonial from "${item.name}" is published on the website!`);
                                          } catch (e: any) {
                                            showNotice('error', e.message || 'Publish failed');
                                          }
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                                          isItemPublished(item)
                                            ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 hover:bg-emerald-700'
                                            : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-600 hover:text-white'
                                        }`}
                                        title={isItemPublished(item) ? 'Currently Published on website' : 'Publish: Make visible to website visitors'}
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        <span>{isItemPublished(item) ? 'Published' : 'Publish'}</span>
                                      </button>

                                      {/* 2. Hide */}
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          try {
                                            await hideTestimonial(item.id);
                                            showNotice('success', `Testimonial from "${item.name}" is now hidden from public view.`);
                                          } catch (e: any) {
                                            showNotice('error', e.message || 'Hide failed');
                                          }
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                                          isItemHidden(item)
                                            ? 'bg-slate-700 text-white ring-2 ring-slate-400 hover:bg-slate-800'
                                            : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 hover:text-slate-900'
                                        }`}
                                        title={isItemHidden(item) ? 'Currently Hidden from public view' : 'Hide: Remove from public view without deleting'}
                                      >
                                        <EyeOff className="w-3.5 h-3.5" />
                                        <span>{isItemHidden(item) ? 'Hidden' : 'Hide'}</span>
                                      </button>

                                      {/* 3. Delete */}
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          const confirmed = window.confirm(
                                            `Are you sure you want to permanently delete the testimonial from "${item.name}"?\n\nThis will permanently remove it from the database and website. This action cannot be undone.`
                                          );
                                          if (!confirmed) return;
                                          try {
                                            await deleteTestimonial(item.id);
                                            showNotice('success', `Testimonial from "${item.name}" has been permanently deleted.`);
                                          } catch (e: any) {
                                            showNotice('error', e.message || 'Delete failed');
                                          }
                                        }}
                                        className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                                        title="Delete: Permanently delete from database"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Full Quote */}
                                <blockquote className="text-xs sm:text-sm text-slate-800 italic bg-white/70 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed font-medium">
                                  &ldquo;{item.quote}&rdquo;
                                </blockquote>

                                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-200/60">
                                  <span>Submitted: {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recent'}</span>
                                  <span>ID: {item.id}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 13: VISITOR FEEDBACK - CONTENT MANAGEMENT */}
              {activeTab === 'feedback' && (
                <div>
                  {(() => {
                    const isItemPublished = (item: { isApproved: boolean; status?: string }) =>
                      item.isApproved === true || item.status === 'published' || item.status === 'approved';

                    const isItemHidden = (item: { isApproved: boolean; status?: string }) =>
                      !item.isApproved && (item.status === 'hidden' || item.status === 'rejected');

                    const isItemPending = (item: { isApproved: boolean; status?: string }) =>
                      !item.isApproved && item.status !== 'hidden' && item.status !== 'rejected';

                    const allCount = allFeedbackList.length;
                    const pendingCount = allFeedbackList.filter(isItemPending).length;
                    const publishedCount = allFeedbackList.filter(isItemPublished).length;
                    const hiddenCount = allFeedbackList.filter(isItemHidden).length;

                    const filtered = allFeedbackList.filter((item) => {
                      if (feedbackFilter === 'published') return isItemPublished(item);
                      if (feedbackFilter === 'hidden') return isItemHidden(item);
                      if (feedbackFilter === 'pending') return isItemPending(item);
                      return true;
                    });

                    return (
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
                          <div>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-lime-700 mb-1">
                              <span>Content Management</span>
                              <span>&bull;</span>
                              <span>Visitors Feedback</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#0B132B] flex items-center gap-2">
                              <MessageSquare className="w-5 h-5 text-lime-600" />
                              <span>Visitors Feedback Management</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                              Manage community suggestions and notes individually. Use the action buttons to <strong className="text-emerald-700">Publish</strong> to the website, <strong className="text-slate-700">Hide</strong> from public view, or permanently <strong className="text-rose-700">Delete</strong>.
                            </p>
                          </div>

                          {/* Filter buttons */}
                          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                            <button
                              type="button"
                              onClick={() => setFeedbackFilter('all')}
                              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                feedbackFilter === 'all'
                                  ? 'bg-[#0B132B] text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              All ({allCount})
                            </button>
                            <button
                              type="button"
                              onClick={() => setFeedbackFilter('published')}
                              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                feedbackFilter === 'published'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-emerald-800 hover:bg-emerald-100/60'
                              }`}
                            >
                              Published ({publishedCount})
                            </button>
                            <button
                              type="button"
                              onClick={() => setFeedbackFilter('hidden')}
                              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                feedbackFilter === 'hidden'
                                  ? 'bg-slate-700 text-white shadow-xs'
                                  : 'text-slate-700 hover:bg-slate-200/60'
                              }`}
                            >
                              Hidden ({hiddenCount})
                            </button>
                            <button
                              type="button"
                              onClick={() => setFeedbackFilter('pending')}
                              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                feedbackFilter === 'pending'
                                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                                  : 'text-amber-800 hover:bg-amber-100/60'
                              }`}
                            >
                              Pending Review ({pendingCount})
                            </button>
                          </div>
                        </div>

                        {/* Feedback items list */}
                        {filtered.length === 0 ? (
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center text-slate-500 max-w-md mx-auto">
                            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                            <h4 className="font-bold text-sm text-slate-700">No Feedback Submissions</h4>
                            <p className="text-xs text-slate-500 mt-1">
                              {feedbackFilter === 'pending'
                                ? 'There is no pending visitor feedback awaiting review.'
                                : feedbackFilter === 'published'
                                ? 'No visitor feedback entries are currently published.'
                                : feedbackFilter === 'hidden'
                                ? 'No hidden feedback entries found.'
                                : 'No submissions match the selected filter.'}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {filtered.map((item) => (
                              <div
                                key={item.id}
                                className={`p-5 rounded-2xl border transition-all ${
                                  isItemPublished(item)
                                    ? 'bg-white border-emerald-200 shadow-xs'
                                    : isItemHidden(item)
                                    ? 'bg-slate-50/80 border-slate-200'
                                    : 'bg-amber-50/40 border-amber-300 shadow-sm'
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                  <div>
                                    <div className="flex items-center flex-wrap gap-2 mb-1">
                                      <h4 className="font-black text-sm text-[#0B132B]">
                                        {item.name || 'Anonymous Visitor'}
                                      </h4>

                                      {/* Current Status Badge */}
                                      {isItemPublished(item) ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                                          <Check className="w-3 h-3 text-emerald-600" />
                                          <span>Published</span>
                                        </span>
                                      ) : isItemHidden(item) ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-200 border border-slate-300 px-2 py-0.5 rounded-full">
                                          <EyeOff className="w-3 h-3 text-slate-500" />
                                          <span>Hidden</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-900 bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-full">
                                          <Clock className="w-3 h-3 text-amber-600" />
                                          <span>Pending Review</span>
                                        </span>
                                      )}

                                      {item.category && (
                                        <span className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                                          {item.category}
                                        </span>
                                      )}
                                    </div>

                                    {/* Private email notice - shown exclusively to admin */}
                                    {item.email ? (
                                      <div className="text-xs text-slate-600 flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">
                                          Private Email (Admin Only)
                                        </span>
                                        <a
                                          href={`mailto:${item.email}`}
                                          className="font-mono text-xs text-[#0B132B] hover:underline"
                                        >
                                          {item.email}
                                        </a>
                                      </div>
                                    ) : (
                                      <span className="text-[11px] text-slate-400 italic">No email provided</span>
                                    )}
                                  </div>

                                  {/* 3 Administrative Action Buttons: Publish, Hide, Delete */}
                                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
                                    {/* 1. Publish */}
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        try {
                                          await publishFeedback(item.id);
                                          showNotice('success', `Feedback from "${item.name || 'Visitor'}" published to website!`);
                                        } catch (e: any) {
                                          showNotice('error', e.message || 'Publish failed');
                                        }
                                      }}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                                        isItemPublished(item)
                                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 hover:bg-emerald-700'
                                          : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-600 hover:text-white'
                                      }`}
                                      title={isItemPublished(item) ? 'Currently Published on website' : 'Publish: Make visible to website visitors'}
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>{isItemPublished(item) ? 'Published' : 'Publish'}</span>
                                    </button>

                                    {/* 2. Hide */}
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        try {
                                          await hideFeedback(item.id);
                                          showNotice('success', `Feedback from "${item.name || 'Visitor'}" is now hidden from public view.`);
                                        } catch (e: any) {
                                          showNotice('error', e.message || 'Hide failed');
                                        }
                                      }}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                                        isItemHidden(item)
                                          ? 'bg-slate-700 text-white ring-2 ring-slate-400 hover:bg-slate-800'
                                          : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 hover:text-slate-900'
                                      }`}
                                      title={isItemHidden(item) ? 'Currently Hidden from public view' : 'Hide: Remove from public view without deleting'}
                                    >
                                      <EyeOff className="w-3.5 h-3.5" />
                                      <span>{isItemHidden(item) ? 'Hidden' : 'Hide'}</span>
                                    </button>

                                    {/* 3. Delete */}
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        const confirmed = window.confirm(
                                          `Are you sure you want to permanently delete this feedback submission from "${item.name || 'Anonymous Visitor'}"?\n\nThis will permanently remove it from the database and website. This action cannot be undone.`
                                        );
                                        if (!confirmed) return;
                                        try {
                                          await deleteFeedback(item.id);
                                          showNotice('success', 'Feedback entry has been permanently deleted.');
                                        } catch (e: any) {
                                          showNotice('error', e.message || 'Delete failed');
                                        }
                                      }}
                                      className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                                      title="Delete: Permanently delete from database"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Feedback message */}
                                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-medium">
                                  {item.message}
                                </p>

                                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-200/60">
                                  <span>Submitted: {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recent'}</span>
                                  <span>ID: {item.id}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
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
                            showNotice('error', err.message || 'Upload failed');
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
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
              <h3 className="font-bold text-[#0B132B] text-base">Upload Gallery Photograph</h3>
              <button
                onClick={() => {
                  setGalleryModalOpen(false);
                  setGalleryUploadProgress(null);
                }}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingGallery.imageUrl) {
                  showNotice('error', 'Please select an image file first.');
                  return;
                }
                setIsProcessing(true);
                try {
                  await saveGalleryItem({
                    ...editingGallery,
                    isPublished: true,
                    order: galleryItems.length + 1,
                  });
                  setGalleryModalOpen(false);
                  setGalleryUploadProgress(null);
                  showNotice('success', 'Photograph successfully added to Agency Gallery!');
                } catch (err: any) {
                  showNotice('error', err.message || 'Failed to save gallery item.');
                } finally {
                  setIsProcessing(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block font-bold text-slate-800 mb-1">Select Photograph *</label>
                {editingGallery.imageUrl ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-2">
                    <img
                      src={editingGallery.imageUrl}
                      alt="Gallery Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-[#0B132B]/80 text-lime-400 text-[10px] font-bold px-2 py-0.5 rounded">
                      Ready to Publish
                    </span>
                  </div>
                ) : null}

                <input
                  type="file"
                  required={!editingGallery.imageUrl}
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      if (!f.type.startsWith('image/') && !/\.(jpe?g|png|webp|svg|heic|heif)$/i.test(f.name)) {
                        showNotice('error', 'Please select a valid image file from device (JPEG, PNG, WebP).');
                        e.target.value = '';
                        return;
                      }
                      setGalleryUploadProgress(20);
                      try {
                        const res = await uploadImageToStorage(f, 'gallery', (pct) => {
                          setGalleryUploadProgress(pct);
                        });
                        setEditingGallery((g) => ({
                          ...g,
                          imageUrl: res.downloadUrl,
                          imagePath: res.storagePath,
                          title: g.title || f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                        }));
                        setGalleryUploadProgress(null);
                        showNotice('success', 'Photograph processed and ready for permanent gallery publishing.');
                      } catch (uploadErr: any) {
                        showNotice('error', uploadErr.message || 'Image processing failed. Please try another file.');
                        setGalleryUploadProgress(null);
                      } finally {
                        e.target.value = '';
                      }
                    }
                  }}
                  className="w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0B132B] file:text-lime-400 hover:file:bg-slate-800 cursor-pointer"
                />

                {galleryUploadProgress !== null && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                      <span>Processing image...</span>
                      <span>{galleryUploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#84cc16] h-full transition-all duration-300"
                        style={{ width: `${galleryUploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                <p className="text-[10px] text-slate-500 mt-1">
                  Select any photo from your device gallery. Optimized for web delivery.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title / Caption</label>
                <input
                  type="text"
                  value={editingGallery.title || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                  placeholder="e.g. Creative team strategy session"
                  className="w-full border rounded-lg p-2.5 text-xs text-[#0B132B]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={editingGallery.category || 'Creative Production'}
                  onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                  placeholder="e.g. Studio, Events, Workshop, Creative Production"
                  className="w-full border rounded-lg p-2.5 text-xs text-[#0B132B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setGalleryModalOpen(false);
                    setGalleryUploadProgress(null);
                  }}
                  className="px-4 py-2 border rounded-lg font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || galleryUploadProgress !== null}
                  className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Saving to Firestore...' : 'Publish to Gallery'}
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

      {/* MODAL 10: VIDEO ADVERTISEMENT ("BRANDS IN MOTION") */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs my-auto max-h-[94vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-lime-100 text-lime-800 flex items-center justify-center">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0B132B] text-base">
                    {editingVideo.id ? 'Edit Video Advertisement' : 'Upload Video Advertisement'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Brands In Motion — Permanent Cloud Storage</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setVideoModalOpen(false);
                  setVideoUploadProgress(null);
                  setVideoThumbUploadProgress(null);
                }}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingVideo.videoUrl) {
                  showNotice('error', 'Please upload a video file or provide a valid video URL.');
                  return;
                }
                if (!editingVideo.title?.trim()) {
                  showNotice('error', 'Please provide a video title.');
                  return;
                }

                setIsProcessing(true);
                try {
                  await saveVideoAdvert({
                    ...editingVideo,
                    category: editingVideo.category || 'Promotional Campaign',
                    isPublished: editingVideo.isPublished ?? true,
                    order: editingVideo.order ?? videoAdverts.length + 1,
                  });
                  setVideoModalOpen(false);
                  setVideoUploadProgress(null);
                  setVideoThumbUploadProgress(null);
                  showNotice('success', editingVideo.id ? 'Video advertisement updated!' : 'Video advertisement published to Brands In Motion!');
                } catch (err: any) {
                  showNotice('error', err.message || 'Failed to save video advert.');
                } finally {
                  setIsProcessing(false);
                }
              }}
              className="space-y-4 overflow-y-auto pr-1 flex-1"
            >
              {/* Video Source Switcher */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Video Source *</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setVideoInputMode('file')}
                    className={`py-2 px-3 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
                      videoInputMode === 'file'
                        ? 'bg-[#0B132B] text-lime-400 border-[#0B132B]'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    📁 Upload From Device
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoInputMode('url')}
                    className={`py-2 px-3 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
                      videoInputMode === 'url'
                        ? 'bg-[#0B132B] text-lime-400 border-[#0B132B]'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    🔗 Web Video URL
                  </button>
                </div>

                {videoInputMode === 'file' ? (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime,.mp4,.webm,.mov,.m4v"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setVideoUploadProgress(10);
                          try {
                            // 1. Auto capture thumbnail from file
                            const autoThumb = await captureVideoThumbnail(file);

                            // 2. Upload video file to Firebase Storage
                            const result = await uploadVideoToStorage(file, 'videos', (pct) => {
                              setVideoUploadProgress(pct);
                            });

                            setEditingVideo((prev) => ({
                              ...prev,
                              videoUrl: result.downloadUrl,
                              videoPath: result.storagePath,
                              thumbnailUrl: prev.thumbnailUrl || autoThumb || '',
                              title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                            }));
                            setVideoUploadProgress(null);
                            showNotice('success', 'Video file uploaded and stored permanently in Firebase Storage.');
                          } catch (err: any) {
                            setVideoUploadProgress(null);
                            showNotice('error', err.message || 'Video upload failed. Please try an MP4 or WebM file.');
                          } finally {
                            e.target.value = '';
                          }
                        }
                      }}
                      className="w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0B132B] file:text-lime-400 hover:file:bg-slate-800 cursor-pointer"
                    />

                    {videoUploadProgress !== null && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-600 font-bold">
                          <span>Uploading video to Cloud Storage...</span>
                          <span>{videoUploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#84cc16] h-full transition-all duration-300"
                            style={{ width: `${videoUploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-500">
                      Supports MP4, WebM, MOV. Up to 150MB. Uploads are stored permanently in Cloud Storage.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="url"
                      placeholder="https://example.com/commercial-advert.mp4"
                      value={editingVideo.videoUrl || ''}
                      onChange={(e) => setEditingVideo({ ...editingVideo, videoUrl: e.target.value })}
                      className="w-full border rounded-lg p-2.5 text-xs text-[#0B132B]"
                    />
                    <p className="text-[10px] text-slate-500">
                      Enter a direct link to an MP4 or WebM video stream.
                    </p>
                  </div>
                )}
              </div>

              {/* Video Player Preview if URL is set */}
              {editingVideo.videoUrl && (
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-800">Video Preview</label>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-300">
                    <video
                      src={editingVideo.videoUrl}
                      poster={editingVideo.thumbnailUrl}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Custom Thumbnail Selection */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Video Thumbnail / Poster Image</label>
                {editingVideo.thumbnailUrl && (
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200 mb-2">
                    <img
                      src={editingVideo.thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingVideo({ ...editingVideo, thumbnailUrl: '', thumbnailPath: '' })}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded p-0.5 text-[9px]"
                      title="Remove custom thumbnail"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setVideoThumbUploadProgress(15);
                        try {
                          const res = await uploadImageToStorage(file, 'video_thumbnails', (pct) => {
                            setVideoThumbUploadProgress(pct);
                          });
                          setEditingVideo((prev) => ({
                            ...prev,
                            thumbnailUrl: res.downloadUrl,
                            thumbnailPath: res.storagePath,
                          }));
                          setVideoThumbUploadProgress(null);
                          showNotice('success', 'Custom video thumbnail saved.');
                        } catch (err: any) {
                          setVideoThumbUploadProgress(null);
                          showNotice('error', err.message || 'Failed to upload thumbnail.');
                        } finally {
                          e.target.value = '';
                        }
                      }
                    }}
                    className="w-full text-xs file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
                  />
                </div>
                {videoThumbUploadProgress !== null && (
                  <p className="text-[10px] text-lime-700 mt-1 font-bold">Uploading thumbnail: {videoThumbUploadProgress}%</p>
                )}
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Optional. If empty, an automated frame is extracted or a default poster is used.
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Advert Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next-Gen Tech Commercial Advert"
                  value={editingVideo.title || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-xs text-[#0B132B] font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Advert Synopsis / Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the campaign, message, client focus, or promotional narrative..."
                  value={editingVideo.description || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-xs text-[#0B132B]"
                />
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Category</label>
                  <select
                    value={editingVideo.category || 'Promotional Campaign'}
                    onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                    className="w-full border rounded-lg p-2.5 text-xs text-[#0B132B] bg-white"
                  >
                    {VIDEO_ADVERT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Duration (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 0:30, 1:15"
                    value={editingVideo.duration || ''}
                    onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                    className="w-full border rounded-lg p-2.5 text-xs text-[#0B132B]"
                  />
                </div>
              </div>

              {/* Checkboxes: Published & Featured */}
              <div className="flex flex-wrap items-center gap-6 pt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editingVideo.isPublished ?? true}
                    onChange={(e) => setEditingVideo({ ...editingVideo, isPublished: e.target.checked })}
                    className="rounded text-lime-600 focus:ring-lime-500 w-4 h-4"
                  />
                  <span>Publish immediately on website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editingVideo.featured ?? false}
                    onChange={(e) => setEditingVideo({ ...editingVideo, featured: e.target.checked })}
                    className="rounded text-lime-600 focus:ring-lime-500 w-4 h-4"
                  />
                  <span>Mark as Featured Campaign</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setVideoModalOpen(false);
                    setVideoUploadProgress(null);
                    setVideoThumbUploadProgress(null);
                  }}
                  className="px-4 py-2 border rounded-lg font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || videoUploadProgress !== null}
                  className="bg-[#84cc16] hover:bg-[#65a30d] text-[#0B132B] font-bold px-5 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isProcessing ? 'Saving to Firestore...' : editingVideo.id ? 'Update Video Advert' : 'Save & Publish Advert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADMIN VIDEO PREVIEW PLAYER */}
      {previewVideoItem && (
        <div className="fixed inset-0 z-70 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B132B] rounded-2xl max-w-2xl w-full p-4 border border-slate-800 text-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-lime-400" />
                <h4 className="font-bold text-sm text-white truncate max-w-md">
                  {previewVideoItem.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewVideoItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-3">
              <video
                src={previewVideoItem.videoUrl}
                poster={previewVideoItem.thumbnailUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-xs text-slate-300">
              <span className="font-bold text-lime-400">{previewVideoItem.category}</span>
              <p className="mt-1 line-clamp-2">{previewVideoItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
