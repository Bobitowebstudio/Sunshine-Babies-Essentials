import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building,
  MessageCircle,
  Banknote,
  CheckCircle2,
  ArrowRight,
  User,
  ShoppingBag,
  Info,
  Copy,
  Check,
  AlertCircle,
  Lock,
  RefreshCw,
  X,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, generateOrderNumber, getWhatsAppUrl } from '../../lib/utils';
import { PaymentMethod, Order } from '../../types';
import { ProductImage } from '../common/ProductImage';

interface PaystackInitResponse {
  success: boolean;
  reference: string;
  order_number: string;
  authorization_url?: string;
  access_code?: string;
  amount_kobo: number;
  total_amount: number;
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  paystack_public_key?: string;
  is_live?: boolean;
  test_mode?: boolean;
  message?: string;
  error?: string;
}

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartItemCount,
    deliveryLocations,
    companySettings,
    currentUser,
    createOrder,
    navigateTo,
  } = useStore();

  // Form states
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const activeLocations = React.useMemo(
    () => deliveryLocations.filter((l) => l.is_active),
    [deliveryLocations]
  );

  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    () => activeLocations[0]?.id || deliveryLocations[0]?.id || ''
  );

  // Sync selectedLocationId if active list changes and current selection is inactive
  useEffect(() => {
    if (activeLocations.length > 0) {
      const exists = activeLocations.some((l) => l.id === selectedLocationId);
      if (!exists) {
        setSelectedLocationId(activeLocations[0].id);
      }
    }
  }, [activeLocations, selectedLocationId]);

  const [address, setAddress] = useState(
    currentUser?.addresses.find((a) => a.is_default)?.address || ''
  );
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Processing & Feedback state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Paystack Modal Simulation state (when inline popup script isn't loaded or test simulation is used)
  const [activePaystackSession, setActivePaystackSession] = useState<PaystackInitResponse | null>(null);
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [simulatedCardNumber, setSimulatedCardNumber] = useState('4084 0800 0000 0000');
  const [simulatedCardExpiry, setSimulatedCardExpiry] = useState('12/28');
  const [simulatedCardCvv, setSimulatedCardCvv] = useState('123');

  const selectedLocation =
    activeLocations.find((l) => l.id === selectedLocationId) ||
    activeLocations[0] ||
    deliveryLocations.find((l) => l.id === selectedLocationId) ||
    deliveryLocations[0];
  const deliveryFee = selectedLocation ? selectedLocation.fee : 2500;
  const grandTotal = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  // Handle discount code
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (['WELCOME10', 'GOLDMOM', 'BABYLOVE'].includes(code)) {
      const discount = Math.round(cartSubtotal * 0.1);
      setDiscountAmount(discount);
      setCouponApplied(true);
    } else {
      setCouponError('Invalid coupon code. Try "WELCOME10" or "GOLDMOM"');
    }
  };

  const handleCopyAccount = () => {
    const accountNum = companySettings.account_number || (companySettings as any).bank_account_number;
    if (accountNum) {
      navigator.clipboard?.writeText(accountNum);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  // 1. WhatsApp Order Flow
  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim() || !selectedLocation) {
      setPaymentError('Please fill in all required customer details (name, phone, destination, and address).');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const newOrderNumber = generateOrderNumber();

    const created = createOrder(
      {
        order_number: newOrderNumber,
        customer: {
          customer_id: currentUser?.id,
          full_name: fullName.trim(),
          email: email.trim() || 'guest@sunshinebabies.com',
          phone: phone.trim(),
        },
        delivery_location: {
          address: address.trim(),
          state: selectedLocation.state,
          city: selectedLocation.city_area,
          instructions: deliveryNotes.trim(),
        },
        items: cart.map((item) => {
          const unitPrice =
            item.product.discount_price && item.product.discount_price > 0
              ? item.product.discount_price
              : item.product.regular_price;
          return {
            product_id: item.product.id,
            name: item.product.name,
            sku: item.product.sku,
            quantity: item.quantity,
            price: unitPrice,
            regular_price: item.product.regular_price,
            image: item.product.images[0] || '',
            age_group: item.product.age_group,
          };
        }),
        subtotal: cartSubtotal,
        delivery_fee: deliveryFee,
        discount_amount: discountAmount,
        discount_code: couponApplied ? couponCode : undefined,
        total_amount: grandTotal,
        payment_method: 'whatsapp',
        payment_status: 'pending_verification',
        order_status: 'Pending',
        notes: deliveryNotes.trim(),
      },
      { clearCart: true }
    );

    setIsProcessing(false);
    navigateTo('order-success', { order: created });
  };

  // 2. Bank Transfer / Cash on Delivery Checkout Flow
  const handleDirectOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim() || !selectedLocation) {
      setPaymentError('Please fill in all required fields to place your order.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const newOrderNumber = generateOrderNumber();

    const created = createOrder(
      {
        order_number: newOrderNumber,
        customer: {
          customer_id: currentUser?.id,
          full_name: fullName.trim(),
          email: email.trim() || 'guest@sunshinebabies.com',
          phone: phone.trim(),
        },
        delivery_location: {
          address: address.trim(),
          state: selectedLocation.state,
          city: selectedLocation.city_area,
          instructions: deliveryNotes.trim(),
        },
        items: cart.map((item) => {
          const unitPrice =
            item.product.discount_price && item.product.discount_price > 0
              ? item.product.discount_price
              : item.product.regular_price;
          return {
            product_id: item.product.id,
            name: item.product.name,
            sku: item.product.sku,
            quantity: item.quantity,
            price: unitPrice,
            regular_price: item.product.regular_price,
            image: item.product.images[0] || '',
            age_group: item.product.age_group,
          };
        }),
        subtotal: cartSubtotal,
        delivery_fee: deliveryFee,
        discount_amount: discountAmount,
        discount_code: couponApplied ? couponCode : undefined,
        total_amount: grandTotal,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cash_on_delivery' ? 'unpaid' : 'pending_verification',
        order_status: 'Pending',
        notes: deliveryNotes.trim(),
      },
      { clearCart: true }
    );

    setIsProcessing(false);
    navigateTo('order-success', { order: created });
  };

  // 3. Online Paystack Payment Flow
  const handlePaystackCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!fullName.trim() || !phone.trim() || !address.trim() || !selectedLocation) {
      setPaymentError('Please fill in your name, WhatsApp phone number, and delivery address before proceeding.');
      return;
    }

    if (cart.length === 0) {
      setPaymentError('Your cart is empty. Please add items before checking out.');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus('Securing transaction with server & Paystack...');

    try {
      // Step 1: Server-side initialization & price calculation
      const initResponse = await fetch('/api/payment/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            full_name: fullName.trim(),
            email: email.trim() || 'customer@sunshinebabies.com',
            phone: phone.trim(),
          },
          delivery_location_id: selectedLocation.id,
          address: address.trim(),
          instructions: deliveryNotes.trim(),
          items: cart.map((it) => ({
            product_id: it.product.id,
            quantity: it.quantity,
          })),
          discount_code: couponApplied ? couponCode : undefined,
        }),
      });

      const initData: PaystackInitResponse = await initResponse.json();

      if (!initResponse.ok || !initData.success) {
        throw new Error(initData.error || 'Failed to initialize secure payment transaction.');
      }

      setActivePaystackSession(initData);

      // Step 2: Open Paystack Payment Interface
      const win = window as any;
      const hasPaystackInline = typeof win.PaystackPop !== 'undefined' && win.PaystackPop?.setup;
      const publicKey = initData.paystack_public_key || (import.meta as any).env?.VITE_PAYSTACK_PUBLIC_KEY;

      if (hasPaystackInline && publicKey && publicKey.trim() !== '') {
        // Use Paystack official inline modal popup
        setProcessingStatus('Opening Paystack payment interface...');
        const handler = win.PaystackPop.setup({
          key: publicKey,
          email: email.trim() || 'customer@sunshinebabies.com',
          amount: initData.amount_kobo,
          currency: 'NGN',
          ref: initData.reference,
          metadata: {
            custom_fields: [
              { display_name: 'Customer Name', variable_name: 'customer_name', value: fullName.trim() },
              { display_name: 'Phone Number', variable_name: 'phone_number', value: phone.trim() },
              { display_name: 'Order Number', variable_name: 'order_number', value: initData.order_number },
            ],
          },
          callback: async (response: { reference: string }) => {
            await verifyAndFinalizeOrder(response.reference || initData.reference, initData);
          },
          onClose: () => {
            setIsProcessing(false);
            setProcessingStatus('');
            setPaymentError('Paystack payment was closed before completion. Your cart remains intact so you can retry anytime.');
          },
        });
        handler.openIframe();
      } else {
        // Provide seamless interactive payment modal (compatible with test environment or when public key is loaded dynamically)
        setIsProcessing(false);
        setProcessingStatus('');
        setShowSimulatedModal(true);
      }
    } catch (err: any) {
      console.error('Payment initialization error:', err);
      setIsProcessing(false);
      setProcessingStatus('');
      setPaymentError(err.message || 'Unable to connect to Paystack payment gateway. Please check your internet or try another payment method.');
    }
  };

  // Step 3: Server-side verification & order creation
  const verifyAndFinalizeOrder = async (reference: string, sessionData: PaystackInitResponse) => {
    setIsProcessing(true);
    setProcessingStatus('Verifying payment on server...');
    setPaymentError(null);

    try {
      const verifyRes = await fetch('/api/payment/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: reference,
          expected_amount: sessionData.total_amount,
          order_number: sessionData.order_number,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.verified || verifyData.payment_status !== 'paid') {
        throw new Error(verifyData.error || verifyData.message || 'Payment verification failed on server.');
      }

      // Step 4: Create final order in Admin Dashboard & Local Storage
      const paidOrder: Order = createOrder(
        {
          order_number: sessionData.order_number,
          customer: {
            customer_id: currentUser?.id,
            full_name: fullName.trim(),
            email: email.trim() || 'guest@sunshinebabies.com',
            phone: phone.trim(),
          },
          delivery_location: {
            address: address.trim(),
            state: selectedLocation.state,
            city: selectedLocation.city_area,
            instructions: deliveryNotes.trim(),
          },
          items: cart.map((item) => {
            const unitPrice =
              item.product.discount_price && item.product.discount_price > 0
                ? item.product.discount_price
                : item.product.regular_price;
            return {
              product_id: item.product.id,
              name: item.product.name,
              sku: item.product.sku,
              quantity: item.quantity,
              price: unitPrice,
              regular_price: item.product.regular_price,
              image: item.product.images[0] || '',
              age_group: item.product.age_group,
            };
          }),
          subtotal: sessionData.subtotal || cartSubtotal,
          delivery_fee: sessionData.delivery_fee || deliveryFee,
          discount_amount: sessionData.discount_amount || discountAmount,
          discount_code: couponApplied ? couponCode : undefined,
          total_amount: sessionData.total_amount || grandTotal,
          payment_method: 'paystack',
          payment_status: 'paid',
          order_status: 'Processing',
          payment_reference: reference,
          payment_channel: verifyData.channel || 'card',
          paid_at: verifyData.paid_at || new Date().toISOString(),
          notes: deliveryNotes.trim(),
        },
        { clearCart: true }
      );

      // Celebration Confetti
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#EC4899', '#3B82F6'],
        });
      } catch {}

      setIsProcessing(false);
      setShowSimulatedModal(false);
      setActivePaystackSession(null);

      // Navigate to order confirmation
      navigateTo('order-success', { order: paidOrder });
    } catch (err: any) {
      console.error('Payment verification error:', err);
      setIsProcessing(false);
      setProcessingStatus('');
      setShowSimulatedModal(false);
      setPaymentError(
        `Payment was not verified: ${err.message || 'Transaction could not be confirmed.'}. Your cart is preserved so you can retry.`
      );
    }
  };

  // Form submission dispatcher
  const handleSubmitOrder = (e: React.FormEvent) => {
    if (paymentMethod === 'paystack') {
      handlePaystackCheckout(e);
    } else if (paymentMethod === 'whatsapp') {
      handleWhatsAppCheckout(e);
    } else {
      handleDirectOrder(e);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-xs text-slate-500 mt-1">Please add items to your cart to proceed with checkout.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer shadow-xs transition-colors"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">Checkout</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete your delivery information and choose your preferred secure payment method
          </p>
        </div>

        {/* Global Error Notice if payment fails or is cancelled */}
        {paymentError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block text-sm">Payment Notice</span>
              <p className="mt-0.5 text-rose-700">{paymentError}</p>
            </div>
            <button
              onClick={() => setPaymentError(null)}
              className="text-rose-500 hover:text-rose-800 cursor-pointer p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Delivery & Payment Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Customer Details Box */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-600" />
                  <h2 className="text-sm font-bold text-slate-900">1. Customer Information</h2>
                </div>
                {!currentUser && (
                  <button
                    type="button"
                    onClick={() => navigateTo('account')}
                    className="text-[11px] font-semibold text-amber-700 hover:underline cursor-pointer"
                  >
                    Already have an account? Sign In
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Mrs. Chioma Adeleke"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 09034665968"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    We send real-time dispatch and delivery updates here
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. chioma@example.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address Box */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Truck className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900">2. Delivery Destination</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select State / City Area *
                  </label>
                  <select
                    id="checkout-delivery-location-select"
                    value={selectedLocationId}
                    onChange={(e) => setSelectedLocationId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    {activeLocations.length > 0 ? (
                      activeLocations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.state} — {loc.city_area} ({formatCurrency(loc.fee, companySettings.currency_symbol)})
                        </option>
                      ))
                    ) : (
                      <option value="">Standard Nationwide Shipping</option>
                    )}
                  </select>
                </div>

                {/* Selected Location Summary Highlight Card */}
                {selectedLocation && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <div className="flex items-center gap-1.5 text-amber-900">
                        <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Delivery to {selectedLocation.state} — {selectedLocation.city_area}</span>
                      </div>
                      <span className="font-black text-amber-950 text-sm">
                        {formatCurrency(selectedLocation.fee, companySettings.currency_symbol)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-amber-200/50">
                      <span>Estimated Delivery Time:</span>
                      <span className="font-bold text-slate-800">{selectedLocation.estimated_days}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Detailed Street Address & Landmark *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Flat 4B, Emerald Court, Opposite Central Park, Lekki Phase 1"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Call upon arrival, leave package with security if away"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method Selector */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900">3. Choose Payment Method</h2>
              </div>

              <div className="space-y-3">
                {/* 1. Paystack (Online Payment) - TOP RECOMMENDED */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'paystack'
                      ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="paystack"
                    checked={paymentMethod === 'paystack'}
                    onChange={() => setPaymentMethod('paystack')}
                    className="mt-0.5 accent-amber-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        <CreditCard className="w-4 h-4 text-amber-600" />
                        <span>Online Payment (Paystack Gateway)</span>
                      </div>
                      <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full">
                        Temporarily Unavailable
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Pay securely with Nigerian Debit Card (Mastercard, Visa, Verve), Bank Transfer, Apple Pay, or USSD via Paystack.
                    </p>
                    <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold block text-amber-950">
                          NOTICE: Paystack payment is temporarily unavailable.
                        </strong>
                        <p className="text-[10.5px] text-amber-800/90 mt-0.5 leading-normal">
                          Please use any of our other available payment options, including bank account payment, payment after delivery, WhatsApp-assisted payment, and other payment methods available on the website. Paystack will be available again soon. We apologise for any inconvenience.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        256-bit SSL Encrypted & Verified
                      </span>
                    </div>
                  </div>
                </label>

                {/* 2. Bank Transfer */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-0.5 accent-amber-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-amber-700" />
                      <span className="text-xs font-bold text-slate-900">Direct Bank Transfer</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Transfer directly to our store bank account and forward your receipt to our WhatsApp desk.
                    </p>

                    {paymentMethod === 'bank_transfer' && (
                      <div className="mt-3 p-3.5 rounded-xl bg-white border border-amber-200 text-xs space-y-2 shadow-2xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Bank Name:</span>
                          <span className="font-bold text-slate-900">
                            {companySettings.bank_name || 'Guaranty Trust Bank (GTBank)'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Account Number:</span>
                          <div className="flex items-center gap-1 font-mono font-black text-amber-900 text-sm">
                            <span>
                              {companySettings.account_number || (companySettings as any).bank_account_number || '0123456789'}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyAccount}
                              className="p-1 text-slate-400 hover:text-amber-700 cursor-pointer"
                              title="Copy account number"
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
                            {companySettings.account_name || companySettings.business_name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* 3. WhatsApp Direct Order */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'whatsapp'
                      ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="whatsapp"
                    checked={paymentMethod === 'whatsapp'}
                    onChange={() => setPaymentMethod('whatsapp')}
                    className="mt-0.5 accent-emerald-600"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900">Order via WhatsApp Concierge</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Our live store sales representative will assist you with custom sizes, express delivery, and payment verification.
                    </p>
                  </div>
                </label>

                {/* 4. Cash on Delivery */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="mt-0.5 accent-amber-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-amber-700" />
                      <span className="text-xs font-bold text-slate-900">Pay on Delivery (Cash / POS)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Pay via cash or POS upon package inspection and handover.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Review (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                Order Review ({cartItemCount} items)
              </h2>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
                {cart.map((item) => {
                  const unitPrice =
                    item.product.discount_price && item.product.discount_price > 0
                      ? item.product.discount_price
                      : item.product.regular_price;

                  return (
                    <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-100 shrink-0">
                          <ProductImage
                            src={item.product.images[0]}
                            alt={item.product.name}
                            categoryId={item.product.category_id}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{item.product.name}</p>
                          <span className="text-[11px] text-slate-400">
                            Age: {item.product.age_group} • Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        {formatCurrency(unitPrice * item.quantity, companySettings.currency_symbol)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Discount Code Input */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Promotional Coupon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    disabled={couponApplied}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
                  >
                    {couponApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
                {couponApplied && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">
                    ✓ 10% discount applied to your order!
                  </p>
                )}
              </div>

              {/* Summary Calculations */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cartItemCount} items)</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(cartSubtotal, companySettings.currency_symbol)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Delivery ({selectedLocation?.city_area || 'Standard'})</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(deliveryFee, companySettings.currency_symbol)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(discountAmount, companySettings.currency_symbol)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-lg text-amber-900">
                    {formatCurrency(grandTotal, companySettings.currency_symbol)}
                  </span>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isProcessing}
                id="checkout-pay-btn"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 group"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>{processingStatus || 'Processing Order...'}</span>
                  </div>
                ) : paymentMethod === 'paystack' ? (
                  <>
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Pay with Paystack ({formatCurrency(grandTotal, companySettings.currency_symbol)})</span>
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  </>
                ) : paymentMethod === 'whatsapp' ? (
                  <>
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Complete Order via WhatsApp</span>
                  </>
                ) : (
                  <>
                    <span>Place Order ({formatCurrency(grandTotal, companySettings.currency_symbol)})</span>
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-[11px] text-slate-400">
                  By placing your order, you agree to {companySettings.business_name}'s safe delivery & return policy.
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Paystack Interactive Payment Modal */}
      {showSimulatedModal && activePaystackSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => {
              if (!isProcessing) {
                setShowSimulatedModal(false);
                setPaymentError('Payment window closed. You can retry or choose another payment method.');
              }
            }}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-200">
            {/* Paystack Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-sm">
                  P
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Paystack Secure Checkout</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-normal">
                      Verified
                    </span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Ref: {activePaystackSession.reference}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => {
                  setShowSimulatedModal(false);
                  setPaymentError('Payment was cancelled. Your cart is preserved.');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Paystack Body */}
            <div className="p-6 space-y-5 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Amount to Pay</span>
                  <span className="text-xl font-black text-slate-900">
                    {formatCurrency(activePaystackSession.total_amount, companySettings.currency_symbol)}
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <span className="block font-bold text-slate-800">{fullName}</span>
                  <span>{email || phone}</span>
                </div>
              </div>

              {/* Card Form */}
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={simulatedCardNumber}
                    onChange={(e) => setSimulatedCardNumber(e.target.value)}
                    placeholder="4084 0800 0000 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={simulatedCardExpiry}
                      onChange={(e) => setSimulatedCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={simulatedCardCvv}
                      onChange={(e) => setSimulatedCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => verifyAndFinalizeOrder(activePaystackSession.reference, activePaystackSession)}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{processingStatus || 'Verifying Payment...'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Authorize & Pay {formatCurrency(activePaystackSession.total_amount, companySettings.currency_symbol)}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => {
                    setShowSimulatedModal(false);
                    setIsProcessing(false);
                    setPaymentError('Transaction was cancelled. No charge was made.');
                  }}
                  className="w-full py-2.5 rounded-xl text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel and Return to Checkout
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Secured by Paystack Payment Infrastructure</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
