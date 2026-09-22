import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HomeAboutSection: React.FC = () => {
  const { companySettings, navigateTo } = useStore();

  if (companySettings.show_homepage_about === false) {
    return null;
  }

  const badgeText =
    companySettings.homepage_about_badge || 'ABOUT US';

  const heading =
    companySettings.homepage_about_heading ||
    companySettings.business_name ||
    'Sunshine Babies Essentials';

  const tagline =
    companySettings.tagline ||
    "Your baby's comfort is our biggest priority.";

  const description1 =
    companySettings.homepage_about_description ||
    'Sunshine Babies Essentials is dedicated to providing quality baby and maternity essentials carefully selected with the comfort, safety and needs of mothers and babies in mind.';

  const description2 =
    companySettings.homepage_about_description_2 ||
    'Our goal is to make shopping for your little one easier by bringing together trusted baby products, maternity essentials and everyday necessities in one convenient place.';

  const buttonText =
    companySettings.homepage_about_button_text ||
    'Learn More About Us';

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
      className="w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 border-t border-slate-100"
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="w-full text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{badgeText}</span>
          </div>

          {/* Heading */}
          <h2 className="mt-5 w-full text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            {heading}
          </h2>

          {/* Tagline */}
          {tagline && (
            <p className="mt-4 text-base sm:text-lg font-semibold text-amber-700 italic">
              “{tagline}”
            </p>
          )}

          {/* Description */}
          <div className="mt-6 w-full max-w-3xl mx-auto space-y-4 text-sm sm:text-base leading-7 text-slate-600">
            <p>{description1}</p>
            <p>{description2}</p>
          </div>

          {/* Supporting values */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="flex items-start gap-3 text-left rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Carefully Selected
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Quality essentials selected with mothers and babies in mind.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Made For Families
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Practical products for everyday baby and maternity needs.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleLearnMore}
            className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
