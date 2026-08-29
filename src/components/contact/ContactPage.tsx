import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getWhatsAppUrl } from '../../lib/utils';
import { Inquiry } from '../../types';

export const ContactPage: React.FC = () => {
  const { companySettings, submitInquiry, currentUser } = useStore();

  const [name, setName] = useState(currentUser?.full_name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    submitInquiry({
      name,
      email: email || 'unspecified@customer.com',
      phone,
      subject: subject || 'General Store Inquiry',
      message,
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  const directWhatsAppUrl = getWhatsAppUrl(
    companySettings.whatsapp_number,
    `Hello ${companySettings.business_name}! I have an inquiry from your website.`
  );

  const faqs = [
    {
      q: 'How fast is nationwide delivery in Nigeria?',
      a: 'Orders in Lagos are typically delivered within 24 to 48 hours. Orders to Abuja, Port Harcourt, and other states take 2 to 4 business days via verified express couriers.',
    },
    {
      q: 'Can I order and confirm sizes directly via WhatsApp?',
      a: 'Yes! We encourage WhatsApp ordering. Simply tap the "Order via WhatsApp" button on any product or cart, and our customer support team will assist you with sizing, fabrics, and pictures.',
    },
    {
      q: 'Are your baby skincare and feeding products certified safe?',
      a: 'Absolutely. All feeding gear, silicone pacifiers, bottles, and maternity skincare products are strictly BPA-Free, hypoallergenic, non-toxic, and tested to pediatric standards.',
    },
    {
      q: 'What is your return or exchange policy?',
      a: 'We offer a 7-day hassle-free exchange policy for unused items in original packaging with tags attached (excluding personal intimate maternity hygiene items).',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>We Are Here For You</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-slate-900">
            Contact & Customer Support
          </h1>
          <p className="text-xs text-slate-500">
            Have questions about sizing, hospital bag essentials, or wholesale delivery? Reach out to our dedicated team.
          </p>
        </div>

        {/* Contact Info & Inquiries Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Quick Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-5">
              <h2 className="text-sm font-bold text-slate-900">Store Information</h2>

              {/* WhatsApp Priority Card */}
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 hover:bg-emerald-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-black block">WhatsApp Priority Chat</span>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Fast response time for orders & inquiries. Tap to chat immediately.
                  </p>
                  <span className="text-xs font-bold text-emerald-900 mt-1 inline-block">
                    {companySettings.whatsapp_number}
                  </span>
                </div>
              </a>

              {/* Phone, Email, Address */}
              <div className="space-y-4 text-xs pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Phone Hotline</span>
                    <a href={`tel:${companySettings.phone}`} className="text-slate-600 hover:text-amber-700">
                      {companySettings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Email Support</span>
                    <a
                      href={`mailto:${companySettings.email}`}
                      className="text-slate-600 hover:text-amber-700"
                    >
                      {companySettings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Store Location</span>
                    <p className="text-slate-600">
                      {companySettings.address && companySettings.address.trim().length > 0
                        ? `${companySettings.address}, `
                        : ''}
                      {companySettings.city || 'Abuja'}, {companySettings.state || 'FCT'},{' '}
                      {companySettings.country || 'Nigeria'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Customer Service Hours</span>
                    <p className="text-slate-600">Mon - Sat: 8:00 AM – 7:00 PM (WAT)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-serif font-black text-slate-900">Send an Inquiry</h2>
              <p className="text-xs text-slate-500">
                Our support team logs all inquiries and replies via WhatsApp or email promptly.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-sm font-bold text-emerald-950">Inquiry Received!</h3>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                    Thank you! A member of our team will contact you shortly on WhatsApp or email.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Fatima Bello"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        WhatsApp Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 803 123 4567"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="fatima@example.com"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Inquiry Topic / Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Newborn Hospital Essentials Kit"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      How can we assist you? *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please specify product details, preferred delivery location, or questions..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-serif font-black text-lg">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <h3>Frequently Asked Questions</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {faqs.map((faq, index) => (
              <div key={index} className="py-3.5">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-900 hover:text-amber-800 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === index ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed pl-1">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
