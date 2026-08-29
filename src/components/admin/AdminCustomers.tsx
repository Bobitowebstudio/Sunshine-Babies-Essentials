import React, { useState } from 'react';
import { Search, User, Mail, Phone, ShoppingBag, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../lib/utils';

export const AdminCustomers: React.FC = () => {
  const { customers = [], orders = [], companySettings } = useStore();
  const [search, setSearch] = useState('');

  const filteredCustomers = (customers || []).filter((c) => {
    if (!c) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (c.full_name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Total Registered: <strong className="text-slate-900">{(customers || []).length}</strong>
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Customer Profile</th>
                <th className="py-3 px-4">WhatsApp Contact</th>
                <th className="py-3 px-4">Primary Address</th>
                <th className="py-3 px-4">Lifetime Orders</th>
                <th className="py-3 px-4">Total Spend</th>
                <th className="py-3 px-4 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => {
                const customerOrders = (orders || []).filter(
                  (o) =>
                    o?.customer?.customer_id === cust.id ||
                    (o?.customer?.email && o.customer.email.toLowerCase() === (cust.email || '').toLowerCase()) ||
                    (o as any)?.customer_id === cust.id ||
                    ((o as any)?.customer_email && (o as any).customer_email.toLowerCase() === (cust.email || '').toLowerCase())
                );
                const totalSpent = customerOrders.reduce((sum, o) => sum + (o?.total_amount || 0), 0);
                const addrs = cust.addresses || [];
                const primaryAddr = addrs.find((a) => a?.is_default) || addrs[0];

                return (
                  <tr key={cust.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs shrink-0">
                          {(cust.full_name || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{cust.full_name || 'Customer'}</span>
                          <span className="text-[11px] text-slate-400">{cust.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {cust.phone}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {primaryAddr ? (
                        <span>
                          {primaryAddr.city || (primaryAddr as any).city_area}, {primaryAddr.state}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">No saved address</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {customerOrders.length} orders
                    </td>

                    <td className="py-3.5 px-4 font-black text-amber-900">
                      {formatCurrency(totalSpent, companySettings.currency_symbol)}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-400 text-[11px]">
                      {cust.created_at ? new Date(cust.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }) : 'Recent'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
