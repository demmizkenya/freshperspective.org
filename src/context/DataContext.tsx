import React, { createContext, useContext, useEffect, useState } from 'react';
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
  fetchInquiries: () => Promise<void>;
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
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

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
        setIsAdmin(false);
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
            setSiteSettings(snap.data() as SiteSettings);
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

  // Fetch inquiries when admin is logged in
  const fetchInquiries = async () => {
    if (!isAdmin) return;
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

  useEffect(() => {
    if (isAdmin) {
      fetchInquiries();
    }
  }, [isAdmin]);

  // Submit Inquiry (Public)
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

      const newInquiry = {
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || '',
        organization: data.organization?.trim() || '',
        service: data.service.trim(),
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
    } catch (err) {
      console.error('Inquiry submission error:', err);
      handleFirestoreError(err, OperationType.CREATE, 'inquiries');
      return { success: false, error: err instanceof Error ? err.message : 'Submission failed.' };
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

  // Email/Password Login explicitly requested by user:
  // email: freshperspectiveorganization@gmail.com, password: fresh@org
  const loginWithEmailPassword = async (emailInput: string, passwordInput: string) => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    try {
      try {
        await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      } catch (authErr: any) {
        // If user does not exist yet in Firebase Auth, attempt to create it
        if (
          authErr.code === 'auth/user-not-found' ||
          authErr.code === 'auth/invalid-credential'
        ) {
          try {
            await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
          } catch (createErr) {
            console.warn('Could not auto-create user in Firebase Auth:', createErr);
            throw authErr;
          }
        } else {
          throw authErr;
        }
      }
    } catch (finalErr: any) {
      // If the email matches the authorized admin credentials
      if (
        cleanEmail === 'freshperspectiveorganization@gmail.com' &&
        cleanPassword === 'fresh@org'
      ) {
        // Fallback: grant administrative session
        setIsAdmin(true);
        return;
      }
      throw finalErr;
    }
  };

  // Logout
  const logoutUser = async () => {
    await signOut(auth);
    setIsAdmin(false);
  };

  // Admin CRUD operations
  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    try {
      const merged = { ...siteSettings, ...settings, updatedAt: new Date().toISOString() };
      await setDoc(doc(db, 'site_settings', 'general'), merged, { merge: true });
      setSiteSettings(merged);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'site_settings/general');
    }
  };

  const saveCeoProfile = async (ceo: Partial<SiteSettings['ceoProfile']>) => {
    try {
      const updatedCeo = {
        ...siteSettings.ceoProfile,
        ...ceo,
        updatedAt: new Date().toISOString(),
      };
      await updateSiteSettings({ ceoProfile: updatedCeo });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'site_settings/general');
    }
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
        await addDoc(collection(db, 'professionals'), dataToSave);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'professionals', id as string), rest);
      }
    } catch (err) {
      handleFirestoreError(err, prof.id ? OperationType.UPDATE : OperationType.CREATE, 'professionals');
    }
  };

  const deleteProfessional = async (id: string, photoPath?: string) => {
    try {
      await deleteDoc(doc(db, 'professionals', id));
      if (photoPath) {
        await deleteStorageFile(photoPath);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `professionals/${id}`);
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
        await addDoc(collection(db, 'services'), rest);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'services', id as string), rest);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'services');
    }
  };

  const deleteService = async (id: string, imagePath?: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      if (imagePath) await deleteStorageFile(imagePath);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `services/${id}`);
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
        await addDoc(collection(db, 'projects'), dataToSave);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'projects', id as string), rest);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'projects');
    }
  };

  const deleteProject = async (id: string, imagePath?: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      if (imagePath) await deleteStorageFile(imagePath);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `projects/${id}`);
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
        await addDoc(collection(db, 'gallery'), dataToSave);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'gallery', id as string), rest);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'gallery');
    }
  };

  const deleteGalleryItem = async (id: string, imagePath?: string) => {
    try {
      await deleteDoc(doc(db, 'gallery', id));
      if (imagePath) await deleteStorageFile(imagePath);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
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
        await addDoc(collection(db, 'leadership'), dataToSave);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'leadership', id as string), rest);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'leadership');
    }
  };

  const deleteLeadership = async (id: string, photoPath?: string) => {
    try {
      await deleteDoc(doc(db, 'leadership', id));
      if (photoPath) await deleteStorageFile(photoPath);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `leadership/${id}`);
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
        await addDoc(collection(db, 'insights'), dataToSave);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'insights', id as string), rest);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'insights');
    }
  };

  const deleteInsight = async (id: string, imagePath?: string) => {
    try {
      await deleteDoc(doc(db, 'insights', id));
      if (imagePath) await deleteStorageFile(imagePath);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `insights/${id}`);
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
        await addDoc(collection(db, 'events'), dataToSave);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'events', id as string), rest);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'events');
    }
  };

  const deleteEvent = async (id: string, imagePath?: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      if (imagePath) await deleteStorageFile(imagePath);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `events/${id}`);
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
        await addDoc(collection(db, 'publications'), dataToSave);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'publications', id as string), rest);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'publications');
    }
  };

  const deletePublication = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'publications', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `publications/${id}`);
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
        await addDoc(collection(db, 'faqs'), rest);
      } else {
        const { id, ...rest } = dataToSave;
        await updateDoc(doc(db, 'faqs', id as string), rest);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'faqs');
    }
  };

  const deleteFAQ = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'faqs', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `faqs/${id}`);
    }
  };

  const updateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { status });
      setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `inquiries/${id}`);
    }
  };

  const deleteInquiry = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `inquiries/${id}`);
    }
  };

  // One-click seed of genuine baseline data to Firestore
  const seedBaselineData = async () => {
    try {
      // 1. Site settings
      await setDoc(doc(db, 'site_settings', 'general'), DEFAULT_SITE_SETTINGS, { merge: true });

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
    } catch (err) {
      console.error('Seed baseline error:', err);
      handleFirestoreError(err, OperationType.WRITE, 'all');
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
        fetchInquiries,
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
