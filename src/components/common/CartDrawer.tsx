import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, getWhatsAppUrl } from '../../lib/utils';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartItemCount,
    companySettings,
    navigateTo,
  } = useStore();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 100000;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const generateCartWhatsAppMessage = () => {
    const itemsSummary = cart
      .map((item, i) => `${i + 1}. ${item.product.name} (Qty: ${item.quantity}) - ${formatCurrency((item.product.discount_price || item.product.regular_price) * item.quantity, companySettings.currency_symbol)}`)
      .join('\n');

    return `Hello ${companySettings.business_name}! 👋\n\nI have items in my shopping cart and want to order via WhatsApp:\n\n🛒 *Items:*\n${itemsSummary}\n\n💰 *Subtotal:* ${formatCurrency(cartSubtotal, companySettings.currency_symbol)}\n\nPlease assist me with delivery and payment details!`;
  };

  const whatsAppCartUrl = getWhatsAppUrl(
    companySettings.whatsapp_number,
    generateCartWhatsAppMessage()
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Shopping Cart ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-amber-50/70 px-4 py-2.5 border-b border-amber-100">
            <div className="flex items-center justify-between text-xs text-amber-900 mb-1 font-medium">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                {remainingForFreeShipping > 0 ? (
                  <>
                    Add{' '}
                    <span className="font-bold text-amber-700">
                      {formatCurrency(remainingForFreeShipping, companySettings.currency_symbol)}
                    </span>{' '}
                    more for free delivery!
                  </>
                ) : (
                  <span className="font-bold text-emerald-700">
                    🎉 You qualify for FREE Delivery!
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Explore our baby gear, maternity essentials, and cute baby clothing.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('shop');
                  }}
                  className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const unitPrice =
                  item.product.discount_price && item.product.discount_price > 0
                    ? item.product.discount_price
                    : item.product.regular_price;

                return (
                  <div key={item.product.id} className="py-3.5 flex gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      onClick={() => {
                        setIsCartOpen(false);
                        navigateTo('product-detail', { productId: item.product.id });
                      }}
                      className="w-16 h-16 object-cover rounded-lg border border-slate-100 shrink-0 cursor-pointer"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4
                          onClick={() => {
                            setIsCartOpen(false);
                            navigateTo('product-detail', { productId: item.product.id });
                          }}
                          className="text-xs font-bold text-slate-800 line-clamp-2 cursor-pointer hover:text-amber-700"
                        >
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span>{item.product.age_group}</span>
                          <span>•</span>
                          <span className="text-amber-800 font-semibold">
                            {formatCurrency(unitPrice, companySettings.currency_symbol)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock_quantity}
                            className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line Total & Remove */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-900">
                            {formatCurrency(unitPrice * item.quantity, companySettings.currency_symbol)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Subtotal</span>
                <span className="text-sm font-black text-slate-900">
                  {formatCurrency(cartSubtotal, companySettings.currency_symbol)}
                </span>
              </div>

              <p className="text-[11px] text-slate-500">
                Delivery fees & taxes calculated dynamically at checkout.
              </p>

              <div className="grid grid-cols-1 gap-2">
                <button
                  id="cart-proceed-checkout-btn"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('checkout');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <a
                  href={whatsAppCartUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order Entire Cart via WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
