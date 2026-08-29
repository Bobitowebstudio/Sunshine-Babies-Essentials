import {
  Category,
  CommunicationLog,
  CompanySettings,
  Customer,
  DeliveryLocation,
  EmailTemplate,
  Inquiry,
  Order,
  Product,
  PromotionalBanner,
  StockNotificationRequest,
  WhatsAppTemplate,
} from '../types';
import {
  DEFAULT_COMPANY_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_DELIVERY_LOCATIONS,
  INITIAL_EMAIL_TEMPLATES,
  INITIAL_PRODUCTS,
  INITIAL_PROMOTIONAL_BANNERS,
  INITIAL_WHATSAPP_TEMPLATES,
} from './constants';

const KEYS = {
  PRODUCTS: 'babystore_products_v9_clean_catalog',
  CATEGORIES: 'babystore_categories_v9_clean',
  SETTINGS: 'babystore_settings_v3',
  DELIVERY: 'babystore_delivery_v3',
  ORDERS: 'babystore_orders_v3',
  CUSTOMERS: 'babystore_customers_v3',
  INQUIRIES: 'babystore_inquiries_v3',
  WHATSAPP_TEMPLATES: 'babystore_whatsapp_templates_v3',
  EMAIL_TEMPLATES: 'babystore_email_templates_v3',
  BANNERS: 'babystore_banners_v3',
  NOTIFICATIONS: 'babystore_notifications_v3',
  COMMS_HISTORY: 'babystore_comms_history_v3',
  RECENTLY_VIEWED: 'babystore_recently_viewed_v3',
  AUTH_USER: 'babystore_auth_user_v3',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export const StorageService = {
  getProducts(): Product[] {
    const stored = safeGet<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    if (!Array.isArray(stored) || stored.length === 0) {
      safeSet(KEYS.PRODUCTS, INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    // Check if stored products have real photos or need synchronization with INITIAL_PRODUCTS
    const storedIds = new Set(stored.map((p) => p.id));
    const missing = INITIAL_PRODUCTS.filter((p) => !storedIds.has(p.id));
    if (missing.length > 0) {
      const merged = [...stored, ...missing];
      safeSet(KEYS.PRODUCTS, merged);
      return merged;
    }
    return stored;
  },
  saveProducts(products: Product[]): void {
    safeSet(KEYS.PRODUCTS, products);
  },

  getCategories(): Category[] {
    const stored = safeGet<Category[]>(KEYS.CATEGORIES, INITIAL_CATEGORIES);
    if (!Array.isArray(stored) || stored.length === 0) {
      safeSet(KEYS.CATEGORIES, INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES;
    }
    const storedIds = new Set(stored.map((c) => c.id));
    const missing = INITIAL_CATEGORIES.filter((c) => !storedIds.has(c.id));
    if (missing.length > 0) {
      const merged = [...stored, ...missing];
      safeSet(KEYS.CATEGORIES, merged);
      return merged;
    }
    return stored;
  },
  saveCategories(categories: Category[]): void {
    safeSet(KEYS.CATEGORIES, categories);
  },

  getSettings(): CompanySettings {
    const settings = safeGet<CompanySettings>(KEYS.SETTINGS, DEFAULT_COMPANY_SETTINGS);
    if (!settings || !settings.business_name || settings.business_name === 'Baby Store' || settings.business_name === 'Baby Store Gold' || !settings.city || settings.city === 'Lagos' || !settings.about_story) {
      const updated: CompanySettings = {
        ...DEFAULT_COMPANY_SETTINGS,
        ...settings,
        business_name: 'Sunshine Babies Essentials',
        tagline: settings?.tagline && settings.tagline !== 'Only the best for your little bless' && settings.tagline !== 'Little Things, Big Smiles' ? settings.tagline : "Your baby's comfort is our biggest priority.",
        logo_url: settings?.logo_url && settings.logo_url !== '' ? settings.logo_url : '/logo.png',
        favicon_url: '/favicon.png',
        city: settings?.city && settings.city !== 'Lagos' && settings.city !== 'Lekki Phase 1' ? settings.city : 'Abuja',
        state: settings?.state && settings.state !== 'Lagos' && settings.state !== 'Lagos State' ? settings.state : 'FCT',
        country: settings?.country || 'Nigeria',
        about_story: settings?.about_story || DEFAULT_COMPANY_SETTINGS.about_story,
        google_maps_url: settings?.google_maps_url || DEFAULT_COMPANY_SETTINGS.google_maps_url,
        latitude: settings?.latitude || DEFAULT_COMPANY_SETTINGS.latitude,
        longitude: settings?.longitude || DEFAULT_COMPANY_SETTINGS.longitude,
      };
      safeSet(KEYS.SETTINGS, updated);
      return updated;
    }
    return settings;
  },
  saveSettings(settings: CompanySettings): void {
    safeSet(KEYS.SETTINGS, settings);
  },

  getDeliveryLocations(): DeliveryLocation[] {
    return safeGet<DeliveryLocation[]>(KEYS.DELIVERY, INITIAL_DELIVERY_LOCATIONS);
  },
  saveDeliveryLocations(locations: DeliveryLocation[]): void {
    safeSet(KEYS.DELIVERY, locations);
  },

  getOrders(): Order[] {
    return safeGet<Order[]>(KEYS.ORDERS, []);
  },
  saveOrders(orders: Order[]): void {
    safeSet(KEYS.ORDERS, orders);
  },

  getCustomers(): Customer[] {
    return safeGet<Customer[]>(KEYS.CUSTOMERS, []);
  },
  saveCustomers(customers: Customer[]): void {
    safeSet(KEYS.CUSTOMERS, customers);
  },

  getInquiries(): Inquiry[] {
    return safeGet<Inquiry[]>(KEYS.INQUIRIES, []);
  },
  saveInquiries(inquiries: Inquiry[]): void {
    safeSet(KEYS.INQUIRIES, inquiries);
  },

  getWhatsAppTemplates(): WhatsAppTemplate[] {
    return safeGet<WhatsAppTemplate[]>(KEYS.WHATSAPP_TEMPLATES, INITIAL_WHATSAPP_TEMPLATES);
  },
  saveWhatsAppTemplates(templates: WhatsAppTemplate[]): void {
    safeSet(KEYS.WHATSAPP_TEMPLATES, templates);
  },

  getEmailTemplates(): EmailTemplate[] {
    return safeGet<EmailTemplate[]>(KEYS.EMAIL_TEMPLATES, INITIAL_EMAIL_TEMPLATES);
  },
  saveEmailTemplates(templates: EmailTemplate[]): void {
    safeSet(KEYS.EMAIL_TEMPLATES, templates);
  },

  getBanners(): PromotionalBanner[] {
    const stored = safeGet<PromotionalBanner[]>(KEYS.BANNERS, INITIAL_PROMOTIONAL_BANNERS);
    if (!Array.isArray(stored) || stored.length === 0) {
      safeSet(KEYS.BANNERS, INITIAL_PROMOTIONAL_BANNERS);
      return INITIAL_PROMOTIONAL_BANNERS;
    }
    
    // Automatically sanitize and modernize stored banners if containing old/inappropriate images
    let hasChanges = false;
    const sanitized = stored.map((b) => {
      let updated = { ...b };
      if (b.image_url.includes('1522771739844-6a9f6d5f14af') || b.title.includes('Newborn & Maternity')) {
        if (b.image_url.includes('1522771739844-6a9f6d5f14af')) {
          updated.image_url = 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80';
          hasChanges = true;
        }
      }
      if (b.image_url.includes('1497633762265') || b.title.includes('Back-to-School')) {
        if (b.image_url.includes('1497633762265')) {
          updated.image_url = 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80';
          hasChanges = true;
        }
      }
      if (!updated.mobile_image_url) {
        if (updated.title.includes('Back-to-School')) {
          updated.mobile_image_url = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80';
          hasChanges = true;
        } else if (updated.title.includes('Newborn') || updated.title.includes('Maternity')) {
          updated.mobile_image_url = 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80';
          hasChanges = true;
        } else {
          updated.mobile_image_url = updated.image_url;
        }
      }
      if (!updated.placement) {
        updated.placement = 'all';
        hasChanges = true;
      }
      return updated;
    });

    if (hasChanges) {
      safeSet(KEYS.BANNERS, sanitized);
      return sanitized;
    }
    return stored;
  },
  saveBanners(banners: PromotionalBanner[]): void {
    safeSet(KEYS.BANNERS, banners);
  },

  getNotifications(): StockNotificationRequest[] {
    return safeGet<StockNotificationRequest[]>(KEYS.NOTIFICATIONS, []);
  },
  saveNotifications(notifications: StockNotificationRequest[]): void {
    safeSet(KEYS.NOTIFICATIONS, notifications);
  },

  getCommsHistory(): CommunicationLog[] {
    return safeGet<CommunicationLog[]>(KEYS.COMMS_HISTORY, []);
  },
  saveCommsHistory(history: CommunicationLog[]): void {
    safeSet(KEYS.COMMS_HISTORY, history);
  },

  getRecentlyViewed(): string[] {
    return safeGet<string[]>(KEYS.RECENTLY_VIEWED, []);
  },
  addRecentlyViewed(productId: string): void {
    const list = safeGet<string[]>(KEYS.RECENTLY_VIEWED, []);
    const filtered = list.filter((id) => id !== productId);
    filtered.unshift(productId);
    safeSet(KEYS.RECENTLY_VIEWED, filtered.slice(0, 10));
  },

  getAuthUser(): Customer | null {
    return safeGet<Customer | null>(KEYS.AUTH_USER, null);
  },
  saveAuthUser(user: Customer | null): void {
    safeSet(KEYS.AUTH_USER, user);
  },

  resetToDefault(): void {
    localStorage.clear();
    window.location.reload();
  },
};
