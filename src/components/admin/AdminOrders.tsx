import React, { useState } from 'react';
import {
  Search,
  Eye,
  MessageCircle,
  Truck,
  CheckCircle2,
  Clock,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, getCustomerWhatsAppUrl } from '../../lib/utils';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { getProductPlaceholderSvg } from '../../lib/placeholders';

export const AdminOrders: React.FC = () => {
  const { orders = [], updateOrderStatus, updatePaymentStatus, companySettings } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = (orders || []).filter((o) => {
    if (!o) return false;
    if (statusFilter !== 'all' && (o.order_status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const customerName = o.customer?.full_name || (o as any).customer_name || '';
      const customerPhone = o.customer?.phone || (o as any).customer_phone || '';
      const city = o.delivery_location?.city || (o as any).delivery_city || '';
      return (
        (o.order_number || '').toLowerCase().includes(q) ||
        customerName.toLowerCase().includes(q) ||
        customerPhone.includes(q) ||
        city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const generateOrderUpdateWhatsApp = (ord: Order) => {
    const customerName = ord.customer?.full_name || (ord as any).customer_name || 'Customer';
    const customerPhone = ord.customer?.phone || (ord as any).customer_phone || '';
    const address = ord.delivery_location?.address || (ord as any).delivery_address || '';
    const city = ord.delivery_location?.city || (ord as any).delivery_city || '';

    let msg = `Hello ${customerName}! 👋\n\nUpdate on your ${companySettings.business_name} order *${ord.order_number}*:\n`;
    if (ord.order_status === 'Confirmed') {
      msg += `✅ Your order has been confirmed and is being packaged for dispatch!\n💰 Total: ${formatCurrency(ord.total_amount || 0, companySettings.currency_symbol)}`;
    } else if (ord.order_status === 'Shipped') {
      msg += `🚚 Your package has been dispatched and is on its way to ${address}, ${city}!\nExpected arrival shortly.`;
    } else if (ord.order_status === 'Delivered') {
      msg += `🎉 Your order has been marked as Delivered! Thank you for trusting ${companySettings.business_name} for your little one.`;
    } else {
      msg += `Status: ${ord.order_status}.\nTotal: ${formatCurrency(ord.total_amount || 0, companySettings.currency_symbol)}`;
    }
    return getCustomerWhatsAppUrl(customerPhone, msg);
  };

  const statusOptions: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Ready for Delivery',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'] as const).map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer shrink-0 ${
                  statusFilter === st
                    ? 'bg-slate-900 text-amber-400 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No orders match current criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 block">
                        {ord.order_number}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(ord.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {ord.payment_reference && (
                        <span className="text-[9px] font-mono text-slate-400 block truncate max-w-[120px]" title={ord.payment_reference}>
                          Ref: {ord.payment_reference}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{ord.customer?.full_name || (ord as any).customer_name || 'Customer'}</span>
                      <span className="text-[11px] text-slate-500">{ord.customer?.phone || (ord as any).customer_phone || ''}</span>
                      {ord.customer?.email && (
                        <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">{ord.customer.email}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {ord.delivery_location?.city || (ord as any).delivery_city || 'City'}
                      </span>
                      <span className="text-[10px] text-slate-400">{ord.delivery_location?.state || (ord as any).delivery_state || ''}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">
                        {formatCurrency(ord.total_amount || 0, companySettings.currency_symbol)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {(ord.items || []).length} {(ord.items || []).length === 1 ? 'item' : 'items'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-700 capitalize block">
                          {(ord.payment_method || 'bank_transfer').replace(/_/g, ' ')}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.payment_status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.payment_status === 'failed'
                              ? 'bg-rose-100 text-rose-800'
                              : ord.payment_status === 'pending_verification'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {(ord.payment_status || 'unpaid').replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={ord.order_status}
                        onChange={(e) =>
                          updateOrderStatus(ord.id, e.target.value as OrderStatus)
                        }
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 bg-slate-50 uppercase cursor-pointer"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={generateOrderUpdateWhatsApp(ord)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                          title="Send WhatsApp Update"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrder(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto z-10 border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400">Order Reference</span>
                <h3 className="font-mono font-black text-lg text-slate-900">
                  {selectedOrder.order_number}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800">
                  {selectedOrder.order_status}
                </span>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Quick Status Modifiers */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Update Order Status:</label>
                <select
                  value={selectedOrder.order_status}
                  onChange={(e) => {
                    const st = e.target.value as OrderStatus;
                    updateOrderStatus(selectedOrder.id, st);
                    setSelectedOrder({ ...selectedOrder, order_status: st });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-semibold"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Update Payment Status:</label>
                <select
                  value={selectedOrder.payment_status}
                  onChange={(e) => {
                    const pst = e.target.value as PaymentStatus;
                    updatePaymentStatus(selectedOrder.id, pst);
                    setSelectedOrder({ ...selectedOrder, payment_status: pst });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-semibold"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="pending_verification">Pending Verification</option>
                  <option value="paid">Mark as Paid</option>
                  <option value="failed">Payment Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>

            {/* Payment Details Box if available */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Gateway / Method:</span>
                <span className="font-bold text-slate-900 capitalize">
                  {(selectedOrder.payment_method || 'bank_transfer').replace(/_/g, ' ')}
                </span>
              </div>
              {selectedOrder.payment_reference && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Reference:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedOrder.payment_reference}</span>
                </div>
              )}
              {selectedOrder.payment_channel && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Channel:</span>
                  <span className="font-bold text-slate-900 uppercase">{selectedOrder.payment_channel}</span>
                </div>
              )}
              {selectedOrder.paid_at && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Paid At:</span>
                  <span className="text-slate-800">
                    {new Date(selectedOrder.paid_at).toLocaleString('en-GB')}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-amber-200/60 font-bold">
                <span className="text-slate-700">Total Order Amount:</span>
                <span className="text-amber-900 text-sm">
                  {formatCurrency(selectedOrder.total_amount || 0, companySettings.currency_symbol)}
                </span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Purchased Products
              </h4>
              <div className="divide-y divide-slate-100">
                {(selectedOrder.items || []).map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.image || getProductPlaceholderSvg(it.name, '', 'main')}
                        alt={it.name}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{it.name}</p>
                        <span className="text-[11px] text-slate-400">
                          SKU: {it.sku} • Qty: {it.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatCurrency((it.price || 0) * (it.quantity || 1), companySettings.currency_symbol)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">Customer Details:</span>
                <p className="font-bold text-slate-900">{selectedOrder.customer?.full_name || (selectedOrder as any).customer_name || 'Customer'}</p>
                <p className="text-slate-600">WhatsApp: {selectedOrder.customer?.phone || (selectedOrder as any).customer_phone || 'None'}</p>
                <p className="text-slate-600">Email: {selectedOrder.customer?.email || (selectedOrder as any).customer_email || 'None'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">Delivery Address:</span>
                <p className="text-slate-800">{selectedOrder.delivery_location?.address || (selectedOrder as any).delivery_address || 'Standard Delivery'}</p>
                <p className="text-slate-600">
                  {selectedOrder.delivery_location?.city || (selectedOrder as any).delivery_city || ''}, {selectedOrder.delivery_location?.state || (selectedOrder as any).delivery_state || ''}
                </p>
                {selectedOrder.notes && (
                  <p className="text-amber-800 bg-amber-50 p-2 rounded-lg mt-1">
                    Note: {selectedOrder.notes}
                  </p>
                )}
              </div>
            </div>

            {/* WhatsApp Handoff CTA */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <a
                href={generateOrderUpdateWhatsApp(selectedOrder)}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Customer on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

