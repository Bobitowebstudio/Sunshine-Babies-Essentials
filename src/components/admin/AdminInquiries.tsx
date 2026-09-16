import React, { useState } from 'react';
import { MessageSquare, MessageCircle, Mail, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getCustomerWhatsAppUrl } from '../../lib/utils';
import { Inquiry } from '../../types';

export const AdminInquiries: React.FC = () => {
  const { inquiries = [], updateInquiryStatus, companySettings } = useStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  const filteredInquiries = (inquiries || []).filter((inq) => {
    if (!inq) return false;
    const st = (inq.status || '').toLowerCase();
    if (filter === 'pending') return st === 'pending' || st === 'new';
    if (filter === 'resolved') return st === 'resolved' || st === 'closed';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Customer Inquiries & Communication Logs
          </h2>
          <p className="text-xs text-slate-500">
            Messages submitted via the contact desk or product inquiry forms.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'all' ? 'bg-slate-900 text-amber-400' : 'text-slate-600'
            }`}
          >
            All ({(inquiries || []).length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'pending' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'
            }`}
          >
            Pending ({(inquiries || []).filter((i) => (i?.status || '').toLowerCase() === 'pending' || i?.status === 'New').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'resolved' ? 'bg-slate-900 text-emerald-400' : 'text-slate-600'
            }`}
          >
            Resolved ({(inquiries || []).filter((i) => (i?.status || '').toLowerCase() === 'resolved' || i?.status === 'Closed').length})
          </button>
        </div>
      </div>

      {filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 text-xs">
          No customer inquiries found.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInquiries.map((inq) => {
            const customerName = inq.name || (inq as any).customer_name || 'Customer';
            const customerPhone = inq.phone || (inq as any).customer_phone || '';
            const customerEmail = inq.email || (inq as any).customer_email || '';

            const whatsAppReplyUrl = getCustomerWhatsAppUrl(
              customerPhone,
              `Hello ${customerName}! 👋\n\nThank you for reaching out to ${companySettings.business_name} regarding "${inq.subject}". How can we assist you today?`
            );

            return (
              <div
                key={inq.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{inq.subject}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        inq.status === 'Resolved' || inq.status === 'Closed' || (inq.status as any) === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inq.status === 'Contacted' || inq.status === 'Waiting for Customer' || (inq.status as any) === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {inq.created_at ? new Date(inq.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : 'Recent'}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                  "{inq.message}"
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-3 text-slate-500">
                    <span className="font-semibold text-slate-900">{customerName}</span>
                    {customerPhone && (
                      <>
                        <span>•</span>
                        <span>WhatsApp: {customerPhone}</span>
                      </>
                    )}
                    {customerEmail && (
                      <>
                        <span>•</span>
                        <span>{customerEmail}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={inq.status}
                      onChange={(e) =>
                        updateInquiryStatus(
                          inq.id,
                          e.target.value as any
                        )
                      }
                      className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 bg-white font-semibold cursor-pointer"
                    >
                      <option value="New">New / Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Waiting for Customer">Waiting for Customer</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>

                    {customerPhone && (
                      <a
                        href={whatsAppReplyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Reply on WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
