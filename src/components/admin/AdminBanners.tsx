import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Sparkles,
  Check,
  X,
  Upload,
  Link as LinkIcon,
  Eye,
  Smartphone,
  Monitor,
  Calendar,
  Layers,
  ArrowUp,
  ArrowDown,
  Copy,
  AlertCircle,
  FolderPlus,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PromotionalBanner } from '../../types';
import { INITIAL_PROMOTIONAL_BANNERS } from '../../lib/constants';
import { processUploadedImageFile } from '../../lib/imageUpload';

type FilterPlacement = 'all' | 'hero' | 'promo_grid';

export const AdminBanners: React.FC = () => {
  const { banners = [], addBanner, updateBanner, deleteBanner, categories = [] } = useStore();

  const [activeFilter, setActiveFilter] = useState<FilterPlacement>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [badgeText, setBadgeText] = useState('New Season 2026');
  const [buttonText, setButtonText] = useState('Shop Now');
  const [linkUrl, setLinkUrl] = useState('/shop');
  const [categoryId, setCategoryId] = useState<string>('');
  const [placement, setPlacement] = useState<'hero' | 'promo_grid' | 'all'>('hero');
  const [bgColor, setBgColor] = useState('from-amber-950/80 via-slate-950/85 to-black');
  const [imageUrl, setImageUrl] = useState('');
  const [mobileImageUrl, setMobileImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const desktopFileInputRef = useRef<HTMLInputElement | null>(null);
  const mobileFileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const openAddModal = () => {
    setEditingBannerId(null);
    setTitle('');
    setSubtitle('');
    setDescription('');
    setBadgeText('SPECIAL PROMOTION');
    setButtonText('Shop Collection');
    setLinkUrl('/shop');
    setCategoryId(categories[0]?.id || '');
    setPlacement('hero');
    setBgColor('from-amber-950/80 via-slate-950/85 to-black');
    setImageUrl('');
    setMobileImageUrl('');
    setIsActive(true);
    setDisplayOrder(banners.length + 1);
    setStartDate('');
    setEndDate('');
    setUploadError(null);
    setModalOpen(true);
  };

  const openEditModal = (b: PromotionalBanner) => {
    setEditingBannerId(b.id);
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setDescription(b.description || '');
    setBadgeText(b.badge_text || '');
    setButtonText(b.button_text || 'Shop Now');
    setLinkUrl(b.link_url || '/shop');
    setCategoryId(b.category_id || '');
    setPlacement(b.placement || 'all');
    setBgColor(b.bg_color || 'from-amber-950/80 via-slate-950/85 to-black');
    setImageUrl(b.image_url || '');
    setMobileImageUrl(b.mobile_image_url || '');
    setIsActive(b.is_active);
    setDisplayOrder(b.display_order || 1);
    setStartDate(b.start_date || '');
    setEndDate(b.end_date || '');
    setUploadError(null);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMobile = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (< 15MB before client-side downscaling)
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Image file is too large. Please select an image under 15MB.');
      return;
    }

    try {
      setUploadError(null);
      const optimizedDataUrl = await processUploadedImageFile(file, isMobile ? 800 : 1600, isMobile ? 800 : 1000, 0.85);
      if (isMobile) {
        setMobileImageUrl(optimizedDataUrl);
      } else {
        setImageUrl(optimizedDataUrl);
      }
      showToast(isMobile ? 'Mobile banner image uploaded and optimized!' : 'Desktop banner image uploaded and optimized!');
    } catch (err) {
      console.error('Error processing banner image:', err);
      setUploadError('Failed to read and process the image. Please try another file.');
    }
  };
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      setUploadError('Please provide both a banner title and an image.');
      return;
    }

    const payload: Omit<PromotionalBanner, 'id'> = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      badge_text: badgeText.trim(),
      button_text: buttonText.trim(),
      link_url: linkUrl.trim(),
      category_id: categoryId || undefined,
      placement: placement,
      bg_color: bgColor,
      image_url: imageUrl.trim(),
      mobile_image_url: mobileImageUrl.trim() || undefined,
      is_active: isActive,
      display_order: Number(displayOrder) || 1,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    };

    if (editingBannerId) {
      updateBanner({
        ...payload,
        id: editingBannerId,
      });
      showToast('Promotional banner updated successfully!');
    } else {
      addBanner(payload);
      showToast('New promotional banner created successfully!');
    }

    setModalOpen(false);
  };

  const handleToggleActive = (b: PromotionalBanner) => {
    updateBanner({ ...b, is_active: !b.is_active });
    showToast(`Banner "${b.title}" is now ${!b.is_active ? 'Active' : 'Disabled'}.`);
  };

  const handleDelete = (id: string, bannerTitle: string) => {
    if (confirm(`Are you sure you want to delete banner "${bannerTitle}"?`)) {
      deleteBanner(id);
      showToast(`Banner "${bannerTitle}" deleted.`);
    }
  };

  const handleDuplicate = (b: PromotionalBanner) => {
    const copyData: Omit<PromotionalBanner, 'id'> = {
      ...b,
      title: `${b.title} (Copy)`,
      display_order: (b.display_order || 1) + 1,
    };
    addBanner(copyData);
    showToast(`Duplicated "${b.title}".`);
  };

  const handleMoveOrder = (b: PromotionalBanner, direction: 'up' | 'down') => {
    const sorted = [...banners].sort((x, y) => (x.display_order || 0) - (y.display_order || 0));
    const currentIndex = sorted.findIndex((item) => item.id === b.id);
    if (currentIndex === -1) return;

    if (direction === 'up' && currentIndex > 0) {
      const prev = sorted[currentIndex - 1];
      const tempOrder = b.display_order || 1;
      updateBanner({ ...b, display_order: prev.display_order || 0 });
      updateBanner({ ...prev, display_order: tempOrder });
    } else if (direction === 'down' && currentIndex < sorted.length - 1) {
      const next = sorted[currentIndex + 1];
      const tempOrder = b.display_order || 1;
      updateBanner({ ...b, display_order: next.display_order || 2 });
      updateBanner({ ...next, display_order: tempOrder });
    }
  };

  // Filter banners
  const filteredBanners = banners
    .filter((b) => {
      if (activeFilter === 'hero') return b.placement === 'hero' || b.placement === 'all' || !b.placement;
      if (activeFilter === 'promo_grid') return b.placement === 'promo_grid' || b.placement === 'all';
      return true;
    })
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-xl border border-amber-500/40 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-900">Promotional Banners & Campaigns</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
              {banners.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage top homepage carousel slides, seasonal promotional cards, category links, and mobile images.
          </p>
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Create New Banner</span>
          </button>
        </div>
      </div>

      {/* Filters & Placement Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          All Banners ({banners.length})
        </button>
        <button
          onClick={() => setActiveFilter('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'hero'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Hero Carousel Sliders ({banners.filter((b) => b.placement === 'hero' || b.placement === 'all' || !b.placement).length})
        </button>
        <button
          onClick={() => setActiveFilter('promo_grid')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'promo_grid'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Promotional Section Cards ({banners.filter((b) => b.placement === 'promo_grid' || b.placement === 'all').length})
        </button>
      </div>

      {/* Banner Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBanners.map((ban, index) => {
          const associatedCat = categories.find((c) => c.id === ban.category_id);
          const hasMobileImage = Boolean(ban.mobile_image_url && ban.mobile_image_url !== ban.image_url);

          return (
            <div
              key={ban.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between hover:border-amber-400/80 transition-all group"
            >
              {/* Visual Banner Preview Container */}
              <div className="relative aspect-16/8 bg-slate-950 overflow-hidden">
                <picture className="w-full h-full block">
                  {ban.mobile_image_url && (
                    <source media="(max-width: 640px)" srcSet={ban.mobile_image_url} />
                  )}
                  <img
                    src={ban.image_url}
                    alt={ban.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-all duration-500"
                  />
                </picture>

                {/* Overlaid Gradient & Copy */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-xs">
                      {ban.badge_text || 'PROMO'}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-200 text-[10px] font-bold uppercase border border-slate-700">
                        {ban.placement === 'hero'
                          ? 'Hero'
                          : ban.placement === 'promo_grid'
                          ? 'Promo Card'
                          : 'Everywhere'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-bold text-[10px]">
                        #{ban.display_order}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif font-black text-white text-sm leading-snug line-clamp-2 drop-shadow-sm">
                      {ban.title}
                    </h4>
                    {ban.subtitle && (
                      <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">{ban.subtitle}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Banner Details & Target Info */}
              <div className="p-4 space-y-3 bg-white flex-1 flex flex-col justify-between">
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-semibold text-slate-500">CTA Button:</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      "{ban.button_text || 'Shop'}"
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-semibold text-slate-500">Target:</span>
                    <span className="font-bold text-amber-900 truncate max-w-[170px]">
                      {associatedCat ? `Category: ${associatedCat.name}` : ban.link_url || 'Shop Page'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-semibold text-slate-500">Mobile Custom:</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${hasMobileImage ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                      {hasMobileImage ? 'Yes (Separate)' : 'Auto-Scaled'}
                    </span>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleActive(ban)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        ban.is_active
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {ban.is_active ? 'Live' : 'Hidden'}
                    </button>

                    <button
                      onClick={() => handleMoveOrder(ban, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(ban, 'down')}
                      disabled={index === filteredBanners.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(ban)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openEditModal(ban)}
                      className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 cursor-pointer"
                      title="Edit Banner"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ban.id, ban.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Banner Full Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {editingBannerId ? 'Edit Promotional Banner' : 'Create New Promotional Banner'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure copy, category targeting, desktop & mobile image assets.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveBanner} className="p-6 overflow-y-auto space-y-6 flex-1">
              {uploadError && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Grid Layout: Left Column Inputs, Right Column Live Storefront Simulator */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Inputs Column */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Section 1: Typography & Copy */}
                  <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                      1. Banner Copy & Headlines
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Main Title / Headline *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Back-to-School Mega Essentials"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Subtitle / Catchphrase
                        </label>
                        <input
                          type="text"
                          value={subtitle}
                          onChange={(e) => setSubtitle(e.target.value)}
                          placeholder="e.g. Equip young learners with backpacks"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Gold Badge / Tag Text
                        </label>
                        <input
                          type="text"
                          value={badgeText}
                          onChange={(e) => setBadgeText(e.target.value)}
                          placeholder="e.g. BACK TO SCHOOL 2026"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Description (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detailed copy shown on promotional cards..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Section 2: CTA & Target Routing */}
                  <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                      2. CTA Action & Storefront Routing
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          CTA Button Text *
                        </label>
                        <input
                          type="text"
                          required
                          value={buttonText}
                          onChange={(e) => setButtonText(e.target.value)}
                          placeholder="Shop Now"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Target Category Filter
                        </label>
                        <select
                          value={categoryId}
                          onChange={(e) => {
                            setCategoryId(e.target.value);
                            if (e.target.value) {
                              setLinkUrl(`/shop?category=${e.target.value}`);
                            }
                          }}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold focus:border-amber-500 focus:outline-none"
                        >
                          <option value="">None (Generic Link)</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Placement Position
                        </label>
                        <select
                          value={placement}
                          onChange={(e) => setPlacement(e.target.value as any)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold focus:border-amber-500 focus:outline-none"
                        >
                          <option value="hero">Hero Carousel Slider Only</option>
                          <option value="promo_grid">Promotional Grid Cards Only</option>
                          <option value="all">Everywhere (Hero & Promo Grid)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Display Priority Order
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={displayOrder}
                          onChange={(e) => setDisplayOrder(Number(e.target.value))}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Image Assets (Desktop & Mobile) */}
                  <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                        3. Banner Photography (Category Appropriate)
                      </h4>
                    </div>

                    {/* Desktop Image Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Desktop Banner Image URL or File Upload *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/... or upload"
                          className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono focus:border-amber-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => desktopFileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5 text-amber-400" />
                          <span>Upload</span>
                        </button>
                        <input
                          ref={desktopFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, false)}
                        />
                      </div>
                    </div>

                    {/* Mobile Image Input (Optional) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">
                          Mobile Banner Image (Optional - Falls back to Desktop)
                        </label>
                        {mobileImageUrl && (
                          <button
                            type="button"
                            onClick={() => setMobileImageUrl('')}
                            className="text-[10px] text-rose-600 font-bold hover:underline"
                          >
                            Remove Custom Mobile
                          </button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={mobileImageUrl}
                          onChange={(e) => setMobileImageUrl(e.target.value)}
                          placeholder="Auto-uses desktop image if left blank"
                          className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono focus:border-amber-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => mobileFileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5 text-slate-700" />
                          <span>Upload</span>
                        </button>
                        <input
                          ref={mobileFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, true)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Scheduling & Status */}
                  <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                      4. Scheduling & Status
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Start Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          End Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-bold text-slate-700">Publish Status:</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                        <span className="ml-2 text-xs font-bold text-slate-900">
                          {isActive ? 'Active (Visible on Store)' : 'Draft (Hidden)'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Live Preview Simulator Column */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Live Storefront Simulator
                    </span>

                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('desktop')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                          previewDevice === 'desktop'
                            ? 'bg-white text-slate-950 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Desktop</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('mobile')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                          previewDevice === 'mobile'
                            ? 'bg-white text-slate-950 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Mobile</span>
                      </button>
                    </div>
                  </div>

                  {/* Simulator Screen Frame */}
                  <div
                    className={`mx-auto bg-slate-950 rounded-3xl overflow-hidden shadow-xl border-4 border-slate-900 transition-all duration-300 ${
                      previewDevice === 'mobile' ? 'max-w-[280px] aspect-9/16' : 'w-full aspect-16/10'
                    } flex flex-col justify-between p-5 relative text-white`}
                  >
                    {/* Background Visual */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <picture className="w-full h-full block">
                        {mobileImageUrl && previewDevice === 'mobile' && (
                          <source srcSet={mobileImageUrl} />
                        )}
                        <img
                          src={previewDevice === 'mobile' && mobileImageUrl ? mobileImageUrl : imageUrl}
                          alt="Banner Preview"
                          className="w-full h-full object-cover opacity-45 scale-105"
                        />
                      </picture>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
                    </div>

                    {/* Top Simulated Tag */}
                    <div className="relative z-10">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{badgeText || 'SPECIAL COLLECTION'}</span>
                      </span>
                    </div>

                    {/* Simulated Content */}
                    <div className="relative z-10 space-y-2">
                      <h4 className="font-serif font-black text-white text-base sm:text-lg leading-tight">
                        {title || 'Banner Title Headline'}
                      </h4>

                      <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                        {subtitle || description || 'Banner subtitle text describing promotional benefits.'}
                      </p>

                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md">
                          <span>{buttonText || 'Shop Now'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 text-center">
                    Simulating how shoppers in Nigeria will experience this banner on{' '}
                    <span className="font-bold">{previewDevice}</span> devices.
                  </p>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
                >
                  {editingBannerId ? 'Update Banner Slide' : 'Save & Publish Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};









