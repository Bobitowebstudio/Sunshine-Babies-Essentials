import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Truck,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  Settings,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  BellRing,
  ExternalLink,
  ShieldCheck,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getProductPlaceholderSvg } from '../../lib/placeholders';
import { BrandLogo } from '../common/BrandLogo';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';
import { AdminDelivery } from './AdminDelivery';
import { AdminBanners } from './AdminBanners';
import { AdminInquiries } from './AdminInquiries';
import { AdminTemplates } from './AdminTemplates';
import { AdminSettings } from './AdminSettings';
import { formatCurrency } from '../../lib/utils';

type AdminTab =
  | 'overview'
  | 'products'
  | 'orders'
  | 'customers'
  | 'delivery'
  | 'banners'
  | 'inquiries'
  | 'templates'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    products = [],
    orders = [],
    customers = [],
    inquiries = [],
    notifications: stockNotifications = [],
    companySettings,
    adminTab,
    setAdminTab,
    isAuthorizedAdmin,
    currentAdminUser,
    adminLogout,
    navigateTo,
  } = useStore();

  const activeTab = adminTab || 'overview';
  const setActiveTab = (tab: AdminTab) => {
    setAdminTab(tab);
    navigateTo('admin', { tab });
  };

  // Computed metrics
  const totalRevenue = (orders || []).reduce((sum, o) => sum + (o?.total_amount || 0), 0);
  const pendingOrders = (orders || []).filter((o) => (o?.order_status || '').toLowerCase().includes('pending')).length;
  const lowStockCount = (products || []).filter((p) => (p?.stock_quantity ?? 0) <= 5).length;
  const pendingInquiries = (inquiries || []).filter((i) => (i?.status || '').toLowerCase().includes('pending') || i?.status === 'New').length;

  const navItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', label: 'Store Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Inventory', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined },
    { id: 'orders', label: 'Orders & Dispatch', icon: ShoppingBag, badge: pendingOrders > 0 ? `${pendingOrders} New` : undefined },
    { id: 'customers', label: 'Customer Roster', icon: Users },
    { id: 'delivery', label: 'Delivery Zones & Fees', icon: Truck },
    { id: 'banners', label: 'Promotional Banners', icon: ImageIcon },
    { id: 'inquiries', label: 'Customer Inquiries', icon: MessageSquare, badge: pendingInquiries > 0 ? `${pendingInquiries}` : undefined },
    { id: 'templates', label: 'WhatsApp Templates', icon: FileText },
    { id: 'settings', label: 'Store Branding & Setup', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-900 flex items-center justify-between">
            <BrandLogo inverted={true} size="sm" showTagline={false} />
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        isActive
                          ? 'bg-slate-950 text-amber-300'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Session & Exit Controls */}
        <div className="p-4 border-t border-slate-900 space-y-2">
          {currentAdminUser && (
            <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-bold truncate">
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{currentAdminUser.full_name || 'Admin User'}</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{currentAdminUser.email}</p>
            </div>
          )}

          <button
            onClick={() => navigateTo('home')}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>View Public Store</span>
          </button>

          <button
            onClick={adminLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-800/40 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-base sm:text-lg font-serif font-black text-slate-900">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-slate-500">
              {companySettings.business_name} Admin Control Portal
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Store</span>
            </button>

            <button
              onClick={adminLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Body View Container */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1: Revenue */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                      Total Sales Revenue
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {formatCurrency(totalRevenue, companySettings.currency_symbol)}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Real-time lifetime orders</span>
                  </span>
                </div>

                {/* Metric 2: Pending Orders */}
                <div
                  onClick={() => setActiveTab('orders')}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-2 cursor-pointer hover:border-amber-400 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                      Active Orders
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{orders.length}</div>
                  <span className="text-[11px] text-amber-700 font-bold">
                    {pendingOrders} awaiting fulfillment
                  </span>
                </div>

                {/* Metric 3: Products */}
                <div
                  onClick={() => setActiveTab('products')}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-2 cursor-pointer hover:border-amber-400 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                      Product Catalog
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{products.length}</div>
                  <span className="text-[11px] text-slate-500">
                    {lowStockCount} items low on stock
                  </span>
                </div>

                {/* Metric 4: Inquiries & Restocks */}
                <div
                  onClick={() => setActiveTab('inquiries')}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-2 cursor-pointer hover:border-amber-400 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                      Customer Inquiries
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{inquiries.length}</div>
                  <span className="text-[11px] text-purple-700 font-bold">
                    {stockNotifications.length} restock requests logged
                  </span>
                </div>
              </div>

              {/* Quick Action Hub */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders Stream */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-amber-800 hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {(orders || []).slice(0, 5).map((ord) => (
                      <div
                        key={ord.id}
                        className="py-3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <span className="font-mono font-bold text-slate-900 block">
                            {ord.order_number}
                          </span>
                          <span className="text-slate-500">
                            {ord.customer?.full_name || (ord as any).customer_name || 'Customer'} • {ord.delivery_location?.city || (ord as any).delivery_city || 'Store Pickup'}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-slate-900 block">
                            {formatCurrency(ord.total_amount || 0, companySettings.currency_symbol)}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                            {ord.order_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inventory Alerts & Quick Shortcuts */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">Inventory Attention</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-700">
                      Low Stock
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {(products || [])
                      .filter((p) => (p?.stock_quantity ?? 0) <= 5 || p?.is_out_of_stock)
                      .slice(0, 5)
                      .map((p) => (
                        <div
                          key={p.id}
                          className="py-3 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0] || getProductPlaceholderSvg(p.name, p.category_id, 'main')}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                            />
                            <div>
                              <p className="font-bold text-slate-900 truncate max-w-xs">{p.name}</p>
                              <span className="text-[10px] font-mono text-slate-400">
                                SKU: {p.sku}
                              </span>
                            </div>
                          </div>

                          <span className="font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                            {(p.stock_quantity ?? 0) <= 0 ? 'Out of Stock' : `${p.stock_quantity} remaining`}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'customers' && <AdminCustomers />}
          {activeTab === 'delivery' && <AdminDelivery />}
          {activeTab === 'banners' && <AdminBanners />}
          {activeTab === 'inquiries' && <AdminInquiries />}
          {activeTab === 'templates' && <AdminTemplates />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  );
};
