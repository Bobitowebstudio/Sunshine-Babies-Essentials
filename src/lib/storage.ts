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
  INITIAL_DELIVERY_LOCATIONS,
  INITIAL_EMAIL_TEMPLATES,
  INITIAL_PROMOTIONAL_BANNERS,
  INITIAL_WHATSAPP_TEMPLATES,
} from './constants';

const KEYS = {
  PRODUCTS: 'babystore_products_v10_clean_catalog',
  CATEGORIES: 'babystore_categories_v10_clean',
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
    const stored = safeGet<Product[]>(KEYS.PRODUCTS, []);
    return Array.isArray(stored) ? stored : [];
  },
  saveProducts(products: Product[]): void {
    safeSet(KEYS.PRODUCTS, products);
  },

  getCategories(): Category[] {
    const stored = safeGet<Category[]>(KEYS.CATEGORIES, []);
    return Array.isArray(stored) ? stored : [];
  },
  saveCategories(categories: Category[]): void {
    safeSet(KEYS.CATEGORIES, categories);
  },

  getSettings(): CompanySettings {
    const settings = safeGet<CompanySettings>(KEYS.SETTINGS, DEFAULT_COMPANY_SETTINGS);
    if (!settings) return { ...DEFAULT_COMPANY_SETTINGS };
    return {
      ...DEFAULT_COMPANY_SETTINGS,
      ...settings,
    };
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
    return safeGet<PromotionalBanner[]>(KEYS.BANNERS, []);
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




