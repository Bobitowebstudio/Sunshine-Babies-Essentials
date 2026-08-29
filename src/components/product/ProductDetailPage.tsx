import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Zap,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Star,
  Plus,
  Minus,
  BellRing,
  ChevronRight,
  Share2,
  Package,
  Layers,
  Heart,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  formatCurrency,
  calculateDiscountPercent,
  getWhatsAppUrl,
} from '../../lib/utils';
import { ProductCard } from '../common/ProductCard';
import { ProductImage } from '../common/ProductImage';
import { RecentlyViewed } from '../home/RecentlyViewed';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    categories,
    addToCart,
    companySettings,
    navigateTo,
    setNotifyProduct,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc');
  const [isCopied, setIsCopied] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Frequently Bought Together Bundle state
  const [bundleChecked, setBundleChecked] = useState<Record<string, boolean>>({});

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    // Initialize variant defaults
    if (product?.variants?.colors && product.variants.colors.length > 0) {
      setSelectedColor(product.variants.colors[0].name);
    } else {
      setSelectedColor(null);
    }
    if (product?.variants?.sizes && product.variants.sizes.length > 0) {
      setSelectedSize(product.variants.sizes[0]);
    } else {
      setSelectedSize(null);
    }
    // Initialize bundle selections
    if (product?.frequently_bought_together_ids) {
      const initial: Record<string, boolean> = { [product.id]: true };
      product.frequently_bought_together_ids.forEach((id) => {
        initial[id] = true;
      });
      setBundleChecked(initial);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product not found</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-6 py-2.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.category_id);
  const isOut = product.stock_quantity <= 0 || product.is_out_of_stock;
  const discountPercent = calculateDiscountPercent(product.regular_price, product.discount_price);
  const basePrice =
    product.discount_price && product.discount_price > 0
      ? product.discount_price
      : product.regular_price;

  // Selected Variant item price override if any
  const matchedVariant = product.variants?.items?.find(
    (item) =>
      (!selectedColor || item.color === selectedColor) &&
      (!selectedSize || item.size === selectedSize)
  );

  const finalPrice = matchedVariant?.price || basePrice;

  // Frequently Bought Together products
  const bundleProducts = (product.frequently_bought_together_ids || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is typeof product => Boolean(p));

  const allBundleItems = [product, ...bundleProducts];

  const totalBundlePrice = allBundleItems.reduce((sum, item) => {
    if (bundleChecked[item.id]) {
      const p = item.discount_price && item.discount_price > 0 ? item.discount_price : item.regular_price;
      return sum + p;
    }
    return sum;
  }, 0);

  const handleAddBundleToCart = () => {
    allBundleItems.forEach((item) => {
      if (bundleChecked[item.id] && item.stock_quantity > 0) {
        addToCart(item, 1);
      }
    });
  };

  // Related products
  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category_id === product.category_id || p.age_group === product.age_group)
    )
    .slice(0, 4);

  const variantSummary = [
    selectedColor ? `Color: ${selectedColor}` : null,
    selectedSize ? `Size: ${selectedSize}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  const whatsAppOrderUrl = getWhatsAppUrl(
    companySettings.whatsapp_number,
    `Hello ${companySettings.business_name}! 👋\n\nI want to order:\n🛍️ *${product.name}*${
      variantSummary ? ` (${variantSummary})` : ''
    }\n🏷️ SKU: ${matchedVariant?.sku || product.sku}\n💰 Price: ${formatCurrency(
      finalPrice,
      companySettings.currency_symbol
    )}\n🔢 Quantity: ${quantity}\n\nPlease confirm availability and delivery timeline!`
  );

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-amber-700 cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <button
            onClick={() => {
              if (category) navigateTo('shop', { categoryId: category.id });
              else navigateTo('shop');
            }}
            className="hover:text-amber-700 cursor-pointer"
          >
            {category ? category.name : 'Shop'}
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Presentation (Gallery + Info) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shadow-inner flex items-center justify-center">
              <ProductImage
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                categoryId={product.category_id}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                  SAVE {discountPercent}%
                </span>
              )}

              {isOut && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
                  <span className="px-4 py-2 rounded-xl bg-rose-600 text-white font-black text-sm uppercase tracking-wider shadow-xl">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-amber-500 shadow-md ring-2 ring-amber-500/20'
                        : 'border-slate-200 opacity-65 hover:opacity-100'
                    }`}
                  >
                    <ProductImage
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      categoryId={product.category_id}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Meta & Purchase Actions (7 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category, Age Group & SKU */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  {category && (
                    <span className="px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 font-bold text-xs">
                      {category.name}
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-xs">
                    Age: {product.age_group}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400">SKU: {product.sku}</span>
                  <button
                    onClick={handleShare}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Share product link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Reviews & Social Proof */}
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <div className="flex items-center text-amber-500 font-bold">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                  <span className="ml-1.5 text-slate-900">{product.rating || 4.9}</span>
                </div>
                <span>•</span>
                <span className="text-slate-500">
                  {product.reviews_count || 32} verified customer reviews
                </span>
              </div>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-baseline justify-between">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-amber-900">
                    {formatCurrency(finalPrice, companySettings.currency_symbol)}
                  </span>
                  {product.discount_price && product.discount_price > 0 && (
                    <span className="text-base text-slate-400 line-through font-semibold">
                      {formatCurrency(product.regular_price, companySettings.currency_symbol)}
                    </span>
                  )}
                </div>

                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                    You save{' '}
                    {formatCurrency(
                      product.regular_price - product.discount_price!,
                      companySettings.currency_symbol
                    )}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.short_description || product.description}
              </p>

              {/* Color Variations Selector */}
              {product.variants?.colors && product.variants.colors.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      Color:{' '}
                      <span className="text-amber-800 font-semibold">
                        {selectedColor || product.variants.colors[0].name}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {product.variants.colors.map((c, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          selectedColor === c.name
                            ? 'border-amber-500 bg-amber-50/60 text-slate-950 shadow-xs ring-2 ring-amber-400/30'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Variations Selector */}
              {product.variants?.sizes && product.variants.sizes.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      Size / Stage:{' '}
                      <span className="text-amber-800 font-semibold">
                        {selectedSize || product.variants.sizes[0]}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.variants.sizes.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          selectedSize === s
                            ? 'border-amber-500 bg-amber-500 text-slate-950 shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-xs font-semibold pt-1">
                {isOut ? (
                  <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                    ● Currently Out of Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold">
                    <Check className="w-4 h-4" /> In Stock ({product.stock_quantity} available for dispatch)
                  </span>
                )}
              </div>
            </div>

            {/* Purchase & Ordering Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {!isOut ? (
                <>
                  {/* Quantity Stepper & Add to Cart */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border-2 border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 text-sm font-black text-slate-900">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                        disabled={quantity >= product.stock_quantity}
                        className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      id="product-add-to-cart-btn"
                      onClick={() => addToCart(product, quantity)}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4 text-amber-400" />
                      <span>Add to Cart</span>
                    </button>
                  </div>

                  {/* Buy Now & WhatsApp Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      onClick={() => {
                        addToCart(product, quantity);
                        navigateTo('checkout');
                      }}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Buy Now (Instant Checkout)</span>
                    </button>

                    <a
                      href={whatsAppOrderUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Order via WhatsApp</span>
                    </a>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                    This item is temporarily sold out due to high demand.
                  </div>
                  <button
                    onClick={() => setNotifyProduct(product)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    <BellRing className="w-4 h-4" />
                    <span>Notify Me When Available</span>
                  </button>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-[11px] text-slate-500 text-center font-medium">
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>Express Dispatch</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Quality Guarantee</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>7-Day Return Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together Bundle Widget */}
        {bundleProducts.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-amber-600" />
              <h3 className="text-base sm:text-lg font-serif font-black text-slate-900">
                Frequently Bought Together
              </h3>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Items in bundle with checkboxes */}
              <div className="flex flex-wrap items-center gap-4">
                {allBundleItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <div className="flex items-center gap-3 p-2 rounded-xl border border-slate-100 bg-slate-50/60 max-w-xs">
                      <input
                        type="checkbox"
                        checked={Boolean(bundleChecked[item.id])}
                        onChange={(e) =>
                          setBundleChecked((prev) => ({
                            ...prev,
                            [item.id]: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                      <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-slate-200">
                        <ProductImage
                          src={item.images[0]}
                          alt={item.name}
                          categoryId={item.category_id}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 line-clamp-1">
                          {item.name}
                        </div>
                        <div className="text-xs font-black text-amber-800">
                          {formatCurrency(
                            item.discount_price || item.regular_price,
                            companySettings.currency_symbol
                          )}
                        </div>
                      </div>
                    </div>

                    {index < allBundleItems.length - 1 && (
                      <span className="text-slate-400 font-bold text-sm">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Total bundle price and action */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 lg:w-72 shrink-0">
                <div>
                  <span className="text-[11px] text-amber-900 font-semibold block">
                    Combined Bundle Price:
                  </span>
                  <span className="text-xl font-black text-amber-950">
                    {formatCurrency(totalBundlePrice, companySettings.currency_symbol)}
                  </span>
                </div>

                <button
                  onClick={handleAddBundleToCart}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Add All to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Information Tabs */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8">
          <div className="flex border-b border-slate-200 space-x-6 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 transition-colors cursor-pointer ${
                activeTab === 'desc'
                  ? 'text-amber-700 border-b-2 border-amber-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Full Description
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 transition-colors cursor-pointer ${
                activeTab === 'specs'
                  ? 'text-amber-700 border-b-2 border-amber-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Specifications & Material
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 transition-colors cursor-pointer ${
                activeTab === 'shipping'
                  ? 'text-amber-700 border-b-2 border-amber-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Shipping & Delivery
            </button>
          </div>

          <div className="py-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Key Highlights:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>Certified baby-safe and hypoallergenic materials.</li>
                    <li>Designed for effortless cleaning, hygiene and long-lasting durability.</li>
                    <li>Supports child development, motor comfort, and parental convenience.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                    <span className="font-semibold text-slate-500">Target Age:</span>
                    <span className="font-bold text-slate-900">{product.age_group}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                    <span className="font-semibold text-slate-500">SKU Code:</span>
                    <span className="font-mono text-slate-900">{product.sku}</span>
                  </div>
                  {product.attributes &&
                    Object.entries(product.attributes).map(([key, val]) => (
                      <div
                        key={key}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex justify-between"
                      >
                        <span className="font-semibold text-slate-500">{key}:</span>
                        <span className="font-bold text-slate-900">{val}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3">
                <p>
                  We provide nationwide doorstep delivery across Nigeria via verified courier partners:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-bold text-slate-900 block">Lagos (Island & Mainland)</span>
                    <span className="text-[11px] text-slate-500">1 - 2 Business Days</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-bold text-slate-900 block">Abuja, PH & Major Cities</span>
                    <span className="text-[11px] text-slate-500">2 - 4 Business Days</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-bold text-slate-900 block">Other Nationwide States</span>
                    <span className="text-[11px] text-slate-500">3 - 6 Business Days</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-black text-slate-900">
              Related Products You Might Love
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Products */}
        <RecentlyViewed excludeProductId={product.id} />
      </div>
    </div>
  );
};
