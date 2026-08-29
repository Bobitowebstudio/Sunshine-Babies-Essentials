import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { ChinaPartnerSection } from './components/common/ChinaPartnerSection';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { NotifyModal } from './components/common/NotifyModal';
import { QuickViewModal } from './components/common/QuickViewModal';
import { HomePage } from './components/home/HomePage';
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { CartPage } from './components/cart/CartPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderSuccessPage } from './components/checkout/OrderSuccessPage';
import { TrackOrderPage } from './components/account/TrackOrderPage';
import { AccountPage } from './components/account/AccountPage';
import { ContactPage } from './components/contact/ContactPage';
import { AboutPage } from './components/about/AboutPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminAccessDenied } from './components/admin/AdminAccessDenied';
import { MessageCircle, Loader2 } from 'lucide-react';
import { getWhatsAppUrl } from './lib/utils';

const MainContent: React.FC = () => {
  const { activePage, isAuthorizedAdmin, isAdminChecking, currentUser, companySettings } = useStore();

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Dedicated Admin Login Route
  if (activePage === 'admin-login') {
    if (isAuthorizedAdmin) {
      return <AdminDashboard />;
    }
    return <AdminLoginPage />;
  }

  // Strictly Protected Admin Route
  if (activePage === 'admin') {
    if (isAdminChecking) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-300">Verifying administrator authorization...</p>
        </div>
      );
    }
    if (isAuthorizedAdmin) {
      return <AdminDashboard />;
    }
    // If a normal authenticated customer attempts to access /admin -> Show Access Denied
    if (currentUser) {
      return <AdminAccessDenied />;
    }
    // Logged-out visitor attempting to access /admin -> display admin login
    return <AdminLoginPage />;
  }

  const floatingWhatsAppUrl = getWhatsAppUrl(
    companySettings.whatsapp_number,
    `Hello ${companySettings.business_name}! I have a question about shopping on your website.`
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-amber-200 selection:text-slate-900">
      {/* Top Header / Navigation */}
      <Header />

      {/* Main Routed Content */}
      <main className="flex-1">
        {activePage === 'home' && <HomePage />}
        {activePage === 'shop' && <ShopPage />}
        {(activePage === 'product' || activePage === 'product-detail') && <ProductDetailPage />}
        {activePage === 'cart' && <CartPage />}
        {activePage === 'checkout' && <CheckoutPage />}
        {activePage === 'order-success' && <OrderSuccessPage />}
        {activePage === 'track-order' && <TrackOrderPage />}
        {activePage === 'account' && <AccountPage />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'contact' && <ContactPage />}
      </main>

      {/* Standalone China Sourcing & Logistics Partner Section */}
      <ChinaPartnerSection />

      {/* Main Website Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <NotifyModal />
      <QuickViewModal />

      {/* Floating Instant WhatsApp Support Button */}
      <a
        id="floating-whatsapp-btn"
        href={floatingWhatsAppUrl}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl hover:shadow-emerald-600/30 transition-all duration-300 transform hover:scale-105 group"
        title="Chat with Customer Support on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 text-white fill-white shrink-0" />
        <span className="text-xs font-bold hidden sm:inline-block pr-1">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
