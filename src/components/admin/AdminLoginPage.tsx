import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../common/BrandLogo';

export const AdminLoginPage: React.FC = () => {
  const { isAuthorizedAdmin, currentAdminUser, adminLogin, adminLogout, navigateTo } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your administrator email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await adminLogin(cleanEmail, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Authentication failed. Please check your administrator credentials.');
      } else {
        // Successful login automatically navigates to /admin dashboard via StoreContext
        navigateTo('admin');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If already authenticated as an authorized admin
  if (isAuthorizedAdmin && currentAdminUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 text-slate-100 font-sans">
        <div className="max-w-md w-full mx-auto space-y-8 my-auto">
          {/* Logo & Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <BrandLogo inverted={true} size="lg" showTagline={false} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Administrator Session Active</span>
            </div>
            <h2 className="text-2xl font-serif font-black text-white">
              Welcome back, {currentAdminUser.full_name || 'Administrator'}
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              You are signed in as <span className="text-amber-400 font-medium">{currentAdminUser.email}</span> with {currentAdminUser.role === 'super_admin' ? 'Super Admin' : 'Admin'} privileges.
            </p>
          </div>

          {/* Action Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-sm space-y-4">
            <button
              id="enter-dashboard-btn"
              onClick={() => navigateTo('admin')}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Go to Admin Dashboard</span>
            </button>

            <button
              id="admin-logout-btn"
              onClick={async () => {
                await adminLogout();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4 text-rose-400" />
              <span>Sign Out of Administrator Account</span>
            </button>
          </div>

          {/* Return to storefront */}
          <div className="text-center">
            <button
              onClick={() => navigateTo('home')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Storefront</span>
            </button>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500 pt-8">
          Sunshine Babies Essentials &copy; {new Date().getFullYear()} &bull; Secure Administrator Portal
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 text-slate-100 font-sans">
      <div className="max-w-md w-full mx-auto space-y-8 my-auto">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo inverted={true} size="lg" showTagline={false} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Secure Admin Gateway</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
            Store Management Sign In
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Authorized administrator access only. Authentication is secured and monitored via Supabase database protocols.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          {/* Error Alert */}
          {errorMessage && (
            <div
              id="admin-login-error"
              className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-3 animate-fade-in"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4.5">
            {/* Email Field */}
            <div>
              <label htmlFor="admin-email" className="block text-xs font-bold text-slate-300 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@sunshinebabies.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="admin-password" className="block text-xs font-bold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-11 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="admin-login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Verifying Authorization...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-slate-950" />
                    <span>Authenticate & Access Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed text-center">
            All administrative logins are verified against database records. Unauthorized attempts are logged.
          </div>
        </div>

        {/* Back to Live Store */}
        <div className="text-center">
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Storefront</span>
          </button>
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-500 pt-8">
        Sunshine Babies Essentials &copy; {new Date().getFullYear()} &bull; Abuja, Nigeria
      </div>
    </div>
  );
};
