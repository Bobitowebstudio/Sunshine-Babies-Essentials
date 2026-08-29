import React, { useState } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, getWhatsAppUrl } from '../../lib/utils';
import { OrderStatus } from '../../types';

export const TrackOrderPage: React.FC = () => {
  const { orders, companySettings } = useStore();
  const [searchCode, setSearchCode] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const matchedOrder = orders.find(
    (o) =>
      o.order_number.toLowerCase() === searchCode.trim().toLowerCase() ||
      o.id.toLowerCase() === searchCode.trim().toLowerCase() ||
      o.customer.phone.includes(searchCode.trim())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const getStepProgress = (status: OrderStatus) => {
    const s = status.toLowerCase();
    if (s.includes('pending')) return 1;
    if (s.includes('confirm') || s.includes('process')) return 2;
    if (s.includes('ship') || s.includes('ready')) return 3;
    if (s.includes('deliver')) return 4;
    return 1;
  };

  const currentStep = matchedOrder ? getStepProgress(matchedOrder.order_status) : 1;

  const whatsAppHelpUrl = matchedOrder
    ? getWhatsAppUrl(
        companySettings.whatsapp_number,
        `Hello ${companySettings.business_name}! I need an update on my order *${matchedOrder.order_number}*. Could you kindly assist?`
      )
    : getWhatsAppUrl(companySettings.whatsapp_number, `Hello! I would like to track an order.`);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Search Header */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-black text-slate-900">
            Real-Time Package Tracking
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Enter your Order Reference Code (e.g.{' '}
            <strong className="font-mono text-slate-800">{orders[0]?.order_number || 'BST-202608-4921'}</strong>) or WhatsApp phone number.
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2 pt-2">
            <input
              type="text"
              required
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="e.g. BST-202608-4921"
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Track</span>
            </button>
          </form>
        </div>

        {/* Results */}
        {hasSearched && (
          <>
            {matchedOrder ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-8">
                {/* Top Order Status Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-mono font-black text-lg text-slate-900">
                        {matchedOrder.order_number}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-200">
                        {matchedOrder.order_status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Placed on{' '}
                      {new Date(matchedOrder.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <a
                    href={whatsAppHelpUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-colors self-start sm:self-auto"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>

                {/* Tracking Step Progress Timeline */}
                <div className="relative py-4">
                  <div className="grid grid-cols-4 gap-2 text-center relative z-10">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                          currentStep >= 1
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-900">Order Placed</span>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                          currentStep >= 2
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-900">Packed & Verified</span>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                          currentStep >= 3
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        <Truck className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-900">Out for Delivery</span>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                          currentStep >= 4
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-900">Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Information & Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      <span>Delivery Details</span>
                    </h4>
                    <div className="space-y-1 text-slate-600">
                      <p className="font-semibold text-slate-800">{matchedOrder.customer.full_name}</p>
                      <p>{matchedOrder.delivery_location.address}</p>
                      <p>
                        {matchedOrder.delivery_location.city}, {matchedOrder.delivery_location.state}
                      </p>
                      <p>Tel: {matchedOrder.customer.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-amber-600" />
                      <span>Items in Package ({matchedOrder.items.length})</span>
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {matchedOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-slate-700">
                          <span className="truncate pr-2">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-bold shrink-0">
                            {formatCurrency(item.price * item.quantity, companySettings.currency_symbol)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No order found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We couldn't locate an order matching "{searchCode}". Please double check your order number or phone number.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
