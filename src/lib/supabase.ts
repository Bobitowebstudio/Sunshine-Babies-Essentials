import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Sanitizes the Supabase project URL by removing trailing slashes,
 * quotes, and accidental endpoint paths (e.g. /rest/v1 or /auth/v1)
 * that cause PostgREST 'Invalid path specified in request URI' (PGRST126) errors.
 */
function sanitizeSupabaseUrl(rawUrl: string | undefined): string {
  if (!rawUrl) return '';
  const clean = rawUrl.trim().replace(/^['"]+|['"]+$/g, '').trim();
  if (!clean) return '';
  try {
    const parsed = new URL(clean);
    // Origin cleanly isolates protocol + hostname + port (e.g. https://xyz.supabase.co)
    return parsed.origin;
  } catch {
    return clean.replace(/\/rest\/v1\/?$/i, '').replace(/\/auth\/v1\/?$/i, '').replace(/\/+$/, '');
  }
}

function sanitizeSupabaseKey(rawKey: string | undefined): string {
  if (!rawKey) return '';
  return rawKey.trim().replace(/^['"]+|['"]+$/g, '').trim();
}

// Read and sanitize Supabase credentials from Vite environment
const rawUrl = (import.meta.env?.VITE_SUPABASE_URL as string | undefined) || '';
const rawKey =
  (import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  '';

export const supabaseUrl = sanitizeSupabaseUrl(rawUrl);
export const supabasePublishableKey = sanitizeSupabaseKey(rawKey);

// Validate that environment variables are non-placeholder and properly formed
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl !== 'YOUR_SUPABASE_PROJECT_URL' &&
  supabasePublishableKey !== 'YOUR_SUPABASE_PUBLISHABLE_KEY'
);

let supabaseClient: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    supabaseClient = null;
  }
} else if (import.meta.env?.DEV) {
  // Development advisory message - without exposing any sensitive tokens
  console.info(
    'ℹ️ Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY) are not configured yet in .env.local.'
  );
}

/**
 * Returns the central Supabase client instance or throws a helpful configuration error.
 */
export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    throw new Error(
      'Supabase environment variables have not been configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env.local file.'
    );
  }
  return supabaseClient;
}

export const supabase = supabaseClient;

/**
 * Complete, production-ready PostgreSQL Schema for Sunshine Babies Essentials Supabase Database
 */
export function generateSupabaseSQL(): string {
  return `-- ==========================================================
-- SUNSHINE BABIES ESSENTIALS - SUPABASE PRODUCTION DATABASE SCHEMA
-- Relational Schema with Foreign Keys, Storage Bucket & Strict RLS Policies
-- ==========================================================

-- Enable pgcrypto / uuid extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 0. ADMIN USERS TABLE (Authorized Store Administrators)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT 'Sunshine Babies Administrator',
    role TEXT NOT NULL DEFAULT 'super_admin',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Seed the single authorized store administrator email
INSERT INTO public.admin_users (email, full_name, role)
VALUES 
    ('info@sunshinebabies.com', 'Sunshine Babies Admin', 'super_admin')
ON CONFLICT (email) DO UPDATE SET is_active = true;

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    icon TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    regular_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    compare_at_price NUMERIC(12, 2),
    discount_price NUMERIC(12, 2),
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    age_group TEXT NOT NULL DEFAULT 'All Ages',
    image_url TEXT,
    additional_images TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    stock_quantity INT NOT NULL DEFAULT 0,
    sku TEXT,
    brand TEXT DEFAULT 'Sunshine Babies Essentials',
    subcategory TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    is_out_of_stock BOOLEAN DEFAULT false,
    rating NUMERIC(2,1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    attributes JSONB DEFAULT '{}'::jsonb,
    related_product_ids TEXT[] DEFAULT '{}',
    frequently_bought_together_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    order_notes TEXT,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    discount_code TEXT,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'whatsapp',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_reference TEXT,
    payment_channel TEXT,
    paid_at TIMESTAMPTZ,
    order_status TEXT NOT NULL DEFAULT 'Pending',
    notes TEXT,
    tracking_number TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 5. ORDER_ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    quantity INT NOT NULL DEFAULT 1,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    sku TEXT,
    image_url TEXT,
    age_group TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 6. CUSTOMER_INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.customer_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New',
    response_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 7. STORE_SETTINGS TABLE (Company & Abuja location details)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    business_name TEXT NOT NULL DEFAULT 'Sunshine Babies Essentials',
    tagline TEXT DEFAULT 'Your baby’s comfort is our biggest priority.',
    about_us TEXT,
    phone TEXT NOT NULL DEFAULT '+234 903 466 5968',
    whatsapp TEXT NOT NULL DEFAULT '+234 903 466 5968',
    email TEXT NOT NULL DEFAULT 'info@sunshinebabies.com',
    support_email TEXT DEFAULT 'info@sunshinebabies.com',
    city TEXT NOT NULL DEFAULT 'Abuja',
    state TEXT NOT NULL DEFAULT 'FCT',
    country TEXT NOT NULL DEFAULT 'Nigeria',
    address TEXT,
    latitude NUMERIC DEFAULT 9.0765,
    longitude NUMERIC DEFAULT 7.3986,
    google_maps_url TEXT DEFAULT 'https://maps.google.com/?q=Abuja,+FCT,+Nigeria',
    opening_hours TEXT DEFAULT 'Mon - Sat: 8:00 AM - 6:00 PM, Sun: Closed',
    logo_url TEXT DEFAULT '/logo.png',
    favicon_url TEXT DEFAULT '/favicon.png',
    currency_symbol TEXT DEFAULT '₦',
    currency_code TEXT DEFAULT 'NGN',
    instagram_url TEXT DEFAULT 'https://instagram.com/sunshinebabiesessentials',
    facebook_url TEXT DEFAULT 'https://facebook.com/sunshinebabiesessentials',
    tiktok_url TEXT DEFAULT 'https://tiktok.com/@sunshinebabiesessentials',
    bank_name TEXT DEFAULT 'Guaranty Trust Bank (GTBank)',
    account_name TEXT DEFAULT 'SUNSHINE BABIES ESSENTIALS ENTERPRISE',
    account_number TEXT DEFAULT '0123456789',
    partner_name TEXT DEFAULT 'Binna''s Logistics Global',
    partner_type TEXT DEFAULT 'China Sourcing & Logistics Partner',
    partner_description TEXT DEFAULT 'Our trusted partner for sourcing and logistics from China.',
    partner_website TEXT DEFAULT 'https://binnaslogisticsglobal.com.ng',
    partner_logo TEXT DEFAULT '/binnas.jpeg',
    show_partner_section BOOLEAN DEFAULT true,
    homepage_about_heading TEXT DEFAULT 'Sunshine Babies Essentials',
    homepage_about_badge TEXT DEFAULT 'ABOUT US',
    homepage_about_description TEXT DEFAULT 'Sunshine Babies Essentials is dedicated to providing quality baby and maternity essentials carefully selected with the comfort, safety and needs of mothers and babies in mind.',
    homepage_about_description_2 TEXT DEFAULT 'Our goal is to make shopping for your little one easier by bringing together trusted baby products, maternity essentials and everyday necessities in one convenient place.',
    homepage_about_image TEXT DEFAULT 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1000&q=80',
    homepage_about_button_text TEXT DEFAULT 'Learn More About Us',
    homepage_about_link TEXT DEFAULT '/about',
    show_homepage_about BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 8. MESSAGE_TEMPLATES TABLE (WhatsApp & Email automations)
CREATE TABLE IF NOT EXISTS public.message_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    channel TEXT NOT NULL, -- 'WhatsApp' or 'Email'
    subject TEXT,
    message TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 9. DELIVERY_LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.delivery_locations (
    id TEXT PRIMARY KEY,
    state TEXT NOT NULL,
    city_area TEXT NOT NULL,
    fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    estimated_days TEXT DEFAULT '1 - 3 Business Days',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 10. PROMOTIONAL_BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.promotional_banners (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    badge_text TEXT,
    button_text TEXT DEFAULT 'Shop Now',
    link_url TEXT NOT NULL,
    image_url TEXT NOT NULL,
    bg_color TEXT DEFAULT 'from-amber-950/80 via-slate-950/85 to-black',
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotional_banners ENABLE ROW LEVEL SECURITY;

-- Helper function to check if auth caller is the designated authorized admin (info@sunshinebabies.com)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    lower(auth.jwt() ->> 'email') = 'info@sunshinebabies.com' AND (
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin' OR
      (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
      EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE (auth_user_id = auth.uid() OR lower(email) = 'info@sunshinebabies.com')
          AND is_active = true
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin Users policies
CREATE POLICY "Admins can view admin users" ON public.admin_users FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can manage admin users" ON public.admin_users FOR ALL USING (public.is_admin());

-- Category policies
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admins can manage categories" ON public.categories FOR ALL USING (public.is_admin());

-- Product policies
CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Only admins can manage products" ON public.products FOR ALL USING (public.is_admin());

-- Customer policies
CREATE POLICY "Customers can view their own profile, admins view all" ON public.customers FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can create or update their customer profile" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own customer profile, admins update any" ON public.customers FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Orders policies
CREATE POLICY "Customers view their own orders, admins view all" ON public.orders FOR SELECT USING (auth.uid() = customer_id OR public.is_admin());
CREATE POLICY "Public can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can update order status and details" ON public.orders FOR UPDATE USING (public.is_admin());

-- Order items policies
CREATE POLICY "Customers view items of their orders, admins view all" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.customer_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Public can insert order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can manage order items" ON public.order_items FOR ALL USING (public.is_admin());

-- Customer inquiries policies
CREATE POLICY "Public can submit customer inquiries" ON public.customer_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view and resolve inquiries" ON public.customer_inquiries FOR ALL USING (public.is_admin());

-- Store settings policies
CREATE POLICY "Public can view store settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can update store settings" ON public.store_settings FOR ALL USING (public.is_admin());

-- Message templates policies
CREATE POLICY "Only admins can view and manage message templates" ON public.message_templates FOR ALL USING (public.is_admin());

-- Delivery location policies
CREATE POLICY "Public can view active delivery locations" ON public.delivery_locations FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Only admins can manage delivery locations" ON public.delivery_locations FOR ALL USING (public.is_admin());

-- Promotional banners policies
CREATE POLICY "Public can view active banners" ON public.promotional_banners FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Only admins can manage banners" ON public.promotional_banners FOR ALL USING (public.is_admin());

-- ==========================================================
-- STORAGE BUCKET CREATION (Supabase Storage for Images)
-- ==========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Access to product-images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Allow Uploads to product-images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow Updates to product-images" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-images');
`;
}

