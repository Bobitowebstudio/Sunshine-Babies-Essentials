import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, getWhatsAppUrl } from '../../lib/utils';
import { ProductImage } from '../common/ProductImage';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    cartItemCount,
    companySettings,
    deliveryLocations,
    navigateTo,
  } = useStore();

  const activeLocations = React.useMemo(
    () => deliveryLocations.filter((l) => l.is_active),
    [deliveryLocations]
  );

  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    () => activeLocations[0]?.id || deliveryLocations[0]?.id || ''
  );

  useEffect(() => {
    if (activeLocations.length > 0) {
      const exists = activeLocations.some((l) => l.id === selectedLocationId);
      if (!exists) {
        setSelectedLocationId(activeLocations[0].id);
      }
    }
  }, [activeLocations, selectedLocationId]);

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const selectedLoc =
    activeLocations.find((l) => l.id === selectedLocationId) ||
    activeLocations[0] ||
    deliveryLocations.find((l) => l.id === selectedLocationId);
  const deliveryFee = selectedLoc ? selectedLoc.fee : 0;
  const grandTotal = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME10' || code === 'GOLDMOM' || code === 'BABYLOVE') {
      const discount = Math.round(cartSubtotal * 0.1);
      setDiscountAmount(discount);
      setCouponApplied(true);
    } else {
      setCouponError('Invalid promo code. Try "WELCOME10" or "GOLDMOM"');
    }
  };

  const generateCartWhatsApp = () => {
    const items = cart
      .map(
        (it, i) =>
          `${i + 1}. *${it.product.name}* (Qty: ${it.quantity}) - ${formatCurrency(
            (it.product.discount_price || it.product.regular_price) * it.quantity,
            companySettings.currency_symbol
          )}`
      )
      .join('\n');

    return `Hello ${companySettings.business_name}! 👋\n\nI want to place this order:\n\n🛒 *Cart Items:*\n${items}\n\n💵 Subtotal: ${formatCurrency(
      cartSubtotal,
      companySettings.currency_symbol
    )}\n🚚 Estimated Delivery (${selectedLoc?.city_area || 'Lagos'}): ${formatCurrency(
      deliveryFee,
      companySettings.currency_symbol
    )}\n💰 *Total: ${formatCurrency(grandTotal, companySettings.currency_symbol)}*\n\nPlease process my order!`;
  };

  const whatsAppUrl = getWhatsAppUrl(companySettings.whatsapp_number, generateCartWhatsApp());

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-serif font-black text-slate-900">Your Cart Is Empty</h2>
          <p className="text-xs text-slate-500">
            Looks like you haven't added any baby essentials or school supplies yet.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
              Shopping Cart
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your items and estimate shipping fees
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
          >
            Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items Table (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 divide-y divide-slate-100">
            {cart.map((item) => {
              const unitPrice =
                item.product.discount_price && item.product.discount_price > 0
                  ? item.product.discount_price
                  : item.product.regular_price;

              return (
                <div
                  key={item.product.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div 
                      className="w-20 h-20 rounded-xl overflow-hidden border border-slate-100 shrink-0 cursor-pointer"
                      onClick={() => navigateTo('product-detail', { productId: item.product.id })}
                    >
                      <ProductImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        categoryId={item.product.category_id}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3
                        onClick={() => navigateTo('product-detail', { productId: item.product.id })}
                        className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 hover:text-amber-700 cursor-pointer"
                      >
                        {item.product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span>Age: {item.product.age_group}</span>
                        <span>•</span>
                        <span className="font-mono">SKU: {item.product.sku}</span>
                      </div>
                      <div className="text-xs font-bold text-amber-800 mt-1">
                        {formatCurrency(unitPrice, companySettings.currency_symbol)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock_quantity}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Total Price */}
                    <span className="text-sm font-black text-slate-900">
                      {formatCurrency(unitPrice * item.quantity, companySettings.currency_symbol)}
                    </span>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary & Delivery Estimator (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              {/* Location Selector for Fee calculation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Destination
                </label>
                <select
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-800"
                >
                  {deliveryLocations
                    .filter((l) => l.is_active)
                    .map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.state} - {loc.city_area} ({formatCurrency(loc.fee, companySettings.currency_symbol)})
                      </option>
                    ))}
                </select>
                {selectedLoc && (
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Estimated Time: {selectedLoc.estimated_days}
                  </span>
                )}
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Discount Coupon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    disabled={couponApplied}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 uppercase font-mono"
                  />
                  <button
                    type="submit"
                    disabled={couponApplied}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-50"
                  >
                    {couponApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
                {couponApplied && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">
                    10% Promotional discount applied!
                  </p>
                )}
              </form>

              {/* Line Items Breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cartItemCount} items)</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(cartSubtotal, companySettings.currency_symbol)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(deliveryFee, companySettings.currency_symbol)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Discount Code</span>
                    <span>-{formatCurrency(discountAmount, companySettings.currency_symbol)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-lg text-amber-900">
                    {formatCurrency(grandTotal, companySettings.currency_symbol)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <button
                  onClick={() => navigateTo('checkout')}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order Directly on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Safe & Flexible Ordering</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Pay online securely, request bank transfer verification, or order seamlessly with our sales agents via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
