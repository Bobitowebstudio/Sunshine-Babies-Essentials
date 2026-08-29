import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, MessageCircle, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getWhatsAppUrl } from '../../lib/utils';

export const HeroBanner: React.FC = () => {
  const { banners, navigateTo, setSelectedCategory, companySettings } = useStore();
  
  // Filter active banners suitable for Hero placement and check scheduled dates if present
  const now = new Date().toISOString().split('T')[0];
  const activeBanners = (banners || [])
    .filter((b) => {
      if (!b.is_active) return false;
      if (b.placement && b.placement !== 'hero' && b.placement !== 'all') return false;
      if (b.start_date && b.start_date > now) return false;
      if (b.end_date && b.end_date < now) return false;
      return true;
    })
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex] || activeBanners[0];

  const handleCtaClick = () => {
    if (current.category_id) {
      setSelectedCategory(current.category_id);
      navigateTo('shop');
      return;
    }

    if (current.link_url) {
      if (current.link_url.includes('cat-') || current.link_url.includes('category=')) {
        const catMatch = current.link_url.match(/(cat-[a-z0-9_-]+)/);
        if (catMatch) {
          setSelectedCategory(catMatch[1]);
        }
      }
      if (current.link_url.includes('contact')) {
        navigateTo('contact');
      } else {
        navigateTo('shop');
      }
    } else {
      navigateTo('shop');
    }
  };

  const directWhatsAppUrl = getWhatsAppUrl(
    companySettings.whatsapp_number,
    `Hello ${companySettings.business_name}! I am looking for product recommendations from your "${current.title}" collection.`
  );

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 text-white">
      {/* Background Image Container with Gradient Overlay and Responsive Picture Support */}
      <div className="relative min-h-[440px] md:min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <picture className="w-full h-full block">
            {current.mobile_image_url && (
              <source media="(max-width: 640px)" srcSet={current.mobile_image_url} />
            )}
            <img
              src={current.image_url}
              alt={current.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-40 transition-all duration-700 scale-105"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16 w-full">
          <div className="max-w-2xl space-y-4 md:space-y-6">
            {/* Gold Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{current.badge_text || 'Exclusive Collection'}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white leading-tight tracking-tight drop-shadow-sm">
              {current.title}
            </h1>

            {/* Subtitle / Description */}
            <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
              {current.subtitle || current.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-shop-now-cta"
                onClick={handleCtaClick}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs md:text-sm tracking-wide transition-all shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 cursor-pointer group"
              >
                <span>{current.button_text || 'Shop Collection'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs md:text-sm font-semibold transition-all backdrop-blur-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Chat with Personal Shopper</span>
              </a>
            </div>

            {/* Value Indicators */}
            <div className="flex items-center gap-6 pt-4 text-xs text-slate-400 font-medium border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>100% Certified Safe</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Original Brand Quality</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Direct WhatsApp Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Slider Controls */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700/80 transition-all cursor-pointer shadow-md"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700/80 transition-all cursor-pointer shadow-md"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {activeBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === i ? 'w-6 bg-amber-400' : 'w-2 bg-slate-600'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
