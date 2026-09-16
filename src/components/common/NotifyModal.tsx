import React, { useState } from 'react';
import { X, BellRing, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const NotifyModal: React.FC = () => {
  const { notifyProduct, setNotifyProduct, requestStockNotification, currentUser } = useStore();

  const [name, setName] = useState(currentUser?.full_name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [submitted, setSubmitted] = useState(false);

  if (!notifyProduct) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    requestStockNotification({
      product_id: notifyProduct.id,
      product_name: notifyProduct.name,
      product_sku: notifyProduct.sku,
      customer_name: name,
      email,
      phone,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setNotifyProduct(null);
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={() => setNotifyProduct(null)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 overflow-hidden border border-amber-100">
        <button
          onClick={() => setNotifyProduct(null)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">You're on the priority list!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              We will immediately notify you via WhatsApp & Email the moment{' '}
              <strong>{notifyProduct.name}</strong> arrives back in our inventory.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                <BellRing className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-700 border border-rose-200">
                  Out of Stock
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                  {notifyProduct.name}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Leave your details below and our team will notify you first thing when this item is restocked.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Joy Adebayo"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joy@example.com"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 903 466 5968"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer mt-2"
              >
                Notify Me When Restocked
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
