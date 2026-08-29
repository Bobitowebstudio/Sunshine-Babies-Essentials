import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  Facebook,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from './BrandLogo';
import { getWhatsAppUrl } from '../../lib/utils';

export const Footer: React.FC = () => {
  const { companySettings, navigateTo, categories, setSelectedCategory } = useStore();

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    navigateTo('shop');
  };

  const directWhatsAppUrl = getWhatsAppUrl(
    companySettings.whatsapp_number,
    `Hello ${companySettings.business_name}! I have an inquiry about your baby & maternity catalog.`
  );

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-amber-500/20">
      {/* Top Value Proposition Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Certified Safe</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                BPA-Free, non-toxic materials rigorously verified for delicate babies.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Swift Nationwide Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Fast courier dispatch to Lagos, Abuja, Port Harcourt, and all states.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">WhatsApp Direct Ordering</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Instant personal assistance, customized messaging & easy order tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Mother & Baby Care Experts</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Friendly support for maternity, newborn and back-to-school essentials.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo inverted={true} size="lg" showTagline={true} />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {companySettings.description}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {companySettings.whatsapp_number && (
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {companySettings.instagram_url && (
                <a
                  href={companySettings.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {companySettings.facebook_url && (
                <a
                  href={companySettings.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className="text-slate-400 hover:text-amber-300 transition-colors cursor-pointer text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              About & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="text-slate-400 hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  About Sunshine Babies
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="text-slate-400 hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Contact & Inquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('track-order')}
                  className="text-slate-400 hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Track Your Package
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('account')}
                  className="text-slate-400 hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  My Account & Orders
                </button>
              </li>
              <li>
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors inline-block"
                >
                  WhatsApp Ordering Desk
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              Location & Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">
                    {companySettings.business_name || 'Sunshine Babies Essentials'}
                  </span>
                  <span>
                    {companySettings.address && companySettings.address.trim().length > 0
                      ? `${companySettings.address}, `
                      : ''}
                    {companySettings.city || 'Abuja'}, {companySettings.state || 'FCT'},{' '}
                    {companySettings.country || 'Nigeria'}
                  </span>
                  <button
                    onClick={() => navigateTo('about')}
                    className="block text-[11px] text-amber-400 hover:underline mt-1 cursor-pointer"
                  >
                    View Abuja Location Map →
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${companySettings.phone}`} className="hover:text-white">
                  {companySettings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${companySettings.email}`} className="hover:text-white">
                  {companySettings.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {companySettings.business_name}. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-400">
              {companySettings.tagline || 'Only the best for your little bless'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
