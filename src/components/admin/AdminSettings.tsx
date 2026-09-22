import React, { useState, useEffect } from 'react';
import {
  Save,
  Building,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  DollarSign,
  CheckCircle2,
  Navigation,
  Globe,
  FileText,
  Sparkles,
  Database,
  RefreshCw,
  Copy,
  Check,
  Server,
  ShieldCheck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Ship,
  ExternalLink,
  Image as ImageIcon,
  Heart,
  Upload,
  Megaphone,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CompanySettings } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { generateSupabaseSQL } from '../../lib/supabase';

const DEFAULT_PAYSTACK_NOTICE =
  'NOTICE: Paystack payment is temporarily unavailable. Please use any of our other available payment options, including bank account payment, payment after delivery, WhatsApp-assisted payment, and other payment methods available on the website. Paystack will be available again soon. We apologise for any inconvenience.';

export const AdminSettings: React.FC = () => {
  const {
    companySettings,
    updateCompanySettings,
    uploadBrandingImage,
    isSupabaseConfigured,
    supabaseSyncStatus,
    syncAllToSupabase,
    products,
    categories,
    orders,
    inquiries,
  } = useStore();

  const [form, setRawForm] = useState<CompanySettings>(() => ({
    ...companySettings,
    business_name: companySettings.business_name || 'Sunshine Babies Essentials',
    tagline: companySettings.tagline || "Your baby's comfort is our biggest priority.",
    logo_url: companySettings.logo_url || '/logo.png',
    favicon_url: companySettings.favicon_url || '/favicon.png',
    hero_banner_image: companySettings.hero_banner_image || '',
    footer_text: companySettings.footer_text || 'Your trusted destination for premium baby and maternity essentials in Abuja and across Nigeria.',
    city: companySettings.city || 'Abuja',
    state: companySettings.state || 'FCT',
    country: companySettings.country || 'Nigeria',
    latitude: companySettings.latitude || 9.0765,
    longitude: companySettings.longitude || 7.3986,
    google_maps_url:
      companySettings.google_maps_url || 'https://maps.google.com/?q=Abuja,+FCT,+Nigeria',
    partner_name: companySettings.partner_name || "Binna's Logistics Global",
    partner_type: companySettings.partner_type || 'China Sourcing & Logistics Partner',
    partner_description:
      companySettings.partner_description || 'Our trusted partner for sourcing and logistics from China.',
    partner_website: companySettings.partner_website || 'https://binnaslogisticsglobal.com.ng',
    partner_logo: companySettings.partner_logo || '/binnas.jpeg',
    show_partner_section:
      companySettings.show_partner_section !== undefined ? companySettings.show_partner_section : true,
    homepage_about_heading:
      companySettings.homepage_about_heading || 'Sunshine Babies Essentials',
    homepage_about_badge: companySettings.homepage_about_badge || 'ABOUT US',
    homepage_about_description:
      companySettings.homepage_about_description ||
      'Sunshine Babies Essentials is dedicated to providing quality baby and maternity essentials carefully selected with the comfort, safety and needs of mothers and babies in mind.',
    homepage_about_description_2:
      companySettings.homepage_about_description_2 ||
      'Our goal is to make shopping for your little one easier by bringing together trusted baby products, maternity essentials and everyday necessities in one convenient place.',
    homepage_about_button_text:
      companySettings.homepage_about_button_text || 'Learn More About Us',
    homepage_about_link: companySettings.homepage_about_link || '/about',
    show_homepage_about:
      companySettings.show_homepage_about !== undefined ? companySettings.show_homepage_about : true,
    announcement_bar_enabled:
      companySettings.announcement_bar_enabled !== undefined ? companySettings.announcement_bar_enabled : true,
    announcement_bar_text:
      companySettings.announcement_bar_text || DEFAULT_PAYSTACK_NOTICE,
  }));

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ success?: boolean; message?: string } | null>(null);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // setForm proxy that marks form as dirty and clears previous save indicator
  const setForm: React.Dispatch<React.SetStateAction<CompanySettings>> = (action) => {
    setIsDirty(true);
    setIsSaved(false);
    setRawForm(action);
  };

  // Sync state whenever companySettings changes in context, but do not overwrite while user has unsaved edits or is actively saving
  useEffect(() => {
    if (!isDirty && !isSaving) {
      setRawForm((prev) => ({
        ...prev,
        ...companySettings,
      }));
    }
  }, [companySettings, isDirty, isSaving]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof CompanySettings,
    assetType: 'logo' | 'favicon' | 'partner' | 'hero' | 'about' | 'branding'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field as string);
    setSaveError(null);

    try {
      console.log(`Uploading ${assetType}...`);
      const res = await uploadBrandingImage(file, assetType);
      if (res.success && res.url) {
        console.log(`Uploaded ${assetType} successfully: ${res.url}`);
        setForm((prev) => ({ ...prev, [field]: res.url }));
      } else {
        setSaveError(res.error || `Failed to upload ${assetType}. Please check file size.`);
      }
    } catch (err: any) {
      console.error(`Error uploading ${assetType}:`, err);
      setSaveError(err?.message || `Failed to upload ${assetType}.`);
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  };

  const handleSyncToSupabase = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await syncAllToSupabase();
      setSyncFeedback(res);
    } catch (err: any) {
      setSyncFeedback({ success: false, message: err?.message || 'Sync failed.' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(generateSupabaseSQL());
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleDiscard = () => {
    setRawForm({ ...companySettings });
    setIsDirty(false);
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (isSaving || uploadingField) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      console.log('Saving store settings changes...');
      const res = await updateCompanySettings(form);

      if (!res.success) {
        console.error('Save Error:', res.error);
        setSaveError(res.error || 'Failed to save store configuration.');
        setIsSaving(false);
        return;
      }

      setSaveSuccess('Configuration saved successfully and synced across live store.');
      setIsSaved(true);
      setIsDirty(false);
      setTimeout(() => {
        setIsSaved(false);
      }, 5000);
    } catch (err: any) {
      console.error('Save exception:', err);
      setSaveError(err?.message || 'An unexpected error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const previewLat = form.latitude || 9.0765;
  const previewLon = form.longitude || 7.3986;
  const previewMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    previewLon - 0.06
  }%2C${previewLat - 0.04}%2C${previewLon + 0.06}%2C${
    previewLat + 0.04
  }&layer=mapnik&marker=${previewLat}%2C${previewLon}`;

  return (
    <div className="space-y-6 max-w-4xl relative">
      {/* Top Header with Sticky Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 bg-slate-50/95 backdrop-blur-md py-3.5 border-b border-slate-200/90 -mx-4 px-4 sm:-mx-6 sm:px-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Store Configuration & Live Branding</span>
          </h2>
          <p className="text-xs text-slate-500">
            Edit branding, announcement notice, coordinates, and payment options with instant live updates.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {isDirty && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Unsaved Changes
            </span>
          )}

          {isSaved && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Saved Live!</span>
            </div>
          )}

          {isDirty && (
            <button
              type="button"
              onClick={handleDiscard}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Discard
            </button>
          )}

          <button
            type="button"
            id="admin-top-save-changes-btn"
            onClick={() => handleSubmit()}
            disabled={isSaving || !!uploadingField}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs shadow-sm transition-all cursor-pointer ${
              isDirty
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-400/60 hover:scale-[1.02]'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isDirty ? 'Save Changes Now' : 'Save Changes'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs shadow-xs animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Save Operation Failed:</span>
            <p className="text-[11px] font-mono bg-rose-100/60 p-2 rounded-lg text-rose-900 break-words">{saveError}</p>
          </div>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-xs shadow-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">{saveSuccess}</span>
            <p className="text-[11px] text-emerald-700">All store branding, contact hotline, About Us content, and coordinates have been confirmed in the database.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Business Identity & About Us */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">
              1. Brand Identity & About Us Content
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business / Store Name *
              </label>
              <input
                type="text"
                required
                value={form.business_name}
                onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                placeholder="e.g. Sunshine Babies Essentials"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Updates dynamically everywhere across the website, receipts, and footer.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tagline / Slogan *
              </label>
              <input
                type="text"
                required
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="Your baby's comfort is our biggest priority."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Official tagline displayed in headers, hero banners, and the About Us page.
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Store Summary (Footer & Meta)
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="A baby and maternity essentials store dedicated to providing quality products for babies, mothers, and families."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  About Us Story & Purpose (Full Page)
                </label>
                <span className="text-[11px] text-amber-700 font-medium">
                  Displayed on the About Us page
                </span>
              </div>
              <textarea
                rows={4}
                value={form.about_story || ''}
                onChange={(e) => setForm({ ...form, about_story: e.target.value })}
                placeholder="Sunshine Babies Essentials was created to support parents and families with thoughtfully selected essentials for every step of childhood..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Store Logo & Branding Upload */}
            <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Store Primary Logo
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Upload a high-resolution logo or enter an image URL. Uploads directly to Supabase Storage.
                  </p>
                </div>
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs cursor-pointer transition-all shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingField === 'logo_url' ? 'Uploading...' : 'Upload Logo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'logo_url', 'logo')}
                    disabled={!!uploadingField}
                    className="sr-only"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={form.logo_url || ''}
                    onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                    placeholder="/logo.png or https://..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div className="h-12 bg-slate-900 rounded-xl flex items-center justify-center p-2 border border-slate-800">
                  <img
                    src={form.logo_url || '/logo.png'}
                    alt="Logo Preview"
                    className="h-full w-auto object-contain max-w-[140px]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.png';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Favicon & Hero Banner */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Favicon Icon URL
                </label>
                <label className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer">
                  <span>{uploadingField === 'favicon_url' ? 'Uploading...' : 'Upload File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'favicon_url', 'favicon')}
                    disabled={!!uploadingField}
                    className="sr-only"
                  />
                </label>
              </div>
              <input
                type="text"
                value={form.favicon_url || ''}
                onChange={(e) => setForm({ ...form, favicon_url: e.target.value })}
                placeholder="/favicon.png"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Hero Banner Custom Image (Optional)
                </label>
                <label className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer">
                  <span>{uploadingField === 'hero_banner_image' ? 'Uploading...' : 'Upload File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'hero_banner_image', 'hero')}
                    disabled={!!uploadingField}
                    className="sr-only"
                  />
                </label>
              </div>
              <input
                type="text"
                value={form.hero_banner_image || ''}
                onChange={(e) => setForm({ ...form, hero_banner_image: e.target.value })}
                placeholder="https://... or leave blank for default collage"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            {/* Live Brand Identity Preview */}
            <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Active Brand Identity Preview
                </span>
                <p className="text-[11px] text-slate-500">
                  Live typography and badge styling rendered across storefront and receipts.
                </p>
              </div>

              <div className="p-3.5 px-5 bg-slate-950 rounded-2xl shadow-inner flex items-center justify-center">
                <BrandLogo inverted={true} size="md" showTagline={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Customer Announcement Bar & Store Notice */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Top Announcement Bar & Customer Notice
              </h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.announcement_bar_enabled !== false}
                onChange={(e) => setForm({ ...form, announcement_bar_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              <span className="ml-2.5 text-xs font-semibold text-slate-700">
                {form.announcement_bar_enabled !== false ? 'Active on Storefront' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Notice Message Text
              </label>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    announcement_bar_text: DEFAULT_PAYSTACK_NOTICE,
                  })
                }
                className="text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to Paystack Notice
              </button>
            </div>
            <textarea
              rows={3}
              value={form.announcement_bar_text || ''}
              onChange={(e) => setForm({ ...form, announcement_bar_text: e.target.value })}
              placeholder="Enter announcement text to display at the top of your website..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 leading-relaxed font-sans"
            />
            <span className="text-[10px] text-slate-400 block">
              Displayed prominently at the very top of all store pages across mobile and desktop.
            </span>

            {/* Live Preview Box */}
            <div className="p-3 bg-slate-950 text-slate-100 rounded-2xl border border-amber-500/40 text-[11px] leading-relaxed shadow-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-slate-300 flex-1">
                <strong className="text-amber-400 font-bold mr-1.5">LIVE PREVIEW:</strong>
                {form.announcement_bar_text || 'No text entered'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Store Location & Interactive Map */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                2. Store Location & Interactive Map (Abuja, FCT, Nigeria)
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
              Abuja Hub
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Abuja"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State / Territory *
              </label>
              <input
                type="text"
                required
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="FCT"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                required
                value={form.country || 'Nigeria'}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="Nigeria"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Exact Street Address (Optional — Leave blank until exact address is provided)
              </label>
              <input
                type="text"
                value={form.address || ''}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="e.g. Suite 10, Wuse 2 / Garki (or leave blank if serving online across Abuja)"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                If left empty, the website cleanly displays "Abuja, FCT, Nigeria" without showing a fake street address.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Map Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={form.latitude ?? 9.0765}
                onChange={(e) =>
                  setForm({ ...form, latitude: parseFloat(e.target.value) || 9.0765 })
                }
                placeholder="9.0765"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Default: 9.0765 (Abuja central)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Map Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={form.longitude ?? 7.3986}
                onChange={(e) =>
                  setForm({ ...form, longitude: parseFloat(e.target.value) || 7.3986 })
                }
                placeholder="7.3986"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Default: 7.3986 (Abuja central)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Google Maps URL / Directions Link
              </label>
              <input
                type="url"
                value={form.google_maps_url || ''}
                onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
                placeholder="https://maps.google.com/?q=Abuja,+FCT,+Nigeria"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Used by the "Get Directions" button.
              </span>
            </div>

            {/* Live Map Frame Preview */}
            <div className="sm:col-span-3 mt-2 rounded-2xl overflow-hidden border border-slate-200 relative">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-amber-600" />
                  <span>Live Location Map Preview</span>
                </span>
                <span className="text-slate-500 text-[11px]">
                  {form.city || 'Abuja'}, {form.state || 'FCT'} ({previewLat}, {previewLon})
                </span>
              </div>
              <iframe
                title="Admin Location Preview"
                src={previewMapUrl}
                className="w-full h-48 border-0 bg-slate-100"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact Channels & WhatsApp Hotline */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              3. Contact Channels & WhatsApp Hotline
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Ordering Number *
              </label>
              <input
                type="text"
                required
                value={form.whatsapp_number}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                placeholder="+234 903 466 5968"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[10px] text-emerald-700 mt-1 block font-medium">
                Used for instant WhatsApp order routing
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Hotline
              </label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+234 903 466 5968"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="info@sunshinebabies.com"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Bank Account & Payment Destination */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <DollarSign className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">
              4. Bank Transfer Details & Currency
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                required
                value={form.currency_symbol}
                onChange={(e) => setForm({ ...form, currency_symbol: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={form.bank_name || ''}
                onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
                placeholder="Guaranty Trust Bank (GTBank)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={form.account_number || ''}
                onChange={(e) => setForm({ ...form, account_number: e.target.value })}
                placeholder="0123456789"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Name
              </label>
              <input
                type="text"
                value={form.account_name || ''}
                onChange={(e) => setForm({ ...form, account_name: e.target.value })}
                placeholder="SUNSHINE BABIES ESSENTIALS ENTERPRISE"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Social Media Channels */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">
              5. Social Media Channels
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={form.instagram_url}
                onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                placeholder="https://instagram.com/sunshinebabiesessentials"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={form.facebook_url}
                onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
                placeholder="https://facebook.com/sunshinebabiesessentials"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                TikTok Profile URL
              </label>
              <input
                type="url"
                value={form.tiktok_url || ''}
                onChange={(e) => setForm({ ...form, tiktok_url: e.target.value })}
                placeholder="https://tiktok.com/@sunshinebabiesessentials"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Twitter / X Profile URL
              </label>
              <input
                type="url"
                value={form.twitter_url || ''}
                onChange={(e) => setForm({ ...form, twitter_url: e.target.value })}
                placeholder="https://x.com/sunshinebabies"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={form.youtube_url || ''}
                onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                placeholder="https://youtube.com/@sunshinebabiesessentials"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Footer Tagline / Statement
              </label>
              <textarea
                rows={2}
                value={form.footer_text || ''}
                onChange={(e) => setForm({ ...form, footer_text: e.target.value })}
                placeholder="Your trusted destination for premium baby and maternity essentials in Abuja and across Nigeria."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Homepage About Us Section Settings */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  6. Homepage About Us Section
                </h3>
                <p className="text-xs text-slate-400">
                  Manage the warm, introductory two-column About Us section on the homepage.
                </p>
              </div>
            </div>

            {/* Toggle switch */}
            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl hover:bg-slate-100/80 transition-colors">
              <input
                type="checkbox"
                checked={form.show_homepage_about !== false}
                onChange={(e) => setForm({ ...form, show_homepage_about: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 relative" />
              <span className="text-xs font-bold text-slate-700">
                {form.show_homepage_about !== false ? 'Section Visible' : 'Section Hidden'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Badge / Small Label
              </label>
              <input
                type="text"
                value={form.homepage_about_badge || ''}
                onChange={(e) => setForm({ ...form, homepage_about_badge: e.target.value })}
                placeholder="ABOUT US"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Main Heading
              </label>
              <input
                type="text"
                value={form.homepage_about_heading || ''}
                onChange={(e) => setForm({ ...form, homepage_about_heading: e.target.value })}
                placeholder="Sunshine Babies Essentials"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Introduction Paragraph
              </label>
              <textarea
                rows={2}
                value={form.homepage_about_description || ''}
                onChange={(e) => setForm({ ...form, homepage_about_description: e.target.value })}
                placeholder="Sunshine Babies Essentials is dedicated to providing quality baby and maternity essentials carefully selected with the comfort, safety and needs of mothers and babies in mind."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Secondary Goal Paragraph (Optional)
              </label>
              <textarea
                rows={2}
                value={form.homepage_about_description_2 || ''}
                onChange={(e) => setForm({ ...form, homepage_about_description_2: e.target.value })}
                placeholder="Our goal is to make shopping for your little one easier by bringing together trusted baby products, maternity essentials and everyday necessities in one convenient place."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

<div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={form.homepage_about_button_text || ''}
                  onChange={(e) => setForm({ ...form, homepage_about_button_text: e.target.value })}
                  placeholder="Learn More About Us"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Button Link Target
                </label>
                <input
                  type="text"
                  value={form.homepage_about_link || ''}
                  onChange={(e) => setForm({ ...form, homepage_about_link: e.target.value })}
                  placeholder="/about"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 7: China Sourcing & Logistics Partner Settings */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Ship className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  7. China Sourcing &amp; Logistics Partner
                </h3>
                <p className="text-xs text-slate-400">
                  Manage the official partnership showcase for product sourcing &amp; international logistics from China.
                </p>
              </div>
            </div>

            {/* Toggle switch */}
            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl hover:bg-slate-100/80 transition-colors">
              <input
                type="checkbox"
                checked={form.show_partner_section !== false}
                onChange={(e) => setForm({ ...form, show_partner_section: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 relative" />
              <span className="text-xs font-bold text-slate-700">
                {form.show_partner_section !== false ? 'Partner Section Active' : 'Section Hidden'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Partner Business Name
              </label>
              <input
                type="text"
                value={form.partner_name || ''}
                onChange={(e) => setForm({ ...form, partner_name: e.target.value })}
                placeholder="Binna's Logistics Global"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Partner Classification / Role
              </label>
              <input
                type="text"
                value={form.partner_type || ''}
                onChange={(e) => setForm({ ...form, partner_type: e.target.value })}
                placeholder="China Sourcing & Logistics Partner"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Must clearly reflect China sourcing, supply &amp; freight forwarding from China.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Partner Official Website URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={form.partner_website || ''}
                  onChange={(e) => setForm({ ...form, partner_website: e.target.value })}
                  placeholder="https://binnaslogisticsglobal.com.ng"
                  className="w-full px-3 py-2 pr-9 text-xs rounded-xl border border-slate-200"
                />
                {form.partner_website && (
                  <a
                    href={form.partner_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors"
                    title="Open website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Partner Logo URL or Asset Path
                </label>
                <label className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer">
                  <span>{uploadingField === 'partner_logo' ? 'Uploading...' : 'Upload Logo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'partner_logo', 'partner')}
                    disabled={!!uploadingField}
                    className="sr-only"
                  />
                </label>
              </div>
              <input
                type="text"
                value={form.partner_logo || ''}
                onChange={(e) => setForm({ ...form, partner_logo: e.target.value })}
                placeholder="/binnas.jpeg"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Default: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">/binnas.jpeg</code>
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supporting Partner Description
              </label>
              <input
                type="text"
                value={form.partner_description || ''}
                onChange={(e) => setForm({ ...form, partner_description: e.target.value })}
                placeholder="Our trusted partner for sourcing and logistics from China."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Live Footer Display Preview:
            </span>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  {form.partner_type || 'China Sourcing & Logistics Partner'}
                </span>
                <h4 className="text-sm font-bold text-white">
                  Our China Sourcing &amp; Logistics Partner
                </h4>
                <p className="text-xs text-slate-400">
                  “{form.partner_description || 'Our trusted partner for sourcing and logistics from China.'}”
                </p>
              </div>
              <div className="flex flex-col items-center md:items-end gap-1.5 shrink-0">
                <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs">
                  <img
                    src={form.partner_logo || '/binnas.jpeg'}
                    alt={form.partner_name || "Binna's Logistics Global"}
                    className="h-8 w-auto max-w-[180px] object-contain block mx-auto"
                  />
                </div>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>{form.partner_website || 'https://binnaslogisticsglobal.com.ng'}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-amber-400" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 8: Supabase Cloud Database Integration */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl border border-slate-700 shadow-md p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    8. Supabase Cloud Database &amp; Storage
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isSupabaseConfigured
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {isSupabaseConfigured ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Connected & Synchronized
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        Awaiting Credentials in .env.local
                      </>
                    )}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time PostgreSQL sync for Products, Categories, Orders, Inquiries, Settings, and Image Storage.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSyncToSupabase}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync All Data to Supabase'}</span>
            </button>
          </div>

          {/* Sync Feedback Alert */}
          {syncFeedback && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-medium border flex items-center gap-2.5 ${
                syncFeedback.success
                  ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/30 text-rose-200'
              }`}
            >
              {syncFeedback.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{syncFeedback.message}</span>
            </div>
          )}

          {/* Live Data Counts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Products in Catalog</span>
              <span className="text-base font-black text-amber-400 mt-0.5 block">{products.length} Active Items</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Categories</span>
              <span className="text-base font-black text-white mt-0.5 block">{categories.length} Categories</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Orders</span>
              <span className="text-base font-black text-emerald-400 mt-0.5 block">{orders.length} Logged Orders</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Inquiries</span>
              <span className="text-base font-black text-cyan-400 mt-0.5 block">{inquiries.length} Enquiries</span>
            </div>
          </div>

          {/* Schema and SQL Migration Section */}
          <div className="pt-2 border-t border-slate-700/80">
            <button
              type="button"
              onClick={() => setShowSqlSchema(!showSqlSchema)}
              className="flex items-center justify-between w-full text-xs font-semibold text-slate-300 hover:text-white py-1 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-amber-400" />
                View Supabase PostgreSQL Schema & RLS Policies
              </span>
              {showSqlSchema ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSqlSchema && (
              <div className="mt-3 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px]">Copy and paste this script into your Supabase SQL Editor:</span>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium text-[11px] transition-colors cursor-pointer"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy SQL Migration</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 max-h-60 overflow-y-auto whitespace-pre leading-relaxed">
                  {generateSupabaseSQL()}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Save Error & Success Warnings near button */}
        {saveError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2.5 text-xs shadow-xs animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-xs shadow-xs animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Save CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500">
            Changes are saved to Supabase PostgreSQL and synced across your live store.
          </p>
          <button
            type="submit"
            disabled={isSaving || !!uploadingField}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 disabled:cursor-not-allowed text-slate-950 font-black text-xs shadow-md transition-all hover:scale-[1.02] cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Store Configuration...</span>
              </>
            ) : uploadingField ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Uploading Image Asset...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Store Configuration</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Floating Save Changes Pill Bar when user has unsaved edits */}
      {isDirty && (
        <div
          id="admin-unsaved-changes-banner"
          className="fixed bottom-6 right-6 z-50 bg-slate-950/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/60 flex items-center gap-4 animate-fade-in"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <div>
              <p className="text-xs font-black text-white">Unsaved Changes Detected</p>
              <p className="text-[10.5px] text-slate-300">Click to apply changes immediately to your live store</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              type="button"
              id="admin-floating-save-changes-btn"
              onClick={() => handleSubmit()}
              disabled={isSaving || !!uploadingField}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


