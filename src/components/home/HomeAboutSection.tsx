import React, { useState } from 'react';
import { ArrowRight, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const DEFAULT_ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1000&q=80';

export const HomeAboutSection: React.FC = () => {
  const { companySettings, navigateTo } = useStore();
  const [imgError, setImgError] = useState(false);

  if (companySettings.show_homepage_about === false) {
    return null;
  }

  const badgeText = companySettings.homepage_about_badge || 'ABOUT US';
  const heading =
    companySettings.homepage_about_heading ||
    companySettings.business_name ||
    'Sunshine Babies Essentials';
  const tagline =
    companySettings.tagline || 'Your baby’s comfort is my biggest priority.';
  const description1 =
    companySettings.homepage_about_description ||
    'Sunshine Babies Essentials is dedicated to providing quality baby and maternity essentials carefully selected with the comfort, safety and needs of mothers and babies in mind.';
  const description2 =
    companySettings.homepage_about_description_2 ||
    'Our goal is to make shopping for your little one easier by bringing together trusted baby products, maternity essentials and everyday necessities in one convenient place.';
  const buttonText =
    companySettings.homepage_about_button_text || 'Learn More About Us';
  const imageUrl =
    !imgError && companySettings.homepage_about_image
      ? companySettings.homepage_about_image
      : DEFAULT_ABOUT_IMAGE;

  const handleLearnMore = () => {
    const link = companySettings.homepage_about_link || '/about';
    if (link === '/about' || link === 'about') {
      navigateTo('about');
    } else if (link.startsWith('http')) {
      window.location.href = link;
    } else {
      navigateTo('about');
    }
  };

  return (
    <section
      id="home-about-us-section"
      aria-label="About Sunshine Babies Essentials"
      className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN: Professional Mother & Baby Imagery */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Decorative warm background glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber-200/50 via-rose-100/30 to-amber-100/40 rounded-3xl blur-lg -z-10 opacity-70" />

              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-amber-200/60 bg-white aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src={imageUrl}
                  alt="Mother and baby caring moment - Sunshine Babies Essentials"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating pill highlight badge */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-lg border border-amber-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                    <Heart className="w-5 h-5 fill-slate-950" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      Caring for Little Ones
                    </p>
                    <p className="text-[11px] text-amber-700 font-medium">
                      Mother, Baby &amp; Maternity Care
                    </p>
                  </div>
                </div>
              </div>

              {/* Small floating badge in top right corner */}
              <div className="hidden sm:flex absolute -top-3 -right-3 bg-amber-500 text-slate-950 px-3 py-1.5 rounded-full shadow-md text-xs font-bold items-center gap-1.5 border border-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Trusted Essentials</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: About Information & Actions */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            {/* Small Gold / Amber Label */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{badgeText}</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              {heading}
            </h2>

            {/* Tagline */}
            {tagline && (
              <p className="text-sm sm:text-base font-semibold text-amber-700 italic">
                “{tagline}”
              </p>
            )}

            {/* Short Introduction Paragraphs */}
            <div className="space-y-3.5 text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              <p>{description1}</p>
              {description2 && <p>{description2}</p>}
            </div>

            {/* Value Highlights List */}
            <div className="pt-1 pb-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Carefully selected for safety</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Comfort for mothers &amp; babies</span>
              </div>
            </div>

            {/* Learn More Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                id="home-about-learn-more-btn"
                onClick={handleLearnMore}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 text-sm font-bold rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
