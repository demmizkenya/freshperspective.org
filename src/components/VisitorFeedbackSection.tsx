import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';

export const VisitorFeedbackSection: React.FC = () => {
  const { feedbackList, submitFeedback } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('General Feedback');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!message.trim() || message.trim().length < 10) {
      setErrorMsg('Please enter a constructive feedback message (at least 10 characters).');
      return;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setErrorMsg('Please enter a valid email address, or leave it blank.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await submitFeedback({
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        message: message.trim(),
        category,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to submit feedback.');
        setIsSubmitting(false);
        return;
      }

      setSuccessMsg(
        'Thank you! Your feedback has been received. Our administrative team will review it shortly.'
      );
      setName('');
      setEmail('');
      setMessage('');
      setCategory('General Feedback');
      setIsSubmitting(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting.');
      setIsSubmitting(false);
    }
  };

  const categories = [
    'General Feedback',
    'Service Experience',
    'Website Usability & Design',
    'Turnaround & Timely Delivery',
    'Recommendation & Ideas',
  ];

  return (
    <section id="feedback" className="py-20 md:py-28 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-lime-950 bg-lime-200 px-4 py-1.5 rounded-lg mb-3 border border-lime-300">
            <MessageSquare className="w-4 h-4 text-[#0B132B]" />
            <span>Community Voice</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-3">
            Visitor Feedback
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-800 font-semibold leading-relaxed">
            We value your insights, recommendations, and experience with Fresh Perspective Organization.
            Share your thoughts below to help us continuously enhance our services.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Form on Left, Approved Feedback on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-[#0B132B]">
                  Leave Your Feedback
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your feedback helps us maintain timely delivery and valuable service standards.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Privacy Protected</span>
              </div>
            </div>

            {successMsg && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-900 text-xs sm:text-sm animate-in fade-in duration-200">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-800">Feedback Submitted</div>
                  <div className="mt-0.5">{successMsg}</div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Samuel Boateng"
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-lime-500 focus:bg-white transition-all font-medium text-slate-900"
                  />
                </div>

                {/* Email Address (Optional & Protected) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@example.com"
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-lime-500 focus:bg-white transition-all font-medium text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    🔒 Strictly confidential — never published.
                  </span>
                </div>
              </div>

              {/* Feedback Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Feedback Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-lime-500 focus:bg-white transition-all font-medium text-slate-900"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Feedback Message (Required) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Feedback Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts, suggestions, impressions, or questions regarding our organization or website..."
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-lime-500 focus:bg-white transition-all font-medium text-slate-900 leading-relaxed"
                />
              </div>

              {/* Privacy and Approval Disclosure */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 leading-relaxed">
                <span className="font-bold text-[#0B132B]">Review Policy: </span>
                All feedback is kept private by default. Only feedback explicitly approved by an
                authorized administrator is displayed publicly. Email addresses are never exposed.
              </div>

              {/* Submit Feedback Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] font-extrabold px-8 py-3.5 rounded-xl text-xs sm:text-sm shadow-sm hover:shadow transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Submit Feedback</span>
                </button>
              </div>
            </form>
          </div>

          {/* Approved Feedback Showcase Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-sm text-[#0B132B] uppercase tracking-wider">
                  Approved Visitor Notes
                </h4>
                <span className="text-xs font-bold text-lime-800 bg-lime-100 px-2.5 py-0.5 rounded-md">
                  {feedbackList.length} Published
                </span>
              </div>

              {feedbackList.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {feedbackList.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-lime-300 transition-all text-xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-[#0B132B]">
                          {item.name || 'Valued Visitor'}
                        </span>
                        {item.category && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-sm">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 leading-relaxed italic mb-2">
                        &ldquo;{item.message}&rdquo;
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium pt-2 border-t border-slate-200/60">
                        <span>Verified Feedback</span>
                        {item.createdAt && (
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-600">No public feedback yet</p>
                  <p className="text-[11px] mt-1 text-slate-600">
                    Be the first visitor to share feedback using the form on the left.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Assurance Box */}
            <div className="bg-[#0B132B] text-white rounded-2xl p-6 shadow-sm border border-slate-800">
              <h5 className="font-black text-sm text-lime-400 mb-1">
                Admin Review & Moderation
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fresh Perspective Organization ensures that public visitor spaces remain constructive,
                truthful, and safe. Unapproved and rejected submissions are strictly sequestered and
                never published.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
