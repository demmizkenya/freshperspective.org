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
} from '../types';
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_SERVICES,
  DEFAULT_FAQS,
  AUTHORIZED_ADMIN_EMAILS,
} from '../constants';

interface DataContextType {
  // Public Data
  siteSettings: SiteSettings;
  professionals: Professional[];
  services: Service[];
  projects: Project[];
  galleryItems: GalleryItem[];
  leadership: LeadershipMember[];
  insights: Insight[];
  events: EventItem[];
  publications: Publication[];
  faqs: FAQ[];
  isLoading: boolean;
  error: string | null;

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
  const [leadership, setLeadership] = useState<LeadershipMember[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

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
          setIsAdmin(true);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('fp_admin_session', 'true');
          }
          // Ensure admin doc exists in Firestore for rules consistency
          try {
            await setDoc(doc(db, 'admins', user.uid), {
              email: user.email,
              role: 'owner',
              updatedAt: new Date().toISOString(),
            }, { merge: true });
          } catch (e) {
            console.warn('Could not auto-sync admin doc:', e);
          }
        } else if (typeof window !== 'undefined' && sessionStorage.getItem('fp_admin_session') === 'true') {
          setIsAdmin(true);
        } else {
          // Check if UID is in admins collection
          try {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            setIsAdmin(adminDoc.exists());
          } catch (err) {
            setIsAdmin(false);
          }
        }
      } else {
        if (typeof window !== 'undefined' && sessionStorage.getItem('fp_admin_session') === 'true') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
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

        // 6. Leadership
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

  // Fetch inquiries when any admin is logged in
  const fetchInquiries = async () => {
    if (!isAdmin && !isInquiriesAdmin) return;
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: Inquiry[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Inquiry);
      });
      setInquiries(list);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    }
  };

  // Real-time synchronization of inquiries for authorized admins
  useEffect(() => {
    if (!isAdmin && !isInquiriesAdmin) {
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
        (err) => {
          console.warn('Real-time inquiries listener note:', err.message);
        }
      );
      return () => unsub();
    } catch (e) {
      console.warn('Could not attach real-time inquiry listener:', e);
    }
  }, [isAdmin, isInquiriesAdmin]);

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

  // Logout Main Admin
  const logoutUser = async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('fp_admin_session');
    }
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout note:', e);
    }
    setIsAdmin(false);
    setCurrentUser(null);
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

  const logoutInquiriesAdmin = async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('fp_inquiries_admin_session');
      sessionStorage.removeItem('fp_inquiries_admin_email');
    }
    setIsInquiriesAdmin(false);
    setInquiriesAdminEmail(null);
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
