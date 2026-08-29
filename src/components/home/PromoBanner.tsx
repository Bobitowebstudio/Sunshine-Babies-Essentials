import React from 'react';
import { ArrowRight, GraduationCap, HeartHandshake, Sparkles, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PromotionalBanner } from '../../types';

export const PromoBanner: React.FC = () => {
  const { banners = [], setSelectedCategory, navigateTo } = useStore();

  const now = new Date().toISOString().split('T')[0];

  // Get active promo banners suitable for promo grid (or all)
  const promoBanners = banners
    .filter((b) => {
      if (!b.is_active) return false;
      if (b.placement && b.placement !== 'promo_grid' && b.placement !== 'all') return false;
      if (b.start_date && b.start_date > now) return false;
      if (b.end_date && b.end_date < now) return false;
      return true;
    })
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  // Fallback defaults if admin disabled all promo banners
  const displayBanners: PromotionalBanner[] = promoBanners.length > 0 ? promoBanners.slice(0, 4) : [
    {
      id: 'ban-promo-default-1',
      title: 'Equip Your Little Scholars For Success',
      subtitle: 'Back-to-School 2026 Collection',
      description: 'Orthopedic school shoes, leakproof thermal bento boxes, durable backpacks, and safe art supplies.',
      badge_text: 'BACK-TO-SCHOOL 2026',
      button_text: 'Shop Back-to-School',
      link_url: '/shop?category=cat-backtoschool',
      category_id: 'cat-backtoschool',
      image_url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
      mobile_image_url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
      bg_color: 'from-amber-950 via-slate-900 to-black',
      is_active: true,
      display_order: 1,
    },
    {
      id: 'ban-promo-default-2',
      title: 'Hospital Bag & Postpartum Recovery Essentials',
      subtitle: 'Mother & Baby Care',
      description: 'Pediatrician-formulated stretch mark oils, ergonomic nursing pillows, anti-colic feeding sets & organic cotton swaddles.',
      badge_text: 'MOTHER & BABY CARE',
      button_text: 'Explore Maternity Kits',
      link_url: '/shop?category=cat-maternity',
      category_id: 'cat-maternity',
      image_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
      mobile_image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
      bg_color: 'from-stone-900 via-amber-950/80 to-slate-950',
      is_active: true,
      display_order: 2,
    },
  ];

  const handleBannerClick = (ban: PromotionalBanner) => {
    if (ban.category_id) {
      setSelectedCategory(ban.category_id);
      navigateTo('shop');
      return;
    }

    if (ban.link_url) {
      if (ban.link_url.includes('cat-') || ban.link_url.includes('category=')) {
        const match = ban.link_url.match(/(cat-[a-z0-9_-]+)/);
        if (match) {
          setSelectedCategory(match[1]);
        }
      }
      if (ban.link_url.includes('contact')) {
        navigateTo('contact');
      } else {
        navigateTo('shop');
      }
    } else {
      navigateTo('shop');
    }
  };

  const getBadgeIcon = (title: string, badge: string) => {
    const text = `${title} ${badge}`.toLowerCase();
    if (text.includes('school') || text.includes('backpack') || text.includes('scholar')) {
      return <GraduationCap className="w-3.5 h-3.5" />;
    }
    if (text.includes('maternity') || text.includes('mother') || text.includes('postpartum') || text.includes('care')) {
      return <HeartHandshake className="w-3.5 h-3.5" />;
    }
    if (text.includes('gear') || text.includes('stroller')) {
      return <ShoppingBag className="w-3.5 h-3.5" />;
    }
    return <Sparkles className="w-3.5 h-3.5" />;
  };

  return (
    <section className="py-10 px-4 bg-slate-50 border-y border-slate-200/60">
      <div className={`max-w-7xl mx-auto grid gap-6 ${displayBanners.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {displayBanners.map((ban, idx) => {
          const isSecond = idx % 2 === 1;
          const bgGradient = ban.bg_color || (isSecond ? 'from-stone-900 via-amber-950/80 to-slate-950' : 'from-amber-950 via-slate-900 to-black');
          
          return (
            <div
              key={ban.id}
              className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${bgGradient} text-white p-6 sm:p-8 flex flex-col justify-between shadow-lg border border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:border-amber-500/50 group`}
            >
              {/* Responsive Category-Appropriate Background Image with Responsive Fallback */}
              <div className="absolute right-0 bottom-0 w-1/2 sm:w-5/12 h-full opacity-35 group-hover:opacity-45 transition-opacity pointer-events-none overflow-hidden">
                <picture className="w-full h-full block">
                  {ban.mobile_image_url && (
                    <source media="(max-width: 640px)" srcSet={ban.mobile_image_url} />
                  )}
                  <img
                    src={ban.image_url}
                    alt={ban.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
              </div>

              {/* Text Content */}
              <div className="relative z-10 space-y-3 max-w-sm sm:max-w-md">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
                  {getBadgeIcon(ban.title, ban.badge_text)}
                  <span>{ban.badge_text || 'Seasonal Special'}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-black text-white leading-tight">
                  {ban.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {ban.subtitle || ban.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="relative z-10 pt-6">
                <button
                  onClick={() => handleBannerClick(ban)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                    isSecond
                      ? 'bg-white hover:bg-slate-100 text-slate-900'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  <span>{ban.button_text || 'Explore Collection'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
