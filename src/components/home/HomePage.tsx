import React from 'react';
import { HeroBanner } from './HeroBanner';
import { CategoryGrid } from './CategoryGrid';
import { FeaturedSection } from './FeaturedSection';
import { PromoBanner } from './PromoBanner';
import { HomeAboutSection } from './HomeAboutSection';
import { RecentlyViewed } from './RecentlyViewed';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Shopping Hero Banner */}
      <HeroBanner />

      {/* 2. Popular Categories */}
      <CategoryGrid />

      {/* 3. Featured Products, New Arrivals & Best Sellers */}
      <FeaturedSection />

      {/* 4. Seasonal & Back-to-School Promotional Banners */}
      <PromoBanner />

      {/* 5. About Sunshine Babies Essentials */}
      <HomeAboutSection />

      {/* 6. Recently Viewed */}
      <RecentlyViewed />
    </div>
  );
};
