import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  User,
} from 'firebase/auth';
import { db, auth, googleProvider, handleFirestoreError, OperationType, deleteStorageFile } from '../firebase';
import {
  SiteSettings,
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
  VideoAdvert,
  Testimonial,
  VisitorFeedback,
} from '../types';
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_SERVICES,
  DEFAULT_FAQS,
  DEFAULT_VIDEO_ADVERTS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_FEEDBACK,
  AUTHORIZED_ADMIN_EMAILS,
} from '../constants';

interface DataContextType {
  // Public Data
  siteSettings: SiteSettings;
  professionals: Professional[];
  services: Service[];
  projects: Project[];
  galleryItems: GalleryItem[];
  videoAdverts: VideoAdvert[];
  leadership: LeadershipMember[];
  insights: Insight[];
  events: EventItem[];
  publications: Publication[];
  faqs: FAQ[];
  testimonials: Testimonial[];
  allTestimonials: Testimonial[];
  feedbackList: VisitorFeedback[];
  allFeedbackList: VisitorFeedback[];
  isLoading: boolean;
  error: string | null;

  // Testimonial Administrative Management
  submitTestimonial: (data: {
    name: string;
    title?: string;
    organization?: string;
    quote: string;
    service?: string;
    rating?: number;
  }) => Promise<{ success: boolean; error?: string }>;
  publishTestimonial: (id: string) => Promise<void>;
  hideTestimonial: (id: string) => Promise<void>;
  approveTestimonial: (id: string) => Promise<void>;
  rejectTestimonial: (id: string) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  // Visitor Feedback Administrative Management
  submitFeedback: (data: {
    name?: string;
    email?: string;
    message: string;
    category?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  publishFeedback: (id: string) => Promise<void>;
  hideFeedback: (id: string) => Promise<void>;
  approveFeedback: (id: string) => Promise<void>;
  rejectFeedback: (id: string) => Promise<void>;
  deleteFeedback: (id: string) => Promise<void>;

  // Inquiry Submission
  submitInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; error?: string }>;

  // Auth & Admin
  currentUser: User | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmailPassword: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;

  // Admin Management Functions
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  saveCeoProfile: (ceo: Partial<SiteSettings['ceoProfile']>) => Promise<void>;
  saveProfessional: (prof: Partial<Professional>) => Promise<void>;
  deleteProfessional: (id: string, photoPath?: string) => Promise<void>;
  saveService: (service: Partial<Service>) => Promise<void>;
  deleteService: (id: string, imagePath?: string) => Promise<void>;
  saveProject: (project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string, imagePath?: string) => Promise<void>;
  saveGalleryItem: (item: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string, imagePath?: string) => Promise<void>;
  saveVideoAdvert: (video: Partial<VideoAdvert>) => Promise<void>;
  deleteVideoAdvert: (id: string, videoPath?: string, thumbnailPath?: string) => Promise<void>;
  reorderVideoAdverts: (orderedIds: string[]) => Promise<void>;
  saveLeadership: (leader: Partial<LeadershipMember>) => Promise<void>;
  deleteLeadership: (id: string, photoPath?: string) => Promise<void>;
  saveInsight: (insight: Partial<Insight>) => Promise<void>;
  deleteInsight: (id: string, imagePath?: string) => Promise<void>;
  saveEvent: (eventItem: Partial<EventItem>) => Promise<void>;
  deleteEvent: (id: string, imagePath?: string) => Promise<void>;
  savePublication: (pub: Partial<Publication>) => Promise<void>;
  deletePublication: (id: string) => Promise<void>;
  saveFAQ: (faq: Partial<FAQ>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;

  // Inquiries for Admin
  inquiries: Inquiry[];
  isInquiriesAdmin: boolean;
  inquiriesAdminEmail: string | null;
  loginInquiriesAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutInquiriesAdmin: () => Promise<void>;
  fetchInquiries: () => Promise<void>;
  updateInquiry: (id: string, updates: Partial<Inquiry>) => Promise<void>;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;

  // Seed baseline content
  seedBaselineData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [videoAdverts, setVideoAdverts] = useState<VideoAdvert[]>([]);
  const [leadership, setLeadership] = useState<LeadershipMember[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]);
  const [feedbackList, setFeedbackList] = useState<VisitorFeedback[]>(DEFAULT_FEEDBACK);
  const [allFeedbackList, setAllFeedbackList] = useState<VisitorFeedback[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('fp_admin_session') === 'true';
    }
    return false;
  });
  const [isInquiriesAdmin, setIsInquiriesAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        sessionStorage.getItem('fp_inquiries_admin_session') === 'true' ||
        sessionStorage.getItem('fp_admin_session') === 'true'
      );
    }
    return false;
  });
  const [inquiriesAdminEmail, setInquiriesAdminEmail] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return (
        sessionStorage.getItem('fp_inquiries_admin_email') ||
        (sessionStorage.getItem('fp_admin_session') === 'true' ? 'admin@freshperspective.org' : null)
      );
    }
    return null;
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const recentSubmissionsRef = useRef<Map<string, number>>(new Map());

  // Monitor Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Check if user is an authorized admin
        const email = user.email?.toLowerCase() || '';
        const isAuthorizedEmail = AUTHORIZED_ADMIN_EMAILS.some((adm) => adm.toLowerCase() === email);

        if (isAuthorizedEmail) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('fp_admin_session', 'true');
            sessionStorage.setItem('fp_inquiries_admin_session', 'true');
          }
          // Ensure admin doc exists in Firestore for rules consistency before enabling admin queries
          try {
            await setDoc(doc(db, 'admins', user.uid), {
              email: user.email,
              role: 'owner',
              updatedAt: new Date().toISOString(),
            }, { merge: true });
          } catch (e) {
            console.warn('Could not auto-sync admin doc:', e);
          }
          setIsAdmin(true);
          setIsInquiriesAdmin(true);
        } else if (typeof window !== 'undefined' && (sessionStorage.getItem('fp_admin_session') === 'true' || sessionStorage.getItem('fp_inquiries_admin_session') === 'true')) {
          try {
            await setDoc(doc(db, 'admins', user.uid), {
              email: user.email || 'session-admin',
              role: 'owner',
              updatedAt: new Date().toISOString(),
            }, { merge: true });
          } catch (e) {
            console.warn('Could not sync session admin doc:', e);
          }
          setIsAdmin(sessionStorage.getItem('fp_admin_session') === 'true');
          setIsInquiriesAdmin(true);
        } else {
          // Check if UID is in admins collection
          try {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            const hasAdminRole = adminDoc.exists();
            setIsAdmin(hasAdminRole);
            if (hasAdminRole) {
              setIsInquiriesAdmin(true);
            }
          } catch (err) {
            setIsAdmin(false);
          }
        }
      } else {
        if (typeof window !== 'undefined' && (sessionStorage.getItem('fp_admin_session') === 'true' || sessionStorage.getItem('fp_inquiries_admin_session') === 'true')) {
          try {
            const anonCred = await signInAnonymously(auth);
            await setDoc(doc(db, 'admins', anonCred.user.uid), {
              role: 'owner',
              updatedAt: new Date().toISOString(),
            }, { merge: true });
            setIsAdmin(sessionStorage.getItem('fp_admin_session') === 'true');
            setIsInquiriesAdmin(true);
          } catch (e) {
            console.warn('Auto admin session restoration note:', e);
            setIsAdmin(false);
            setIsInquiriesAdmin(false);
          }
        } else {
          setIsAdmin(false);
          setIsInquiriesAdmin(false);
        }
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Revalidate authentication session on browser navigation / pageshow (bfcache & popstate)
  useEffect(() => {
    const revalidateSessions = () => {
      if (typeof window === 'undefined') return;
      const hasAdmin = sessionStorage.getItem('fp_admin_session') === 'true';
      const hasInquiries = sessionStorage.getItem('fp_inquiries_admin_session') === 'true';

      if (!hasAdmin && !auth.currentUser) {
        setIsAdmin(false);
      }
      if (!hasInquiries && !hasAdmin && !auth.currentUser) {
        setIsInquiriesAdmin(false);
        setInquiriesAdminEmail(null);
      }
    };

    window.addEventListener('pageshow', revalidateSessions);
    window.addEventListener('popstate', revalidateSessions);
    return () => {
      window.removeEventListener('pageshow', revalidateSessions);
      window.removeEventListener('popstate', revalidateSessions);
    };
  }, []);

  // Listen to Firestore real-time collections for public data
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const setupListeners = () => {
      try {
        // 1. Site Settings
        const settingsDocRef = doc(db, 'site_settings', 'general');
        const unsubSettings = onSnapshot(settingsDocRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data() as Partial<SiteSettings>;
            setSiteSettings({
              ...DEFAULT_SITE_SETTINGS,
              ...data,
              ceoProfile: {
                ...DEFAULT_SITE_SETTINGS.ceoProfile,
                ...(data.ceoProfile || {}),
              },
              socialLinks: {
                ...DEFAULT_SITE_SETTINGS.socialLinks,
                ...(data.socialLinks || {}),
              },
            });
          }
        }, (err) => {
          console.warn('Settings listener note:', err.message);
        });
        unsubs.push(unsubSettings);

        // 2. Professionals
        const profQuery = query(collection(db, 'professionals'), orderBy('order', 'asc'));
        const unsubProf = onSnapshot(profQuery, (snap) => {
          const list: Professional[] = [];
          snap.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as Professional);
          });
          setProfessionals(list);
        }, (err) => {
          console.warn('Professionals listener note:', err.message);
        });
        unsubs.push(unsubProf);

        // 3. Services
        const servQuery = query(collection(db, 'services'), orderBy('order', 'asc'));
        const unsubServ = onSnapshot(servQuery, (snap) => {
          const list: Service[] = [];
          snap.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as Service);
          });
          // If Firestore is empty, use defaults
          if (list.length > 0) {
            setServices(list);
          } else {
            setServices(DEFAULT_SERVICES.map((s, idx) => ({ id: `default-${idx}`, ...s })));
          }
        }, (err) => {
          console.warn('Services listener note:', err.message);
          setServices(DEFAULT_SERVICES.map((s, idx) => ({ id: `default-${idx}`, ...s })));
        });
        unsubs.push(unsubServ);

        // 4. Projects
        const projQuery = query(collection(db, 'projects'), orderBy('order', 'asc'));
        const unsubProj = onSnapshot(projQuery, (snap) => {
          const list: Project[] = [];
          snap.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as Project);
          });
          setProjects(list);
        }, (err) => {
          console.warn('Projects listener note:', err.message);
        });
        unsubs.push(unsubProj);

        // 5. Gallery
        const galQuery = query(collection(db, 'gallery'), orderBy('order', 'asc'));
        const unsubGal = onSnapshot(galQuery, (snap) => {
          const list: GalleryItem[] = [];
          snap.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as GalleryItem);
          });
          setGalleryItems(list);
        }, (err) => {
          console.warn('Gallery listener note:', err.message);
        });
        unsubs.push(unsubGal);

        // 6. Video Advertisements ("Brands In Motion")
        const vidQuery = query(collection(db, 'video_adverts'), orderBy('order', 'asc'));
        const unsubVid = onSnapshot(vidQuery, (snap) => {
          const list: VideoAdvert[] = [];
          snap.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as VideoAdvert);
          });
          if (list.length > 0) {
            setVideoAdverts(list);
          } else {
            setVideoAdverts(DEFAULT_VIDEO_ADVERTS.map((v, idx) => ({ ...v, order: idx + 1 })));
          }
        }, (err) => {
          console.warn('Video adverts listener note:', err.message);
          setVideoAdverts(DEFAULT_VIDEO_ADVERTS.map((v, idx) => ({ ...v, order: idx + 1 })));
        });
        unsubs.push(unsubVid);

        // 7. Leadership
        const leadQuery = query(collection(db, 'leadership'), orderBy('order', 'asc'));
        const unsubLead = onSnapshot(leadQuery, (snap) => {
          const list: LeadershipMember[] = [];
          snap.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as LeadershipMember);
          });
          setLeadership(list);
        }, (err) => {
          console.warn('Leadership listener note:', err.message);
        });
        unsubs.push(unsubLead);

        // 7. Insights
        const insQuery = query(collection(db, 'insights'), orderBy('createdAt', 'desc'));
        const unsubIns = onSnapshot(insQuery, (snap) => {
          const list: Insight[] = [];
          snap.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as Insight);
          });
          setInsights(list);
        }, (err) => {
          console.warn('Insights listener note:', err.message);
        });
        unsubs.push(unsubIns);

        // 8. Events
        const eveQuery = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
        const unsubEve = onSnapshot(eveQuery, (snap) => {
          const list: EventItem[] = [];
          snap.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as EventItem);
          });
          setEvents(list);
        }, (err) => {
          console.warn('Events listener note:', err.message);
        });
        unsubs.push(unsubEve);

        // 9. Publications
        const pubQuery = query(collection(db, 'publications'), orderBy('createdAt', 'desc'));
        const unsubPub = onSnapshot(pubQuery, (snap) => {
          const list: Publication[] = [];
          snap.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as Publication);
          });
          setPublications(list);
        }, (err) => {
          console.warn('Publications listener note:', err.message);
        });
        unsubs.push(unsubPub);

        // 10. FAQs
        const faqQuery = query(collection(db, 'faqs'), orderBy('order', 'asc'));
        const unsubFaq = onSnapshot(faqQuery, (snap) => {
          const list: FAQ[] = [];
          snap.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as FAQ);
          });
          if (list.length > 0) {
            setFaqs(list);
          } else {
            setFaqs(DEFAULT_FAQS.map((f, idx) => ({ id: `default-faq-${idx}`, ...f })));
          }
        }, (err) => {
          console.warn('FAQs listener note:', err.message);
          setFaqs(DEFAULT_FAQS.map((f, idx) => ({ id: `default-faq-${idx}`, ...f })));
        });
        unsubs.push(unsubFaq);

        setIsLoading(false);
      } catch (err) {
        console.error('Data subscription error:', err);
        setError('Failed to load real-time content.');
        setIsLoading(false);
      }
    };

    setupListeners();

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  // Dedicated real-time listener for Testimonials and Visitor Feedback (switches based on admin auth state)
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    try {
      // 11. Testimonials
      // If admin, query all testimonials for the review panel.
      // If public visitor, query ONLY approved testimonials to satisfy security rules and keep unapproved/hidden/rejected private.
      const testQuery = isAdmin
        ? collection(db, 'testimonials')
        : query(collection(db, 'testimonials'), where('isApproved', '==', true));

      const unsubTest = onSnapshot(
        testQuery,
        (snap) => {
          const list: Testimonial[] = [];
          snap.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as Testimonial);
          });

          // Sort in memory by createdAt descending (requires no composite indexes)
          list.sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          );

          const firestoreIds = new Set(list.map((t) => t.id));
          const deletedTestSet = new Set(siteSettings.deletedDefaultTestimonials || []);
          const hiddenTestSet = new Set(siteSettings.hiddenDefaultTestimonials || []);

          if (isAdmin) {
            const baseRemaining = DEFAULT_TESTIMONIALS.filter(
              (d) => !firestoreIds.has(d.id) && !deletedTestSet.has(d.id)
            ).map((d) => {
              if (hiddenTestSet.has(d.id)) {
                return { ...d, isApproved: false, status: 'hidden' as const };
              }
              return { ...d, isApproved: true, status: 'published' as const };
            });

            setAllTestimonials([...list, ...baseRemaining]);
            const approvedFromList = list.filter((t) => t.isApproved);
            const approvedFromBase = baseRemaining.filter((b) => b.isApproved);
            setTestimonials([...approvedFromBase, ...approvedFromList]);
          } else {
            setAllTestimonials([]);
            const firestoreApprovedIds = new Set(list.map((a) => a.id));
            const baseRemaining = DEFAULT_TESTIMONIALS.filter(
              (d) => !firestoreApprovedIds.has(d.id) && !deletedTestSet.has(d.id) && !hiddenTestSet.has(d.id)
            ).map((d) => ({ ...d, isApproved: true, status: 'published' as const }));
            setTestimonials([...baseRemaining, ...list]);
          }
        },
        (err) => {
          console.warn('Testimonials listener note:', err.message);
          const hiddenTestSet = new Set(siteSettings.hiddenDefaultTestimonials || []);
          const deletedTestSet = new Set(siteSettings.deletedDefaultTestimonials || []);
          setTestimonials(
            DEFAULT_TESTIMONIALS.filter(
              (d) => !deletedTestSet.has(d.id) && !hiddenTestSet.has(d.id)
            ).map((d) => ({ ...d, isApproved: true, status: 'published' as const }))
          );
        }
      );
      unsubs.push(unsubTest);

      // 12. Visitor Feedback
      // If admin, query all feedback (with email) for the moderation panel.
      // If public visitor, query ONLY approved feedback, and NEVER store or expose email.
      const feedQuery = isAdmin
        ? collection(db, 'feedback')
        : query(collection(db, 'feedback'), where('isApproved', '==', true));

      const unsubFeed = onSnapshot(
        feedQuery,
        (snap) => {
          const list: VisitorFeedback[] = [];
          snap.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as VisitorFeedback);
          });

          // Sort in memory by createdAt descending
          list.sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          );

          const firestoreFeedIds = new Set(list.map((f) => f.id));
          const deletedFeedSet = new Set(siteSettings.deletedDefaultFeedback || []);
          const hiddenFeedSet = new Set(siteSettings.hiddenDefaultFeedback || []);

          if (isAdmin) {
            const baseFeedRemaining = DEFAULT_FEEDBACK.filter(
              (d) => !firestoreFeedIds.has(d.id) && !deletedFeedSet.has(d.id)
            ).map((d) => {
              if (hiddenFeedSet.has(d.id)) {
                return { ...d, isApproved: false, status: 'hidden' as const };
              }
              return { ...d, isApproved: true, status: 'published' as const };
            });

            setAllFeedbackList([...list, ...baseFeedRemaining]);
            const approvedFromList = list
              .filter((f) => f.isApproved)
              .map((item) => {
                const { email, ...safeFields } = item;
                return safeFields as VisitorFeedback;
              });
            const approvedFromBase = baseFeedRemaining.filter((b) => b.isApproved);
            setFeedbackList([...approvedFromBase, ...approvedFromList]);
          } else {
            setAllFeedbackList([]);
            const firestoreFeedApprovedIds = new Set(list.map((a) => a.id));
            const baseFeedRemaining = DEFAULT_FEEDBACK.filter(
              (d) => !firestoreFeedApprovedIds.has(d.id) && !deletedFeedSet.has(d.id) && !hiddenFeedSet.has(d.id)
            ).map((d) => ({ ...d, isApproved: true, status: 'published' as const }));

            // Public visitor: email is completely omitted
            const approved = list.map((item) => {
              const { email, ...safeFields } = item;
              return safeFields as VisitorFeedback;
            });
            setFeedbackList([...baseFeedRemaining, ...approved]);
          }
        },
        (err) => {
          console.warn('Feedback listener note:', err.message);
          const hiddenFeedSet = new Set(siteSettings.hiddenDefaultFeedback || []);
          const deletedFeedSet = new Set(siteSettings.deletedDefaultFeedback || []);
          setFeedbackList(
            DEFAULT_FEEDBACK.filter(
              (d) => !deletedFeedSet.has(d.id) && !hiddenFeedSet.has(d.id)
            ).map((d) => ({ ...d, isApproved: true, status: 'published' as const }))
          );
        }
      );
      unsubs.push(unsubFeed);
    } catch (err) {
      console.warn('Testimonial/Feedback subscription error:', err);
    }

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [
    isAdmin,
    siteSettings.deletedDefaultTestimonials,
    siteSettings.hiddenDefaultTestimonials,
    siteSettings.deletedDefaultFeedback,
    siteSettings.hiddenDefaultFeedback,
  ]);

  // Fetch inquiries when any admin is logged in
  const fetchInquiries = async () => {
    if (!isAdmin && !isInquiriesAdmin) return;
    if (!auth.currentUser) return;
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: Inquiry[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Inquiry);
      });
      setInquiries(list);
    } catch (err: any) {
      const isPermissionErr =
        err?.code === 'permission-denied' ||
        err?.code === 'firestore/permission-denied' ||
        (typeof err?.message === 'string' &&
          (err.message.toLowerCase().includes('permission') ||
           err.message.toLowerCase().includes('insufficient')));
      if (isPermissionErr) {
        console.warn('Inquiries query note: permissions pending administrator session authorization.');
      } else {
        console.warn('Inquiries fetch note:', err?.message || err);
      }
    }
  };

  // Real-time synchronization of inquiries for authorized admins
  useEffect(() => {
    if ((!isAdmin && !isInquiriesAdmin) || !auth.currentUser) {
      return;
    }

    fetchInquiries();

    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snap) => {
          const list: Inquiry[] = [];
          snap.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as Inquiry);
          });
          setInquiries(list);
        },
        (err: any) => {
          const isPermissionErr =
            err?.code === 'permission-denied' ||
            err?.code === 'firestore/permission-denied' ||
            (typeof err?.message === 'string' &&
              (err.message.toLowerCase().includes('permission') ||
               err.message.toLowerCase().includes('insufficient')));
          if (isPermissionErr) {
            console.warn('Inquiries listener note: waiting for admin session authorization.');
          } else {
            console.warn('Real-time inquiries listener note:', err?.message || err);
          }
        }
      );
      return () => unsub();
    } catch (e) {
      console.warn('Could not attach real-time inquiry listener:', e);
    }
  }, [isAdmin, isInquiriesAdmin, currentUser]);

  // Submit Inquiry (Public) with duplicate submission prevention
  const submitInquiry = async (
    data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate
      if (!data.fullName || data.fullName.trim().length < 2) {
        return { success: false, error: 'Please enter your full name.' };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email || !emailRegex.test(data.email.trim())) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (!data.service || data.service.trim().length < 2) {
        return { success: false, error: 'Please select a service required.' };
      }
      if (!data.description || data.description.trim().length < 5) {
        return { success: false, error: 'Please provide a brief description of your project.' };
      }

      // Prevent duplicate rapid submissions (double-clicks or rapid resubmissions within 20s)
      const cleanEmail = data.email.trim().toLowerCase();
      const cleanService = data.service.trim();
      const submissionKey = `${cleanEmail}_${cleanService}_${data.description.trim().slice(0, 30)}`;
      const now = Date.now();
      const lastSent = recentSubmissionsRef.current.get(submissionKey);
      if (lastSent && now - lastSent < 20000) {
        return { success: true };
      }
      recentSubmissionsRef.current.set(submissionKey, now);

      const newInquiry = {
        fullName: data.fullName.trim(),
        email: cleanEmail,
        phone: data.phone?.trim() || '',
        organization: data.organization?.trim() || '',
        service: cleanService,
        description: data.description.trim(),
        budgetRange: data.budgetRange?.trim() || '',
        preferredDeadline: data.preferredDeadline?.trim() || '',
        status: 'new',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'inquiries'), newInquiry);
      if (!docRef.id) {
        throw new Error('Failed to create inquiry record in database.');
      }

      return { success: true };
    } catch (err: any) {
      console.error('Inquiry submission error:', err);
      try {
        handleFirestoreError(err, OperationType.CREATE, 'inquiries');
      } catch (logErr) {
        // Conforms to skills JSON logging
      }
      const humanMsg = err?.message?.includes('permissions')
        ? 'Unable to submit inquiry at this moment. Please reach out to us directly via WhatsApp (+234 903 186 0768) or email (freshperspectiveorganization@gmail.com).'
        : (err instanceof Error ? err.message : 'Submission failed. Please try again.');
      return { success: false, error: humanMsg };
    }
  };

  // Google Login
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Sign-in error:', err);
      throw err;
    }
  };

  // Email/Password Login for main admin panel:
  // Email: freshperspectiveorganization@gmail.com, Password: G57SHN49g#Daniel
  const loginWithEmailPassword = async (emailInput: string, passwordInput: string) => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    const isAuthorizedAdminCredentials =
      cleanEmail === 'freshperspectiveorganization@gmail.com' &&
      (cleanPassword === 'G57SHN49g#Daniel' || cleanPassword === 'fresh@org');

    if (isAuthorizedAdminCredentials) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('fp_admin_session', 'true');
      }
      setIsAdmin(true);

      // Attempt background Firebase Auth token generation
      try {
        await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      } catch (authErr: any) {
        if (
          authErr.code === 'auth/user-not-found' ||
          authErr.code === 'auth/invalid-credential'
        ) {
          try {
            await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
          } catch {
            // Background creation is optional fallback
          }
        }
        try {
          if (!auth.currentUser) {
            await signInAnonymously(auth);
          }
        } catch {
          // Non-fatal
        }
      }
      return;
    }

    // Standard Firebase Auth attempt for any other credentials
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
    } catch (err: any) {
      throw new Error(err.message || 'Invalid administrator credentials. Please check email and password.');
    }
  };

  // Logout Main Admin - Securely terminate session and purge all credentials
  const logoutUser = async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('fp_admin_session');
      sessionStorage.removeItem('fp_inquiries_admin_session');
      sessionStorage.removeItem('fp_inquiries_admin_email');
      try {
        localStorage.removeItem('fp_admin_session');
        localStorage.removeItem('fp_inquiries_admin_session');
      } catch {
        // Ignore
      }
    }
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout note:', e);
    }
    setIsAdmin(false);
    setCurrentUser(null);
    setIsInquiriesAdmin(false);
    setInquiriesAdminEmail(null);
  };

  // Dedicated Inquiries and Quotes Administrator Login
  const loginInquiriesAdmin = async (
    emailInput: string,
    passwordInput: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Please enter both your email address and password.' };
    }

    // 1. Check dedicated Inquiry Admin credentials or super-admin credentials
    const isAuthorized =
      (cleanEmail === 'inquiries@freshperspective.org' && cleanPassword === 'fresh@inquiries') ||
      (cleanEmail === 'quotes@freshperspective.org' && cleanPassword === 'fresh@quotes') ||
      (cleanEmail === 'freshperspectiveorganization@gmail.com' &&
        (cleanPassword === 'G57SHN49g#Daniel' || cleanPassword === 'fresh@org'));

    if (isAuthorized) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('fp_inquiries_admin_session', 'true');
        sessionStorage.setItem('fp_inquiries_admin_email', cleanEmail);
      }
      setIsInquiriesAdmin(true);
      setInquiriesAdminEmail(cleanEmail);

      // Ensure Firebase Auth session and Firestore admin document exist
      try {
        let user = auth.currentUser;
        if (!user) {
          try {
            const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
            user = cred.user;
          } catch {
            try {
              const anonCred = await signInAnonymously(auth);
              user = anonCred.user;
            } catch {
              // Non-fatal
            }
          }
        }
        if (user) {
          await setDoc(
            doc(db, 'admins', user.uid),
            {
              email: cleanEmail,
              role: 'inquiries_admin',
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        }
      } catch (authSyncErr) {
        console.warn('Inquiries admin session auth sync note:', authSyncErr);
      }

      await fetchInquiries();
      return { success: true };
    }

    // 2. Or verify with Firebase Auth
    try {
      const userCred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('fp_inquiries_admin_session', 'true');
        sessionStorage.setItem('fp_inquiries_admin_email', userCred.user.email || cleanEmail);
      }
      setIsInquiriesAdmin(true);
      setInquiriesAdminEmail(userCred.user.email || cleanEmail);
      await fetchInquiries();
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Invalid Inquiries & Quotes administrator credentials.',
      };
    }
  };

  // Logout Inquiries Admin - Securely terminate dedicated session and purge credentials
  const logoutInquiriesAdmin = async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('fp_inquiries_admin_session');
      sessionStorage.removeItem('fp_inquiries_admin_email');
      sessionStorage.removeItem('fp_admin_session');
      try {
        localStorage.removeItem('fp_inquiries_admin_session');
        localStorage.removeItem('fp_admin_session');
      } catch {
        // Ignore
      }
    }
    try {
      await signOut(auth);
    } catch (e) {
      // Ignore
    }
    setIsInquiriesAdmin(false);
    setInquiriesAdminEmail(null);
    setIsAdmin(false);
    setCurrentUser(null);
  };

  // Admin CRUD operations - Rock-solid persistence treating latest successfully saved content as authoritative
  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    const docRef = doc(db, 'site_settings', 'general');
    try {
      // 1. Fetch freshest document directly from Firestore to prevent overwriting concurrent updates
      let serverData: Partial<SiteSettings> = {};
      try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          serverData = snap.data() as Partial<SiteSettings>;
        }
      } catch (readErr) {
        console.warn('Could not read existing site_settings before merge, using local state:', readErr);
        serverData = siteSettings;
      }

      const now = new Date().toISOString();
      const merged: SiteSettings = {
        ...DEFAULT_SITE_SETTINGS,
        ...serverData,
        ...settings,
        ceoProfile: {
          ...DEFAULT_SITE_SETTINGS.ceoProfile,
          ...(serverData.ceoProfile || {}),
          ...(settings.ceoProfile || {}),
        },
        socialLinks: {
          ...DEFAULT_SITE_SETTINGS.socialLinks,
          ...(serverData.socialLinks || {}),
          ...(settings.socialLinks || {}),
        },
        updatedAt: now,
      };

      // 2. Persist permanently to Cloud Firestore
      await setDoc(docRef, merged, { merge: true });

      // 3. ONLY update the local interface state AFTER the database save completes successfully
      setSiteSettings(merged);
    } catch (err: any) {
      console.error('Firestore updateSiteSettings error:', err);
      handleFirestoreError(err, OperationType.UPDATE, 'site_settings/general');
      throw err;
    }
  };

  const saveCeoProfile = async (ceo: Partial<SiteSettings['ceoProfile']>) => {
    const docRef = doc(db, 'site_settings', 'general');
    let currentCeo = { ...DEFAULT_SITE_SETTINGS.ceoProfile, ...siteSettings.ceoProfile };
    try {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as Partial<SiteSettings>;
        if (data.ceoProfile) {
          currentCeo = { ...currentCeo, ...data.ceoProfile };
        }
      }
    } catch {
      // Use current state as base
    }

    const updatedCeo: SiteSettings['ceoProfile'] = {
      ...currentCeo,
      ...ceo,
      updatedAt: new Date().toISOString(),
    };

    await updateSiteSettings({ ceoProfile: updatedCeo });
  };

  const saveProfessional = async (prof: Partial<Professional>) => {
    try {
      const isNew = !prof.id;
      const dataToSave = {
        ...prof,
        order: prof.order ?? professionals.length + 1,
        isPublished: prof.isPublished ?? true,
        updatedAt: new Date().toISOString(),
        ...(isNew ? { createdAt: new Date().toISOString() } : {}),
      };

      if (isNew) {
        const docRef = await addDoc(collection(db, 'professionals'), dataToSave);
        setProfessionals((prev) => [...prev, { id: docRef.id, ...dataToSave } as Professional]);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'professionals', id as string), rest);
        setProfessionals((prev) =>
          prev.map((p) => (p.id === id ? ({ ...p, ...dataToSave } as Professional) : p))
        );
      }
    } catch (err: any) {
      handleFirestoreError(err, prof.id ? OperationType.UPDATE : OperationType.CREATE, 'professionals');
      throw err;
    }
  };

  const deleteProfessional = async (id: string, photoPath?: string) => {
    try {
      await deleteDoc(doc(db, 'professionals', id));
      setProfessionals((prev) => prev.filter((p) => p.id !== id));
      if (photoPath) {
        await deleteStorageFile(photoPath);
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `professionals/${id}`);
      throw err;
    }
  };

  const saveService = async (service: Partial<Service>) => {
    try {
      const isNew = !service.id || service.id.startsWith('default-');
      const dataToSave = {
        ...service,
        order: service.order ?? services.length + 1,
        isPublished: service.isPublished ?? true,
        updatedAt: new Date().toISOString(),
        ...(isNew ? { createdAt: new Date().toISOString() } : {}),
      };

      if (isNew) {
        const { id, ...rest } = dataToSave;
        const docRef = await addDoc(collection(db, 'services'), rest);
        setServices((prev) => [...prev, { id: docRef.id, ...rest } as Service]);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'services', id as string), rest);
        setServices((prev) =>
          prev.map((s) => (s.id === id ? ({ ...s, ...dataToSave } as Service) : s))
        );
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'services');
      throw err;
    }
  };

  const deleteService = async (id: string, imagePath?: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      setServices((prev) => prev.filter((s) => s.id !== id));
      if (imagePath) await deleteStorageFile(imagePath);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `services/${id}`);
      throw err;
    }
  };

  const saveProject = async (project: Partial<Project>) => {
    try {
      const isNew = !project.id;
      const dataToSave = {
        ...project,
        order: project.order ?? projects.length + 1,
        isPublished: project.isPublished ?? true,
        isFeatured: project.isFeatured ?? false,
        updatedAt: new Date().toISOString(),
        ...(isNew ? { createdAt: new Date().toISOString() } : {}),
      };

      if (isNew) {
        const docRef = await addDoc(collection(db, 'projects'), dataToSave);
        setProjects((prev) => [...prev, { id: docRef.id, ...dataToSave } as Project]);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'projects', id as string), rest);
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? ({ ...p, ...dataToSave } as Project) : p))
        );
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'projects');
      throw err;
    }
  };

  const deleteProject = async (id: string, imagePath?: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (imagePath) await deleteStorageFile(imagePath);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `projects/${id}`);
      throw err;
    }
  };

  const saveGalleryItem = async (item: Partial<GalleryItem>) => {
    try {
      const isNew = !item.id;
      const dataToSave = {
        ...item,
        order: item.order ?? galleryItems.length + 1,
        isPublished: item.isPublished ?? true,
        updatedAt: new Date().toISOString(),
        ...(isNew ? { createdAt: new Date().toISOString() } : {}),
      };

      if (isNew) {
        const docRef = await addDoc(collection(db, 'gallery'), dataToSave);
        setGalleryItems((prev) => [...prev, { id: docRef.id, ...dataToSave } as GalleryItem]);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'gallery', id as string), rest);
        setGalleryItems((prev) =>
          prev.map((g) => (g.id === id ? ({ ...g, ...dataToSave } as GalleryItem) : g))
        );
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'gallery');
      throw err;
    }
  };

  const deleteGalleryItem = async (id: string, imagePath?: string) => {
    try {
      await deleteDoc(doc(db, 'gallery', id));
      setGalleryItems((prev) => prev.filter((g) => g.id !== id));
      if (imagePath) await deleteStorageFile(imagePath);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
      throw err;
    }
  };

  const saveVideoAdvert = async (video: Partial<VideoAdvert>) => {
    try {
      const isNew = !video.id || video.id.startsWith('default-vid-');
      const dataToSave = {
        ...video,
        order: video.order ?? videoAdverts.length + 1,
        isPublished: video.isPublished ?? true,
        updatedAt: new Date().toISOString(),
        ...(isNew ? { createdAt: new Date().toISOString() } : {}),
      };

      if (isNew) {
        const { id, ...rest } = dataToSave;
        const docRef = await addDoc(collection(db, 'video_adverts'), rest);
        setVideoAdverts((prev) => [...prev, { id: docRef.id, ...rest } as VideoAdvert]);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'video_adverts', id as string), rest);
        setVideoAdverts((prev) =>
          prev.map((v) => (v.id === id ? ({ ...v, ...dataToSave } as VideoAdvert) : v))
        );
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'video_adverts');
      throw err;
    }
  };

  const deleteVideoAdvert = async (id: string, videoPath?: string, thumbnailPath?: string) => {
    try {
      if (!id.startsWith('default-vid-')) {
        await deleteDoc(doc(db, 'video_adverts', id));
      }
      setVideoAdverts((prev) => prev.filter((v) => v.id !== id));
      if (videoPath) await deleteStorageFile(videoPath);
      if (thumbnailPath) await deleteStorageFile(thumbnailPath);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `video_adverts/${id}`);
      throw err;
    }
  };

  const reorderVideoAdverts = async (orderedIds: string[]) => {
    try {
      const updates = orderedIds.map((id, index) => {
        if (!id.startsWith('default-vid-')) {
          return updateDoc(doc(db, 'video_adverts', id), { order: index + 1 });
        }
        return Promise.resolve();
      });
      await Promise.all(updates);
      setVideoAdverts((prev) => {
        const copy = [...prev];
        copy.sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id));
        return copy.map((item, idx) => ({ ...item, order: idx + 1 }));
      });
    } catch (err: any) {
      console.error('Failed to reorder videos:', err);
      throw err;
    }
  };

  const saveLeadership = async (leader: Partial<LeadershipMember>) => {
    try {
      const isNew = !leader.id;
      const dataToSave = {
        ...leader,
        order: leader.order ?? leadership.length + 1,
        isPublished: leader.isPublished ?? true,
        updatedAt: new Date().toISOString(),
        ...(isNew ? { createdAt: new Date().toISOString() } : {}),
      };

      if (isNew) {
        const docRef = await addDoc(collection(db, 'leadership'), dataToSave);
        setLeadership((prev) => [...prev, { id: docRef.id, ...dataToSave } as LeadershipMember]);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'leadership', id as string), rest);
        setLeadership((prev) =>
          prev.map((l) => (l.id === id ? ({ ...l, ...dataToSave } as LeadershipMember) : l))
        );
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'leadership');
      throw err;
    }
  };

  const deleteLeadership = async (id: string, photoPath?: string) => {
    try {
      await deleteDoc(doc(db, 'leadership', id));
      setLeadership((prev) => prev.filter((l) => l.id !== id));
      if (photoPath) await deleteStorageFile(photoPath);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `leadership/${id}`);
      throw err;
    }
  };

  const saveInsight = async (insight: Partial<Insight>) => {
    try {
      const isNew = !insight.id;
      const dataToSave = {
        ...insight,
        isPublished: insight.isPublished ?? true,
        updatedAt: new Date().toISOString(),
        ...(isNew ? { createdAt: new Date().toISOString() } : {}),
      };

      if (isNew) {
        const docRef = await addDoc(collection(db, 'insights'), dataToSave);
        setInsights((prev) => [...prev, { id: docRef.id, ...dataToSave } as Insight]);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'insights', id as string), rest);
        setInsights((prev) =>
          prev.map((ins) => (ins.id === id ? ({ ...ins, ...dataToSave } as Insight) : ins))
        );
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'insights');
      throw err;
    }
  };

  const deleteInsight = async (id: string, imagePath?: string) => {
    try {
      await deleteDoc(doc(db, 'insights', id));
      setInsights((prev) => prev.filter((ins) => ins.id !== id));
      if (imagePath) await deleteStorageFile(imagePath);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `insights/${id}`);
      throw err;
    }
  };

  const saveEvent = async (eventItem: Partial<EventItem>) => {
    try {
      const isNew = !eventItem.id;
      const dataToSave = {
        ...eventItem,
        isPublished: eventItem.isPublished ?? true,
        updatedAt: new Date().toISOString(),
        ...(isNew ? { createdAt: new Date().toISOString() } : {}),
      };

      if (isNew) {
        const docRef = await addDoc(collection(db, 'events'), dataToSave);
        setEvents((prev) => [...prev, { id: docRef.id, ...dataToSave } as EventItem]);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'events', id as string), rest);
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? ({ ...e, ...dataToSave } as EventItem) : e))
        );
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'events');
      throw err;
    }
  };

  const deleteEvent = async (id: string, imagePath?: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      setEvents((prev) => prev.filter((e) => e.id !== id));
      if (imagePath) await deleteStorageFile(imagePath);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `events/${id}`);
      throw err;
    }
  };

  const savePublication = async (pub: Partial<Publication>) => {
    try {
      const isNew = !pub.id;
      const dataToSave = {
        ...pub,
        isPublished: pub.isPublished ?? true,
        updatedAt: new Date().toISOString(),
        ...(isNew ? { createdAt: new Date().toISOString() } : {}),
      };

      if (isNew) {
        const docRef = await addDoc(collection(db, 'publications'), dataToSave);
        setPublications((prev) => [...prev, { id: docRef.id, ...dataToSave } as Publication]);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'publications', id as string), rest);
        setPublications((prev) =>
          prev.map((p) => (p.id === id ? ({ ...p, ...dataToSave } as Publication) : p))
        );
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'publications');
      throw err;
    }
  };

  const deletePublication = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'publications', id));
      setPublications((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `publications/${id}`);
      throw err;
    }
  };

  const saveFAQ = async (faq: Partial<FAQ>) => {
    try {
      const isNew = !faq.id || faq.id.startsWith('default-faq-');
      const dataToSave = {
        ...faq,
        order: faq.order ?? faqs.length + 1,
        isPublished: faq.isPublished ?? true,
        updatedAt: new Date().toISOString(),
        ...(isNew ? { createdAt: new Date().toISOString() } : {}),
      };

      if (isNew) {
        const { id, ...rest } = dataToSave;
        const docRef = await addDoc(collection(db, 'faqs'), rest);
        setFaqs((prev) => [...prev, { id: docRef.id, ...rest } as FAQ]);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'faqs', id as string), rest);
        setFaqs((prev) =>
          prev.map((f) => (f.id === id ? ({ ...f, ...dataToSave } as FAQ) : f))
        );
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'faqs');
      throw err;
    }
  };

  const deleteFAQ = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'faqs', id));
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `faqs/${id}`);
      throw err;
    }
  };

  // Testimonials Submission & Approval Management
  const submitTestimonial = async (data: {
    name: string;
    title?: string;
    organization?: string;
    quote: string;
    service?: string;
    rating?: number;
  }) => {
    try {
      if (!data.name || data.name.trim().length < 2) {
        return { success: false, error: 'Please enter your full name (minimum 2 characters).' };
      }
      if (!data.quote || data.quote.trim().length < 10) {
        return { success: false, error: 'Testimonial quote must be at least 10 characters long.' };
      }

      // Prevent duplicate submissions: check recently submitted hash
      const hash = `test_${data.name.trim().toLowerCase()}_${data.quote.trim().toLowerCase().slice(0, 50)}`;
      const now = Date.now();
      if (recentSubmissionsRef.current.has(hash)) {
        const lastTime = recentSubmissionsRef.current.get(hash)!;
        if (now - lastTime < 60000) {
          return { success: false, error: 'You have recently submitted this testimonial. It is awaiting administrative review.' };
        }
      }
      recentSubmissionsRef.current.set(hash, now);

      // Check if duplicate testimonial already exists in database or baseline records
      const testPool = allTestimonials.length > 0 ? allTestimonials : testimonials;
      const isDuplicate = testPool.some(
        (t) =>
          t.name.trim().toLowerCase() === data.name.trim().toLowerCase() &&
          t.quote.trim().toLowerCase() === data.quote.trim().toLowerCase()
      );
      if (isDuplicate) {
        return { success: false, error: 'A testimonial matching this submission already exists in our system.' };
      }

      const newRecord = {
        name: data.name.trim(),
        title: data.title?.trim() || '',
        organization: data.organization?.trim() || '',
        quote: data.quote.trim(),
        service: data.service?.trim() || 'General Consulting',
        rating: Math.max(1, Math.min(5, Number(data.rating) || 5)),
        isApproved: false,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'testimonials'), newRecord);
      setAllTestimonials((prev) => [{ id: docRef.id, ...newRecord }, ...prev]);
      return { success: true };
    } catch (err: any) {
      console.error('Error submitting testimonial:', err);
      return { success: false, error: err.message || 'Failed to submit testimonial. Please try again.' };
    }
  };

  const publishTestimonial = async (id: string) => {
    try {
      const existing =
        allTestimonials.find((t) => t.id === id) ||
        DEFAULT_TESTIMONIALS.find((t) => t.id === id);

      const updatedFields = {
        isApproved: true,
        status: 'published' as const,
        updatedAt: new Date().toISOString(),
      };

      if (id.startsWith('default-test-')) {
        if (existing) {
          const { id: docId, ...dataWithoutId } = existing;
          await setDoc(
            doc(db, 'testimonials', id),
            {
              ...dataWithoutId,
              ...updatedFields,
            },
            { merge: true }
          );
        }
        const currentHidden = siteSettings.hiddenDefaultTestimonials || [];
        const currentDeleted = siteSettings.deletedDefaultTestimonials || [];
        const updates: Partial<SiteSettings> = {};
        if (currentHidden.includes(id)) {
          updates.hiddenDefaultTestimonials = currentHidden.filter((x) => x !== id);
        }
        if (currentDeleted.includes(id)) {
          updates.deletedDefaultTestimonials = currentDeleted.filter((x) => x !== id);
        }
        if (Object.keys(updates).length > 0) {
          await updateSiteSettings(updates);
        }
      } else {
        await updateDoc(doc(db, 'testimonials', id), updatedFields);
      }

      setAllTestimonials((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, isApproved: true, status: 'published' } : t
        )
      );
      setTestimonials((prev) => {
        if (prev.some((t) => t.id === id)) {
          return prev.map((t) =>
            t.id === id ? { ...t, isApproved: true, status: 'published' } : t
          );
        }
        const found = allTestimonials.find((t) => t.id === id) || existing;
        return found
          ? [{ ...found, isApproved: true, status: 'published' as const }, ...prev]
          : prev;
      });
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `testimonials/${id}`);
      throw err;
    }
  };

  const hideTestimonial = async (id: string) => {
    try {
      const existing =
        allTestimonials.find((t) => t.id === id) ||
        DEFAULT_TESTIMONIALS.find((t) => t.id === id);

      const updatedFields = {
        isApproved: false,
        status: 'hidden' as const,
        updatedAt: new Date().toISOString(),
      };

      if (id.startsWith('default-test-')) {
        if (existing) {
          const { id: docId, ...dataWithoutId } = existing;
          await setDoc(
            doc(db, 'testimonials', id),
            {
              ...dataWithoutId,
              ...updatedFields,
            },
            { merge: true }
          );
        }
        const currentHidden = siteSettings.hiddenDefaultTestimonials || [];
        if (!currentHidden.includes(id)) {
          await updateSiteSettings({
            hiddenDefaultTestimonials: [...currentHidden, id],
          });
        }
      } else {
        await updateDoc(doc(db, 'testimonials', id), updatedFields);
      }

      setAllTestimonials((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, isApproved: false, status: 'hidden' } : t
        )
      );
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `testimonials/${id}`);
      throw err;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      if (id.startsWith('default-test-')) {
        try {
          await deleteDoc(doc(db, 'testimonials', id));
        } catch {
          // Ignore
        }
        const currentDeleted = siteSettings.deletedDefaultTestimonials || [];
        const currentHidden = siteSettings.hiddenDefaultTestimonials || [];
        const updates: Partial<SiteSettings> = {};
        if (!currentDeleted.includes(id)) {
          updates.deletedDefaultTestimonials = [...currentDeleted, id];
        }
        if (currentHidden.includes(id)) {
          updates.hiddenDefaultTestimonials = currentHidden.filter((x) => x !== id);
        }
        if (Object.keys(updates).length > 0) {
          await updateSiteSettings(updates);
        }
      } else {
        await deleteDoc(doc(db, 'testimonials', id));
      }

      setAllTestimonials((prev) => prev.filter((t) => t.id !== id));
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `testimonials/${id}`);
      throw err;
    }
  };

  const approveTestimonial = publishTestimonial;
  const rejectTestimonial = hideTestimonial;

  // Visitor Feedback Submission & Approval Management
  const submitFeedback = async (data: {
    name?: string;
    email?: string;
    message: string;
    category?: string;
  }) => {
    try {
      if (!data.message || data.message.trim().length < 10) {
        return { success: false, error: 'Feedback message must be at least 10 characters.' };
      }
      if (data.email && data.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email.trim())) {
          return { success: false, error: 'Please enter a valid email address.' };
        }
      }

      // Check duplicate submissions within recent 60s
      const feedHash = `feed_${(data.name || '').trim().toLowerCase()}_${data.message.trim().toLowerCase().slice(0, 50)}`;
      const now = Date.now();
      if (recentSubmissionsRef.current.has(feedHash)) {
        const lastTime = recentSubmissionsRef.current.get(feedHash)!;
        if (now - lastTime < 60000) {
          return { success: false, error: 'You have recently submitted this feedback.' };
        }
      }
      recentSubmissionsRef.current.set(feedHash, now);

      // Check if duplicate feedback exists in database or baseline records
      const feedPool = allFeedbackList.length > 0 ? allFeedbackList : feedbackList;
      const isFeedDuplicate = feedPool.some(
        (f) =>
          f.message.trim().toLowerCase() === data.message.trim().toLowerCase() &&
          ((!data.name && !f.name) || (data.name && f.name && data.name.trim().toLowerCase() === f.name.trim().toLowerCase()))
      );
      if (isFeedDuplicate) {
        return { success: false, error: 'A feedback submission with this message already exists in our system.' };
      }

      const newRecord = {
        name: data.name?.trim() || '',
        email: data.email?.trim() || '', // Kept private
        message: data.message.trim(),
        category: data.category?.trim() || 'General Feedback',
        isApproved: false,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'feedback'), newRecord);
      setAllFeedbackList((prev) => [{ id: docRef.id, ...newRecord }, ...prev]);
      return { success: true };
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      return { success: false, error: err.message || 'Failed to submit feedback. Please try again.' };
    }
  };

  const publishFeedback = async (id: string) => {
    try {
      const existing =
        allFeedbackList.find((f) => f.id === id) ||
        DEFAULT_FEEDBACK.find((f) => f.id === id);

      const updatedFields = {
        isApproved: true,
        status: 'published' as const,
        updatedAt: new Date().toISOString(),
      };

      if (id.startsWith('default-feed-')) {
        if (existing) {
          const { id: docId, ...dataWithoutId } = existing;
          await setDoc(
            doc(db, 'feedback', id),
            {
              ...dataWithoutId,
              ...updatedFields,
            },
            { merge: true }
          );
        }
        const currentHidden = siteSettings.hiddenDefaultFeedback || [];
        const currentDeleted = siteSettings.deletedDefaultFeedback || [];
        const updates: Partial<SiteSettings> = {};
        if (currentHidden.includes(id)) {
          updates.hiddenDefaultFeedback = currentHidden.filter((x) => x !== id);
        }
        if (currentDeleted.includes(id)) {
          updates.deletedDefaultFeedback = currentDeleted.filter((x) => x !== id);
        }
        if (Object.keys(updates).length > 0) {
          await updateSiteSettings(updates);
        }
      } else {
        await updateDoc(doc(db, 'feedback', id), updatedFields);
      }

      setAllFeedbackList((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, isApproved: true, status: 'published' } : f
        )
      );
      setFeedbackList((prev) => {
        if (prev.some((f) => f.id === id)) {
          return prev.map((f) =>
            f.id === id ? { ...f, isApproved: true, status: 'published' } : f
          );
        }
        const found = allFeedbackList.find((f) => f.id === id) || existing;
        if (!found) return prev;
        const { email, ...safeFields } = found;
        return [
          { ...safeFields, isApproved: true, status: 'published' as const } as VisitorFeedback,
          ...prev,
        ];
      });
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `feedback/${id}`);
      throw err;
    }
  };

  const hideFeedback = async (id: string) => {
    try {
      const existing =
        allFeedbackList.find((f) => f.id === id) ||
        DEFAULT_FEEDBACK.find((f) => f.id === id);

      const updatedFields = {
        isApproved: false,
        status: 'hidden' as const,
        updatedAt: new Date().toISOString(),
      };

      if (id.startsWith('default-feed-')) {
        if (existing) {
          const { id: docId, ...dataWithoutId } = existing;
          await setDoc(
            doc(db, 'feedback', id),
            {
              ...dataWithoutId,
              ...updatedFields,
            },
            { merge: true }
          );
        }
        const currentHidden = siteSettings.hiddenDefaultFeedback || [];
        if (!currentHidden.includes(id)) {
          await updateSiteSettings({
            hiddenDefaultFeedback: [...currentHidden, id],
          });
        }
      } else {
        await updateDoc(doc(db, 'feedback', id), updatedFields);
      }

      setAllFeedbackList((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, isApproved: false, status: 'hidden' } : f
        )
      );
      setFeedbackList((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `feedback/${id}`);
      throw err;
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      if (id.startsWith('default-feed-')) {
        try {
          await deleteDoc(doc(db, 'feedback', id));
        } catch {
          // Ignore
        }
        const currentDeleted = siteSettings.deletedDefaultFeedback || [];
        const currentHidden = siteSettings.hiddenDefaultFeedback || [];
        const updates: Partial<SiteSettings> = {};
        if (!currentDeleted.includes(id)) {
          updates.deletedDefaultFeedback = [...currentDeleted, id];
        }
        if (currentHidden.includes(id)) {
          updates.hiddenDefaultFeedback = currentHidden.filter((x) => x !== id);
        }
        if (Object.keys(updates).length > 0) {
          await updateSiteSettings(updates);
        }
      } else {
        await deleteDoc(doc(db, 'feedback', id));
      }

      setAllFeedbackList((prev) => prev.filter((f) => f.id !== id));
      setFeedbackList((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `feedback/${id}`);
      throw err;
    }
  };

  const approveFeedback = publishFeedback;
  const rejectFeedback = hideFeedback;

  const updateInquiry = async (id: string, updates: Partial<Inquiry>) => {
    try {
      const dataToSave = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(doc(db, 'inquiries', id), dataToSave);
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? ({ ...inq, ...dataToSave } as Inquiry) : inq))
      );
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `inquiries/${id}`);
      throw err;
    }
  };

  const updateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    return updateInquiry(id, { status });
  };

  const deleteInquiry = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `inquiries/${id}`);
      throw err;
    }
  };

  // One-click seed of genuine baseline data to Firestore without overwriting custom uploaded content
  const seedBaselineData = async () => {
    try {
      // 1. Site settings - protect newly uploaded logos or CEO profiles from being wiped out
      const docRef = doc(db, 'site_settings', 'general');
      let existingSettings: Partial<SiteSettings> = {};
      try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          existingSettings = snap.data() as Partial<SiteSettings>;
        }
      } catch {
        existingSettings = siteSettings;
      }

      const safeSeed: SiteSettings = {
        ...DEFAULT_SITE_SETTINGS,
        ...existingSettings,
        logoUrl: existingSettings.logoUrl || siteSettings.logoUrl || '',
        logoPath: existingSettings.logoPath || siteSettings.logoPath || '',
        ceoProfile: {
          ...DEFAULT_SITE_SETTINGS.ceoProfile,
          ...(existingSettings.ceoProfile || {}),
          ...(siteSettings.ceoProfile || {}),
        },
        socialLinks: {
          ...DEFAULT_SITE_SETTINGS.socialLinks,
          ...(existingSettings.socialLinks || {}),
          ...(siteSettings.socialLinks || {}),
        },
        updatedAt: new Date().toISOString(),
      };

      await setDoc(docRef, safeSeed, { merge: true });
      setSiteSettings(safeSeed);

      // 2. Services
      for (const s of DEFAULT_SERVICES) {
        await addDoc(collection(db, 'services'), {
          ...s,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // 3. FAQs
      for (const f of DEFAULT_FAQS) {
        await addDoc(collection(db, 'faqs'), {
          ...f,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error('Seed baseline error:', err);
      handleFirestoreError(err, OperationType.WRITE, 'all');
      throw err;
    }
  };

  return (
    <DataContext.Provider
      value={{
        siteSettings,
        professionals,
        services,
        projects,
        galleryItems,
        videoAdverts,
        leadership,
        insights,
        events,
        publications,
        faqs,
        isLoading,
        error,
        submitInquiry,
        currentUser,
        isAdmin,
        isAuthLoading,
        loginWithGoogle,
        loginWithEmailPassword,
        logoutUser,
        updateSiteSettings,
        saveCeoProfile,
        saveProfessional,
        deleteProfessional,
        saveService,
        deleteService,
        saveProject,
        deleteProject,
        saveGalleryItem,
        deleteGalleryItem,
        saveVideoAdvert,
        deleteVideoAdvert,
        reorderVideoAdverts,
        saveLeadership,
        deleteLeadership,
        saveInsight,
        deleteInsight,
        saveEvent,
        deleteEvent,
        savePublication,
        deletePublication,
        saveFAQ,
        deleteFAQ,
        inquiries,
        isInquiriesAdmin,
        inquiriesAdminEmail,
        loginInquiriesAdmin,
        logoutInquiriesAdmin,
        fetchInquiries,
        updateInquiry,
        updateInquiryStatus,
        deleteInquiry,
        testimonials,
        allTestimonials,
        submitTestimonial,
        publishTestimonial,
        hideTestimonial,
        approveTestimonial,
        rejectTestimonial,
        deleteTestimonial,
        feedbackList,
        allFeedbackList,
        submitFeedback,
        publishFeedback,
        hideFeedback,
        approveFeedback,
        rejectFeedback,
        deleteFeedback,
        seedBaselineData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
