import React from 'react';
import { AlertCircle } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div
      id="site-announcement-bar"
      role="region"
      aria-label="Important Notice Regarding Paystack Payment Gateway"
      className="w-full bg-slate-950 text-slate-100 border-b border-amber-500/40 shadow-xs relative z-10"
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-center">
        <div className="flex items-start sm:items-center justify-center gap-2 sm:gap-2.5 text-left sm:text-center max-w-5xl">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed sm:leading-normal">
            <strong className="text-amber-400 font-extrabold tracking-wide uppercase mr-1.5 inline-flex items-center">
              NOTICE:
            </strong>
            <span className="text-white font-semibold">
              Paystack payment is temporarily unavailable.
            </span>{' '}
            <span>
              Please use any of our other available payment options, including bank account payment, payment after delivery, WhatsApp-assisted payment, and other payment methods available on the website.
            </span>{' '}
            <span className="text-amber-300 font-semibold">
              Paystack will be available again soon.
            </span>{' '}
            <span className="text-slate-300">
              We apologise for any inconvenience.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
