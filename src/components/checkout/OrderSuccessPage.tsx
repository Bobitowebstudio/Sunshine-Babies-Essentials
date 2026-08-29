import React from 'react';
import {
  CheckCircle2,
  Package,
  MessageCircle,
  ArrowRight,
  Truck,
  Building,
  Copy,
  Check,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, getWhatsAppUrl, formatOrderWhatsAppMessage } from '../../lib/utils';
import { Order } from '../../types';
import { ProductImage } from '../common/ProductImage';

export const OrderSuccessPage: React.FC = () => {
  const { orders, navigateTo, companySettings, navigationParams } = useStore();
  const [copiedAccount, setCopiedAccount] = React.useState(false);

  const orderFromParams = navigationParams?.order as Order | undefined;
  const order =
    orderFromParams ||
    (orders.length > 0 ? orders[0] : null);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order not found</h2>
        <button
          onClick={() => navigateTo('home')}
          className="mt-4 px-6 py-2.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  const whatsAppOrderMessage = formatOrderWhatsAppMessage(order, companySettings);
  const whatsAppUrl = getWhatsAppUrl(companySettings.whatsapp_number, whatsAppOrderMessage);

  const handleCopyAccount = () => {
    if (companySettings.bank_account_number) {
      navigator.clipboard?.writeText(companySettings.bank_account_number);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Celebration Header */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
              Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mt-2">
              Thank You For Your Order!
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your order reference number is{' '}
              <strong className="font-mono text-slate-900 text-sm">{order.order_number}</strong>
            </p>
          </div>

          {/* Direct WhatsApp Instant Handoff CTA */}
          <div className="pt-2">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Order Confirmation to WhatsApp Desk</span>
            </a>
            <p className="text-[11px] text-slate-500 mt-2">
              Clicking will send your order details & delivery instructions directly to our store representative.
            </p>
          </div>
        </div>

        {/* Bank Transfer Instructions if chosen */}
        {order.payment_method === 'bank_transfer' && (
          <div className="bg-amber-50/70 rounded-3xl border border-amber-200/80 p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Building className="w-4 h-4 text-amber-700" />
              <span>Bank Payment Instructions</span>
            </div>
            <p className="text-xs text-amber-800">
              Please transfer{' '}
              <strong>{formatCurrency(order.total_amount, companySettings.currency_symbol)}</strong>{' '}
              to the account below and forward your payment receipt to WhatsApp:
            </p>

            <div className="bg-white rounded-2xl p-4 border border-amber-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Name:</span>
                <span className="font-bold text-slate-900">
                  {companySettings.bank_name || 'Zenith Bank'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Account Number:</span>
                <div className="flex items-center gap-1 font-mono font-black text-amber-900 text-sm">
                  <span>{companySettings.bank_account_number || '1012345678'}</span>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="p-1 text-slate-400 hover:text-amber-700 cursor-pointer"
                  >
                    {copiedAccount ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account Name:</span>
                <span className="font-bold text-slate-900">
                  {companySettings.bank_account_name || companySettings.business_name}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Breakdown Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Order Summary</h2>
            <span className="text-xs text-slate-500">
              {new Date(order.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Purchased Items List */}
          <div className="divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-100 shrink-0">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <span className="text-[11px] text-slate-500">
                      Qty: {item.quantity} ×{' '}
                      {formatCurrency(item.price, companySettings.currency_symbol)}
                    </span>
                  </div>
                </div>
                <span className="font-black text-slate-900">
                  {formatCurrency(item.price * item.quantity, companySettings.currency_symbol)}
                </span>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-900">
                {formatCurrency(order.subtotal, companySettings.currency_symbol)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee ({order.delivery_location.city})</span>
              <span className="font-bold text-slate-900">
                {formatCurrency(order.delivery_fee, companySettings.currency_symbol)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Amount</span>
              <span className="text-base text-amber-900">
                {formatCurrency(order.total_amount, companySettings.currency_symbol)}
              </span>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Shipping Destination:</span>
              <p className="font-bold text-slate-800">{order.customer.full_name}</p>
              <p className="text-slate-600">{order.delivery_location.address}</p>
              <p className="text-slate-600">
                {order.delivery_location.city}, {order.delivery_location.state}
              </p>
              <p className="text-slate-600">Tel: {order.customer.phone}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Payment Method:</span>
              <p className="font-bold text-slate-800 capitalize">
                {(order.payment_method || 'bank_transfer').replace(/_/g, ' ')}
              </p>
              {order.payment_reference && (
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Ref: {order.payment_reference}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    order.payment_status === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Payment: {(order.payment_status || 'unpaid').replace(/_/g, ' ')}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                  Status: {order.order_status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigations */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => navigateTo('track-order')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Track Order Status</span>
          </button>

          <button
            onClick={() => navigateTo('shop')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};
