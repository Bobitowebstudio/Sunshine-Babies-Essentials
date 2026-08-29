import React, { useState, useRef } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  BellRing,
  Check,
  X,
  Package,
  Sparkles,
  AlertTriangle,
  Layers,
  Image as ImageIcon,
  Upload,
  ArrowUpDown,
  Filter,
  Eye,
  Star,
  Flame,
  Tag,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  SlidersHorizontal,
  CheckCircle2,
  HelpCircle,
  Camera,
  MoveLeft,
  MoveRight,
  Palette,
  Maximize2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, calculateDiscountPercent } from '../../lib/utils';
import { Product, AgeGroup, ProductVariantItem, ProductImageViews, PRODUCT_AGE_GROUP_OPTIONS, AGE_GROUP_FILTER_OPTIONS } from '../../types';
import { getProductPlaceholderSvg } from '../../lib/placeholders';

type SortOption =
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'stock-asc'
  | 'stock-desc'
  | 'name-asc'
  | 'name-desc'
  | 'discount-desc';

type StockFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock' | 'backorders';
type BadgeFilter = 'all' | 'featured' | 'best-seller' | 'new-arrival' | 'on-sale' | 'hidden';

interface ImageSlot {
  id: string;
  url: string;
  angle: 'main' | 'front' | 'side' | 'back' | 'detail' | 'additional';
}

export const AdminProducts: React.FC = () => {
  const {
    products = [],
    categories = [],
    notifications: stockNotifications = [],
    companySettings,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    navigateTo,
    uploadProductImage,
  } = useStore();

  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStock, setFilterStock] = useState<StockFilter>('all');
  const [filterAge, setFilterAge] = useState<string>('all');
  const [filterBadge, setFilterBadge] = useState<BadgeFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewTab, setViewTab] = useState<'products' | 'restock'>('products');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Quick Action Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Delete Confirmation Modal
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);

  // Edit / Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'basic' | 'pricing' | 'images' | 'variants' | 'flags' | 'preview'>('basic');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('All Ages');
  const [sku, setSku] = useState('');
  const [regularPrice, setRegularPrice] = useState<number>(15000);
  const [discountPrice, setDiscountPrice] = useState<number | ''>('');
  const [stockQuantity, setStockQuantity] = useState<number>(20);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [allowBackorders, setAllowBackorders] = useState<boolean>(false);
  const [shortDesc, setShortDesc] = useState('');
  const [desc, setDesc] = useState('');

  // Flags
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [fbtIds, setFbtIds] = useState<string[]>([]);

  // Images state (Slot-based with multi-angle support)
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [activePreviewImgIndex, setActivePreviewImgIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const [replacingSlotIndex, setReplacingSlotIndex] = useState<number | null>(null);

  // Variations State
  const [enableVariants, setEnableVariants] = useState(false);
  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [variantColors, setVariantColors] = useState<{ name: string; hex: string }[]>([]);
  const [variantSizes, setVariantSizes] = useState<string[]>([]);
  const [variantItems, setVariantItems] = useState<ProductVariantItem[]>([]);

  // Quick SKU Generator
  const generateSku = (catId?: string) => {
    const prefix = 'BST';
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${rand}`;
  };

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setModalTab('basic');
    setName('');
    setCategoryId(categories[0]?.id || 'cat-baby-essentials');
    setSubcategory('Essentials');
    setBrand('Sunshine Babies Essentials');
    setAgeGroup('All Ages');
    setSku(generateSku());
    setRegularPrice(18500);
    setDiscountPrice('');
    setStockQuantity(25);
    setLowStockThreshold(5);
    setAllowBackorders(false);
    setShortDesc('Premium certified quality designed for comfort, safety and peace of mind.');
    setDesc(
      'Carefully crafted from hypoallergenic baby-safe materials. Engineered to provide exceptional durability, ergonomic convenience, and effortless hygiene for modern parents.'
    );
    setIsFeatured(false);
    setIsNewArrival(true);
    setIsBestSeller(false);
    setIsOnSale(false);
    setIsActive(true);
    setFbtIds([]);

    // Default high-quality image slot
    setImageSlots([
      {
        id: `img-${Date.now()}-1`,
        url: getProductPlaceholderSvg('New Baby Product', 'cat-gear', 'main'),
        angle: 'main',
      },
    ]);
    setActivePreviewImgIndex(0);

    // Variants default
    setEnableVariants(false);
    setVariantColors([]);
    setVariantSizes([]);
    setVariantItems([]);

    setIsModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setModalTab('basic');
    setName(p.name);
    setCategoryId(p.category_id);
    setSubcategory(p.subcategory || 'General');
    setBrand(p.brand || 'Sunshine Babies Essentials');
    setAgeGroup(p.age_group || 'All Ages');
    setSku(p.sku);
    setRegularPrice(p.regular_price);
    setDiscountPrice(p.discount_price ?? '');
    setStockQuantity(p.stock_quantity);
    setLowStockThreshold(p.low_stock_threshold ?? 5);
    setAllowBackorders(p.allow_backorders ?? false);
    setShortDesc(p.short_description || '');
    setDesc(p.description || '');
    setIsFeatured(Boolean(p.is_featured));
    setIsNewArrival(Boolean(p.is_new_arrival));
    setIsBestSeller(Boolean(p.is_best_seller));
    setIsOnSale(Boolean(p.is_on_sale || (p.discount_price && p.discount_price < p.regular_price)));
    setIsActive(p.is_active !== false);
    setFbtIds(p.frequently_bought_together_ids || []);

    // Load Image Slots
    const angles: ('main' | 'front' | 'side' | 'back' | 'detail' | 'additional')[] = [
      'main',
      'front',
      'side',
      'back',
      'detail',
      'additional',
    ];
    const initialSlots: ImageSlot[] = (p.images || []).map((url, idx) => ({
      id: `img-${p.id}-${idx}`,
      url,
      angle: angles[idx] || 'additional',
    }));

    if (initialSlots.length === 0) {
      initialSlots.push({
        id: `img-def-${Date.now()}`,
        url: getProductPlaceholderSvg(p.name, p.category_id, 'main'),
        angle: 'main',
      });
    }

    setImageSlots(initialSlots);
    setActivePreviewImgIndex(0);

    // Variants
    if (p.variants && (p.variants.colors?.length || p.variants.sizes?.length || p.variants.items?.length)) {
      setEnableVariants(true);
      setVariantColors(p.variants.colors || []);
      setVariantSizes(p.variants.sizes || []);
      setVariantItems(p.variants.items || []);
    } else {
      setEnableVariants(false);
      setVariantColors([]);
      setVariantSizes([]);
      setVariantItems([]);
    }

    setIsModalOpen(true);
  };

  // Duplicate Product Action
  const handleDuplicate = (productId: string) => {
    duplicateProduct(productId);
    showToast('Product successfully duplicated with new SKU!');
  };

  // Image Upload Handlers
  const handleFilesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      try {
        const uploadedUrl = await uploadProductImage(file);
        if (uploadedUrl) {
          setImageSlots((prev) => {
            const angles: ('main' | 'front' | 'side' | 'back' | 'detail' | 'additional')[] = [
              'main',
              'front',
              'side',
              'back',
              'detail',
              'additional',
            ];
            const nextAngle = angles[prev.length] || 'additional';
            return [
              ...prev,
              {
                id: `img-up-${Date.now()}-${Math.random()}`,
                url: uploadedUrl,
                angle: nextAngle,
              },
            ];
          });
        }
      } catch (err) {
        console.error('Failed to upload image:', err);
        showToast('Error uploading image');
      }
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const angles: ('main' | 'front' | 'side' | 'back' | 'detail' | 'additional')[] = [
      'main',
      'front',
      'side',
      'back',
      'detail',
      'additional',
    ];
    setImageSlots((prev) => [
      ...prev,
      {
        id: `img-url-${Date.now()}`,
        url: newImageUrl.trim(),
        angle: angles[prev.length] || 'additional',
      },
    ]);
    setNewImageUrl('');
  };

  const handleReplaceImage = (index: number, newUrl: string) => {
    setImageSlots((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], url: newUrl };
      }
      return updated;
    });
    setReplacingSlotIndex(null);
  };

  const handleSetAsMain = (index: number) => {
    if (index === 0) return;
    setImageSlots((prev) => {
      const updated = [...prev];
      const [selected] = updated.splice(index, 1);
      selected.angle = 'main';
      if (updated[0]) updated[0].angle = 'front';
      updated.unshift(selected);
      return updated;
    });
    setActivePreviewImgIndex(0);
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    setImageSlots((prev) => {
      const updated = [...prev];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const handleDeleteImage = (index: number) => {
    setImageSlots((prev) => {
      const updated = prev.filter((_, idx) => idx !== index);
      if (updated.length > 0 && updated[0]) {
        updated[0].angle = 'main';
      }
      return updated;
    });
    setActivePreviewImgIndex(0);
  };

  const handleUpdateImageAngle = (index: number, angle: ImageSlot['angle']) => {
    setImageSlots((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], angle };
      }
      return updated;
    });
  };

  // Color & Size Variations Handlers
  const handleAddColor = () => {
    if (!colorInput.trim()) return;
    const name = colorInput.trim();
    const hexMap: Record<string, string> = {
      pink: '#f472b6',
      blue: '#60a5fa',
      white: '#ffffff',
      black: '#1e293b',
      beige: '#f5f5dc',
      mint: '#6ee7b7',
      lavender: '#c084fc',
      yellow: '#fde047',
      grey: '#94a3b8',
      gray: '#94a3b8',
      cream: '#fffbeb',
      navy: '#1e3a8a',
    };
    const hex = hexMap[name.toLowerCase()] || '#cbd5e1';

    if (!variantColors.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      const newColors = [...variantColors, { name, hex }];
      setVariantColors(newColors);
      rebuildVariantItems(newColors, variantSizes);
    }
    setColorInput('');
  };

  const handleRemoveColor = (index: number) => {
    const updated = variantColors.filter((_, i) => i !== index);
    setVariantColors(updated);
    rebuildVariantItems(updated, variantSizes);
  };

  const handleAddSize = () => {
    if (!sizeInput.trim()) return;
    const s = sizeInput.trim();
    if (!variantSizes.includes(s)) {
      const newSizes = [...variantSizes, s];
      setVariantSizes(newSizes);
      rebuildVariantItems(variantColors, newSizes);
    }
    setSizeInput('');
  };

  const handleRemoveSize = (index: number) => {
    const updated = variantSizes.filter((_, i) => i !== index);
    setVariantSizes(updated);
    rebuildVariantItems(variantColors, updated);
  };

  const rebuildVariantItems = (
    colors: { name: string; hex: string }[],
    sizes: string[]
  ) => {
    const items: ProductVariantItem[] = [];
    if (colors.length > 0 && sizes.length > 0) {
      colors.forEach((c) => {
        sizes.forEach((s) => {
          items.push({
            id: `var-${c.name}-${s}`.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            name: `${c.name} / ${s}`,
            color: c.name,
            color_hex: c.hex,
            size: s,
            sku: `${sku || 'BST'}-${c.name.substring(0, 2).toUpperCase()}-${s.substring(0, 2).toUpperCase()}`,
            price: Number(discountPrice || regularPrice),
            stock: 10,
          });
        });
      });
    } else if (colors.length > 0) {
      colors.forEach((c) => {
        items.push({
          id: `var-${c.name}`.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: c.name,
          color: c.name,
          color_hex: c.hex,
          sku: `${sku || 'BST'}-${c.name.substring(0, 3).toUpperCase()}`,
          price: Number(discountPrice || regularPrice),
          stock: 10,
        });
      });
    } else if (sizes.length > 0) {
      sizes.forEach((s) => {
        items.push({
          id: `var-${s}`.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: s,
          size: s,
          sku: `${sku || 'BST'}-${s.substring(0, 3).toUpperCase()}`,
          price: Number(discountPrice || regularPrice),
          stock: 10,
        });
      });
    }
    setVariantItems(items);
  };

  // Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId || !sku.trim()) {
      alert('Please fill in required fields: Product Name, Category and SKU.');
      return;
    }

    const finalImages =
      imageSlots.length > 0
        ? imageSlots.map((slot) => slot.url)
        : [getProductPlaceholderSvg(name, categoryId, 'main')];

    const imageViewsObj: ProductImageViews = {};
    imageSlots.forEach((slot) => {
      if (slot.angle && slot.angle !== 'additional') {
        imageViewsObj[slot.angle] = slot.url;
      }
    });

    const isStockZero = Number(stockQuantity) <= 0;

    const payload: Product = {
      id: editingProductId || `prod-${Date.now()}`,
      name: name.trim(),
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      category_id: categoryId,
      subcategory: subcategory.trim() || 'General',
      brand: brand.trim() || 'Sunshine Babies Essentials',
      age_group: ageGroup,
      sku: sku.trim(),
      regular_price: Number(regularPrice),
      discount_price: discountPrice !== '' ? Number(discountPrice) : undefined,
      stock_quantity: Number(stockQuantity),
      low_stock_threshold: Number(lowStockThreshold),
      allow_backorders: Boolean(allowBackorders),
      is_out_of_stock: isStockZero,
      images: finalImages,
      image_views: imageViewsObj,
      short_description: shortDesc.trim() || 'Certified safe and gentle for baby.',
      description: desc.trim() || 'Comprehensive quality specifications and premium materials.',
      is_featured: isFeatured,
      is_new_arrival: isNewArrival,
      is_best_seller: isBestSeller,
      is_on_sale: isOnSale || Boolean(discountPrice && Number(discountPrice) < Number(regularPrice)),
      is_active: isActive,
      variants: enableVariants
        ? {
            colors: variantColors,
            sizes: variantSizes,
            items: variantItems,
          }
        : undefined,
      frequently_bought_together_ids: fbtIds,
      updated_at: new Date().toISOString(),
    };

    if (editingProductId) {
      updateProduct(payload);
      showToast(`Updated "${payload.name}" successfully.`);
    } else {
      addProduct(payload);
      showToast(`Created new product "${payload.name}".`);
    }

    setIsModalOpen(false);
  };

  // Filter Pipeline
  const filteredProducts = products
    .filter((p) => {
      // Category filter
      if (filterCategory !== 'all' && p.category_id !== filterCategory) return false;

      // Age filter
      if (filterAge !== 'all' && p.age_group !== filterAge) return false;

      // Stock status filter
      const isOut = p.stock_quantity <= 0 || p.is_out_of_stock;
      const threshold = p.low_stock_threshold ?? 5;
      const isLow = !isOut && p.stock_quantity <= threshold;

      if (filterStock === 'in-stock' && isOut) return false;
      if (filterStock === 'low-stock' && !isLow) return false;
      if (filterStock === 'out-of-stock' && !isOut) return false;
      if (filterStock === 'backorders' && !p.allow_backorders) return false;

      // Badge filter
      if (filterBadge === 'featured' && !p.is_featured) return false;
      if (filterBadge === 'best-seller' && !p.is_best_seller) return false;
      if (filterBadge === 'new-arrival' && !p.is_new_arrival) return false;
      if (filterBadge === 'on-sale' && !p.is_on_sale && (!p.discount_price || p.discount_price >= p.regular_price))
        return false;
      if (filterBadge === 'hidden' && p.is_active !== false) return false;

      // Search Query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
          p.age_group.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const priceA = a.discount_price && a.discount_price > 0 ? a.discount_price : a.regular_price;
      const priceB = b.discount_price && b.discount_price > 0 ? b.discount_price : b.regular_price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'stock-asc') return a.stock_quantity - b.stock_quantity;
      if (sortBy === 'stock-desc') return b.stock_quantity - a.stock_quantity;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'discount-desc') {
        const discA = calculateDiscountPercent(a.regular_price, a.discount_price);
        const discB = calculateDiscountPercent(b.regular_price, b.discount_price);
        return discB - discA;
      }
      // Default newest
      return new Date(b.created_at || b.updated_at || '').getTime() - new Date(a.created_at || a.updated_at || '').getTime();
    });

  // Calculate quick stats
  const totalCount = products.length;
  const outOfStockCount = products.filter((p) => p.stock_quantity <= 0 || p.is_out_of_stock).length;
  const lowStockCount = products.filter((p) => {
    const thresh = p.low_stock_threshold ?? 5;
    return p.stock_quantity > 0 && p.stock_quantity <= thresh;
  }).length;
  const activeCount = products.filter((p) => p.is_active !== false).length;

  const discountCalculated = calculateDiscountPercent(Number(regularPrice), discountPrice !== '' ? Number(discountPrice) : undefined);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Catalog</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
          <span className="text-[10px] text-slate-500">{activeCount} active on storefront</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Healthy Stock</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{totalCount - outOfStockCount - lowStockCount}</div>
          <span className="text-[10px] text-emerald-600">Ready for instant dispatch</span>
        </div>

        <div
          onClick={() => setFilterStock('low-stock')}
          className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-2xs cursor-pointer hover:border-amber-400 transition-colors"
        >
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Low Stock Alert</span>
          <div className="text-2xl font-black text-amber-800 mt-1">{lowStockCount}</div>
          <span className="text-[10px] text-amber-700 font-semibold">≤ 5 units remaining</span>
        </div>

        <div
          onClick={() => setFilterStock('out-of-stock')}
          className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-2xs cursor-pointer hover:border-rose-400 transition-colors"
        >
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">Out of Stock</span>
          <div className="text-2xl font-black text-rose-700 mt-1">{outOfStockCount}</div>
          <span className="text-[10px] text-rose-600 font-semibold">Automatic Notify Enabled</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Main Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setViewTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              viewTab === 'products'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>Product Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setViewTab('restock')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              viewTab === 'restock'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BellRing className="w-4 h-4 text-amber-400" />
            <span>Restock Requests</span>
            {stockNotifications.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                {stockNotifications.length}
              </span>
            )}
          </button>
        </div>

        {viewTab === 'products' && (
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  viewMode === 'table' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table View"
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  viewMode === 'cards' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Cards View"
              >
                Cards
              </button>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>Create New Product</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Tab 1: Product Inventory Manager */}
      {viewTab === 'products' ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Advanced Filter Toolbar */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by product name, SKU, brand, age group..."
                  className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort By Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sort:</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800"
                >
                  <option value="newest">Newest Added</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="stock-asc">Stock: Low to High (Restock alert)</option>
                  <option value="stock-desc">Stock: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="discount-desc">Highest Discount %</option>
                </select>
              </div>
            </div>

            {/* Dropdown Filters Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
              {/* Category Filter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-800"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Filter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stock Status</label>
                <select
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value as StockFilter)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-800"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="in-stock">In Stock (Healthy)</option>
                  <option value="low-stock">Low Stock (≤ 5 units)</option>
                  <option value="out-of-stock">Out of Stock (0 units)</option>
                  <option value="backorders">Backorders Allowed</option>
                </select>
              </div>

              {/* Age Group Filter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Age Group</label>
                <select
                  value={filterAge}
                  onChange={(e) => setFilterAge(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-800"
                >
                  <option value="all">All Age Groups</option>
                  <option value="0-3 Months">0-3 Months</option>
                  <option value="3-6 Months">3-6 Months</option>
                  <option value="6-12 Months">6-12 Months</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5-7 Years">5-7 Years</option>
                  <option value="7-10 Years">7-10 Years</option>
                  <option value="10-12 Years">10-12 Years</option>
                  <option value="Maternity">Maternity</option>
                  <option value="All Ages">All Ages</option>
                </select>
              </div>

              {/* Badges / Visibility Filter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Flag / Badge</label>
                <select
                  value={filterBadge}
                  onChange={(e) => setFilterBadge(e.target.value as BadgeFilter)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-800"
                >
                  <option value="all">All Flags</option>
                  <option value="featured">⭐ Featured Only</option>
                  <option value="best-seller">🔥 Best Sellers Only</option>
                  <option value="new-arrival">🆕 New Arrivals Only</option>
                  <option value="on-sale">💥 On Sale Only</option>
                  <option value="hidden">👁️ Inactive / Hidden</option>
                </select>
              </div>
            </div>

            {/* Active Filters Pill Bar (if filters applied) */}
            {(filterCategory !== 'all' || filterStock !== 'all' || filterAge !== 'all' || filterBadge !== 'all' || search) && (
              <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px]">
                <span className="text-slate-400 font-semibold">Active Filters:</span>
                {filterCategory !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold flex items-center gap-1">
                    Cat: {categories.find((c) => c.id === filterCategory)?.name}
                    <button onClick={() => setFilterCategory('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterStock !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold flex items-center gap-1">
                    Stock: {filterStock}
                    <button onClick={() => setFilterStock('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterAge !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold flex items-center gap-1">
                    Age: {filterAge}
                    <button onClick={() => setFilterAge('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterBadge !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold flex items-center gap-1">
                    Badge: {filterBadge}
                    <button onClick={() => setFilterBadge('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setFilterCategory('all');
                    setFilterStock('all');
                    setFilterAge('all');
                    setFilterBadge('all');
                    setSearch('');
                  }}
                  className="text-amber-800 hover:underline font-bold"
                >
                  Clear All Filters
                </button>
                <span className="ml-auto text-slate-500 font-semibold">
                  Showing {filteredProducts.length} of {products.length} products
                </span>
              </div>
            )}
          </div>

          {/* TABLE VIEW */}
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Product Info & Photos</th>
                    <th className="py-3 px-4">Classification</th>
                    <th className="py-3 px-4">Price & Discount</th>
                    <th className="py-3 px-4">Inventory Status</th>
                    <th className="py-3 px-4">Storefront Badges</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Package className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                        <p className="font-bold text-slate-600">No matching products found</p>
                        <p className="text-[11px] mt-0.5">Try clearing filters or search terms</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      const cat = categories.find((c) => c.id === product.category_id);
                      const isOut = product.stock_quantity <= 0 || product.is_out_of_stock;
                      const thresh = product.low_stock_threshold ?? 5;
                      const isLow = !isOut && product.stock_quantity <= thresh;
                      const discPercent = calculateDiscountPercent(product.regular_price, product.discount_price);
                      const finalPrice =
                        product.discount_price && product.discount_price > 0
                          ? product.discount_price
                          : product.regular_price;

                      return (
                        <tr key={product.id} className="hover:bg-slate-50/70 transition-colors group">
                          {/* Product & Images */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                <img
                                  src={product.images?.[0] || getProductPlaceholderSvg(product.name, product.category_id, 'main')}
                                  alt={product.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                                {product.images?.length > 1 && (
                                  <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white font-bold text-[9px] px-1 rounded-tl-md">
                                    {product.images.length}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 max-w-xs">
                                <span className="font-bold text-slate-900 line-clamp-1 block hover:text-amber-800">
                                  {product.name}
                                </span>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                  <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                                    {product.sku}
                                  </span>
                                  {product.brand && <span className="truncate">{product.brand}</span>}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category & Age */}
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800 block truncate max-w-[140px]">
                              {cat?.name || 'Unassigned'}
                            </span>
                            <span className="text-[11px] text-slate-500">{product.age_group}</span>
                          </td>

                          {/* Price & Discount */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">
                              {formatCurrency(finalPrice, companySettings.currency_symbol)}
                            </div>
                            {product.discount_price && product.discount_price > 0 ? (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-slate-400 line-through font-normal">
                                  {formatCurrency(product.regular_price, companySettings.currency_symbol)}
                                </span>
                                <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-1 rounded">
                                  -{discPercent}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400">Regular</span>
                            )}
                          </td>

                          {/* Stock & Inventory */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1 ${
                                  isOut
                                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                    : isLow
                                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                {isOut ? '● Out of Stock' : `${product.stock_quantity} in stock`}
                              </span>
                            </div>
                            {product.allow_backorders && (
                              <span className="text-[9px] text-blue-600 block mt-0.5 font-semibold">
                                Backorders allowed
                              </span>
                            )}
                          </td>

                          {/* Badges */}
                          <td className="py-3 px-4">
                            <div className="flex gap-1 flex-wrap max-w-[150px]">
                              {product.is_featured && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                                  Featured
                                </span>
                              )}
                              {product.is_best_seller && (
                                <span className="px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 text-[10px] font-bold">
                                  Best Seller
                                </span>
                              )}
                              {product.is_new_arrival && (
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                                  New
                                </span>
                              )}
                              {product.is_on_sale && (
                                <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">
                                  Sale
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Visibility Toggle */}
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => {
                                const newActive = product.is_active === false;
                                updateProduct({ ...product, is_active: newActive });
                                showToast(`Product visibility ${newActive ? 'Enabled' : 'Disabled'}`);
                              }}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                                product.is_active !== false
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200 border border-slate-200'
                              }`}
                            >
                              {product.is_active !== false ? 'Active' : 'Hidden'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Storefront View */}
                              <button
                                onClick={() => navigateTo('product-detail', { productId: product.id })}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                                title="View on Live Storefront"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>

                              {/* Duplicate */}
                              <button
                                onClick={() => handleDuplicate(product.id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                                title="Duplicate Product"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEditModal(product)}
                                className="p-1.5 rounded-lg text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => setDeleteConfirmProduct(product)}
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* GRID CARDS VIEW */
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((p) => {
                const isOut = p.stock_quantity <= 0 || p.is_out_of_stock;
                const cat = categories.find((c) => c.id === p.category_id);
                return (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-amber-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-100">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {isOut && (
                          <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                            <span className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold text-[10px] uppercase">
                              Out of Stock
                            </span>
                          </div>
                        )}
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-slate-900/80 text-white text-[9px] font-bold">
                          {p.images.length} photos
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
                        <span className="text-amber-800 font-semibold truncate">{cat?.name}</span>
                        <span className="font-mono text-slate-400 text-[10px]">SKU: {p.sku}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug mb-2">{p.name}</h4>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black text-slate-900">
                          {formatCurrency(p.discount_price || p.regular_price, companySettings.currency_symbol)}
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">{p.stock_quantity} left</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmProduct(p)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: Out of Stock Restock Customer Requests */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Restock Notification Inquiries</h3>
              <p className="text-xs text-slate-500">
                Shoppers who asked to be alerted when out-of-stock items are replenished.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
              {stockNotifications.length} Waiting Customers
            </span>
          </div>

          {stockNotifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No pending restock customer notifications. All demand is currently fulfilled!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stockNotifications.map((req) => (
                <div
                  key={req.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900">{req.product_name}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>Customer: {req.customer_name}</span>
                      <span>•</span>
                      <span>Phone: {req.phone}</span>
                      <span>•</span>
                      <span>{req.email}</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                      req.customer_name
                    )}!%20Good%20news%20from%20${encodeURIComponent(
                      companySettings.business_name
                    )}!%20${encodeURIComponent(req.product_name)}%20is%20now%20back%20in%20stock!`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs self-start sm:self-auto transition-colors"
                  >
                    Send Restock WhatsApp Message
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setDeleteConfirmProduct(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Delete Product Permanently?</h3>
            <p className="text-xs text-slate-600 mb-4">
              Are you sure you want to delete <span className="font-bold text-slate-900">{deleteConfirmProduct.name}</span> (SKU: {deleteConfirmProduct.sku})? This action will remove it from the catalog.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setDeleteConfirmProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(deleteConfirmProduct.id);
                  setDeleteConfirmProduct(null);
                  showToast('Product deleted from inventory.');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-xs"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL-FEATURED ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] z-10 border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-serif font-black text-slate-900">
                    {editingProductId ? `Edit Product: ${name || 'Untitled'}` : 'Create New Store Product'}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>SKU: {sku || 'Pending'}</span>
                    <span>•</span>
                    <span>{categories.find((c) => c.id === categoryId)?.name || 'Category'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Bar */}
            <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-slate-100 bg-white overflow-x-auto text-xs font-bold">
              <button
                type="button"
                onClick={() => setModalTab('basic')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  modalTab === 'basic'
                    ? 'border-amber-500 text-slate-950 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Basic Information
              </button>

              <button
                type="button"
                onClick={() => setModalTab('pricing')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  modalTab === 'pricing'
                    ? 'border-amber-500 text-slate-950 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Pricing & Stock
              </button>

              <button
                type="button"
                onClick={() => setModalTab('images')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === 'images'
                    ? 'border-amber-500 text-slate-950 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>3. Product Images ({imageSlots.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('variants')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === 'variants'
                    ? 'border-amber-500 text-slate-950 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>4. Variations ({variantItems.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('flags')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  modalTab === 'flags'
                    ? 'border-amber-500 text-slate-950 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                5. Badges & Visibility
              </button>

              <button
                type="button"
                onClick={() => setModalTab('preview')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 text-amber-700 ${
                  modalTab === 'preview'
                    ? 'border-amber-600 text-amber-900 font-black'
                    : 'border-transparent hover:text-amber-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Customer Preview</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: BASIC INFORMATION */}
              {modalTab === 'basic' && (
                <div className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Product Name * <span className="text-slate-400 font-normal">(as shown to customers)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ergonomic 3-in-1 Baby Stroller & Pram"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-semibold"
                    />
                  </div>

                  {/* SKU & Category & Subcategory */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-800">SKU Code *</label>
                        <button
                          type="button"
                          onClick={() => setSku(generateSku())}
                          className="text-[10px] text-amber-800 hover:underline font-bold"
                        >
                          Auto Generate
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Category *</label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Subcategory / Type</label>
                      <input
                        type="text"
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        placeholder="e.g. Travel, Feeding, Bedding"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  {/* Brand & Age Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Brand / Manufacturer</label>
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="e.g. Chicco, Avent, Sunshine Babies Essentials"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Target Age Group *</label>
                      <select
                        value={ageGroup}
                        onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold cursor-pointer focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      >
                        <option value="0-3 Months">0-3 Months</option>
                        <option value="3-6 Months">3-6 Months</option>
                        <option value="6-12 Months">6-12 Months</option>
                        <option value="1-3 Years">1-3 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="5-7 Years">5-7 Years</option>
                        <option value="7-10 Years">7-10 Years</option>
                        <option value="10-12 Years">10-12 Years</option>
                        <option value="Maternity">Maternity & Motherhood</option>
                        <option value="All Ages">All Ages / Universal</option>
                      </select>
                    </div>
                  </div>

                  {/* Short Summary */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Short Description (Card summary, 1-2 sentences)
                    </label>
                    <input
                      type="text"
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                      placeholder="Brief highlight that appears on product cards and quick views"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200"
                    />
                  </div>

                  {/* Full Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Full Description, Materials & Specifications
                    </label>
                    <textarea
                      rows={5}
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="Detailed product features, baby safety certifications, dimensions, washing instructions..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 leading-relaxed font-sans"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & INVENTORY */}
              {modalTab === 'pricing' && (
                <div className="space-y-6">
                  {/* Pricing Matrix */}
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-4">
                    <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Pricing Configuration</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Original / Regular Price ({companySettings.currency_symbol}) *
                        </label>
                        <input
                          type="number"
                          required
                          value={regularPrice}
                          onChange={(e) => setRegularPrice(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 text-sm font-bold rounded-xl border border-slate-200 bg-white"
                        />
                        <span className="text-[11px] text-slate-500 mt-1 block">Full retail listing price</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Discount / Selling Price ({companySettings.currency_symbol}) (Optional)
                        </label>
                        <input
                          type="number"
                          value={discountPrice}
                          onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : '')}
                          placeholder="Leave empty if regular price applies"
                          className="w-full px-3.5 py-2.5 text-sm font-bold rounded-xl border border-slate-200 bg-white"
                        />
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          If set, customers pay this price and see a sale badge
                        </span>
                      </div>
                    </div>

                    {/* Computed Discount Preview */}
                    {discountCalculated > 0 && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs">
                        <span className="font-bold text-rose-800">
                          💥 Active Discount: Save {discountCalculated}% (
                          {formatCurrency(
                            Number(regularPrice) - Number(discountPrice),
                            companySettings.currency_symbol
                          )}{' '}
                          off)
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px]">
                          SALE BADGE ENABLED
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Stock & Inventory Control */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Inventory & Stock Control
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Stock Quantity in Warehouse *
                        </label>
                        <input
                          type="number"
                          required
                          value={stockQuantity}
                          onChange={(e) => setStockQuantity(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 text-sm font-bold rounded-xl border border-slate-200 bg-white"
                        />
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          Setting to 0 automatically shows "OUT OF STOCK" on storefront.
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Low Stock Alert Threshold</label>
                        <input
                          type="number"
                          value={lowStockThreshold}
                          onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 text-sm font-bold rounded-xl border border-slate-200 bg-white"
                        />
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          Alerts admin dashboard when units drop to or below this level (default 5).
                        </span>
                      </div>
                    </div>

                    {/* Backorders Toggle */}
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Allow Backorders</span>
                        <span className="text-[11px] text-slate-500">
                          Allow customers to order even when stock quantity reaches 0.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowBackorders}
                          onChange={(e) => setAllowBackorders(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRODUCT IMAGE STUDIO */}
              {modalTab === 'images' && (
                <div className="space-y-6">
                  {/* Image Upload Zone */}
                  <div className="p-5 rounded-2xl bg-amber-50/40 border-2 border-dashed border-amber-300/80 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Upload Product Photographs & Multi-Angle Shots</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                        Select files from your computer or phone camera. Supports JPG, PNG, WEBP.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer shadow-xs transition-colors">
                        <Camera className="w-4 h-4 text-amber-400" />
                        <span>Select / Take Photos</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          ref={fileInputRef}
                          className="hidden"
                          onChange={(e) => handleFilesUpload(e.target.files)}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Direct Image URL input */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-700">Or Paste Image URL directly:</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 font-mono bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 shrink-0"
                      >
                        + Add URL
                      </button>
                    </div>
                  </div>

                  {/* Hidden input for single image replacement */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={replaceInputRef}
                    className="hidden"
                    onChange={(e) => {
                      if (replacingSlotIndex !== null && e.target.files?.[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const res = ev.target?.result as string;
                          if (res) handleReplaceImage(replacingSlotIndex, res);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />

                  {/* Managed Image Slots */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Current Product Photos ({imageSlots.length})
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        First image is automatically the Main Hero photograph.
                      </span>
                    </div>

                    {imageSlots.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-100">
                        No images uploaded yet. Please add at least one product photo.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {imageSlots.map((slot, index) => (
                          <div
                            key={slot.id}
                            className={`p-3 rounded-2xl border transition-all flex items-start gap-3 bg-white ${
                              index === 0
                                ? 'border-amber-400 shadow-xs ring-2 ring-amber-400/20'
                                : 'border-slate-200'
                            }`}
                          >
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                              <img
                                src={slot.url}
                                alt={`Slot ${index + 1}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              {index === 0 && (
                                <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow-xs">
                                  MAIN
                                </span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800">
                                  Photo #{index + 1} {index === 0 ? '(Hero)' : ''}
                                </span>

                                {/* Angle Tag Selector */}
                                <select
                                  value={slot.angle}
                                  onChange={(e) =>
                                    handleUpdateImageAngle(index, e.target.value as ImageSlot['angle'])
                                  }
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700"
                                >
                                  <option value="main">Main Hero</option>
                                  <option value="front">Front View</option>
                                  <option value="side">Side View</option>
                                  <option value="back">Back View</option>
                                  <option value="detail">Close-Up Detail</option>
                                  <option value="additional">Gallery Photo</option>
                                </select>
                              </div>

                              {/* Action Buttons for this Image */}
                              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                {index !== 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetAsMain(index)}
                                    className="px-2 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold hover:bg-amber-100"
                                  >
                                    ★ Set as Main
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplacingSlotIndex(index);
                                    replaceInputRef.current?.click();
                                  }}
                                  className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 text-[10px] font-bold"
                                >
                                  Replace
                                </button>

                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => handleMoveImage(index, 'left')}
                                  className="p-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30 text-[10px]"
                                  title="Move Left/Up"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  disabled={index === imageSlots.length - 1}
                                  onClick={() => handleMoveImage(index, 'right')}
                                  className="p-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30 text-[10px]"
                                  title="Move Right/Down"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteImage(index)}
                                  className="p-1 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 text-[10px] ml-auto"
                                  title="Delete this photo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: PRODUCT VARIATIONS (COLORS, SIZES, AGES) */}
              {modalTab === 'variants' && (
                <div className="space-y-6">
                  {/* Enable Switch */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Enable Product Variations</h3>
                      <p className="text-[11px] text-slate-500">
                        Create options for different colors, sizes, or age stages with custom pricing.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableVariants}
                        onChange={(e) => setEnableVariants(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  {enableVariants && (
                    <div className="space-y-6">
                      {/* Color Options */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                        <label className="block text-xs font-bold text-slate-800">
                          Color Options (e.g. Pink, Blue, Beige, White, Black)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={colorInput}
                            onChange={(e) => setColorInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                            placeholder="Type color name and click Add"
                            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={handleAddColor}
                            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                          >
                            + Add Color
                          </button>
                        </div>

                        {variantColors.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {variantColors.map((c, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200"
                              >
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-slate-300"
                                  style={{ backgroundColor: c.hex }}
                                />
                                <span>{c.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveColor(idx)}
                                  className="text-slate-400 hover:text-rose-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Size Options */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                        <label className="block text-xs font-bold text-slate-800">
                          Size / Age Options (e.g. Small, Medium, Large, Newborn, 0-3M)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={sizeInput}
                            onChange={(e) => setSizeInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                            placeholder="Type size and click Add"
                            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={handleAddSize}
                            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                          >
                            + Add Size
                          </button>
                        </div>

                        {variantSizes.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {variantSizes.map((s, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200"
                              >
                                <span>{s}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSize(idx)}
                                  className="text-slate-400 hover:text-rose-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Generated Variant Item Table */}
                      {variantItems.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Generated Combinations ({variantItems.length})
                          </h4>
                          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[10px] uppercase">
                                <tr>
                                  <th className="py-2.5 px-3">Variant</th>
                                  <th className="py-2.5 px-3">SKU</th>
                                  <th className="py-2.5 px-3">Price ({companySettings.currency_symbol})</th>
                                  <th className="py-2.5 px-3">Stock Units</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {variantItems.map((item, index) => (
                                  <tr key={item.id}>
                                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.name}</td>
                                    <td className="py-2.5 px-3">
                                      <input
                                        type="text"
                                        value={item.sku || ''}
                                        onChange={(e) => {
                                          const updated = [...variantItems];
                                          updated[index].sku = e.target.value;
                                          setVariantItems(updated);
                                        }}
                                        className="px-2 py-1 text-xs rounded border border-slate-200 font-mono w-28"
                                      />
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <input
                                        type="number"
                                        value={item.price ?? regularPrice}
                                        onChange={(e) => {
                                          const updated = [...variantItems];
                                          updated[index].price = Number(e.target.value);
                                          setVariantItems(updated);
                                        }}
                                        className="px-2 py-1 text-xs rounded border border-slate-200 font-bold w-24"
                                      />
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <input
                                        type="number"
                                        value={item.stock ?? 10}
                                        onChange={(e) => {
                                          const updated = [...variantItems];
                                          updated[index].stock = Number(e.target.value);
                                          setVariantItems(updated);
                                        }}
                                        className="px-2 py-1 text-xs rounded border border-slate-200 font-bold w-20"
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: BADGES & STOREFRONT VISIBILITY */}
              {modalTab === 'flags' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100">
                    <label className="py-3 flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                          <span>⭐ Featured Product</span>
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Displays on the homepage Featured Collection & prime spotlight areas.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>

                    <label className="py-3 flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                          <span>🔥 Best Seller</span>
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Adds Best Seller badge and ranks high in popularity filters.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isBestSeller}
                        onChange={(e) => setIsBestSeller(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>

                    <label className="py-3 flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-slate-700" />
                          <span>🆕 New Arrival</span>
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Highlights product in the New Arrivals showcase.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isNewArrival}
                        onChange={(e) => setIsNewArrival(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>

                    <label className="py-3 flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Tag className="w-4 h-4 text-rose-600" />
                          <span>💥 On Sale Flag</span>
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Forces sale badge display even if discount price is identical.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isOnSale}
                        onChange={(e) => setIsOnSale(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>

                    <label className="py-3 flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-emerald-600" />
                          <span>👁️ Active / Visible to Customers</span>
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Uncheck to temporarily hide from customer search and shop catalogue.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 6: LIVE CUSTOMER PREVIEW */}
              {modalTab === 'preview' && (
                <div className="space-y-6">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between">
                    <span>👀 Live Preview: How this product will look to customers on the website</span>
                    <span className="text-[10px] font-mono uppercase bg-amber-200/60 px-2 py-0.5 rounded">
                      Instant Rendering
                    </span>
                  </div>

                  {/* Customer Product Card & Detail Preview */}
                  <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Left: Gallery preview */}
                    <div className="space-y-3">
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-inner">
                        <img
                          src={imageSlots[activePreviewImgIndex]?.url || imageSlots[0]?.url}
                          alt="Live Preview"
                          className="w-full h-full object-cover"
                        />
                        {discountCalculated > 0 && (
                          <span className="absolute top-3 left-3 bg-rose-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full shadow-md">
                            SAVE {discountCalculated}%
                          </span>
                        )}
                        {stockQuantity <= 0 && (
                          <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                            <span className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-black text-xs uppercase">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {imageSlots.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {imageSlots.map((slot, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActivePreviewImgIndex(idx)}
                              className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 ${
                                activePreviewImgIndex === idx
                                  ? 'border-amber-500 ring-2 ring-amber-400/30'
                                  : 'border-slate-200 opacity-60'
                              }`}
                            >
                              <img src={slot.url} alt="thumb" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right: Info Preview */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                          {categories.find((c) => c.id === categoryId)?.name || 'Category'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">
                          Age: {ageGroup}
                        </span>
                      </div>

                      <h3 className="text-xl font-serif font-black text-slate-900 leading-tight">
                        {name || 'Product Title Placeholder'}
                      </h3>

                      <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-baseline gap-3">
                        <span className="text-2xl font-black text-amber-950">
                          {formatCurrency(
                            discountPrice !== '' ? Number(discountPrice) : Number(regularPrice),
                            companySettings.currency_symbol
                          )}
                        </span>
                        {discountPrice !== '' && Number(discountPrice) < Number(regularPrice) && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatCurrency(Number(regularPrice), companySettings.currency_symbol)}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {shortDesc || desc || 'Short summary preview for buyers.'}
                      </p>

                      {/* Stock badge */}
                      <div className="text-xs font-semibold">
                        {stockQuantity <= 0 ? (
                          <span className="text-rose-600 font-bold">● Currently Out of Stock (Notify Me Active)</span>
                        ) : (
                          <span className="text-emerald-700 font-bold">
                            ✓ In Stock ({stockQuantity} units available)
                          </span>
                        )}
                      </div>

                      {/* Sample buttons */}
                      <div className="pt-2 space-y-2">
                        <button
                          type="button"
                          disabled={stockQuantity <= 0}
                          className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-40"
                        >
                          Add to Cart
                        </button>
                        <button
                          type="button"
                          className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                        >
                          Order via WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 bg-white sticky bottom-0 z-10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    {editingProductId ? 'Save Product Changes' : 'Publish Product to Store'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
