import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CategoryGrid: React.FC = () => {
  const { categories, products, setSelectedCategory, navigateTo } = useStore();

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    navigateTo('shop');
  };

  return (
    <section className="py-12 px-4 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Curated Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
              Popular Categories
            </h2>
          </div>

          <button
            onClick={() => {
              setSelectedCategory(null);
              navigateTo('shop');
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 transition-colors cursor-pointer group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Bento/Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {categories.filter((c) => c.is_active).map((cat) => {
            const count = products.filter((p) => p.category_id === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-amber-400 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
              >
                <div className="aspect-4/3 w-full bg-slate-100 overflow-hidden relative">
                  <>{cat.image_url ? (<img src={cat.image_url} alt={cat.name} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" loading="lazy" />) : (<div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400"><span className="text-xs font-semibold">{cat.name}</span></div>)}</>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                  <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-white/90 text-slate-800 text-[10px] font-bold shadow-xs backdrop-blur-xs">
                    {count} {count === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="p-3 text-center flex-1 flex flex-col justify-center">
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-amber-700 transition-colors leading-tight line-clamp-1">
                    {cat.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

