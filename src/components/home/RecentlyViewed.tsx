import React from 'react';
import { History, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';

interface RecentlyViewedProps {
  excludeProductId?: string;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ excludeProductId }) => {
  const { recentlyViewed } = useStore();

  const filtered = excludeProductId
    ? recentlyViewed.filter((p) => p.id !== excludeProductId)
    : recentlyViewed;

  if (filtered.length === 0) return null;

  return (
    <section className="py-12 px-4 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-black text-slate-900">
                Recently Viewed Items
              </h3>
              <p className="text-xs text-slate-500">Pick up right where you left off</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
