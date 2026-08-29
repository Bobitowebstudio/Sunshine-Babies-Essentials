import React, { useState } from 'react';
import { X, ShoppingCart, MessageCircle, ArrowRight, Check, Star } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, getWhatsAppUrl, calculateDiscountPercent } from '../../lib/utils';
import { ProductImage } from './ProductImage';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    companySettings,
    navigateTo,
    setNotifyProduct,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const discountPercent = calculateDiscountPercent(
    quickViewProduct.regular_price,
    quickViewProduct.discount_price
  );

  const finalPrice =
    quickViewProduct.discount_price && quickViewProduct.discount_price > 0
      ? quickViewProduct.discount_price
      : quickViewProduct.regular_price;

  const isOut = quickViewProduct.stock_quantity <= 0 || quickViewProduct.is_out_of_stock;

  const whatsAppUrl = getWhatsAppUrl(
    companySettings.whatsapp_number,
    `Hello ${companySettings.business_name}! 👋 I am interested in:\n🛍️ *${quickViewProduct.name}*\nSKU: ${quickViewProduct.sku}\nPrice: ${formatCurrency(finalPrice, companySettings.currency_symbol)}\n\nIs this available for delivery?`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={() => setQuickViewProduct(null)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-100 flex flex-col md:flex-row max-h-[90vh]">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/90 shadow-md text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Column */}
        <div className="md:w-1/2 bg-slate-50 p-4 flex flex-col justify-between">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-slate-100 mb-3">
            <ProductImage
              src={quickViewProduct.images[activeImageIndex] || quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              categoryId={quickViewProduct.category_id}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-2 left-2 bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {quickViewProduct.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-12 h-12 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-amber-500 shadow-xs'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <ProductImage
                    src={img}
                    alt={`${quickViewProduct.name} thumb ${idx + 1}`}
                    categoryId={quickViewProduct.category_id}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                {quickViewProduct.age_group}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                SKU: {quickViewProduct.sku}
              </span>
            </div>

            <h2 className="text-base font-bold text-slate-900 leading-snug">
              {quickViewProduct.name}
            </h2>

            {/* Price & Rating */}
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-black text-amber-800">
                {formatCurrency(finalPrice, companySettings.currency_symbol)}
              </span>
              {quickViewProduct.discount_price && quickViewProduct.discount_price > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(quickViewProduct.regular_price, companySettings.currency_symbol)}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 line-clamp-3">
              {quickViewProduct.short_description || quickViewProduct.description}
            </p>

            {/* Stock status indicator */}
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              {isOut ? (
                <span className="text-rose-600 flex items-center gap-1">
                  ● Out of Stock
                </span>
              ) : (
                <span className="text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock ({quickViewProduct.stock_quantity} available)
                </span>
              )}
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="pt-4 space-y-2">
            {!isOut ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-50"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800">{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(quickViewProduct.stock_quantity, quantity + 1))
                      }
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, quantity);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 text-amber-400" />
                    <span>Add to Cart</span>
                  </button>
                </div>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Order via WhatsApp</span>
                </a>
              </>
            ) : (
              <button
                onClick={() => {
                  const p = quickViewProduct;
                  setQuickViewProduct(null);
                  setNotifyProduct(p);
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs cursor-pointer"
              >
                Notify Me When Restocked
              </button>
            )}

            <button
              onClick={() => {
                const id = quickViewProduct.id;
                setQuickViewProduct(null);
                navigateTo('product-detail', { productId: id });
              }}
              className="w-full text-center text-xs font-semibold text-amber-700 hover:text-amber-800 pt-1 flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Full Specifications & Reviews</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
