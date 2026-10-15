import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Inquiry, InquiryStatus } from '../types';
import {
  X,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  MessageSquare,
  Trash2,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Save,
  Download,
  Lock,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  DollarSign,
  Briefcase,
  UserCheck,
} from 'lucide-react';

interface InquiriesAdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InquiriesAdminDashboard: React.FC<InquiriesAdminDashboardProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    inquiries,
    fetchInquiries,
    updateInquiry,
    deleteInquiry,
    isInquiriesAdmin,
    inquiriesAdminEmail,
    loginInquiriesAdmin,
    logoutInquiriesAdmin,
  } = useData();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InquiryStatus>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'name' | 'status'>('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // UI state for internal notes editing
  const [activeNotesId, setActiveNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Deletion confirmation modal state
  const [itemToDelete, setItemToDelete] = useState<Inquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Action feedback notifications
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 4000);
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const res = await loginInquiriesAdmin(loginEmail, loginPassword);
      if (!res.success) {
        setLoginError(res.error || 'Authentication failed. Please verify credentials.');
      } else {
        setLoginEmail('');
        setLoginPassword('');
      }
    } catch (err: any) {
      setLoginError(err.message || 'An error occurred during login.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchInquiries();
      showNotice('success', 'Inquiries and quote requests synchronized.');
    } catch {
      showNotice('error', 'Failed to synchronize inquiries.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle Status Change
  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    try {
      await updateInquiry(id, { status: newStatus });
      showNotice('success', `Status updated to "${formatStatus(newStatus)}".`);
    } catch {
      showNotice('error', 'Failed to update submission status.');
    }
  };

  // Handle Internal Notes Save
  const handleSaveNotes = async (id: string) => {
    setIsSavingNotes(true);
    try {
      await updateInquiry(id, { internalNotes: notesDraft });
      setActiveNotesId(null);
      showNotice('success', 'Internal notes updated successfully.');
    } catch {
      showNotice('error', 'Failed to save internal notes.');
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteInquiry(itemToDelete.id);
      showNotice('success', `Submission from ${itemToDelete.fullName} deleted.`);
      setItemToDelete(null);
    } catch {
      showNotice('error', 'Failed to delete submission.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper: Format status
  const formatStatus = (st: string) => {
    switch (st) {
      case 'new':
        return 'New';
      case 'in_progress':
        return 'In Progress';
      case 'responded':
        return 'Responded';
      case 'completed':
        return 'Completed';
      case 'reviewed':
        return 'Reviewed';
      case 'contacted':
        return 'Contacted';
      default:
        return st;
    }
  };

  // Export CSV
  const exportToCSV = () => {
    if (inquiries.length === 0) return;
    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Phone',
      'Organization',
      'Service',
      'Description',
      'Budget Range',
      'Preferred Deadline',
      'Status',
      'Internal Notes',
      'Date Submitted',
    ];

    const rows = filteredInquiries.map((inq) => [
      `"${inq.id || ''}"`,
      `"${(inq.fullName || '').replace(/"/g, '""')}"`,
      `"${(inq.email || '').replace(/"/g, '""')}"`,
      `"${(inq.phone || '').replace(/"/g, '""')}"`,
      `"${(inq.organization || '').replace(/"/g, '""')}"`,
      `"${(inq.service || '').replace(/"/g, '""')}"`,
      `"${(inq.description || '').replace(/"/g, '""')}"`,
      `"${(inq.budgetRange || '').replace(/"/g, '""')}"`,
      `"${(inq.preferredDeadline || '').replace(/"/g, '""')}"`,
      `"${inq.status}"`,
      `"${(inq.internalNotes || '').replace(/"/g, '""')}"`,
      `"${inq.createdAt || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `fresh_perspective_inquiries_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Distinct Services for filter dropdown
  const uniqueServices = useMemo(() => {
    const set = new Set<string>();
    inquiries.forEach((i) => {
      if (i.service) set.add(i.service);
    });
    return Array.from(set).sort();
  }, [inquiries]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = inquiries.length;
    const newCount = inquiries.filter((i) => i.status === 'new').length;
    const inProgressCount = inquiries.filter(
      (i) => i.status === 'in_progress' || i.status === 'reviewed'
    ).length;
    const respondedCount = inquiries.filter(
      (i) => i.status === 'responded' || i.status === 'contacted'
    ).length;
    const completedCount = inquiries.filter((i) => i.status === 'completed').length;
    return { total, newCount, inProgressCount, respondedCount, completedCount };
  }, [inquiries]);

  // Filtered & Sorted Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries
      .filter((inq) => {
        // Status filter
        if (statusFilter !== 'all') {
          if (statusFilter === 'in_progress') {
            if (inq.status !== 'in_progress' && inq.status !== 'reviewed') return false;
          } else if (statusFilter === 'responded') {
            if (inq.status !== 'responded' && inq.status !== 'contacted') return false;
          } else if (inq.status !== statusFilter) {
            return false;
          }
        }
        // Service filter
        if (serviceFilter !== 'all' && inq.service !== serviceFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = inq.fullName?.toLowerCase().includes(q);
          const matchEmail = inq.email?.toLowerCase().includes(q);
          const matchPhone = inq.phone?.toLowerCase().includes(q);
          const matchOrg = inq.organization?.toLowerCase().includes(q);
          const matchService = inq.service?.toLowerCase().includes(q);
          const matchDesc = inq.description?.toLowerCase().includes(q);
          const matchNotes = inq.internalNotes?.toLowerCase().includes(q);
          return (
            matchName ||
            matchEmail ||
            matchPhone ||
            matchOrg ||
            matchService ||
            matchDesc ||
            matchNotes
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortOrder === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortOrder === 'name') {
          return a.fullName.localeCompare(b.fullName);
        }
        if (sortOrder === 'status') {
          return a.status.localeCompare(b.status);
        }
        return 0;
      });
  }, [inquiries, searchQuery, statusFilter, serviceFilter, sortOrder]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / itemsPerPage));
  const paginatedInquiries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInquiries.slice(start, start + itemsPerPage);
  }, [filteredInquiries, currentPage, itemsPerPage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-center items-start p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-[#0B132B] text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/20 border border-lime-400/30 flex items-center justify-center text-lime-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Inquiries & Quotes Admin Panel
                </h2>
                <span className="text-[10px] bg-lime-400/20 text-lime-400 border border-lime-400/30 font-bold px-2 py-0.5 rounded-full">
                  Dedicated Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Fresh Perspective Organization — Client Inquiries & Quote Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isInquiriesAdmin && (
              <div className="hidden sm:flex items-center gap-2 mr-2">
                <span className="text-xs text-slate-300 font-mono bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                  {inquiriesAdminEmail || 'Inquiries Admin'}
                </span>
                <button
                  type="button"
                  onClick={logoutInquiriesAdmin}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        {notice && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-between shrink-0 ${
              notice.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {notice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{notice.message}</span>
            </div>
            <button
              onClick={() => setNotice(null)}
              className="text-xs opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f8fafc]">
          {!isInquiriesAdmin ? (
            /* SECURE LOGIN SCREEN */
            <div className="max-w-md mx-auto py-10">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center text-lime-700 mx-auto mb-4 border border-lime-200">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-[#0B132B] mb-1">
                  Inquiries & Quotes Admin
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Restricted access. Sign in with your authorized administrator credentials to manage
                  website quote requests and client inquiries.
                </p>

                {loginError && (
                  <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs text-left flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Administrator Email
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. inquiries@freshperspective.org"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter administrator password"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] font-extrabold py-3 rounded-xl text-xs transition-all shadow-sm hover:shadow disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoggingIn ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying credentials...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Sign In to Inquiries Portal</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
                  Access is strictly limited to viewing and responding to submitted client inquiries and
                  quotes. Website content management is isolated to the main administration panel.
                </div>
              </div>
            </div>
          ) : (
            /* MAIN DASHBOARD */
            <div className="space-y-6">
              {/* Summary Statistics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Total Inquiries
                  </div>
                  <div className="text-2xl font-black text-[#0B132B]">{stats.total}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">All time submissions</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-lime-300 shadow-xs bg-lime-50/30">
                  <div className="text-[11px] font-bold text-lime-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
                    <span>New</span>
                  </div>
                  <div className="text-2xl font-black text-lime-700">{stats.newCount}</div>
                  <div className="text-[10px] text-lime-700 mt-0.5">Awaiting first response</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs bg-blue-50/20">
                  <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                    In Progress
                  </div>
                  <div className="text-2xl font-black text-blue-800">{stats.inProgressCount}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Active quote review</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-xs bg-purple-50/20">
                  <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-1">
                    Responded
                  </div>
                  <div className="text-2xl font-black text-purple-800">{stats.respondedCount}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Contacted client</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Completed
                  </div>
                  <div className="text-2xl font-black text-slate-700">{stats.completedCount}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Delivered / Finished</div>
                </div>
              </div>

              {/* Toolbar & Filters */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search sender name, email, phone, organization, or message..."
                      className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime-500 text-slate-800"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Sync with Cloud Firestore"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                      <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={exportToCSV}
                      disabled={inquiries.length === 0}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      title="Export filtered records to CSV"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Status Tabs and Secondary Filters */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  {/* Status Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                      <Filter className="w-3 h-3" /> Status:
                    </span>
                    {(
                      [
                        { id: 'all', label: `All (${inquiries.length})` },
                        { id: 'new', label: `New (${stats.newCount})` },
                        { id: 'in_progress', label: `In Progress (${stats.inProgressCount})` },
                        { id: 'responded', label: `Responded (${stats.respondedCount})` },
                        { id: 'completed', label: `Completed (${stats.completedCount})` },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setStatusFilter(tab.id as any);
                          setCurrentPage(1);
                        }}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                          statusFilter === tab.id
                            ? 'bg-[#0B132B] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Service & Sort Controls */}
                  <div className="flex items-center gap-2 ml-auto">
                    {/* Service selector */}
                    <select
                      value={serviceFilter}
                      onChange={(e) => {
                        setServiceFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium"
                    >
                      <option value="all">All Services</option>
                      {uniqueServices.map((srv) => (
                        <option key={srv} value={srv}>
                          {srv}
                        </option>
                      ))}
                    </select>

                    {/* Sort selector */}
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as any)}
                      className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="name">Name (A-Z)</option>
                      <option value="status">Status</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submissions List */}
              {paginatedInquiries.length > 0 ? (
                <div className="space-y-4">
                  {paginatedInquiries.map((inq) => {
                    const isNew = inq.status === 'new';
                    const isInProgress = inq.status === 'in_progress' || inq.status === 'reviewed';
                    const isResponded = inq.status === 'responded' || inq.status === 'contacted';
                    const isCompleted = inq.status === 'completed';

                    const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
                    const whatsappLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;
                    const mailtoSubject = encodeURIComponent(
                      `Fresh Perspective Organization — Re: Your ${inq.service} Inquiry`
                    );
                    const mailtoBody = encodeURIComponent(
                      `Dear ${inq.fullName},\n\nThank you for reaching out to Fresh Perspective Organization regarding our ${inq.service} services.\n\nWe have reviewed your project requirements:\n"${inq.description}"\n\n`
                    );
                    const mailtoLink = `mailto:${inq.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

                    const dateFormatted = inq.createdAt
                      ? new Date(inq.createdAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Date unavailable';

                    return (
                      <div
                        key={inq.id}
                        className={`bg-white rounded-xl border p-5 shadow-xs transition-all ${
                          isNew
                            ? 'border-lime-400 bg-lime-50/15 ring-1 ring-lime-400/30'
                            : isInProgress
                            ? 'border-blue-200'
                            : 'border-slate-200'
                        }`}
                      >
                        {/* Header Row */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-extrabold text-[#0B132B]">
                                {inq.fullName}
                              </h4>
                              {inq.organization && (
                                <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                                  <Building className="w-3 h-3 text-slate-400" />
                                  {inq.organization}
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-lime-900 bg-lime-100 px-2.5 py-0.5 rounded-full border border-lime-200">
                                <Briefcase className="w-3 h-3 text-lime-700" />
                                {inq.service}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              <span>Submitted on {dateFormatted}</span>
                            </div>
                          </div>

                          {/* Status Dropdown and Delete Action */}
                          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-slate-500">Status:</span>
                              <select
                                value={inq.status}
                                onChange={(e) =>
                                  handleStatusChange(inq.id!, e.target.value as InquiryStatus)
                                }
                                className={`text-xs font-extrabold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                                  isNew
                                    ? 'bg-lime-100 text-lime-900 border-lime-400'
                                    : isInProgress
                                    ? 'bg-blue-100 text-blue-900 border-blue-300'
                                    : isResponded
                                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                                    : 'bg-slate-100 text-slate-700 border-slate-300'
                                }`}
                              >
                                <option value="new">New</option>
                                <option value="in_progress">In Progress</option>
                                <option value="responded">Responded</option>
                                <option value="completed">Completed</option>
                              </select>
                            </div>

                            <button
                              type="button"
                              onClick={() => setItemToDelete(inq)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete submission"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Contact & Meta Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-4">
                          <div>
                            <span className="font-bold text-slate-700 block mb-0.5">Email Address:</span>
                            <a
                              href={mailtoLink}
                              className="text-blue-600 hover:underline break-all font-medium inline-flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3 shrink-0" />
                              <span>{inq.email}</span>
                            </a>
                          </div>

                          <div>
                            <span className="font-bold text-slate-700 block mb-0.5">Phone / WhatsApp:</span>
                            {inq.phone ? (
                              <div className="flex items-center gap-2">
                                <a
                                  href={`tel:${inq.phone}`}
                                  className="text-slate-800 hover:text-blue-600 font-medium inline-flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{inq.phone}</span>
                                </a>
                                {whatsappLink && (
                                  <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-1.5 py-0.5 rounded transition-colors"
                                  >
                                    WhatsApp
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400">Not provided</span>
                            )}
                          </div>

                          <div>
                            <span className="font-bold text-slate-700 block mb-0.5">Budget Range:</span>
                            <span className="text-slate-700 font-medium">
                              {inq.budgetRange || 'Flexible / To be discussed'}
                            </span>
                          </div>

                          <div>
                            <span className="font-bold text-slate-700 block mb-0.5">Preferred Deadline:</span>
                            <span className="text-slate-700 font-medium">
                              {inq.preferredDeadline || 'Flexible'}
                            </span>
                          </div>
                        </div>

                        {/* Message / Description */}
                        <div className="mb-4">
                          <span className="text-xs font-bold text-[#0B132B] block mb-1">
                            Client Message & Project Scope:
                          </span>
                          <div className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                            {inq.description}
                          </div>
                        </div>

                        {/* Internal Notes Section */}
                        <div className="pt-3 border-t border-slate-100">
                          {activeNotesId === inq.id ? (
                            <div className="space-y-2 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                              <label className="block text-xs font-bold text-amber-900">
                                Internal Administrator Notes (Visible only to authorized staff):
                              </label>
                              <textarea
                                value={notesDraft}
                                onChange={(e) => setNotesDraft(e.target.value)}
                                rows={3}
                                placeholder="Add follow-up notes, quote price provided, scheduled meetings, or internal updates..."
                                className="w-full text-xs p-2.5 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setActiveNotesId(null)}
                                  className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  disabled={isSavingNotes}
                                  onClick={() => handleSaveNotes(inq.id!)}
                                  className="px-3 py-1 text-xs font-bold bg-[#0B132B] text-white hover:bg-slate-800 rounded-md flex items-center gap-1 shadow-xs disabled:opacity-50"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>{isSavingNotes ? 'Saving...' : 'Save Notes'}</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                              <div className="flex-1">
                                {inq.internalNotes ? (
                                  <div className="text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 flex items-start gap-2">
                                    <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                    <div className="flex-1">
                                      <span className="font-bold text-slate-700 mr-1">
                                        Internal Note:
                                      </span>
                                      <span className="text-slate-600">{inq.internalNotes}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic">No internal notes added yet.</span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveNotesId(inq.id!);
                                    setNotesDraft(inq.internalNotes || '');
                                  }}
                                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                                >
                                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                                  <span>{inq.internalNotes ? 'Edit Notes' : 'Add Note'}</span>
                                </button>

                                {/* Quick Contact Buttons */}
                                <a
                                  href={mailtoLink}
                                  className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  <span>Reply by Email</span>
                                </a>

                                {whatsappLink && (
                                  <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>WhatsApp Chat</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty state */
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#0B132B] mb-1">
                    No Inquiries or Quote Requests Found
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                    {searchQuery || statusFilter !== 'all' || serviceFilter !== 'all'
                      ? 'No submissions match your active search or filter criteria. Try clearing filters to see all submissions.'
                      : 'No inquiries have been received yet. Any quotes or messages submitted via website forms will appear here in real-time.'}
                  </p>
                  {(searchQuery || statusFilter !== 'all' || serviceFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setServiceFilter('all');
                        setCurrentPage(1);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}

              {/* Pagination Controls */}
              {filteredInquiries.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
                  <div className="text-slate-500">
                    Showing{' '}
                    <span className="font-bold text-slate-800">
                      {Math.min(
                        (currentPage - 1) * itemsPerPage + 1,
                        filteredInquiries.length
                      )}
                    </span>{' '}
                    to{' '}
                    <span className="font-bold text-slate-800">
                      {Math.min(currentPage * itemsPerPage, filteredInquiries.length)}
                    </span>{' '}
                    of <span className="font-bold text-slate-800">{filteredInquiries.length}</span>{' '}
                    submissions
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Per page:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-700"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
                        aria-label="Previous Page"
                      >
                        <ChevronLeft className="w-4 h-4 text-slate-600" />
                      </button>
                      <span className="px-2 font-bold text-slate-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        type="button"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
                        aria-label="Next Page"
                      >
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Permanent Deletion */}
      {itemToDelete && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-[#0B132B] text-center mb-1">
              Delete Submission?
            </h4>
            <p className="text-xs text-slate-500 text-center mb-5">
              Are you sure you want to permanently delete the inquiry from{' '}
              <strong className="text-slate-800">{itemToDelete.fullName}</strong> ({itemToDelete.email})?
              This record will be permanently removed from Cloud Firestore.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
