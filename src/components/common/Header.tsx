import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  User,
  Phone,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Package,
  Heart,
  Store,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from './BrandLogo';
import { AnnouncementBar } from './AnnouncementBar';
import { formatCurrency, getWhatsAppUrl } from '../../lib/utils';
import { AgeGroup, AGE_GROUP_FILTER_OPTIONS } from '../../types';

export const Header: React.FC = () => {
  const {
    companySettings,
    cartItemCount,
    cartSubtotal,
    setIsCartOpen,
    activePage,
    navigateTo,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedAgeGroup,
    setSelectedAgeGroup,
    searchQuery,
    setSearchQuery,
    products,
    currentUser,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [ageDropdownOpen, setAgeDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Filter live search preview results
  const searchResults = localSearch.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(localSearch.toLowerCase()) ||
            p.sku.toLowerCase().includes(localSearch.toLowerCase()) ||
            p.short_description.toLowerCase().includes(localSearch.toLowerCase())
        )
        .slice(0, 5)
    : [];

  // Close search popup on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setSearchFocused(false);
    navigateTo('shop');
  };

  const handleAgeSelect = (age: AgeGroup | 'All') => {
    setSelectedAgeGroup(age);
    setAgeDropdownOpen(false);
    navigateTo('shop');
  };

  const handleCategorySelect = (catId: string | null) => {
    setSelectedCategory(catId);
    setCategoryDropdownOpen(false);
    navigateTo('shop');
  };

  const directWhatsAppUrl = getWhatsAppUrl(
    companySettings.whatsapp_number,
    `Hello ${companySettings.business_name}! 👋 I am browsing your website and would like assistance with an order.`
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* Professional Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 lg:py-3.5 flex items-center justify-between gap-3 sm:gap-4 lg:gap-6">
        {/* Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <BrandLogo onClick={() => navigateTo('home')} size="md" showTagline={true} />
        </div>

        {/* Live Search Bar */}
        <div ref={searchRef} className="relative hidden md:block flex-1 max-w-md lg:max-w-lg xl:max-w-xl mx-2 lg:mx-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search baby gear, feeding bottles, rompers, school bags..."
              className="w-full pl-10 pr-24 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white focus:border-transparent transition-all shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs transition-colors shadow-xs cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Instant Search Results Dropdown */}
          {searchFocused && localSearch.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden">
              <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Products Found ({searchResults.length})
              </div>
              {searchResults.length > 0 ? (
                <div>
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        navigateTo('product-detail', { productId: item.id });
                        setSearchFocused(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-amber-50/60 cursor-pointer transition-colors"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-md border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-800 truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span className="text-amber-700 font-bold">
                            {formatCurrency(
                              item.discount_price || item.regular_price,
                              companySettings.currency_symbol
                            )}
                          </span>
                          <span>•</span>
                          <span>{item.age_group}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={() => {
                      setSearchQuery(localSearch);
                      setSearchFocused(false);
                      navigateTo('shop');
                    }}
                    className="border-t border-slate-100 px-3 py-2 text-center text-xs font-semibold text-amber-700 hover:bg-amber-50 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>View all matching items</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 text-xs text-slate-500 text-center">
                  No products found for "{localSearch}". Press Enter to browse all.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions (Account, WhatsApp, Cart) */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
          {/* WhatsApp Direct Order Button */}
          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
            title="Chat & Order via WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span className="hidden lg:inline">Order via WhatsApp</span>
          </a>

          {/* Customer Account Button */}
          <button
            onClick={() => navigateTo('account')}
            className="flex items-center gap-2 p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title={currentUser ? `Signed in as ${currentUser.full_name}` : 'Account / Sign In'}
          >
            <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-[11px] text-slate-500 font-medium leading-tight">
                {currentUser ? 'Hello,' : 'Account'}
              </span>
              <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                {currentUser ? currentUser.full_name.split(' ')[0] : 'Sign In'}
              </span>
            </div>
          </button>

          {/* Cart Drawer Trigger */}
          <button
            id="open-cart-drawer-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shadow-xs animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Cart</span>
              <span className="text-xs font-bold text-amber-300 mt-0.5">
                {formatCurrency(cartSubtotal, companySettings.currency_symbol)}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Bar: Categories, Age Groups, Links */}
      <nav className="bg-slate-50 border-t border-slate-200/80 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-1">
            {/* All Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-t-lg hover:bg-amber-400 transition-colors cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>Shop All Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    categoryDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute left-0 top-full w-64 bg-white rounded-b-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div
                    onClick={() => handleCategorySelect(null)}
                    className={`px-4 py-2 hover:bg-amber-50 flex items-center justify-between cursor-pointer ${
                      selectedCategory === null ? 'text-amber-700 font-bold bg-amber-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>All Products</span>
                    <span className="text-[11px] text-slate-400">{products.length}</span>
                  </div>
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`px-4 py-2 hover:bg-amber-50 flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'text-amber-700 font-bold bg-amber-50/50'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[11px] text-slate-400">
                        {products.filter((p) => p.category_id === cat.id).length}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <button
              onClick={() => {
                setSelectedCategory(null);
                navigateTo('shop');
              }}
              className={`px-3 py-2.5 transition-colors cursor-pointer ${
                activePage === 'shop' && selectedCategory === null
                  ? 'text-amber-700 border-b-2 border-amber-600 font-bold'
                  : 'text-slate-700 hover:text-amber-600'
              }`}
            >
              All Items
            </button>

            {categories
              .filter((cat) => cat.is_active)
              .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-3 py-2.5 transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'text-amber-700 border-b-2 border-amber-600 font-bold'
                      : 'text-slate-700 hover:text-amber-600'
                  }`}
                >
                  {cat.name}
                </button>
              ))}

            <button
              onClick={() => {
                setSelectedCategory(null);
                navigateTo('about');
              }}
              className={`px-3 py-2.5 transition-colors cursor-pointer ${
                activePage === 'about'
                  ? 'text-amber-700 border-b-2 border-amber-600 font-bold'
                  : 'text-slate-700 hover:text-amber-600'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => {
                setSelectedCategory(null);
                navigateTo('contact');
              }}
              className={`px-3 py-2.5 transition-colors cursor-pointer ${
                activePage === 'contact'
                  ? 'text-amber-700 border-b-2 border-amber-600 font-bold'
                  : 'text-slate-700 hover:text-amber-600'
              }`}
            >
              Contact Us
            </button>
          </div>

          {/* Right Side: Age Group, Track Order & Admin */}
          <div className="flex items-center gap-3 py-1">
            {/* Track Order */}
            <button
              onClick={() => navigateTo('track-order')}
              className="flex items-center gap-1 text-slate-600 hover:text-amber-700 transition-colors cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-amber-500" />
              <span>Track Order</span>
            </button>

            {/* Age Group Quick Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAgeDropdownOpen(!ageDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-amber-400 transition-colors cursor-pointer"
                aria-expanded={ageDropdownOpen}
                aria-haspopup="true"
              >
                <span className="text-slate-400 font-normal">Age Group:</span>
                <span className="text-amber-700 font-bold">{selectedAgeGroup}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {ageDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setAgeDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 max-h-72 overflow-y-auto">
                    {AGE_GROUP_FILTER_OPTIONS.map((age) => (
                      <button
                        key={age}
                        onClick={() => handleAgeSelect(age)}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-amber-50 cursor-pointer transition-colors ${
                          selectedAgeGroup === age
                            ? 'font-bold text-amber-700 bg-amber-50/80'
                            : 'text-slate-700'
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full overflow-y-auto p-5 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <BrandLogo onClick={() => { setMobileMenuOpen(false); navigateTo('home'); }} size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mt-4 relative">
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </form>

              {/* Categories Navigation */}
              <div className="mt-4 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Shop by Category
                </div>
                <button
                  onClick={() => {
                    handleCategorySelect(null);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-amber-50 cursor-pointer"
                >
                  All Products ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      handleCategorySelect(cat.id);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-amber-50 flex items-center justify-between cursor-pointer"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {products.filter((p) => p.category_id === cat.id).length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Age Groups */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Age Groups
                </div>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {AGE_GROUP_FILTER_OPTIONS.map((age) => (
                    <button
                      key={age}
                      onClick={() => {
                        handleAgeSelect(age);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-left px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                        selectedAgeGroup === age
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-50 text-slate-700 hover:bg-amber-100 hover:text-amber-900'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Footer Links */}
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <div className="grid grid-cols-2 gap-2 pb-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('about');
                  }}
                  className={`py-2 px-3 text-center text-xs font-bold rounded-lg border transition-colors ${
                    activePage === 'about'
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                  }`}
                >
                  About Us
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('contact');
                  }}
                  className={`py-2 px-3 text-center text-xs font-bold rounded-lg border transition-colors ${
                    activePage === 'contact'
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                  }`}
                >
                  Contact Us
                </button>
              </div>

              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo('track-order');
                }}
                className="w-full py-2 text-center text-xs font-medium text-slate-600 hover:text-amber-600 cursor-pointer"
              >
                Track Your Order
              </button>
            </div>
          </div>

          <div
            className="flex-1"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        </div>
      )}
    </header>
  );
};
