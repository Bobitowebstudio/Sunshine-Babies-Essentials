import React, { useState } from 'react';
import { MessageCircle, Mail, Edit2, Check, Save, Copy } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { WhatsAppTemplate } from '../../types';

export const AdminTemplates: React.FC = () => {
  const { whatsappTemplates = [], updateWhatsAppTemplate } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleStartEdit = (tpl: WhatsAppTemplate) => {
    setEditingId(tpl.id);
    setEditedText(tpl.template_text);
  };

  const handleSave = (tpl: WhatsAppTemplate) => {
    updateWhatsAppTemplate({
      ...tpl,
      template_text: editedText,
    });
    setSavedId(tpl.id);
    setEditingId(null);
    setTimeout(() => setSavedId(null), 3000);
  };

  const handleCopy = (tpl: WhatsAppTemplate) => {
    navigator.clipboard?.writeText(tpl.template_text);
    setCopiedId(tpl.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">
          WhatsApp & Customer Messaging Templates
        </h2>
        <p className="text-xs text-slate-500">
          Customize automated templates used for instant WhatsApp order notifications, payment confirmation, and dispatch alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {whatsappTemplates.map((tpl) => {
          const isEditing = editingId === tpl.id;

          return (
            <div
              key={tpl.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{tpl.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">{tpl.type}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                {/* Template Content */}
                <div className="pt-3">
                  {isEditing ? (
                    <textarea
                      rows={5}
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl border border-amber-300 font-mono bg-amber-50/20 focus:outline-hidden"
                    />
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
                      {tpl.template_text}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                {savedId === tpl.id && (
                  <span className="mr-auto inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 animate-fade-in">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Template Saved!
                  </span>
                )}
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(tpl)}
                      className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Template</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleCopy(tpl)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Copy template text"
                    >
                      {copiedId === tpl.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleStartEdit(tpl)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
