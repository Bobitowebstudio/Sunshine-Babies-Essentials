import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  Lock,
  LogOut,
  Plus,
  Trash2,
  CheckCircle,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  EyeOff,
  ShoppingBag,
  Loader2,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../lib/utils';
import { CustomerAddress } from '../../types';
import { ProductImage } from '../common/ProductImage';

export const AccountPage: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    loginCustomer,
    registerCustomer,
    logoutCustomer,
    updateCustomerProfile,
    orders,
    companySettings,
    navigateTo,
  } = useStore();

  // Authentication sub-states when logged out
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccessMessage, setAuthSuccessMessage] = useState('');

  // Active tab when logged in
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');

  // Profile editing state
  const [profileName, setProfileName] = useState(currentUser?.full_name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Address add state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressTitle, setAddressTitle] = useState('Home');
  const [streetAddress, setStreetAddress] = useState('');
  const [cityArea, setCityArea] = useState('Lekki Phase 1');
  const [stateName, setStateName] = useState('Lagos');

  // Keep profile form inputs in sync if user changes
  React.useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.full_name);
      setProfilePhone(currentUser.phone);
    }
  }, [currentUser]);

  // Filter orders belonging to this user
  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          o.customer_id === currentUser.id ||
          (o.customer_email && currentUser.email && o.customer_email.toLowerCase() === currentUser.email.toLowerCase())
      )
    : [];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMessage('');

    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail) {
      setAuthError('Please enter your email address.');
      return;
    }
    if (!passwordInput) {
      setAuthError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginCustomer(cleanEmail, passwordInput);
      if (!res.success) {
        setAuthError(res.error || 'Invalid email or password. Please try again.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'An unexpected error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMessage('');

    const cleanName = nameInput.trim();
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPhone = phoneInput.trim();

    // Validation
    if (!cleanName) {
      setAuthError('Please enter your full name.');
      return;
    }
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 7) {
      setAuthError('Please enter a valid WhatsApp phone number.');
      return;
    }
    if (!passwordInput || passwordInput.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerCustomer(cleanName, cleanEmail, cleanPhone, passwordInput);
      if (res.success) {
        if (res.requiresEmailConfirmation) {
          setAuthSuccessMessage(
            'Your account has been created! Please check your email inbox (and spam folder) to verify your address before logging in.'
          );
          setIsRegistering(false);
        }
      } else {
        setAuthError(res.error || 'Registration failed. Please check your details and try again.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'An unexpected error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !streetAddress) return;

    const newAddr: CustomerAddress = {
      id: 'addr-' + Date.now(),
      title: addressTitle,
      address: streetAddress,
      city: cityArea,
      state: stateName,
      phone: currentUser.phone,
      is_default: currentUser.addresses.length === 0,
    };

    const updatedUser = {
      ...currentUser,
      addresses: [...currentUser.addresses, newAddr],
    };

    await updateCustomerProfile(updatedUser);
    setIsAddingAddress(false);
    setStreetAddress('');
  };

  const handleDeleteAddress = async (id: string) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      addresses: currentUser.addresses.filter((a) => a.id !== id),
    };
    await updateCustomerProfile(updated);
  };

  const handleSaveProfileDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSavingProfile(true);
    try {
      const updatedUser = {
        ...currentUser,
        full_name: profileName.trim() || currentUser.full_name,
        phone: profilePhone.trim() || currentUser.phone,
      };
      await updateCustomerProfile(updatedUser);
      setProfileSavedToast(true);
      setTimeout(() => setProfileSavedToast(false), 4000);
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
              {isRegistering ? 'Create Customer Account' : 'Welcome Back'}
            </h1>
            <p className="text-xs text-slate-500">
              {isRegistering
                ? 'Save your addresses, track delivery progress & enjoy faster checkout'
                : 'Sign in to access your order history and stored delivery details'}
            </p>
          </div>

          {authSuccessMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Account Created</span>
              </div>
              <p className="text-emerald-700 leading-relaxed">{authSuccessMessage}</p>
            </div>
          )}

          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{authError}</div>
            </div>
          )}

          {isRegistering ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Amina Mohammed"
                    disabled={isLoading}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-slate-50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="amina@example.com"
                    disabled={isLoading}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-slate-50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+234 903 466 5968"
                    disabled={isLoading}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-slate-50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>{' '}
                  <span className="text-[10px] font-normal text-slate-400">(Min. 6 characters)</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-slate-50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="create-account-btn"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer mt-3 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="joy@example.com"
                    disabled={isLoading}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-slate-50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-slate-50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="sign-in-btn"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          )}

          <div className="pt-2 text-center text-xs text-slate-600 border-t border-slate-100">
            {isRegistering ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setAuthError('');
                    setAuthSuccessMessage('');
                  }}
                  className="text-amber-800 font-bold hover:underline cursor-pointer ml-1"
                >
                  Log In
                </button>
              </p>
            ) : (
              <p>
                New to {companySettings.business_name}?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setAuthError('');
                    setAuthSuccessMessage('');
                  }}
                  className="text-amber-800 font-bold hover:underline cursor-pointer ml-1"
                >
                  Create an Account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* User Hero Greeting */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 font-serif font-black text-xl">
              {currentUser.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{currentUser.full_name}</h1>
              <p className="text-xs text-slate-500">
                {currentUser.email} {currentUser.phone ? `• ${currentUser.phone}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={() => logoutCustomer()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-colors self-start sm:self-auto cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-slate-200/80 max-w-md">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({userOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>
        </div>

        {/* Tab 1: Order History */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {userOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No previous orders yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you make a purchase, all order receipts and live courier tracking will appear here.
                </p>
                <button
                  onClick={() => navigateTo('shop')}
                  className="px-5 py-2.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer hover:bg-amber-600 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-slate-900">
                            {ord.order_number}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                            {ord.order_status}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Placed on{' '}
                          {new Date(ord.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-black text-slate-900">
                          {formatCurrency(ord.total_amount, companySettings.currency_symbol)}
                        </span>
                        <button
                          onClick={() =>
                            navigateTo('track-order', { orderNumber: ord.order_number })
                          }
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>Track</span>
                        </button>
                      </div>
                    </div>

                    {/* Order items preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                            <ProductImage
                              src={item.image_url}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate">
                              {item.product_name}
                            </h4>
                            <span className="text-[11px] text-slate-500">
                              Qty: {item.quantity} ×{' '}
                              {formatCurrency(item.unit_price, companySettings.currency_symbol)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Delivery Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Delivery Addresses</h3>
              <button
                onClick={() => setIsAddingAddress(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            {isAddingAddress && (
              <form
                onSubmit={handleSaveAddress}
                className="bg-white rounded-3xl border border-amber-300 p-6 space-y-4 shadow-sm"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  New Delivery Location
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Label / Title (e.g. Home, Office)
                    </label>
                    <input
                      type="text"
                      required
                      value={addressTitle}
                      onChange={(e) => setAddressTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City / Area
                    </label>
                    <input
                      type="text"
                      required
                      value={cityArea}
                      onChange={(e) => setCityArea(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Street Address & Landmark
                    </label>
                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUser.addresses.length === 0 && !isAddingAddress && (
                <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                  No saved delivery addresses yet. Add an address for one-click checkout.
                </div>
              )}
              {currentUser.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                      {addr.title}
                    </span>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                      title="Delete Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-800 font-semibold">{addr.address}</p>
                  <p className="text-xs text-slate-500">
                    {addr.city}, {addr.state}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-5 max-w-xl">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
              <p className="text-xs text-slate-500">Update your contact profile synced to Supabase</p>
            </div>

            {profileSavedToast && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Profile details updated and saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfileDetails} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Managed securely via Supabase Auth
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] disabled:opacity-60 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

