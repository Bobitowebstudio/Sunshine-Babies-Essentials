import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { StorageService } from '../lib/storage';
import {
  ActivePage,
  AdminTab,
  AdminUser,
  AgeGroup,
  CartItem,
  Category,
  CommunicationLog,
  CompanySettings,
  Customer,
  DeliveryLocation,
  EmailTemplate,
  Inquiry,
  InquiryStatus,
  MessageTemplate,
  Order,
  OrderStatus,
  PaymentStatus,
  Product,
  PromotionalBanner,
  StockNotificationRequest,
  WhatsAppTemplate,
} from '../types';
import { generateOrderNumber } from '../lib/utils';
import { SupabaseService } from '../lib/supabaseService';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface StoreContextType {
  // Data
  products: Product[];
  categories: Category[];
  companySettings: CompanySettings;
  deliveryLocations: DeliveryLocation[];
  orders: Order[];
  customers: Customer[];
  inquiries: Inquiry[];
  whatsappTemplates: WhatsAppTemplate[];
  emailTemplates: EmailTemplate[];
  banners: PromotionalBanner[];
  notifications: StockNotificationRequest[];
  commsHistory: CommunicationLog[];
  cart: CartItem[];
  recentlyViewed: Product[];
  currentUser: Customer | null;
  setCurrentUser: (user: Customer | null) => void;

  // Supabase status & sync
  isSupabaseConfigured: boolean;
  supabaseSyncStatus: 'connected' | 'disconnected' | 'syncing' | 'error';
  syncAllToSupabase: () => Promise<{ success: boolean; message: string; counts?: any }>;
  uploadProductImage: (file: File) => Promise<string>;
  uploadBrandingImage: (file: File, assetType?: 'logo' | 'favicon' | 'partner' | 'hero' | 'about' | 'branding') => Promise<{ success: boolean; url: string; error?: string }>;

  // View state
  activePage: ActivePage;
  adminTab: AdminTab;
  isAdmin: boolean;
  isAuthorizedAdmin: boolean;
  isAdminChecking: boolean;
  currentAdminUser: AdminUser | null;
  isCartOpen: boolean;
  selectedProductId: string | null;
  selectedCategory: string | null;
  selectedAgeGroup: AgeGroup | 'All';
  searchQuery: string;
  notifyProduct: Product | null;
  quickViewProduct: Product | null;
  currentOrder: Order | null;
  navigationParams: any;

  // Setters & Navigators
  navigateTo: (page: ActivePage, options?: { productId?: string; categoryId?: string; order?: Order; tab?: AdminTab; params?: any }) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setAdminTab: (tab: AdminTab) => void;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;
  checkAdminAuthorization: () => Promise<boolean>;
  setIsCartOpen: (isOpen: boolean) => void;
  setSelectedCategory: (cat: string | null) => void;
  setSelectedAgeGroup: (age: AgeGroup | 'All') => void;
  setSearchQuery: (query: string) => void;
  setNotifyProduct: (p: Product | null) => void;
  setQuickViewProduct: (p: Product | null) => void;

  // Cart operations
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;

  // Order operations
  createOrder: (
    orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'> & { order_number?: string },
    options?: { clearCart?: boolean }
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus, reference?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;

  // Product CRUD
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  duplicateProduct: (productId: string) => void;

  // Category CRUD
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;

  // Delivery CRUD
  addDeliveryLocation: (location: Omit<DeliveryLocation, 'id'>) => void;
  updateDeliveryLocation: (location: DeliveryLocation) => void;
  deleteDeliveryLocation: (locationId: string) => void;

  // Settings & Inquiries
  updateCompanySettings: (settings: CompanySettings) => Promise<{ success: boolean; error?: string; data?: CompanySettings }>;
  submitInquiry: (inquiry: Omit<Inquiry, 'id' | 'created_at' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: InquiryStatus, notes?: string) => void;

  // Templates & Banners
  updateWhatsAppTemplate: (template: WhatsAppTemplate) => void;
  addWhatsAppTemplate: (template: Omit<WhatsAppTemplate, 'id'>) => void;
  deleteWhatsAppTemplate: (id: string) => void;
  updateEmailTemplate: (template: EmailTemplate) => void;
  addEmailTemplate: (template: Omit<EmailTemplate, 'id'>) => void;
  deleteEmailTemplate: (id: string) => void;
  addBanner: (banner: Omit<PromotionalBanner, 'id'>) => void;
  updateBanner: (banner: PromotionalBanner) => void;
  deleteBanner: (id: string) => void;

  // Notification Requests
  requestStockNotification: (req: Omit<StockNotificationRequest, 'id' | 'created_at' | 'is_notified'>) => void;
  markNotificationSent: (id: string) => void;

  // Communication Log
  logCommunication: (log: Omit<CommunicationLog, 'id' | 'timestamp'>) => void;

  // Auth
  loginCustomer: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerCustomer: (
    name: string,
    email: string,
    phone: string,
    password?: string
  ) => Promise<{ success: boolean; requiresEmailConfirmation?: boolean; error?: string }>;
  logoutCustomer: () => Promise<void>;
  customerLogout: () => Promise<void>;
  updateCustomerProfile: (customer: Customer) => Promise<boolean>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Storage states with immediate local cache initialization
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => StorageService.getSettings());
  const [deliveryLocations, setDeliveryLocations] = useState<DeliveryLocation[]>(() => StorageService.getDeliveryLocations());
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [customers, setCustomers] = useState<Customer[]>(() => StorageService.getCustomers());
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => StorageService.getInquiries());
  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplate[]>(() => StorageService.getWhatsAppTemplates());
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(() => StorageService.getEmailTemplates());
  const [banners, setBanners] = useState<PromotionalBanner[]>(() => StorageService.getBanners());
  const [notifications, setNotifications] = useState<StockNotificationRequest[]>(() => StorageService.getNotifications());
  const [commsHistory, setCommsHistory] = useState<CommunicationLog[]>(() => StorageService.getCommsHistory());
  const [currentUser, setCurrentUser] = useState<Customer | null>(() => StorageService.getAuthUser());

  // Supabase sync status
  const [supabaseSyncStatus, setSupabaseSyncStatus] = useState<'connected' | 'disconnected' | 'syncing' | 'error'>(
    isSupabaseConfigured ? 'connected' : 'disconnected'
  );

  // App UI State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('babystore_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => StorageService.getRecentlyViewed());
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState<boolean>(false);
  const [isAdminChecking, setIsAdminChecking] = useState<boolean>(true);
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notifyProduct, setNotifyProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [navigationParams, setNavigationParams] = useState<any>(null);

  // Initial Load & Synchronize from Supabase
  useEffect(() => {
    let isMounted = true;

    async function loadFromSupabase() {
      try {
        // Check current session for authorized admin status
        if (isSupabaseConfigured && supabase) {
          const currentAdmin = await SupabaseService.getCurrentAuthAdmin();
          if (isMounted) {
            if (currentAdmin) {
              setIsAuthorizedAdmin(true);
              setCurrentAdminUser(currentAdmin);
              setIsAdmin(true);
            } else {
              setIsAuthorizedAdmin(false);
              setCurrentAdminUser(null);
              setIsAdmin(false);
            }
          }
        }
      } catch (err) {
        console.warn('Admin session check error:', err);
      } finally {
        if (isMounted) setIsAdminChecking(false);
      }

      if (!isSupabaseConfigured) return;

      try {
        // 1. Load Products from Supabase
        const remoteProducts = await SupabaseService.fetchProducts();
        if (isMounted && remoteProducts && remoteProducts.length > 0) {
          setProducts(remoteProducts);
          StorageService.saveProducts(remoteProducts);
        }

        // 2. Load Categories from Supabase
        const remoteCategories = await SupabaseService.fetchCategories();
        if (isMounted && remoteCategories && remoteCategories.length > 0) {
          setCategories(remoteCategories);
          StorageService.saveCategories(remoteCategories);
        }

        // 3. Load Store Settings from Supabase
        const remoteSettings = await SupabaseService.fetchStoreSettings();
        if (isMounted && remoteSettings) {
          setCompanySettings(remoteSettings);
          StorageService.saveSettings(remoteSettings);
        }

        // 4. Load Orders from Supabase
        const remoteOrders = await SupabaseService.fetchOrders();
        if (isMounted && remoteOrders && remoteOrders.length > 0) {
          setOrders(remoteOrders);
          StorageService.saveOrders(remoteOrders);
        }

        // 5. Load Inquiries from Supabase
        const remoteInquiries = await SupabaseService.fetchInquiries();
        if (isMounted && remoteInquiries && remoteInquiries.length > 0) {
          setInquiries(remoteInquiries);
          StorageService.saveInquiries(remoteInquiries);
        }

        // 6. Load Message Templates from Supabase
        const remoteTemplates = await SupabaseService.fetchMessageTemplates();
        if (isMounted && remoteTemplates) {
          if (remoteTemplates.whatsapp.length > 0) {
            setWhatsappTemplates(remoteTemplates.whatsapp);
            StorageService.saveWhatsAppTemplates(remoteTemplates.whatsapp);
          }
          if (remoteTemplates.email.length > 0) {
            setEmailTemplates(remoteTemplates.email);
            StorageService.saveEmailTemplates(remoteTemplates.email);
          }
        }

        // 7. Load Customers from Supabase
        const remoteCustomers = await SupabaseService.fetchCustomers();
        if (isMounted && remoteCustomers && remoteCustomers.length > 0) {
          setCustomers(remoteCustomers);
          StorageService.saveCustomers(remoteCustomers);
        }

        // 8. Restore Current Authenticated Customer Profile
        const currentAuthCustomer = await SupabaseService.getCurrentAuthCustomer();
        if (isMounted && currentAuthCustomer) {
          setCurrentUser(currentAuthCustomer);
          StorageService.saveAuthUser(currentAuthCustomer);
        }

        // 9. Load Delivery Locations from Supabase
        const remoteDelivery = await SupabaseService.fetchDeliveryLocations();
        if (isMounted && remoteDelivery && remoteDelivery.length > 0) {
          setDeliveryLocations(remoteDelivery);
          StorageService.saveDeliveryLocations(remoteDelivery);
        }

        if (isMounted) {
          setSupabaseSyncStatus('connected');
        }
      } catch (err) {
        console.warn('Supabase initial fetch failed, retaining persistent offline cache:', err);
        if (isMounted) setSupabaseSyncStatus('error');
      }
    }

    loadFromSupabase();

    // Listen to Supabase Auth state changes
    let authUnsubscribe: (() => void) | undefined;
    if (isSupabaseConfigured && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') && session?.user) {
          const profile = await SupabaseService.getCurrentAuthCustomer();
          if (isMounted && profile) {
            setCurrentUser(profile);
            StorageService.saveAuthUser(profile);
          }

          // Check admin authorization (strictly info@sunshinebabies.com)
          const authCheck = await SupabaseService.verifyIsAdminUser(session.user);
          if (isMounted) {
            if (authCheck.isAuthorized && authCheck.adminUser) {
              setIsAuthorizedAdmin(true);
              setCurrentAdminUser(authCheck.adminUser);
              setIsAdmin(true);
            } else {
              setIsAuthorizedAdmin(false);
              setCurrentAdminUser(null);
              setIsAdmin(false);
              // Handle routing for unauthorized session on admin path
              const currentPath = window.location.pathname.replace(/\/+$/, '');
              if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
                if (!profile && currentPath !== '/admin/login') {
                  window.history.replaceState({}, '', '/admin/login');
                  setActivePage('admin-login');
                } else if (profile) {
                  setActivePage('admin');
                }
              }
            }
          }
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setCurrentUser(null);
            StorageService.saveAuthUser(null);
            setIsAuthorizedAdmin(false);
            setCurrentAdminUser(null);
            setIsAdmin(false);
            const currentPath = window.location.pathname.replace(/\/+$/, '');
            if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
              if (currentPath !== '/admin/login') {
                window.history.replaceState({}, '', '/admin/login');
                setActivePage('admin-login');
              }
            }
          }
        }
      });
      authUnsubscribe = () => authListener?.subscription?.unsubscribe();
    }

    return () => {
      isMounted = false;
      if (authUnsubscribe) authUnsubscribe();
    };
  }, []);

  // URL Route Synchronization for Direct Access, Popstate & Back/Forward Navigation
  useEffect(() => {
    const syncRouteFromPath = () => {
      const p = window.location.pathname.replace(/\/+$/, '') || '/';

      if (p === '/admin/login') {
        setActivePage('admin-login');
      } else if (p === '/admin' || p === '/admin/dashboard') {
        if (isAuthorizedAdmin) {
          setActivePage('admin');
          setAdminTab('overview');
        } else if (currentUser) {
          // Authenticated customer visiting /admin -> Display Access Denied view
          setActivePage('admin');
        } else if (!isAdminChecking) {
          // Logged-out visitor visiting /admin -> Redirect to /admin/login
          window.history.replaceState({}, '', '/admin/login');
          setActivePage('admin-login');
        }
      } else if (p.startsWith('/admin/')) {
        const sub = p.replace('/admin/', '').toLowerCase();
        const tabMap: Record<string, AdminTab> = {
          overview: 'overview',
          products: 'products',
          inventory: 'products',
          orders: 'orders',
          customers: 'customers',
          delivery: 'delivery',
          banners: 'banners',
          promotions: 'promotions',
          inquiries: 'inquiries',
          templates: 'templates',
          settings: 'settings',
        };
        const resolvedTab = tabMap[sub] || 'overview';
        if (isAuthorizedAdmin) {
          setActivePage('admin');
          setAdminTab(resolvedTab);
        } else if (currentUser) {
          setActivePage('admin');
        } else if (!isAdminChecking) {
          window.history.replaceState({}, '', '/admin/login');
          setActivePage('admin-login');
        }
      } else if (p === '/shop') {
        setActivePage('shop');
      } else if (p === '/cart') {
        setActivePage('cart');
      } else if (p === '/checkout') {
        setActivePage('checkout');
      } else if (p === '/order-success') {
        setActivePage('order-success');
      } else if (p === '/track-order') {
        setActivePage('track-order');
      } else if (p === '/account') {
        setActivePage('account');
      } else if (p === '/about') {
        setActivePage('about');
      } else if (p === '/contact') {
        setActivePage('contact');
      } else if (p.startsWith('/product') || p === '/product-detail') {
        setActivePage('product-detail');
      } else {
        setActivePage('home');
      }
    };

    syncRouteFromPath();
    window.addEventListener('popstate', syncRouteFromPath);
    return () => window.removeEventListener('popstate', syncRouteFromPath);
  }, [isAuthorizedAdmin, isAdminChecking]);

  // Sync state to local storage cache for instant offline fallback
  useEffect(() => {
    StorageService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    StorageService.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    StorageService.saveSettings(companySettings);
  }, [companySettings]);

  useEffect(() => {
    StorageService.saveDeliveryLocations(deliveryLocations);
  }, [deliveryLocations]);

  useEffect(() => {
    StorageService.saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    StorageService.saveCustomers(customers);
  }, [customers]);

  useEffect(() => {
    StorageService.saveInquiries(inquiries);
  }, [inquiries]);

  useEffect(() => {
    StorageService.saveWhatsAppTemplates(whatsappTemplates);
  }, [whatsappTemplates]);

  useEffect(() => {
    StorageService.saveEmailTemplates(emailTemplates);
  }, [emailTemplates]);

  useEffect(() => {
    StorageService.saveBanners(banners);
  }, [banners]);

  useEffect(() => {
    StorageService.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    StorageService.saveCommsHistory(commsHistory);
  }, [commsHistory]);

  useEffect(() => {
    StorageService.saveAuthUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('babystore_cart', JSON.stringify(cart));
  }, [cart]);

  // Derived recently viewed products
  const recentlyViewed = useMemo(() => {
    return recentlyViewedIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [recentlyViewedIds, products]);

  // Cart Subtotal calculation with real-time price source of truth
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const currentProduct = products.find((p) => p.id === item.product.id) || item.product;
      const price = currentProduct.discount_price && currentProduct.discount_price > 0 && currentProduct.discount_price < currentProduct.regular_price
        ? currentProduct.discount_price
        : currentProduct.regular_price;
      return sum + price * item.quantity;
    }, 0);
  }, [cart, products]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Navigation Helper
  const navigateTo = (
    page: ActivePage,
    options?: { productId?: string; categoryId?: string; order?: Order; tab?: AdminTab; params?: any }
  ) => {
    let targetPage = page;
    let targetPath = '/';

    if (page === 'admin') {
      if (isAuthorizedAdmin) {
        const tabToUse = options?.tab || adminTab || 'overview';
        setAdminTab(tabToUse);
        targetPath = tabToUse === 'overview' ? '/admin' : `/admin/${tabToUse}`;
      } else if (currentUser) {
        targetPage = 'admin';
        targetPath = '/admin';
      } else {
        targetPage = 'admin-login';
        targetPath = '/admin/login';
      }
    } else if (page === 'admin-login') {
      targetPath = '/admin/login';
    } else if (page === 'home') {
      targetPath = '/';
    } else if (page === 'shop') {
      targetPath = '/shop';
    } else if (page === 'cart') {
      targetPath = '/cart';
    } else if (page === 'checkout') {
      targetPath = '/checkout';
    } else if (page === 'order-success') {
      targetPath = '/order-success';
    } else if (page === 'track-order') {
      targetPath = '/track-order';
    } else if (page === 'account') {
      targetPath = '/account';
    } else if (page === 'about') {
      targetPath = '/about';
    } else if (page === 'contact') {
      targetPath = '/contact';
    } else if (page === 'product' || page === 'product-detail') {
      targetPath = options?.productId ? `/product/${options.productId}` : '/product-detail';
    }

    try {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    } catch {}

    setActivePage(targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (options?.productId) {
      setSelectedProductId(options.productId);
      StorageService.addRecentlyViewed(options.productId);
      setRecentlyViewedIds(StorageService.getRecentlyViewed());
    }
    if (options?.categoryId !== undefined) {
      setSelectedCategory(options.categoryId);
    }
    if (options?.order) {
      setCurrentOrder(options.order);
    }
    if (options?.params || options) {
      setNavigationParams(options?.params || options);
    }
  };

  // Cart operations with stock validation & source of truth checks
  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    // Look up latest stock from products source of truth
    const liveProd = products.find((p) => p.id === product.id) || product;

    if (liveProd.is_active === false || liveProd.stock_quantity <= 0 || liveProd.is_out_of_stock) {
      setNotifyProduct(liveProd);
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === liveProd.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex].quantity = Math.min(newQty, liveProd.stock_quantity);
        updated[existingIndex].product = liveProd; // Update to latest product price/image
        return updated;
      }
      return [...prev, { product: liveProd, quantity: Math.min(quantity, liveProd.stock_quantity), selected_variant: variant }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const liveProd = products.find((p) => p.id === productId) || item.product;
          const maxStock = Math.max(1, liveProd.stock_quantity);
          return { ...item, product: liveProd, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order operations with Supabase persistence
  const createOrder = (
    orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'> & { order_number?: string },
    options?: { clearCart?: boolean }
  ): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      order_number: orderData.order_number || generateOrderNumber(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Update local state immediately
    setOrders((prev) => [newOrder, ...prev]);

    // Decrement stock
    setProducts((prev) =>
      prev.map((p) => {
        const itemInOrder = newOrder.items.find((it) => it.product_id === p.id);
        if (itemInOrder) {
          const remaining = Math.max(0, p.stock_quantity - itemInOrder.quantity);
          const updatedProd = {
            ...p,
            stock_quantity: remaining,
            is_out_of_stock: remaining === 0,
          };
          // Asynchronously update stock in Supabase
          if (isSupabaseConfigured) {
            SupabaseService.upsertProduct(updatedProd);
          }
          return updatedProd;
        }
        return p;
      })
    );

    // Save Customer if not exists
    if (newOrder.customer.email) {
      setCustomers((prev) => {
        const exists = prev.find((c) => c.email.toLowerCase() === newOrder.customer.email.toLowerCase());
        if (exists) {
          return prev.map((c) =>
            c.id === exists.id
              ? {
                  ...c,
                  orders_count: (c.orders_count || 0) + 1,
                  total_spent: (c.total_spent || 0) + newOrder.total_amount,
                }
              : c
          );
        } else {
          const newCust: Customer = {
            id: `cust-${Date.now()}`,
            full_name: newOrder.customer.full_name,
            email: newOrder.customer.email,
            phone: newOrder.customer.phone,
            created_at: new Date().toISOString(),
            addresses: [
              {
                id: `addr-${Date.now()}`,
                title: 'Default Shipping',
                state: newOrder.delivery_location.state,
                city: newOrder.delivery_location.city,
                address: newOrder.delivery_location.address,
                phone: newOrder.customer.phone,
                is_default: true,
                additional_instructions: newOrder.delivery_location.instructions,
              },
            ],
            orders_count: 1,
            total_spent: newOrder.total_amount,
          };
          return [newCust, ...prev];
        }
      });
    }

    // Push to Supabase asynchronously
    if (isSupabaseConfigured) {
      SupabaseService.createOrder(newOrder, products).then((res) => {
        if (res.success && res.id) {
          setOrders((prev) =>
            prev.map((o) => (o.order_number === newOrder.order_number ? { ...o, id: res.id! } : o))
          );
        }
      });
    }

    if (options?.clearCart !== false) {
      clearCart();
    }
    setCurrentOrder(newOrder);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: status, updated_at: new Date().toISOString() } : o))
    );
    if (isSupabaseConfigured) {
      SupabaseService.updateOrderStatus(orderId, status);
    }
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus, reference?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              payment_status: status,
              payment_reference: reference || o.payment_reference,
              paid_at: status === 'paid' ? new Date().toISOString() : o.paid_at,
              updated_at: new Date().toISOString(),
            }
          : o
      )
    );
    if (isSupabaseConfigured) {
      SupabaseService.updatePaymentStatus(orderId, status, reference);
    }
  };

  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId);
  const getOrderByNumber = (orderNumber: string) =>
    orders.find((o) => o.order_number.trim().toLowerCase() === orderNumber.trim().toLowerCase());

  // Product CRUD with Supabase
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      slug: prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);

    if (isSupabaseConfigured) {
      SupabaseService.upsertProduct(newProduct);
    }
  };

  const updateProduct = (updated: Product) => {
    const refined: Product = {
      ...updated,
      is_out_of_stock: updated.stock_quantity <= 0,
      updated_at: new Date().toISOString(),
    };

    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? refined : p))
    );

    if (isSupabaseConfigured) {
      SupabaseService.upsertProduct(refined);
    }
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (isSupabaseConfigured) {
      SupabaseService.deleteProduct(productId);
    }
  };

  const duplicateProduct = (productId: string) => {
    const original = products.find((p) => p.id === productId);
    if (!original) return;
    const duplicated: Product = {
      ...original,
      id: `prod-${Date.now()}`,
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      sku: `${original.sku}-CPY`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProducts((prev) => [duplicated, ...prev]);
    if (isSupabaseConfigured) {
      SupabaseService.upsertProduct(duplicated);
    }
  };

  // Category CRUD with Supabase
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
      slug: catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    };
    setCategories((prev) => [...prev, newCat]);
    if (isSupabaseConfigured) {
      SupabaseService.upsertCategory(newCat);
    }
  };

  const updateCategory = (updated: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (isSupabaseConfigured) {
      SupabaseService.upsertCategory(updated);
    }
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    if (isSupabaseConfigured) {
      SupabaseService.deleteCategory(categoryId);
    }
  };

  // Delivery CRUD
  const addDeliveryLocation = (locData: Omit<DeliveryLocation, 'id'>) => {
    const newLoc: DeliveryLocation = {
      ...locData,
      id: `del-${Date.now()}`,
    };
    setDeliveryLocations((prev) => {
      const updated = [...prev, newLoc];
      StorageService.saveDeliveryLocations(updated);
      return updated;
    });
    if (isSupabaseConfigured) {
      SupabaseService.upsertDeliveryLocation(newLoc);
    }
  };

  const updateDeliveryLocation = (updated: DeliveryLocation) => {
    setDeliveryLocations((prev) => {
      const next = prev.map((l) => (l.id === updated.id ? updated : l));
      StorageService.saveDeliveryLocations(next);
      return next;
    });
    if (isSupabaseConfigured) {
      SupabaseService.upsertDeliveryLocation(updated);
    }
  };

  const deleteDeliveryLocation = (locationId: string) => {
    setDeliveryLocations((prev) => {
      const next = prev.filter((l) => l.id !== locationId);
      StorageService.saveDeliveryLocations(next);
      return next;
    });
    if (isSupabaseConfigured) {
      SupabaseService.deleteDeliveryLocation(locationId);
    }
  };

  // Settings & Inquiries with Supabase
  const saveSettingsSeqRef = useRef<number>(0);

  const updateCompanySettings = async (
    newSettings: CompanySettings
  ): Promise<{ success: boolean; error?: string; data?: CompanySettings }> => {
    const currentSeq = ++saveSettingsSeqRef.current;
    console.log(`[StoreContext] Initiating store settings save (seq #${currentSeq})...`);

    // Step A: Immediately persist to local storage backup to eliminate data loss
    setCompanySettings(newSettings);
    StorageService.saveSettings(newSettings);

    // Step B: If Supabase is configured, transmit to cloud database and verify persistence
    if (isSupabaseConfigured) {
      try {
        const result = await SupabaseService.updateStoreSettings(newSettings);

        // Race condition check: ensure older request does not overwrite newer state
        if (currentSeq !== saveSettingsSeqRef.current) {
          console.warn(`[StoreContext] Save seq #${currentSeq} superseded by newer seq #${saveSettingsSeqRef.current}. Discarding outdated response.`);
          return { success: true, data: newSettings };
        }

        if (!result.success) {
          console.error('[StoreContext] Supabase Error:', result.error);
          return { success: false, error: result.error || 'Failed to save to database.' };
        }

        // Apply verified readback from Supabase to guarantee exact database alignment
        if (result.data) {
          setCompanySettings(result.data);
          StorageService.saveSettings(result.data);
        }

        return { success: true, data: result.data || newSettings };
      } catch (err: any) {
        console.error('[StoreContext] Save exception:', err);
        return { success: false, error: err?.message || 'Database connection error during save.' };
      }
    } else {
      console.log('[StoreContext] Supabase not configured in .env. Stored configuration saved to local storage.');
      return { success: true, data: newSettings };
    }
  };

  const submitInquiry = (inquiryData: Omit<Inquiry, 'id' | 'created_at' | 'status'>) => {
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      status: 'New',
      created_at: new Date().toISOString(),
    };
    setInquiries((prev) => [newInquiry, ...prev]);

    if (isSupabaseConfigured) {
      SupabaseService.submitInquiry(inquiryData).then((res) => {
        if (res.success && res.id) {
          setInquiries((prev) =>
            prev.map((i) => (i.id === newInquiry.id ? { ...i, id: res.id! } : i))
          );
        }
      });
    }
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus, notes?: string) => {
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === id ? { ...inq, status, response_notes: notes ?? inq.response_notes } : inq
      )
    );
    if (isSupabaseConfigured) {
      SupabaseService.updateInquiryStatus(id, status, notes);
    }
  };

  // Templates & Banners
  const updateWhatsAppTemplate = (tmpl: WhatsAppTemplate) => {
    setWhatsappTemplates((prev) => prev.map((t) => (t.id === tmpl.id ? tmpl : t)));
    if (isSupabaseConfigured) {
      SupabaseService.upsertMessageTemplate({
        id: tmpl.id,
        name: tmpl.name,
        channel: 'WhatsApp',
        message: tmpl.template_text,
        is_active: tmpl.is_active,
      });
    }
  };

  const addWhatsAppTemplate = (tmpl: Omit<WhatsAppTemplate, 'id'>) => {
    const newTmpl: WhatsAppTemplate = { ...tmpl, id: `wt-${Date.now()}` };
    setWhatsappTemplates((prev) => [...prev, newTmpl]);
    if (isSupabaseConfigured) {
      SupabaseService.upsertMessageTemplate({
        id: newTmpl.id,
        name: newTmpl.name,
        channel: 'WhatsApp',
        message: newTmpl.template_text,
        is_active: newTmpl.is_active,
      });
    }
  };

  const deleteWhatsAppTemplate = (id: string) => {
    setWhatsappTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const updateEmailTemplate = (tmpl: EmailTemplate) => {
    setEmailTemplates((prev) => prev.map((t) => (t.id === tmpl.id ? tmpl : t)));
    if (isSupabaseConfigured) {
      SupabaseService.upsertMessageTemplate({
        id: tmpl.id,
        name: tmpl.name,
        channel: 'Email',
        subject: tmpl.subject,
        message: tmpl.body_html,
        is_active: tmpl.is_active,
      });
    }
  };

  const addEmailTemplate = (tmpl: Omit<EmailTemplate, 'id'>) => {
    const newTmpl: EmailTemplate = { ...tmpl, id: `et-${Date.now()}` };
    setEmailTemplates((prev) => [...prev, newTmpl]);
    if (isSupabaseConfigured) {
      SupabaseService.upsertMessageTemplate({
        id: newTmpl.id,
        name: newTmpl.name,
        channel: 'Email',
        subject: newTmpl.subject,
        message: newTmpl.body_html,
        is_active: newTmpl.is_active,
      });
    }
  };

  const deleteEmailTemplate = (id: string) => {
    setEmailTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const addBanner = (bData: Omit<PromotionalBanner, 'id'>) => {
    setBanners((prev) => [...prev, { ...bData, id: `ban-${Date.now()}` }]);
  };

  const updateBanner = (updated: PromotionalBanner) => {
    setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  // Stock Notifications
  const requestStockNotification = (req: Omit<StockNotificationRequest, 'id' | 'created_at' | 'is_notified'>) => {
    const newReq: StockNotificationRequest = {
      ...req,
      id: `notif-${Date.now()}`,
      created_at: new Date().toISOString(),
      is_notified: false,
    };
    setNotifications((prev) => [newReq, ...prev]);
  };

  const markNotificationSent = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_notified: true } : n)));
  };

  // Communication Log
  const logCommunication = (logData: Omit<CommunicationLog, 'id' | 'timestamp'>) => {
    const entry: CommunicationLog = {
      ...logData,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setCommsHistory((prev) => [entry, ...prev]);
  };

  // Auth operations
  const loginCustomer = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const res = await SupabaseService.signInCustomer(email, password || '');
    if (res.success && res.customer) {
      setCurrentUser(res.customer);
      StorageService.saveAuthUser(res.customer);
      setCustomers((prev) => {
        const idx = prev.findIndex((c) => c.email.toLowerCase() === res.customer!.email.toLowerCase());
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = res.customer!;
          return copy;
        }
        return [res.customer!, ...prev];
      });
      return { success: true };
    }
    return { success: false, error: res.error || 'Invalid credentials' };
  };

  const registerCustomer = async (
    name: string,
    email: string,
    phone: string,
    password?: string
  ): Promise<{ success: boolean; requiresEmailConfirmation?: boolean; error?: string }> => {
    const res = await SupabaseService.signUpCustomer(email, password || '', name, phone);
    if (res.success && res.customer) {
      if (!res.requiresEmailConfirmation) {
        setCurrentUser(res.customer);
        StorageService.saveAuthUser(res.customer);
      }
      setCustomers((prev) => {
        const idx = prev.findIndex((c) => c.email.toLowerCase() === res.customer!.email.toLowerCase());
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = res.customer!;
          return copy;
        }
        return [res.customer!, ...prev];
      });
      return {
        success: true,
        requiresEmailConfirmation: res.requiresEmailConfirmation,
      };
    }
    return { success: false, error: res.error || 'Registration failed' };
  };

  const logoutCustomer = async () => {
    await SupabaseService.signOutCustomer();
    setCurrentUser(null);
    StorageService.saveAuthUser(null);
  };

  // Administrator Authentication & Authorisation Handlers
  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const res = await SupabaseService.signInAdmin(email, password);
    if (res.success && res.adminUser) {
      setIsAuthorizedAdmin(true);
      setCurrentAdminUser(res.adminUser);
      setIsAdmin(true);
      navigateTo('admin');
      return { success: true };
    }
    return { success: false, error: res.error || 'Authentication failed. Please check administrator credentials.' };
  };

  const adminLogout = async () => {
    await SupabaseService.signOutCustomer();
    setIsAuthorizedAdmin(false);
    setCurrentAdminUser(null);
    setIsAdmin(false);
    navigateTo('admin-login');
  };

  const checkAdminAuthorization = async (): Promise<boolean> => {
    const current = await SupabaseService.getCurrentAuthAdmin();
    if (current) {
      setIsAuthorizedAdmin(true);
      setCurrentAdminUser(current);
      setIsAdmin(true);
      return true;
    }
    setIsAuthorizedAdmin(false);
    setCurrentAdminUser(null);
    setIsAdmin(false);
    return false;
  };

  const updateCustomerProfile = async (updated: Customer): Promise<boolean> => {
    setCurrentUser(updated);
    StorageService.saveAuthUser(updated);
    setCustomers((prev) => prev.map((c) => (c.id === updated.id || c.email === updated.email ? updated : c)));
    if (isSupabaseConfigured) {
      return await SupabaseService.upsertCustomer(updated);
    }
    return true;
  };

  // One-click manual full database sync to Supabase
  const syncAllToSupabase = async () => {
    setSupabaseSyncStatus('syncing');
    const result = await SupabaseService.syncInitialDataToSupabase(
      products,
      categories,
      companySettings,
      deliveryLocations,
      whatsappTemplates,
      emailTemplates
    );

    if (result.success) {
      setSupabaseSyncStatus('connected');
      return {
        success: true,
        message: `Successfully synchronized ${result.syncedCounts.products} products, ${result.syncedCounts.categories} categories, store settings, and ${result.syncedCounts.templates} message templates to Supabase!`,
        counts: result.syncedCounts,
      };
    } else {
      setSupabaseSyncStatus('error');
      return {
        success: false,
        message: result.error || 'Failed to sync to Supabase.',
      };
    }
  };

  const uploadProductImage = async (file: File): Promise<string> => {
    return SupabaseService.uploadProductImage(file);
  };

  const uploadBrandingImage = async (
    file: File,
    assetType: 'logo' | 'favicon' | 'partner' | 'hero' | 'about' | 'branding' = 'branding'
  ): Promise<{ success: boolean; url: string; error?: string }> => {
    return SupabaseService.uploadBrandingImage(file, assetType);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        companySettings,
        deliveryLocations,
        orders,
        customers,
        inquiries,
        whatsappTemplates,
        emailTemplates,
        banners,
        notifications,
        commsHistory,
        cart,
        recentlyViewed,
        currentUser,
        setCurrentUser,
        isSupabaseConfigured,
        supabaseSyncStatus,
        syncAllToSupabase,
        uploadProductImage,
        uploadBrandingImage,
        activePage,
        adminTab,
        isAdmin: isAuthorizedAdmin,
        isAuthorizedAdmin,
        isAdminChecking,
        currentAdminUser,
        isCartOpen,
        selectedProductId,
        selectedCategory,
        selectedAgeGroup,
        searchQuery,
        notifyProduct,
        quickViewProduct,
        currentOrder,
        navigationParams,
        navigateTo,
        setIsAdmin,
        setAdminTab,
        adminLogin,
        adminLogout,
        checkAdminAuthorization,
        setIsCartOpen,
        setSelectedCategory,
        setSelectedAgeGroup,
        setSearchQuery,
        setNotifyProduct,
        setQuickViewProduct,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartItemCount,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        getOrderById,
        getOrderByNumber,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addDeliveryLocation,
        updateDeliveryLocation,
        deleteDeliveryLocation,
        updateCompanySettings,
        submitInquiry,
        updateInquiryStatus,
        updateWhatsAppTemplate,
        addWhatsAppTemplate,
        deleteWhatsAppTemplate,
        updateEmailTemplate,
        addEmailTemplate,
        deleteEmailTemplate,
        addBanner,
        updateBanner,
        deleteBanner,
        requestStockNotification,
        markNotificationSent,
        logCommunication,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        customerLogout: logoutCustomer,
        updateCustomerProfile,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

