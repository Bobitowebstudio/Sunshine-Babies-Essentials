import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  X,
  Search,
  Check,
  ChevronDown,
  ArrowUpDown,
  Sparkles,
  ShoppingBag,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { AgeGroup, AGE_GROUP_FILTER_OPTIONS } from '../../types';
import { formatCurrency } from '../../lib/utils';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'bestsellers';

const normalizeAge = (s: string) => (s || '').replace(/[–—]/g, '-').trim().toLowerCase();

export const ShopPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedAgeGroup,
    setSelectedAgeGroup,
    searchQuery,
    setSearchQuery,
    companySettings,
  } = useStore();

  // Local filter states
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(200000);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<'all' | 'featured' | 'deals'>('all');

  const ageGroups = AGE_GROUP_FILTER_OPTIONS;

  // Filtering and sorting pipeline
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.short_description.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Category filter
        if (selectedCategory && p.category_id !== selectedCategory) {
          return false;
        }

        // Age group filter
        if (selectedAgeGroup !== 'All') {
          const normSelected = normalizeAge(selectedAgeGroup);
          const normProductAge = normalizeAge(p.age_group);
          if (normProductAge !== normSelected) {
            return false;
          }
        }

        // In-stock only
        if (inStockOnly && (p.is_out_of_stock || p.stock_quantity <= 0)) {
          return false;
        }

        // Price filter
        const price = p.discount_price && p.discount_price > 0 ? p.discount_price : p.regular_price;
        if (price > priceMax) {
          return false;
        }

        // Tag filter
        if (selectedTag === 'featured' && !p.is_featured) return false;
        if (selectedTag === 'deals' && (!p.discount_price || p.discount_price >= p.regular_price))
          return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discount_price && a.discount_price > 0 ? a.discount_price : a.regular_price;
        const priceB = b.discount_price && b.discount_price > 0 ? b.discount_price : b.regular_price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'popular') return (b.reviews_count || 0) - (a.reviews_count || 0);
        if (sortBy === 'bestsellers') return (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0);
        // Default newest
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedAgeGroup,
    inStockOnly,
    priceMax,
    selectedTag,
    sortBy,
  ]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  const resetAllFilters = () => {
    setSelectedCategory(null);
    setSelectedAgeGroup('All');
    setSearchQuery('');
    setInStockOnly(false);
    setPriceMax(200000);
    setSelectedTag('all');
    setSortBy('newest');
  };

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedAgeGroup !== 'All' ||
    searchQuery !== '' ||
    inStockOnly ||
    priceMax < 200000 ||
    selectedTag !== 'all';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>Shop</span>
                <span>/</span>
                <span className="text-amber-800 font-bold">
                  {activeCategoryObj ? activeCategoryObj.name : 'All Products'}
                </span>
                {selectedAgeGroup !== 'All' && (
                  <>
                    <span>/</span>
                    <span className="text-amber-800 font-bold">{selectedAgeGroup}</span>
                  </>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
                {activeCategoryObj ? activeCategoryObj.name : 'Shop Products'}
              </h1>
              {activeCategoryObj?.description && (
                <p className="text-xs text-slate-600 mt-1 max-w-xl">
                  {activeCategoryObj.description}
                </p>
              )}
            </div>

            {/* Quick Tag Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedTag('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTag === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setSelectedTag('featured')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTag === 'featured'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Featured Only
              </button>
              <button
                onClick={() => setSelectedTag('deals')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTag === 'deals'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Special Discounts
              </button>
            </div>
          </div>
        </div>

        {/* Main Shop Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Left Sidebar Filter Column */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
              {/* Filter Header & Reset */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                  <span>Filter Products</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Categories
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategory === null
                        ? 'bg-amber-100/70 text-amber-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-[10px] text-slate-400">{products.length}</span>
                  </button>
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category_id === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                          selectedCategory === cat.id
                            ? 'bg-amber-100/70 text-amber-900 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-slate-400">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Age Group Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Age Group
                </h4>
                <div className="space-y-1">
                  {ageGroups.map((age) => (
                    <button
                      key={age}
                      onClick={() => setSelectedAgeGroup(age)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        selectedAgeGroup === age
                          ? 'bg-amber-100/70 text-amber-900 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{age}</span>
                      {selectedAgeGroup === age && <Check className="w-3.5 h-3.5 text-amber-700" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Max Price
                  </h4>
                  <span className="text-xs font-bold text-amber-800">
                    {formatCurrency(priceMax, companySettings.currency_symbol)}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>{formatCurrency(5000, companySettings.currency_symbol)}</span>
                  <span>{formatCurrency(200000, companySettings.currency_symbol)}</span>
                </div>
              </div>

              {/* Availability Filter Toggle */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-slate-800">In-Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right Product Grid Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Top Toolbar: Search, Result Count, Sort Dropdown, Mobile Filter Button */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button>

                <span className="text-xs text-slate-600 font-medium">
                  Showing <strong className="text-slate-900">{filteredProducts.length}</strong>{' '}
                  {filteredProducts.length === 1 ? 'product' : 'products'}
                </span>
              </div>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    aria-label="Sort products by"
                    className="pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="bestsellers">Best Sellers</option>
                    <option value="popular">Customer Favorites</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                    {activeCategoryObj?.name}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-rose-600"
                      onClick={() => setSelectedCategory(null)}
                    />
                  </span>
                )}
                {selectedAgeGroup !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                    {selectedAgeGroup}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-rose-600"
                      onClick={() => setSelectedAgeGroup('All')}
                    />
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                    "{searchQuery}"
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-rose-600"
                      onClick={() => setSearchQuery('')}
                    />
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                    In-Stock Only
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-rose-600"
                      onClick={() => setInStockOnly(false)}
                    />
                  </span>
                )}
                <button
                  onClick={resetAllFilters}
                  className="text-[11px] font-bold text-amber-800 hover:text-rose-600 underline ml-1 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">No matching products found</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Try adjusting your search criteria, price range, or category filter.
                  </p>
                </div>
                <button
                  onClick={resetAllFilters}
                  className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full p-5 overflow-y-auto z-10 flex flex-col justify-between shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Filter Products</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-md text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Category
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-md text-xs font-semibold ${
                      selectedCategory === null ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-md text-xs font-semibold ${
                        selectedCategory === cat.id ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Group */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Age Group
                </h4>
                <div className="space-y-1">
                  {ageGroups.map((age) => (
                    <button
                      key={age}
                      onClick={() => {
                        setSelectedAgeGroup(age);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-md text-xs font-semibold ${
                        selectedAgeGroup === age ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                onClick={() => {
                  resetAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2 text-center text-xs font-bold text-rose-600"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
