export type AgeGroup =
  | '0-3 Months'
  | '3-6 Months'
  | '6-12 Months'
  | '1-3 Years'
  | '3-5 Years'
  | '5-7 Years'
  | '7-10 Years'
  | '10-12 Years'
  | 'Maternity'
  | 'Other'
  | 'All Ages';

export const AGE_GROUP_FILTER_OPTIONS: readonly (AgeGroup | 'All')[] = [
  'All',
  '0-3 Months',
  '3-6 Months',
  '6-12 Months',
  '1-3 Years',
  '3-5 Years',
  '5-7 Years',
  '7-10 Years',
  '10-12 Years',
] as const;

export const PRODUCT_AGE_GROUP_OPTIONS: readonly AgeGroup[] = [
  '0-3 Months',
  '3-6 Months',
  '6-12 Months',
  '1-3 Years',
  '3-5 Years',
  '5-7 Years',
  '7-10 Years',
  '10-12 Years',
  'Maternity',
  'All Ages',
] as const;

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  is_primary?: boolean;
  angle?: 'main' | 'front' | 'side' | 'back' | 'detail' | 'additional';
}

export interface ProductImageViews {
  main?: string;
  front?: string;
  side?: string;
  back?: string;
  detail?: string;
}

export interface ProductVariantColor {
  name: string;
  hex: string;
}

export interface ProductVariantItem {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  stock?: number;
  color?: string;
  color_hex?: string;
  size?: string;
  age?: string;
  image?: string;
}

export interface ProductVariants {
  sizes?: string[];
  colors?: ProductVariantColor[];
  styles?: string[];
  items?: ProductVariantItem[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  regular_price: number;
  discount_price?: number;
  stock_quantity: number;
  sku: string;
  category_id: string;
  age_group: AgeGroup;
  brand?: string;
  subcategory?: string;
  low_stock_threshold?: number;
  allow_backorders?: boolean;
  images: string[];
  image_views?: ProductImageViews;
  variants?: ProductVariants;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_on_sale?: boolean;
  is_out_of_stock: boolean;
  is_active?: boolean;
  rating?: number;
  reviews_count?: number;
  attributes?: Record<string, string>;
  related_product_ids?: string[];
  frequently_bought_together_ids?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url: string;
  icon?: string;
  is_active: boolean;
  display_order?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected_variant?: string;
}

export interface CustomerAddress {
  id: string;
  title: string;
  state: string;
  city: string;
  address: string;
  phone: string;
  is_default: boolean;
  additional_instructions?: string;
}

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  addresses: CustomerAddress[];
  orders_count?: number;
  total_spent?: number;
  auth_user_id?: string;
}

export interface DeliveryLocation {
  id: string;
  state: string;
  city_area: string;
  fee: number;
  estimated_days: string;
  is_active: boolean;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Ready for Delivery'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus = 'unpaid' | 'pending' | 'pending_verification' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'paystack' | 'paystack_card' | 'bank_transfer' | 'whatsapp' | 'cash_on_delivery';

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  regular_price?: number;
  quantity: number;
  image: string;
  sku: string;
  age_group?: AgeGroup;
}

export interface Order {
  id: string;
  order_number: string;
  customer: {
    customer_id?: string;
    full_name: string;
    email: string;
    phone: string;
  };
  delivery_location: {
    state: string;
    city: string;
    address: string;
    instructions?: string;
  };
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  discount_code?: string;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  payment_reference?: string;
  payment_channel?: string;
  paid_at?: string;
  notes?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export type InquiryStatus = 'New' | 'Contacted' | 'Waiting for Customer' | 'Resolved' | 'Closed';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  source: string;
  created_at: string;
  response_notes?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  type: string;
  template_text: string;
  is_active: boolean;
  is_default?: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  body_html: string;
  is_active: boolean;
}

export interface MessageTemplate {
  id: string;
  name: string;
  channel: 'WhatsApp' | 'Email';
  subject?: string;
  message: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CommunicationLog {
  id: string;
  customer_name: string;
  customer_contact: string;
  channel: 'WhatsApp' | 'Email';
  message: string;
  order_number?: string;
  timestamp: string;
  status: 'Sent' | 'Delivered' | 'Failed' | 'Drafted';
}

export interface CompanySettings {
  business_name: string;
  tagline: string;
  description: string;
  about_us?: string;
  about_story?: string;
  opening_hours?: string;
  logo_url: string;
  favicon_url: string;
  whatsapp_number: string;
  phone: string;
  email: string;
  support_email: string;
  address: string;
  state: string;
  city: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  google_maps_url?: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  twitter_url?: string;
  youtube_url?: string;
  hero_banner_image?: string;
  footer_text?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  currency_symbol: string;
  currency_code: string;
  enable_guest_checkout: boolean;
  enable_whatsapp_orders: boolean;
  enable_low_stock_alerts: boolean;
  low_stock_threshold: number;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  // China Sourcing & Logistics Partner
  partner_name?: string;
  partner_type?: string;
  partner_description?: string;
  partner_website?: string;
  partner_logo?: string;
  show_partner_section?: boolean;
  // Homepage About Us Section
  homepage_about_heading?: string;
  homepage_about_badge?: string;
  homepage_about_description?: string;
  homepage_about_description_2?: string;
  homepage_about_image?: string;
  homepage_about_button_text?: string;
  homepage_about_link?: string;
  show_homepage_about?: boolean;
}

export interface PromotionalBanner {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  badge_text: string;
  button_text: string;
  link_url: string;
  image_url: string;
  mobile_image_url?: string;
  category_id?: string;
  placement?: 'hero' | 'promo_grid' | 'all';
  bg_color?: string;
  is_active: boolean;
  display_order: number;
  start_date?: string;
  end_date?: string;
}

export interface StockNotificationRequest {
  id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  customer_name: string;
  email: string;
  phone: string;
  created_at: string;
  is_notified: boolean;
}

export type ActivePage =
  | 'home'
  | 'shop'
  | 'product'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'account'
  | 'about'
  | 'contact'
  | 'track-order'
  | 'order-success'
  | 'admin'
  | 'admin-login';

export interface AdminUser {
  id: string;
  auth_user_id?: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
  created_at?: string;
}

export type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'delivery'
  | 'banners'
  | 'promotions'
  | 'inquiries'
  | 'templates'
  | 'whatsapp'
  | 'email'
  | 'settings'
  | 'notifications'
  | 'history'
  | 'database';
