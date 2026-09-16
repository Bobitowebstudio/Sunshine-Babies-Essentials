import React from 'react';
import {
  Heart,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Headphones,
  MapPin,
  Navigation,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Smile,
  Truck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../common/BrandLogo';
import { getWhatsAppUrl } from '../../lib/utils';

export const AboutPage: React.FC = () => {
  const { companySettings, navigateTo } = useStore();

  const directWhatsAppUrl = getWhatsAppUrl(
    companySettings.whatsapp_number,
    `Hello ${companySettings.business_name}! I am contacting you from the About Us page.`
  );

  const directionsUrl =
    companySettings.google_maps_url && companySettings.google_maps_url.trim().length > 0
      ? companySettings.google_maps_url
      : `https://maps.google.com/?q=${encodeURIComponent(
          `${companySettings.business_name || 'Sunshine Babies Essentials'} ${
            companySettings.city || 'Abuja'
          } ${companySettings.state || 'FCT'} Nigeria`
        )}`;

  const beliefCards = [
    {
      icon: ShieldCheck,
      color: 'text-amber-600 bg-amber-100',
      title: 'Quality First',
      description:
        'Every baby clothing piece, nursery item, feeding accessory, and maternity essential is hand-inspected for safety, skin friendliness, and durability.',
    },
    {
      icon: Heart,
      color: 'text-rose-600 bg-rose-100',
      title: 'Baby Comfort',
      description:
        'We prioritize gentle, breathable fabrics, ergonomic baby gear, and non-toxic materials so your little one stays comfortable, safe, and happy all day.',
    },
    {
      icon: ShoppingBag,
      color: 'text-blue-600 bg-blue-100',
      title: 'Parent-Friendly Shopping',
      description:
        'From instant WhatsApp ordering to fast dispatch across Abuja and nationwide, we make shopping for your growing family effortless and stress-free.',
    },
    {
      icon: Headphones,
      color: 'text-emerald-600 bg-emerald-100',
      title: 'Reliable Customer Care',
      description:
        'Our friendly support team is always ready to assist you with sizing questions, hospital bag preparation checklists, and custom order assistance.',
    },
  ];

  // Default Abuja coordinates
  const lat = companySettings.latitude || 9.0765;
  const lon = companySettings.longitude || 7.3986;

  // OpenStreetMap embed URL centered on Abuja
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.08}%2C${lat - 0.05}%2C${lon + 0.08}%2C${lat + 0.05}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-amber-200">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white py-16 sm:py-20 px-4">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Welcome to Sunshine Babies Essentials</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            About {companySettings.business_name || 'Sunshine Babies Essentials'}
          </h1>

          <p className="text-lg sm:text-xl font-medium text-amber-300 italic max-w-2xl mx-auto">
            “{companySettings.tagline || "Your baby's comfort is our biggest priority."}”
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {companySettings.description ||
              'A baby and maternity essentials store dedicated to providing quality products for babies, mothers, and families.'}
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('shop')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all hover:scale-105 cursor-pointer text-xs sm:text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Our Catalog</span>
            </button>
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all text-xs sm:text-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Chat with Our Team</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="py-14 sm:py-18 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column - Story Text */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                <Smile className="w-3.5 h-3.5 text-amber-600" />
                <span>Our Story & Mission</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
                Caring for Mothers, Babies & Growing Families
              </h2>

              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  {companySettings.about_story ||
                    'Sunshine Babies Essentials was created to support parents and families with thoughtfully selected essentials for every step of childhood. Based in Abuja, FCT, Nigeria, we curate top-tier maternity wear, newborn nursery essentials, pediatric-safe feeding gear, cozy infant clothing, and educational essentials.'}
                </p>
                <p>
                  We understand that welcoming a baby and raising children is one of life’s most joyful yet demanding journeys. That is why every single product in our catalog is chosen with deep care for safety, gentle comfort, and everyday convenience for busy parents.
                </p>
              </div>

              {/* Quick highlights checklist */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Quality baby & maternity essentials',
                  'Comfort & convenience for parents',
                  'Carefully selected & pediatric-safe',
                  'Reliable nationwide delivery',
                  'Direct WhatsApp order assistance',
                  'Family-focused shopping experience',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Visual Brand Identity Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-inner">
              <div className="space-y-3">
                <div className="p-3 bg-white/95 rounded-xl inline-block shadow-sm">
                  <BrandLogo inverted={false} size="md" showTagline={false} />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {companySettings.business_name || 'Sunshine Babies Essentials'}
                </h3>
                <p className="text-xs text-amber-300 italic">
                  “{companySettings.tagline || "Your baby's comfort is our biggest priority."}”
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Based in:</strong> {companySettings.city || 'Abuja'},{' '}
                    {companySettings.state || 'FCT'}, {companySettings.country || 'Nigeria'}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Delivery:</strong> Express delivery across Abuja & nationwide courier dispatch
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigateTo('shop')}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What We Believe Section */}
      <section className="py-14 bg-white border-y border-slate-200/80 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Our Commitments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
              What We Believe
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Four core principles that guide our product selection and customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {beliefCards.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl border border-slate-200/70 p-6 flex flex-col justify-between hover:border-amber-400/60 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="space-y-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Abuja Location & Interactive Map Section */}
      <section id="location-section" className="py-14 sm:py-18 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Visit Us / Our Location</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
              Our Location in Abuja, FCT
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {companySettings.business_name || 'Sunshine Babies Essentials'} is proud to be based in the Federal Capital Territory, serving families across Abuja and nationwide.
            </p>
          </div>

          {/* Location Details & Map Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left info panel (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-slate-900 text-white">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Abuja, FCT, Nigeria</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    {companySettings.business_name || 'Sunshine Babies Essentials'}
                  </h3>
                  <p className="text-xs text-amber-300 mt-1">
                    {companySettings.city || 'Abuja'}, {companySettings.state || 'FCT'},{' '}
                    {companySettings.country || 'Nigeria'}
                  </p>
                </div>

                {companySettings.address && companySettings.address.trim().length > 0 ? (
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      Physical Address
                    </span>
                    <p className="font-medium text-white">{companySettings.address}</p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      Service Hub
                    </span>
                    <p>
                      Serving customers across Abuja Municipal Area and all surrounding districts with door-to-door delivery & nationwide shipping.
                    </p>
                  </div>
                )}

                <div className="space-y-2 pt-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">WhatsApp Desk:</span>
                    <span className="font-semibold text-emerald-400">
                      {companySettings.whatsapp_number || '+234 903 466 5968'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-semibold text-white">
                      {companySettings.email || 'info@sunshinebabies.com'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-400">Delivery Scope:</span>
                    <span className="font-semibold text-amber-300">Abuja & Nationwide</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-4">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>

                <button
                  onClick={() => navigateTo('contact')}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Headphones className="w-3.5 h-3.5 text-amber-400" />
                  <span>Contact Customer Support</span>
                </button>
              </div>
            </div>

            {/* Right Map Container (7 cols) */}
            <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[420px] bg-slate-100 flex flex-col">
              {/* Map embed iframe */}
              <iframe
                title="Sunshine Babies Essentials - Abuja Location Map"
                src={osmEmbedUrl}
                className="w-full h-full min-h-[340px] sm:min-h-[420px] border-0"
                loading="lazy"
              />

              {/* Floating map pin pill */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs border border-slate-200/80 rounded-xl px-3.5 py-2 shadow-lg flex items-center gap-2.5 z-10">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {companySettings.business_name || 'Sunshine Babies Essentials'}
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight">
                    {companySettings.city || 'Abuja'}, {companySettings.state || 'FCT'}, Nigeria
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
