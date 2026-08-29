import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut, Lock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../common/BrandLogo';

export const AdminAccessDenied: React.FC = () => {
  const { currentUser, logoutCustomer, navigateTo } = useStore();

  const handleSignOutAndAdminLogin = async () => {
    await logoutCustomer();
    navigateTo('admin-login');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 text-slate-100 font-sans">
      <div className="max-w-md w-full mx-auto space-y-8 my-auto text-center">
        {/* Brand Logo */}
        <div className="flex justify-center">
          <BrandLogo inverted={true} size="lg" showTagline={false} />
        </div>

        {/* Access Denied Card */}
        <div className="bg-slate-900/90 border border-red-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-sm space-y-6 text-center">
          {/* Warning Icon Badge */}
          <div className="inline-flex p-4 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-400 shadow-inner">
            <ShieldAlert className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-black text-white tracking-tight">
              Access Denied
            </h2>
            <p className="text-xs font-semibold text-red-400 uppercase tracking-widest">
              Administrator Privileges Required
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2">
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                You are currently signed in as{' '}
                <span className="font-bold text-white underline decoration-amber-500/50">
                  {currentUser?.email || 'a customer account'}
                </span>
                . Customer accounts do not have permission to access the management portal.
              </p>
            </div>
            <p className="text-[11px] text-slate-400 pl-6.5 leading-relaxed">
              Only the authorized administrator (<span className="text-amber-400 font-mono">info@sunshinebabies.com</span>) is permitted to access this area.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              id="return-to-store-btn"
              onClick={() => navigateTo('home')}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Storefront</span>
            </button>

            <button
              id="switch-to-admin-login-btn"
              onClick={handleSignOutAndAdminLogin}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white border border-red-500/30 font-bold text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out & Log In as Admin</span>
            </button>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500">
          Sunshine Babies Essentials Security Verification System
        </div>
      </div>
    </div>
  );
};
