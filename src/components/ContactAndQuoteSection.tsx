import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

interface ContactAndQuoteSectionProps {
  initialService?: string;
}

export const ContactAndQuoteSection: React.FC<ContactAndQuoteSectionProps> = ({
  initialService,
}) => {
  const { siteSettings, submitInquiry } = useData();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [service, setService] = useState('Graphic Design');
  const [description, setDescription] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [preferredDeadline, setPreferredDeadline] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialService) {
      setService(initialService);
    }
  }, [initialService]);

  const serviceOptions = [
    'Graphic Design',
    'Content Creation',
    'Web Development',
    'Digital Marketing',
    'Social Media Management',
    'Copywriting',
    'Video Editing',
    'AI Photography',
    'Virtual Assistant Services',
    'General Consultation',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!service.trim()) {
      setErrorMessage('Please select the service required.');
      return;
    }
    if (!description.trim() || description.trim().length < 5) {
      setErrorMessage('Please provide a project description (minimum 5 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitInquiry({
        fullName,
        email,
        phone,
        organization,
        service,
        description,
        budgetRange,
        preferredDeadline,
      });

      if (res.success) {
        setSubmitSuccess(true);
        setFullName('');
        setEmail('');
        setPhone('');
        setOrganization('');
        setDescription('');
        setBudgetRange('');
        setPreferredDeadline('');
      } else {
        setErrorMessage(res.error || 'Submission failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while saving your inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Direct Contact Column */}
          <div className="lg:col-span-5">
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-lime-800 bg-lime-100 px-3 py-1 rounded mb-3">
              Contact
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight mb-3">
              Get in Touch
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Connect directly with our team for consultations, proposals, and project delivery inquiries.
            </p>

            <div className="space-y-3 mb-6 text-sm">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Email
                </div>
                <a
                  href="mailto:freshperspectiveorganization@gmail.com"
                  className="font-bold text-[#0B132B] hover:text-lime-700 break-all"
                >
                  freshperspectiveorganization@gmail.com
                </a>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  WhatsApp & Phone
                </div>
                <a
                  href={siteSettings.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0B132B] hover:text-lime-700"
                >
                  +234 903 186 0768
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-lime-50 border border-lime-200 text-xs text-slate-700">
              <div className="font-bold text-[#0B132B] mb-1">Guaranteed Response</div>
              <p>
                Inquiries saved to Cloud Firestore are reviewed by our project leads within 24 business hours.
              </p>
            </div>
          </div>

          {/* Quote Form Column */}
          <div className="lg:col-span-7" id="quote">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-[#0B132B] mb-1">
                Request a Quote
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Complete your project details below. Stored securely in Cloud Firestore.
              </p>

              {submitSuccess ? (
                <div className="bg-white border border-lime-400 rounded-xl p-6 text-center">
                  <h4 className="text-lg font-bold text-[#0B132B] mb-2">
                    Inquiry Confirmed & Saved
                  </h4>
                  <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                    Thank you. Your project brief is saved in Cloud Firestore. Our team will contact you promptly.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="text-xs font-bold bg-[#0B132B] text-white px-4 py-2 rounded-lg"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#0B132B] uppercase mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#0B132B] uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#0B132B] uppercase mb-1">
                        Phone or WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234..."
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#0B132B] uppercase mb-1">
                        Organization (Optional)
                      </label>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Company or organization"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#0B132B] uppercase mb-1">
                      Service Required *
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B] font-medium"
                    >
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#0B132B] uppercase mb-1">
                      Project Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your project requirements and scope..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#0B132B] uppercase mb-1">
                        Budget Range (Optional)
                      </label>
                      <input
                        type="text"
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                        placeholder="e.g. Standard"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#0B132B] uppercase mb-1">
                        Preferred Deadline (Optional)
                      </label>
                      <input
                        type="text"
                        value={preferredDeadline}
                        onChange={(e) => setPreferredDeadline(e.target.value)}
                        placeholder="e.g. Within 2 weeks"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#0B132B]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#74C01E] hover:bg-[#65A30D] text-[#0B132B] font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-sm hover:shadow disabled:opacity-60 animate-quote-pulse"
                  >
                    {isSubmitting ? 'Saving to Cloud Firestore...' : 'Submit Project Brief & Request Quote'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
