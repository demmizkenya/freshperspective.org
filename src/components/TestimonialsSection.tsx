import React, { useState } from 'react';
import { Quote, Star, PlusCircle, CheckCircle, X, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';

interface TestimonialsSectionProps {
  onRequestQuote?: (serviceTitle?: string) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onRequestQuote }) => {
  const { testimonials, submitTestimonial } = useData();

  // Testimonial submission modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [title, setTitle] = useState('');
  const [service, setService] = useState('Graphic Design');
  const [rating, setRating] = useState<number>(5);
  const [quote, setQuote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  const resetForm = () => {
    setName('');
    setOrganization('');
    setTitle('');
    setService('Graphic Design');
    setRating(5);
    setQuote('');
    setErrorMsg(null);
    setSuccessSubmitted(false);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsSubmitModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSubmitModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!quote.trim() || quote.trim().length < 10) {
      setErrorMsg('Please enter a descriptive testimonial (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitTestimonial({
        name: name.trim(),
        title: title.trim(),
        organization: organization.trim(),
        quote: quote.trim(),
        service: service.trim(),
        rating,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to submit testimonial.');
        setIsSubmitting(false);
        return;
      }

      setSuccessSubmitted(true);
      setIsSubmitting(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting.');
      setIsSubmitting(false);
    }
  };

  const serviceOptions = [
    'Graphic Design',
    'Brand Video & Commercial',
    'Web Development',
    'Digital Marketing',
    'Content Creation',
    'Social Media Management',
    'Copywriting',
    'Corporate Consulting & Strategy',
    'Event Production & Coverage',
    'AI Photography & Media',
  ];

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
          <div className="max-w-3xl">
            <div className="inline-block text-xs sm:text-sm font-black uppercase tracking-wider text-lime-950 bg-lime-200 px-4 py-1.5 rounded-lg mb-3 border border-lime-300">
              Client Testimonials & Feedback
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-3">
              Valued Client Perspectives
            </h2>
            <p className="text-lg sm:text-xl text-slate-800 font-semibold leading-relaxed">
              Genuine endorsements from corporate partners, brands, and institutions who experience
              our commitment: Timely Delivery With Valuable Works Done.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Submit Testimonial Button */}
            <button
              onClick={handleOpenModal}
              className="bg-[#0B132B] hover:bg-slate-800 text-lime-400 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-sm hover:shadow transition-all inline-flex items-center gap-2 border border-slate-700 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-lime-400" />
              <span>Submit Your Testimonial</span>
            </button>

            {onRequestQuote && (
              <button
                onClick={() => onRequestQuote('Consulting & Services')}
                className="bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-sm hover:shadow transition-all shrink-0 animate-quote-pulse cursor-pointer"
              >
                Start Your Project →
              </button>
            )}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-7 sm:p-8 flex flex-col justify-between hover:border-lime-400 hover:shadow-lg transition-all relative group"
            >
              <div>
                {/* Top Quote Icon & Rating */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lime-700 shadow-2xs group-hover:bg-[#0B132B] group-hover:text-lime-400 transition-colors">
                    <Quote className="w-5 h-5 fill-current" />
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>

                {/* Service Tag */}
                {t.service && (
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-lime-900 bg-lime-100 border border-lime-200 px-2.5 py-1 rounded-md">
                      {t.service}
                    </span>
                  </div>
                )}

                {/* Quote Text */}
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed italic font-medium mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#0B132B] text-lime-400 font-black text-sm flex items-center justify-center shrink-0 border border-slate-700 shadow-xs">
                  {t.name
                    ? t.name
                        .split(' ')
                        .map((n) => n[0])
                        .filter((_, idx, arr) => idx === 0 || idx === arr.length - 1)
                        .join('')
                    : 'FP'}
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-[#0B132B] leading-tight">
                    {t.name}
                  </h4>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    {t.title && <span>{t.title}</span>}
                    {t.title && t.organization && <span> &bull; </span>}
                    {t.organization && <span className="text-slate-900 font-bold">{t.organization}</span>}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Strip */}
        <div className="bg-[#0B132B] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-lime-400 mb-1">100%</div>
              <div className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wide">
                On-Time Milestone Delivery
              </div>
              <p className="text-xs text-slate-400 mt-1">Guaranteed milestone completion</p>
            </div>
            <div className="p-3 border-y sm:border-y-0 sm:border-x border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-lime-400 mb-1">5.0 ★</div>
              <div className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wide">
                Verified Client Satisfaction
              </div>
              <p className="text-xs text-slate-400 mt-1">Across corporate & creative engagements</p>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-lime-400 mb-1">Multi-Sector</div>
              <div className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wide">
                Cross-Disciplinary Roster
              </div>
              <p className="text-xs text-slate-400 mt-1">Creative, consulting & technical solutions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visitor Testimonial Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-[#0B132B] text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="font-black text-lg text-white">
                  Share Your Client Experience
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Submit your testimonial for Fresh Perspective Organization
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {successSubmitted ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-[#0B132B] mb-2">
                    Testimonial Received!
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-sm mx-auto">
                    Thank you for sharing your experience! In accordance with our review process, your
                    testimonial will be reviewed by the administrator and will automatically appear in this
                    public section upon approval.
                  </p>
                  <button
                    onClick={handleCloseModal}
                    className="bg-[#0B132B] hover:bg-slate-800 text-lime-400 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dr. Anthony Adeleke"
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-lime-500 focus:bg-white transition-all font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Role / Title <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Managing Director"
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-lime-500 focus:bg-white transition-all font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Organization / Company <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. Apex Brand Ventures"
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-lime-500 focus:bg-white transition-all font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Service Received
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-lime-500 focus:bg-white transition-all font-medium text-slate-900"
                      >
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Rating
                    </label>
                    <div className="flex items-center gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 fill-slate-100'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-bold text-slate-600">
                        {rating} out of 5 stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Testimonial Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      placeholder="Describe your collaboration, project milestones, quality of service, and timely delivery with Fresh Perspective Organization..."
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-lime-500 focus:bg-white transition-all font-medium text-slate-900 leading-relaxed"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                    <span className="font-bold">Notice:</span>
                    <span>
                      To maintain community trust and prevent duplicates, all submissions are reviewed by
                      an administrator before appearing publicly.
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={isSubmitting}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-sm hover:shadow transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Submit for Review</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
