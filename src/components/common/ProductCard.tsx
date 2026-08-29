import React from 'react';
import { ShoppingCart, Eye, MessageCircle, BellRing, Star } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, calculateDiscountPercent, getWhatsAppUrl } from '../../lib/utils';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    companySettings,
    addToCart,
    navigateTo,
    setNotifyProduct,
    setQuickViewProduct,
    categories,
  } = useStore();

  const isOut = product.stock_quantity <= 0 || product.is_out_of_stock;
  const discountPercent = calculateDiscountPercent(product.regular_price, product.discount_price);
  const finalPrice =
    product.discount_price && product.discount_price > 0
      ? product.discount_price
      : product.regular_price;

  const category = categories.find((c) => c.id === product.category_id);

  const whatsAppUrl = getWhatsAppUrl(
    companySettings.whatsapp_number,
    `Hello ${companySettings.business_name}! 👋 I would like to buy:\n*${product.name}* (SKU: ${product.sku})\nPrice: ${formatCurrency(finalPrice, companySettings.currency_symbol)}\n\nPlease advise on ordering.`
  );

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-amber-400/60 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Badges Container */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1">
          {discountPercent > 0 && (
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {product.is_best_seller && (
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs">
              Best Seller
            </span>
          )}
          {product.is_new_arrival && !product.is_best_seller && (
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900 text-amber-300 shadow-xs">
              New Arrival
            </span>
          )}
        </div>

        {/* Age Group Tag */}
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-700 backdrop-blur-xs shadow-2xs border border-slate-100">
          {product.age_group}
        </span>
      </div>

      {/* Image Gallery Viewer with Hover Overlay */}
      <div 
        className="relative aspect-square w-full bg-slate-50 overflow-hidden cursor-pointer"
        onClick={() => navigateTo('product-detail', { productId: product.id })}
      >
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          categoryId={product.category_id}
          viewAngle="main"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Secondary image on hover if available */}
        {product.images[1] && (
          <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <ProductImage
              src={product.images[1]}
              alt={`${product.name} secondary view`}
              categoryId={product.category_id}
              viewAngle="front"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOut && (
          <div className="absolute inset-0 bg-slate-900/65 backdrop-blur-[2px] flex items-center justify-center p-3">
            <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg border border-white/20">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Action Floating Bar */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="p-2 rounded-xl bg-white/95 text-slate-800 hover:bg-amber-500 hover:text-slate-950 shadow-md transition-all cursor-pointer"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-all cursor-pointer"
            title="Ask / Order on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {category && (
            <span className="text-[11px] font-semibold text-amber-700 block truncate">
              {category.name}
            </span>
          )}
          <h3
            onClick={() => navigateTo('product-detail', { productId: product.id })}
            className="text-xs font-bold text-slate-900 line-clamp-2 hover:text-amber-700 transition-colors cursor-pointer mt-0.5 leading-snug"
          >
            {product.name}
          </h3>
        </div>

        {/* Rating and SKU */}
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1 text-amber-500 font-semibold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating || 5.0}</span>
            <span className="text-slate-400 font-normal">({product.reviews_count || 12})</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">{product.sku}</span>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-900">
              {formatCurrency(finalPrice, companySettings.currency_symbol)}
            </span>
            {product.discount_price && product.discount_price > 0 && (
              <span className="text-[11px] text-slate-400 line-through">
                {formatCurrency(product.regular_price, companySettings.currency_symbol)}
              </span>
            )}
          </div>

          {isOut ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNotifyProduct(product);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <BellRing className="w-3 h-3" />
              <span>Notify</span>
            </button>
          ) : (
            <button
              id={`add-to-cart-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white transition-all shadow-2xs cursor-pointer group/btn flex items-center gap-1.5 px-3"
              title="Add to Cart"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="w-4 h-4 text-amber-400 group-hover/btn:text-slate-950 transition-colors shrink-0" />
              <span className="text-[11px] font-bold hidden sm:inline-block">Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
