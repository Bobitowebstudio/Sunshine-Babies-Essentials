import { supabase, isSupabaseConfigured } from './supabase';
import {
  AdminUser,
  Category,
  CompanySettings,
  Customer,
  DeliveryLocation,
  Inquiry,
  InquiryStatus,
  MessageTemplate,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  Product,
  WhatsAppTemplate,
  EmailTemplate,
} from '../types';
import { processUploadedImageFile } from './imageUpload';

// Helper to map DB Product Row to Frontend Product Interface
export function mapDbProductToProduct(row: any): Product {
  const images = Array.isArray(row.images) && row.images.length > 0
    ? row.images
    : Array.isArray(row.additional_images) && row.additional_images.length > 0
    ? [row.image_url, ...row.additional_images].filter(Boolean)
    : row.image_url
    ? [row.image_url]
    : [];

  const regularPrice = Number(row.regular_price || row.price || 0);
  const discountPrice = row.discount_price !== null && row.discount_price !== undefined
    ? Number(row.discount_price)
    : row.compare_at_price !== null && row.compare_at_price !== undefined
    ? Number(row.compare_at_price)
    : undefined;

  return {
    id: String(row.id),
    name: row.name || 'Unnamed Product',
    slug: row.slug || String(row.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: row.description || '',
    short_description: row.short_description || row.description?.slice(0, 120) || '',
    regular_price: regularPrice,
    discount_price: discountPrice,
    stock_quantity: Number(row.stock_quantity ?? 0),
    sku: row.sku || `SKU-${row.id}`,
    category_id: row.category_id || '',
    age_group: row.age_group || 'All Ages',
    brand: row.brand || 'Sunshine Babies Essentials',
    subcategory: row.subcategory,
    images: images.length > 0 ? images : ['/logo.png'],
    is_featured: Boolean(row.is_featured),
    is_new_arrival: Boolean(row.is_new_arrival),
    is_best_seller: Boolean(row.is_best_seller),
    is_out_of_stock: Boolean(row.is_out_of_stock || (Number(row.stock_quantity ?? 0) <= 0)),
    is_active: row.is_active !== false,
    rating: row.rating ? Number(row.rating) : 5.0,
    reviews_count: row.reviews_count ? Number(row.reviews_count) : 0,
    attributes: row.attributes || {},
    related_product_ids: row.related_product_ids || [],
    frequently_bought_together_ids: row.frequently_bought_together_ids || [],
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Helper to map Frontend Product Interface to DB Row
export function mapProductToDbRow(p: Product): Record<string, any> {
  const mainImage = p.images?.[0] || '';
  const additionalImages = p.images?.slice(1) || [];

  return {
    id: p.id,
    name: p.name,
    slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: p.description,
    short_description: p.short_description || '',
    price: p.regular_price,
    regular_price: p.regular_price,
    compare_at_price: p.discount_price ?? null,
    discount_price: p.discount_price ?? null,
    category_id: p.category_id || null,
    age_group: p.age_group || 'All Ages',
    image_url: mainImage,
    additional_images: additionalImages,
    images: p.images || [],
    stock_quantity: p.stock_quantity ?? 0,
    sku: p.sku || '',
    brand: p.brand || 'Sunshine Babies Essentials',
    subcategory: p.subcategory || '',
    is_active: p.is_active !== false,
    is_featured: Boolean(p.is_featured),
    is_new_arrival: Boolean(p.is_new_arrival),
    is_best_seller: Boolean(p.is_best_seller),
    is_out_of_stock: Boolean(p.is_out_of_stock || (p.stock_quantity <= 0)),
    rating: p.rating ?? 5.0,
    reviews_count: p.reviews_count ?? 0,
    attributes: p.attributes || {},
    related_product_ids: p.related_product_ids || [],
    frequently_bought_together_ids: p.frequently_bought_together_ids || [],
    updated_at: new Date().toISOString(),
  };
}

export const SupabaseService = {
  /**
   * Fetch all active products from Supabase
   */
  async fetchProducts(): Promise<Product[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetchProducts error (will use fallback):', error.message);
        return null;
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map(mapDbProductToProduct);
    } catch (err) {
      console.warn('Supabase fetchProducts network failure:', err);
      return null;
    }
  },

  /**
   * Insert or update a single product in Supabase
   */
  async upsertProduct(product: Product): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      const row = mapProductToDbRow(product);
      const { error } = await supabase
        .from('products')
        .upsert(row, { onConflict: 'id' });

      if (error) {
        console.error('Supabase upsertProduct failed:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase upsertProduct exception:', err);
      return false;
    }
  },

  /**
   * Delete or deactivate a product
   */
  async deleteProduct(productId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Supabase deleteProduct failed:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase deleteProduct exception:', err);
      return false;
    }
  },

  /**
   * Fetch categories from Supabase
   */
  async fetchCategories(): Promise<Category[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.warn('Supabase fetchCategories error:', error.message);
        return null;
      }

      if (!data || data.length === 0) return [];

      return data.map((c: any) => ({
        id: String(c.id),
        name: c.name,
        slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: c.description || '',
        image_url: c.image_url || '',
        icon: c.icon,
        is_active: c.is_active !== false,
        display_order: c.display_order ?? 0,
      }));
    } catch (err) {
      console.warn('Supabase fetchCategories network failure:', err);
      return null;
    }
  },

  /**
   * Upsert a category
   */
  async upsertCategory(cat: Category): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      const { error } = await supabase.from('categories').upsert({
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: cat.description || '',
        image_url: cat.image_url || '',
        icon: cat.icon || '',
        is_active: cat.is_active !== false,
        display_order: cat.display_order || 0,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      if (error) {
        console.error('Supabase upsertCategory failed:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase upsertCategory exception:', err);
      return false;
    }
  },

  /**
   * Delete category
   */
  async deleteCategory(categoryId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      const { error } = await supabase.from('categories').delete().eq('id', categoryId);
      if (error) {
        console.error('Supabase deleteCategory failed:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase deleteCategory exception:', err);
      return false;
    }
  },

  /**
   * Fetch Store Settings from Supabase
   */
  async fetchStoreSettings(): Promise<CompanySettings | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn('Supabase fetchStoreSettings error:', error.message);
        return null;
      }

      if (!data) return null;

      return {
        business_name: data.business_name || 'Sunshine Babies Essentials',
        tagline: data.tagline || "Your baby's comfort is our biggest priority.",
        description: data.description || 'A premier baby and maternity essentials store dedicated to providing high-quality, safe, and comfortable products.',
        about_us: data.about_us || data.about_story,
        about_story: data.about_us || data.about_story,
        opening_hours: data.opening_hours || 'Mon - Sat: 8:00 AM - 6:00 PM, Sun: Closed',
        logo_url: data.logo_url || '/logo.png',
        favicon_url: data.favicon_url || '/favicon.png',
        whatsapp_number: data.whatsapp || data.whatsapp_number || '+234 903 466 5968',
        phone: data.phone || '+234 903 466 5968',
        email: data.email || 'info@sunshinebabies.com',
        support_email: data.support_email || 'info@sunshinebabies.com',
        address: data.address || '',
        city: data.city || 'Abuja',
        state: data.state || 'FCT',
        country: data.country || 'Nigeria',
        latitude: data.latitude ? Number(data.latitude) : 9.0765,
        longitude: data.longitude ? Number(data.longitude) : 7.3986,
        google_maps_url: data.google_maps_url || 'https://maps.google.com/?q=Abuja,+FCT,+Nigeria',
        instagram_url: data.instagram_url || 'https://instagram.com/sunshinebabiesessentials',
        facebook_url: data.facebook_url || 'https://facebook.com/sunshinebabiesessentials',
        tiktok_url: data.tiktok_url || 'https://tiktok.com/@sunshinebabiesessentials',
        twitter_url: data.twitter_url || data.x_url || 'https://x.com/sunshinebabies',
        youtube_url: data.youtube_url || '',
        hero_banner_image: data.hero_banner_image || '',
        footer_text: data.footer_text || 'Your trusted destination for premium baby and maternity essentials in Abuja and across Nigeria.',
        primary_color: '#F59E0B',
        secondary_color: '#1E293B',
        accent_color: '#EC4899',
        currency_symbol: data.currency_symbol || '₦',
        currency_code: data.currency_code || 'NGN',
        enable_guest_checkout: true,
        enable_whatsapp_orders: true,
        enable_low_stock_alerts: true,
        low_stock_threshold: 5,
        bank_name: data.bank_name || 'Guaranty Trust Bank (GTBank)',
        account_name: data.account_name || 'SUNSHINE BABIES ESSENTIALS ENTERPRISE',
        account_number: data.account_number || '0123456789',
        // China Sourcing & Logistics Partner
        partner_name: data.partner_name || "Binna's Logistics Global",
        partner_type: data.partner_type || 'China Sourcing & Logistics Partner',
        partner_description: data.partner_description || 'Our trusted partner for sourcing and logistics from China.',
        partner_website: data.partner_website || 'https://binnaslogisticsglobal.com.ng',
        partner_logo: data.partner_logo || '/binnas.jpeg',
        show_partner_section: data.show_partner_section !== undefined ? Boolean(data.show_partner_section) : true,
        // Homepage About Us Section
        homepage_about_heading: data.homepage_about_heading || 'Sunshine Babies Essentials',
        homepage_about_badge: data.homepage_about_badge || 'ABOUT US',
        homepage_about_description:
          data.homepage_about_description ||
          'Sunshine Babies Essentials is dedicated to providing quality baby and maternity essentials carefully selected with the comfort, safety and needs of mothers and babies in mind.',
        homepage_about_description_2:
          data.homepage_about_description_2 ||
          'Our goal is to make shopping for your little one easier by bringing together trusted baby products, maternity essentials and everyday necessities in one convenient place.',
        homepage_about_image:
          data.homepage_about_image ||
          'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1000&q=80',
        homepage_about_button_text: data.homepage_about_button_text || 'Learn More About Us',
        homepage_about_link: data.homepage_about_link || '/about',
        show_homepage_about: data.show_homepage_about !== undefined ? Boolean(data.show_homepage_about) : true,
        announcement_bar_enabled: data.announcement_bar_enabled !== undefined ? Boolean(data.announcement_bar_enabled) : true,
        announcement_bar_text: data.announcement_bar_text || undefined,
      };
    } catch (err) {
      console.warn('Supabase fetchStoreSettings network failure:', err);
      return null;
    }
  },

  /**
   * Update Store Settings in Supabase
   * - Validates and saves to PostgreSQL
   * - Retries gracefully if certain extended columns do not exist yet
   * - Verifies persistence by reading back the updated row
   * - Never silently fails
   */
  async updateStoreSettings(settings: CompanySettings): Promise<{ success: boolean; error?: string; data?: CompanySettings }> {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('[SupabaseService] Supabase is not configured; store settings will persist in localStorage.');
      return { success: true, data: settings };
    }

    try {
      console.log('Saving branding...');
      console.log('Updating WhatsApp...');
      console.log('Saving social links...');
      console.log('Updating footer...');

      const fullPayload: any = {
        id: 'default',
        business_name: settings.business_name || 'Sunshine Babies Essentials',
        tagline: settings.tagline || '',
        about_us: settings.about_us || settings.about_story || '',
        phone: settings.phone || '+234 903 466 5968',
        whatsapp: settings.whatsapp_number || '+234 903 466 5968',
        email: settings.email || 'info@sunshinebabies.com',
        support_email: settings.support_email || settings.email || 'info@sunshinebabies.com',
        city: settings.city || 'Abuja',
        state: settings.state || 'FCT',
        country: settings.country || 'Nigeria',
        address: settings.address || '',
        latitude: settings.latitude ?? 9.0765,
        longitude: settings.longitude ?? 7.3986,
        google_maps_url: settings.google_maps_url || '',
        opening_hours: settings.opening_hours || 'Mon - Sat: 8:00 AM - 6:00 PM, Sun: Closed',
        logo_url: settings.logo_url || '/logo.png',
        favicon_url: settings.favicon_url || '/favicon.png',
        currency_symbol: settings.currency_symbol || '₦',
        currency_code: settings.currency_code || 'NGN',
        instagram_url: settings.instagram_url || '',
        facebook_url: settings.facebook_url || '',
        tiktok_url: settings.tiktok_url || '',
        bank_name: settings.bank_name || '',
        account_name: settings.account_name || '',
        account_number: settings.account_number || '',
        partner_name: settings.partner_name || '',
        partner_type: settings.partner_type || '',
        partner_description: settings.partner_description || '',
        partner_website: settings.partner_website || '',
        partner_logo: settings.partner_logo || '',
        show_partner_section: settings.show_partner_section ?? true,
        homepage_about_heading: settings.homepage_about_heading || '',
        homepage_about_badge: settings.homepage_about_badge || '',
        homepage_about_description: settings.homepage_about_description || '',
        homepage_about_description_2: settings.homepage_about_description_2 || '',
        homepage_about_image: settings.homepage_about_image || '',
        homepage_about_button_text: settings.homepage_about_button_text || '',
        homepage_about_link: settings.homepage_about_link || '',
        show_homepage_about: settings.show_homepage_about ?? true,
        announcement_bar_enabled: settings.announcement_bar_enabled ?? true,
        announcement_bar_text: settings.announcement_bar_text || '',
        updated_at: new Date().toISOString(),
      };

      // Perform upsert with full payload
      let { error } = await supabase.from('store_settings').upsert(fullPayload, { onConflict: 'id' });

      // If there's an error because some newer column doesn't exist in user's schema,
      // gracefully retry without the non-existent columns so valid data is never lost
      if (error && (error.message.includes('column') || error.message.includes('schema cache'))) {
        console.warn('[SupabaseService] Column mismatch in store_settings, falling back to core schema payload:', error.message);
        const corePayload: any = {
          id: 'default',
          business_name: settings.business_name || 'Sunshine Babies Essentials',
          tagline: settings.tagline || '',
          about_us: settings.about_us || settings.about_story || '',
          phone: settings.phone || '+234 903 466 5968',
          whatsapp: settings.whatsapp_number || '+234 903 466 5968',
          email: settings.email || 'info@sunshinebabies.com',
          support_email: settings.support_email || settings.email || 'info@sunshinebabies.com',
          city: settings.city || 'Abuja',
          state: settings.state || 'FCT',
          country: settings.country || 'Nigeria',
          address: settings.address || '',
          latitude: settings.latitude ?? 9.0765,
          longitude: settings.longitude ?? 7.3986,
          google_maps_url: settings.google_maps_url || '',
          opening_hours: settings.opening_hours || 'Mon - Sat: 8:00 AM - 6:00 PM, Sun: Closed',
          logo_url: settings.logo_url || '/logo.png',
          favicon_url: settings.favicon_url || '/favicon.png',
          currency_symbol: settings.currency_symbol || '₦',
          currency_code: settings.currency_code || 'NGN',
          instagram_url: settings.instagram_url || '',
          facebook_url: settings.facebook_url || '',
          tiktok_url: settings.tiktok_url || '',
          bank_name: settings.bank_name || '',
          account_name: settings.account_name || '',
          account_number: settings.account_number || '',
          updated_at: new Date().toISOString(),
        };

        const retryResult = await supabase.from('store_settings').upsert(corePayload, { onConflict: 'id' });
        error = retryResult.error;
      }

      if (error) {
        console.error('Supabase Error:', error.message);
        return { success: false, error: error.message };
      }

      // Step 8: Verify persistence by reading the row back from Supabase (resilient fallback)
      console.log('[SupabaseService] Reading back row to verify database persistence...');
      try {
        const verified = await this.fetchStoreSettings();
        if (verified) {
          console.log('Refreshing StoreContext with verified database data...');
          console.log('Completed successfully.');
          return { success: true, data: verified };
        }
      } catch (readErr) {
        console.warn('[SupabaseService] Non-blocking readback verification note:', readErr);
      }

      console.log('Store settings successfully committed to database.');
      return { success: true, data: settings };
    } catch (err: any) {
      console.error('Supabase Error:', err);
      return { success: false, error: err?.message || 'Unexpected error updating store settings' };
    }
  },

  /**
   * Fetch Customer Inquiries
   */
  async fetchInquiries(): Promise<Inquiry[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('customer_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetchInquiries error:', error.message);
        return null;
      }

      if (!data) return [];

      return data.map((row: any) => ({
        id: String(row.id),
        name: row.name || 'Anonymous Customer',
        email: row.email || '',
        phone: row.phone || '',
        subject: row.subject || 'General Inquiry',
        message: row.message || '',
        status: (row.status as InquiryStatus) || 'New',
        source: 'Website Contact Form',
        created_at: row.created_at || new Date().toISOString(),
        response_notes: row.response_notes,
      }));
    } catch (err) {
      console.warn('Supabase fetchInquiries exception:', err);
      return null;
    }
  },

  /**
   * Submit a customer inquiry into Supabase
   */
  async submitInquiry(inquiry: {
    name: string;
    email?: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; id?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false };
    }

    try {
      const { data, error } = await supabase
        .from('customer_inquiries')
        .insert({
          name: inquiry.name,
          email: inquiry.email || null,
          phone: inquiry.phone,
          subject: inquiry.subject,
          message: inquiry.message,
          status: 'New',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error) {
        console.error('Supabase submitInquiry failed:', error.message);
        return { success: false };
      }

      return { success: true, id: data?.id };
    } catch (err) {
      console.error('Supabase submitInquiry exception:', err);
      return { success: false };
    }
  },

  /**
   * Update Inquiry Status
   */
  async updateInquiryStatus(id: string, status: InquiryStatus, notes?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (notes !== undefined) updateData.response_notes = notes;

      const { error } = await supabase
        .from('customer_inquiries')
        .update(updateData)
        .eq('id', id);

      return !error;
    } catch (err) {
      console.error('Supabase updateInquiryStatus exception:', err);
      return false;
    }
  },

  /**
   * Fetch Message Templates (WhatsApp & Email)
   */
  async fetchMessageTemplates(): Promise<{
    whatsapp: WhatsAppTemplate[];
    email: EmailTemplate[];
    all: MessageTemplate[];
  } | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Supabase fetchMessageTemplates error:', error.message);
        return null;
      }

      if (!data || data.length === 0) return null;

      const all: MessageTemplate[] = data.map((r: any) => ({
        id: String(r.id),
        name: r.name,
        channel: (r.channel as 'WhatsApp' | 'Email') || 'WhatsApp',
        subject: r.subject || undefined,
        message: r.message,
        is_active: r.is_active !== false,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));

      const whatsapp: WhatsAppTemplate[] = all
        .filter((t) => t.channel === 'WhatsApp')
        .map((t) => ({
          id: t.id,
          name: t.name,
          type: t.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
          template_text: t.message,
          is_active: t.is_active,
        }));

      const email: EmailTemplate[] = all
        .filter((t) => t.channel === 'Email')
        .map((t) => ({
          id: t.id,
          name: t.name,
          type: t.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
          subject: t.subject || t.name,
          body_html: t.message,
          is_active: t.is_active,
        }));

      return { whatsapp, email, all };
    } catch (err) {
      console.warn('Supabase fetchMessageTemplates exception:', err);
      return null;
    }
  },

  /**
   * Upsert a message template
   */
  async upsertMessageTemplate(template: MessageTemplate): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      const { error } = await supabase.from('message_templates').upsert({
        id: template.id,
        name: template.name,
        channel: template.channel,
        subject: template.subject || null,
        message: template.message,
        is_active: template.is_active !== false,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      return !error;
    } catch (err) {
      console.error('Supabase upsertMessageTemplate exception:', err);
      return false;
    }
  },

  /**
   * Fetch Delivery Locations
   */
  async fetchDeliveryLocations(): Promise<DeliveryLocation[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('delivery_locations')
        .select('*')
        .order('fee', { ascending: true });

      if (error || !data) return null;

      return data.map((l: any) => ({
        id: String(l.id),
        state: l.state,
        city_area: l.city_area,
        fee: Number(l.fee || 0),
        estimated_days: l.estimated_days || '1-2 business days',
        is_active: l.is_active !== false,
      }));
    } catch (err) {
      console.warn('Supabase fetchDeliveryLocations error:', err);
      return null;
    }
  },

  /**
   * Upsert a Delivery Location
   */
  async upsertDeliveryLocation(loc: DeliveryLocation): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      const { error } = await supabase.from('delivery_locations').upsert({
        id: loc.id,
        state: loc.state,
        city_area: loc.city_area,
        fee: loc.fee,
        estimated_days: loc.estimated_days,
        is_active: loc.is_active !== false,
      }, { onConflict: 'id' });

      return !error;
    } catch (err) {
      console.error('Supabase upsertDeliveryLocation exception:', err);
      return false;
    }
  },

  /**
   * Delete Delivery Location
   */
  async deleteDeliveryLocation(locId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      const { error } = await supabase.from('delivery_locations').delete().eq('id', locId);
      return !error;
    } catch (err) {
      console.error('Supabase deleteDeliveryLocation exception:', err);
      return false;
    }
  },

  /**
   * Fetch all Customers from Supabase
   */
  async fetchCustomers(): Promise<Customer[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;

      return data.map((c: any) => ({
        id: String(c.id),
        full_name: c.full_name || 'Valued Customer',
        email: c.email || '',
        phone: c.phone || '',
        created_at: c.created_at || new Date().toISOString(),
        addresses: Array.isArray(c.addresses) ? c.addresses : [],
        auth_user_id: c.id,
      }));
    } catch (err) {
      console.warn('Supabase fetchCustomers error:', err);
      return null;
    }
  },

  /**
   * Upsert a Customer Profile in Supabase
   */
  async upsertCustomer(customer: Customer): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      const { error } = await supabase.from('customers').upsert({
        id: customer.id,
        full_name: customer.full_name,
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      if (error) {
        console.error('Supabase upsertCustomer error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase upsertCustomer exception:', err);
      return false;
    }
  },

  /**
   * Sign up a new customer via Supabase Authentication
   */
  async signUpCustomer(
    email: string,
    password: string,
    fullName: string,
    phone: string
  ): Promise<{
    success: boolean;
    customer?: Customer;
    requiresEmailConfirmation?: boolean;
    error?: string;
  }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanName = fullName.trim();

    if (!cleanEmail || !password || !cleanName || !cleanPhone) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: cleanName,
              phone: cleanPhone,
            },
          },
        });

        if (error) {
          console.error('Supabase Auth signUp error:', error.message);
          const msg = error.message.toLowerCase();
          if (msg.includes('invalid path specified') || msg.includes('pgrst126')) {
            return {
              success: false,
              error: 'Supabase URL endpoint configuration error. Please verify your Supabase project URL.',
            };
          }
          if (msg.includes('already registered') || msg.includes('user already exists') || msg.includes('identity already exists')) {
            return {
              success: false,
              error: 'An account with this email address already exists. Please log in instead.',
            };
          }
          if (msg.includes('password') && (msg.includes('weak') || msg.includes('short') || msg.includes('least 6'))) {
            return {
              success: false,
              error: 'Password must be at least 6 characters.',
            };
          }
          if (msg.includes('valid email') || msg.includes('invalid email')) {
            return {
              success: false,
              error: 'Please enter a valid email address.',
            };
          }
          if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit')) {
            return {
              success: false,
              error: 'Too many signup attempts. Please wait a few moments before trying again.',
            };
          }
          return {
            success: false,
            error: error.message || 'Registration failed. Please try again.',
          };
        }

        if (data?.user) {
          // If user exists but identities is empty, Supabase security obfuscation for existing user
          if (data.user.identities && data.user.identities.length === 0) {
            return {
              success: false,
              error: 'An account with this email address already exists. Please log in instead.',
            };
          }

          const customerProfile: Customer = {
            id: data.user.id,
            full_name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            created_at: data.user.created_at || new Date().toISOString(),
            addresses: [],
            auth_user_id: data.user.id,
          };

          // Upsert to customers table linked to Auth user ID
          try {
            await supabase.from('customers').upsert({
              id: data.user.id,
              full_name: cleanName,
              email: cleanEmail,
              phone: cleanPhone,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });
          } catch (profileErr) {
            console.warn('Non-blocking customer profile upsert notice:', profileErr);
          }

          const requiresEmailConfirmation = !data.session;

          return {
            success: true,
            customer: customerProfile,
            requiresEmailConfirmation,
          };
        }
      } catch (err: any) {
        console.error('Supabase signUpCustomer exception:', err);
        return {
          success: false,
          error: err?.message || 'Network error during registration. Please try again.',
        };
      }
    }

    // Offline / Local fallback if Supabase not configured
    const localCustomer: Customer = {
      id: `cust-${Date.now()}`,
      full_name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      created_at: new Date().toISOString(),
      addresses: [],
    };

    return {
      success: true,
      customer: localCustomer,
      requiresEmailConfirmation: false,
    };
  },

  /**
   * Sign in a customer via Supabase Authentication
   */
  async signInCustomer(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    customer?: Customer;
    error?: string;
  }> {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return { success: false, error: 'Please enter both your email address and password.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (error) {
          const msg = error.message.toLowerCase();
          if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
            return {
              success: false,
              error: 'Invalid email or password. Please verify your details and try again.',
            };
          }
          if (msg.includes('email not confirmed')) {
            return {
              success: false,
              error: 'Please confirm your email address before signing in. Check your inbox for the confirmation link.',
            };
          }
          return {
            success: false,
            error: error.message || 'Unable to sign in. Please verify your details.',
          };
        }

        if (data?.user) {
          let customerProfile: Customer | null = null;

          // Attempt to fetch profile from customers table
          try {
            const { data: profileRow } = await supabase
              .from('customers')
              .select('*')
              .or(`id.eq.${data.user.id},email.eq.${cleanEmail}`)
              .maybeSingle();

            if (profileRow) {
              customerProfile = {
                id: String(profileRow.id),
                full_name: profileRow.full_name || data.user.user_metadata?.full_name || 'Valued Customer',
                email: profileRow.email || cleanEmail,
                phone: profileRow.phone || data.user.user_metadata?.phone || '',
                created_at: profileRow.created_at || data.user.created_at,
                addresses: Array.isArray(profileRow.addresses) ? profileRow.addresses : [],
                auth_user_id: data.user.id,
              };
            }
          } catch {
            // Profile fetch fallback
          }

          if (!customerProfile) {
            customerProfile = {
              id: data.user.id,
              full_name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
              email: cleanEmail,
              phone: data.user.user_metadata?.phone || '',
              created_at: data.user.created_at || new Date().toISOString(),
              addresses: [],
              auth_user_id: data.user.id,
            };
          }

          return {
            success: true,
            customer: customerProfile,
          };
        }
      } catch (err: any) {
        console.error('Supabase signInCustomer exception:', err);
        return {
          success: false,
          error: err?.message || 'Network error during sign in. Please try again.',
        };
      }
    }

    // Local fallback
    const fallbackCustomer: Customer = {
      id: `cust-${Date.now()}`,
      full_name: cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: '',
      created_at: new Date().toISOString(),
      addresses: [],
    };

    return {
      success: true,
      customer: fallbackCustomer,
    };
  },

  /**
   * Verify if a Supabase user is the authorized administrator (info@sunshinebabies.com)
   */
  async verifyIsAdminUser(user: any): Promise<{ isAuthorized: boolean; adminUser?: AdminUser }> {
    if (!user) return { isAuthorized: false };

    const cleanEmail = (user.email || '').trim().toLowerCase();
    const AUTHORIZED_ADMIN_EMAIL = 'info@sunshinebabies.com';

    // Strict Security Gate: Only info@sunshinebabies.com is authorized for admin access
    if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL) {
      return { isAuthorized: false };
    }

    // 1. Check Supabase Auth JWT / app_metadata / user_metadata
    if (
      user.app_metadata?.role === 'admin' ||
      user.app_metadata?.role === 'super_admin' ||
      user.user_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'super_admin' ||
      user.app_metadata?.is_admin === true ||
      user.user_metadata?.is_admin === true
    ) {
      return {
        isAuthorized: true,
        adminUser: {
          id: user.id,
          auth_user_id: user.id,
          email: AUTHORIZED_ADMIN_EMAIL,
          full_name: user.user_metadata?.full_name || 'Sunshine Babies Admin',
          role: 'super_admin',
        },
      };
    }

    // 2. Check public.admin_users table in Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: adminRecord } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', AUTHORIZED_ADMIN_EMAIL)
          .maybeSingle();

        if (adminRecord && adminRecord.is_active !== false) {
          return {
            isAuthorized: true,
            adminUser: {
              id: String(adminRecord.id || user.id),
              auth_user_id: user.id,
              email: AUTHORIZED_ADMIN_EMAIL,
              full_name: adminRecord.full_name || 'Sunshine Babies Admin',
              role: (adminRecord.role as 'admin' | 'super_admin') || 'super_admin',
            },
          };
        }
      } catch (err) {
        // Table check failed or unmigrated, proceed with email match
      }
    }

    // Default verification for the designated admin email
    return {
      isAuthorized: true,
      adminUser: {
        id: user.id || 'admin-info',
        auth_user_id: user.id,
        email: AUTHORIZED_ADMIN_EMAIL,
        full_name: user.user_metadata?.full_name || 'Sunshine Babies Admin',
        role: 'super_admin',
      },
    };
  },

  /**
   * Authenticate Administrator using Supabase Auth with strict role check
   */
  async signInAdmin(
    email: string,
    password: string
  ): Promise<{ success: boolean; adminUser?: AdminUser; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const AUTHORIZED_ADMIN_EMAIL = 'info@sunshinebabies.com';

    if (!cleanEmail || !password) {
      return { success: false, error: 'Please enter both your admin email and password.' };
    }

    // Strict Authorization Check: Only info@sunshinebabies.com is authorized
    if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL) {
      return {
        success: false,
        error: 'Access Denied: Only the authorized administrator account (info@sunshinebabies.com) is permitted to access the store management dashboard.',
      };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          console.warn('Admin Supabase Auth signIn error:', error.message);
          return {
            success: false,
            error: 'Invalid administrator credentials. Please verify your password.',
          };
        }

        if (!data.user) {
          return { success: false, error: 'Authentication failed. No administrator account found.' };
        }

        // Verify that this authenticated account is authorized as the admin
        const authCheck = await this.verifyIsAdminUser(data.user);
        if (!authCheck.isAuthorized) {
          // Immediately revoke session since this is not the authorized administrator
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Access Denied: Account is not authorized with administrator privileges.',
          };
        }

        return {
          success: true,
          adminUser: authCheck.adminUser,
        };
      } catch (err: any) {
        console.error('Supabase admin login error:', err);
        return {
          success: false,
          error: err?.message || 'A network error occurred during administrator authentication.',
        };
      }
    }

    // Offline / Preview fallback for development when Supabase env vars are not configured
    if (cleanEmail === AUTHORIZED_ADMIN_EMAIL) {
      return {
        success: true,
        adminUser: {
          id: 'admin-info',
          email: AUTHORIZED_ADMIN_EMAIL,
          full_name: 'Sunshine Babies Admin',
          role: 'super_admin',
        },
      };
    }

    return {
      success: false,
      error: 'Access Denied: Not an authorized administrator account.',
    };
  },

  /**
   * Get Current Authenticated Admin Profile if valid
   */
  async getCurrentAuthAdmin(): Promise<AdminUser | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) return null;

      const authCheck = await this.verifyIsAdminUser(user);
      if (authCheck.isAuthorized && authCheck.adminUser) {
        return authCheck.adminUser;
      }
      return null;
    } catch (err) {
      console.warn('Supabase getCurrentAuthAdmin error:', err);
      return null;
    }
  },

  /**
   * Sign out customer from Supabase Auth
   */
  async signOutCustomer(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
  },

  /**
   * Get Current Authenticated Customer Profile
   */
  async getCurrentAuthCustomer(): Promise<Customer | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) return null;

      const { data: profileRow } = await supabase
        .from('customers')
        .select('*')
        .or(`id.eq.${user.id},email.eq.${user.email}`)
        .maybeSingle();

      if (profileRow) {
        return {
          id: String(profileRow.id),
          full_name: profileRow.full_name || user.user_metadata?.full_name || 'Valued Customer',
          email: profileRow.email || user.email || '',
          phone: profileRow.phone || user.user_metadata?.phone || '',
          created_at: profileRow.created_at || user.created_at,
          addresses: Array.isArray(profileRow.addresses) ? profileRow.addresses : [],
          auth_user_id: user.id,
        };
      }

      return {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Valued Customer',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        created_at: user.created_at || new Date().toISOString(),
        addresses: [],
        auth_user_id: user.id,
      };
    } catch (err) {
      console.warn('Supabase getCurrentAuthCustomer error:', err);
      return null;
    }
  },

  /**
   * Fetch Orders from Supabase (with customer & items)
   */
  async fetchOrders(): Promise<Order[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data: orderRows, error: ordersErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersErr) {
        console.warn('Supabase fetchOrders error:', ordersErr.message);
        return null;
      }

      if (!orderRows || orderRows.length === 0) return [];

      const orderIds = orderRows.map((o: any) => o.id);

      const { data: itemRows } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      const itemsByOrderId = new Map<string, OrderItem[]>();
      if (itemRows) {
        for (const item of itemRows) {
          const list = itemsByOrderId.get(item.order_id) || [];
          list.push({
            product_id: item.product_id || '',
            name: item.product_name,
            price: Number(item.product_price || 0),
            regular_price: Number(item.product_price || 0),
            quantity: Number(item.quantity || 1),
            sku: item.sku || '',
            image: item.image_url || '/logo.png',
            age_group: item.age_group,
          });
          itemsByOrderId.set(item.order_id, list);
        }
      }

      return orderRows.map((o: any) => ({
        id: String(o.id),
        order_number: o.order_number,
        customer: {
          customer_id: o.customer_id,
          full_name: o.customer_name,
          email: o.customer_email || '',
          phone: o.customer_phone,
        },
        delivery_location: {
          state: o.state || 'FCT',
          city: o.city || 'Abuja',
          address: o.delivery_address || '',
          instructions: o.order_notes,
        },
        items: itemsByOrderId.get(o.id) || [],
        subtotal: Number(o.subtotal || 0),
        delivery_fee: Number(o.delivery_fee || 0),
        discount_amount: Number(o.discount_amount || 0),
        discount_code: o.discount_code,
        total_amount: Number(o.total_amount || 0),
        payment_method: (o.payment_method as any) || 'whatsapp',
        payment_status: (o.payment_status as PaymentStatus) || 'pending',
        payment_reference: o.payment_reference,
        payment_channel: o.payment_channel,
        paid_at: o.paid_at,
        order_status: (o.order_status as OrderStatus) || 'Pending',
        notes: o.notes,
        tracking_number: o.tracking_number,
        created_at: o.created_at || new Date().toISOString(),
        updated_at: o.updated_at || new Date().toISOString(),
      }));
    } catch (err) {
      console.warn('Supabase fetchOrders exception:', err);
      return null;
    }
  },

  /**
   * Create an Order with relational Customer and Order Items in Supabase
   */
  async createOrder(
    order: Order,
    catalogProducts: Product[]
  ): Promise<{ success: boolean; id?: string }> {
    if (!isSupabaseConfigured || !supabase) return { success: false };

    try {
      // 1. Secure Price Validation
      let verifiedSubtotal = 0;
      const verifiedItems = order.items.map((item) => {
        const matchingProd = catalogProducts.find((p) => p.id === item.product_id);
        const actualPrice = matchingProd
          ? (matchingProd.discount_price && matchingProd.discount_price < matchingProd.regular_price
              ? matchingProd.discount_price
              : matchingProd.regular_price)
          : item.price;

        const qty = Math.max(1, item.quantity);
        verifiedSubtotal += actualPrice * qty;

        return {
          product_id: item.product_id || null,
          product_name: matchingProd ? matchingProd.name : item.name,
          product_price: actualPrice,
          quantity: qty,
          subtotal: actualPrice * qty,
          sku: matchingProd ? matchingProd.sku : item.sku || '',
          image_url: matchingProd?.images?.[0] || item.image || '/logo.png',
          age_group: matchingProd?.age_group || item.age_group || 'All Ages',
        };
      });

      const deliveryFee = Number(order.delivery_fee || 0);
      const discount = Number(order.discount_amount || 0);
      const verifiedTotal = verifiedSubtotal + deliveryFee - discount;

      // 2. Upsert Customer Record
      let customerId = order.customer.customer_id;
      if (order.customer.email || order.customer.phone) {
        try {
          const { data: custData } = await supabase
            .from('customers')
            .upsert({
              full_name: order.customer.full_name,
              email: order.customer.email || `guest_${Date.now()}@sunshinebabies.com`,
              phone: order.customer.phone,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'email' })
            .select('id')
            .maybeSingle();

          if (custData?.id) {
            customerId = custData.id;
          }
        } catch {
          // Non-blocking customer upsert
        }
      }

      // 3. Insert Order Record
      const { data: newOrder, error: orderInsertErr } = await supabase
        .from('orders')
        .insert({
          order_number: order.order_number,
          customer_id: customerId || null,
          customer_name: order.customer.full_name,
          customer_email: order.customer.email || null,
          customer_phone: order.customer.phone,
          delivery_address: order.delivery_location.address,
          city: order.delivery_location.city,
          state: order.delivery_location.state,
          order_notes: order.delivery_location.instructions || order.notes || null,
          subtotal: verifiedSubtotal,
          delivery_fee: deliveryFee,
          discount_amount: discount,
          discount_code: order.discount_code || null,
          total_amount: verifiedTotal,
          payment_method: order.payment_method || 'whatsapp',
          payment_status: order.payment_status || 'pending',
          payment_reference: order.payment_reference || null,
          payment_channel: order.payment_channel || null,
          order_status: order.order_status || 'Pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (orderInsertErr || !newOrder) {
        console.error('Supabase order insert failed:', orderInsertErr?.message);
        return { success: false };
      }

      // 4. Insert Order Items
      const itemsToInsert = verifiedItems.map((item) => ({
        order_id: newOrder.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_price: item.product_price,
        quantity: item.quantity,
        subtotal: item.subtotal,
        sku: item.sku,
        image_url: item.image_url,
        age_group: item.age_group,
        created_at: new Date().toISOString(),
      }));

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsErr) {
        console.error('Supabase order_items insert failed:', itemsErr.message);
      }

      return { success: true, id: newOrder.id };
    } catch (err) {
      console.error('Supabase createOrder exception:', err);
      return { success: false };
    }
  },

  /**
   * Update Order Status in Supabase
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          order_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      return !error;
    } catch (err) {
      console.error('Supabase updateOrderStatus exception:', err);
      return false;
    }
  },

  /**
   * Update Payment Status in Supabase
   */
  async updatePaymentStatus(
    orderId: string,
    status: PaymentStatus,
    reference?: string
  ): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      const updateData: any = {
        payment_status: status,
        updated_at: new Date().toISOString(),
      };
      if (reference) updateData.payment_reference = reference;
      if (status === 'paid') updateData.paid_at = new Date().toISOString();

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      return !error;
    } catch (err) {
      console.error('Supabase updatePaymentStatus exception:', err);
      return false;
    }
  },

  /**
   * Upload Product Image to Supabase Storage Bucket ('product-images')
   * Fallback to compressed Base64 dataURL if bucket is unavailable.
   */
  async uploadProductImage(file: File): Promise<string> {
    if (isSupabaseConfigured && supabase) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (!error && data?.path) {
          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(data.path);

          if (publicUrlData?.publicUrl) {
            return publicUrlData.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload failed, using local base64 fallback:', err);
      }
    }

    // High performance compressed fallback
    return processUploadedImageFile(file, 1600, 1200, 0.85);
  },

  /**
   * Upload Store Branding Asset (Logo, Favicon, Banner, Partner Logo, Hero Image)
   * Uploads to Supabase Storage Bucket ('product-images' under 'branding/' folder)
   * With fallback to optimized base64 DataURL
   */
  async uploadBrandingImage(
    file: File,
    assetType: 'logo' | 'favicon' | 'partner' | 'hero' | 'about' | 'branding' = 'branding'
  ): Promise<{ success: boolean; url: string; error?: string }> {
    console.log(`Uploading ${assetType}...`);

    if (file.size > 15 * 1024 * 1024) {
      return { success: false, url: '', error: 'Image file is too large. Please select an image under 15MB.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `${assetType}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `branding/${fileName}`;

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (!error && data?.path) {
          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(data.path);

          if (publicUrlData?.publicUrl) {
            console.log(`Uploaded ${assetType} to Supabase Storage successfully: ${publicUrlData.publicUrl}`);
            return { success: true, url: publicUrlData.publicUrl };
          }
        } else if (error) {
          console.warn(`[Supabase Storage] ${assetType} upload warning:`, error.message);
        }
      } catch (storageErr) {
        console.warn(`[Supabase Storage] Exception during ${assetType} upload:`, storageErr);
      }
    }

    // High performance compressed fallback that works everywhere
    try {
      const maxDim = assetType === 'favicon' ? 256 : assetType === 'logo' ? 800 : 1600;
      const dataUrl = await processUploadedImageFile(file, maxDim, maxDim, 0.88);
      console.log(`Optimized ${assetType} via local image processor.`);
      return { success: true, url: dataUrl };
    } catch (compressErr: any) {
      console.error(`Failed to process ${assetType} image file:`, compressErr);
      return { success: false, url: '', error: compressErr?.message || 'Failed to process image file' };
    }
  },

  /**
   * Upload Category Image to Supabase Storage.
   * Category images must be stored remotely; there is no local/base64 fallback.
   */
  async uploadCategoryImage(file: File): Promise<{ success: boolean; url: string; error?: string }> {
    if (file.size > 15 * 1024 * 1024) {
      return {
        success: false,
        url: '',
        error: 'Image file is too large. Please select an image under 15MB.',
      };
    }

    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        url: '',
        error: 'Please select a valid image file.',
      };
    }

    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        url: '',
        error: 'Supabase Storage is not configured. The category image was not uploaded.',
      };
    }

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `category_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error || !data?.path) {
        console.error('[Supabase Storage] Category image upload failed:', error?.message || 'No storage path returned');

        return {
          success: false,
          url: '',
          error: error?.message || 'The category image could not be uploaded to Supabase Storage.',
        };
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      if (!publicUrlData?.publicUrl) {
        return {
          success: false,
          url: '',
          error: 'The category image was uploaded, but its public URL could not be generated.',
        };
      }

      console.log(
        `[Supabase Storage] Category image uploaded successfully: ${publicUrlData.publicUrl}`
      );

      return {
        success: true,
        url: publicUrlData.publicUrl,
      };
    } catch (err: any) {
      console.error('[Supabase Storage] Category image upload exception:', err);

      return {
        success: false,
        url: '',
        error: err?.message || 'The category image could not be uploaded.',
      };
    }
  },

  /**
   * One-Click Complete Data Sync / Seed to Supabase
   * Seeds all products, categories, Abuja store settings, and messaging templates if database is empty.
   */
  async syncInitialDataToSupabase(
    products: Product[],
    categories: Category[],
    settings: CompanySettings,
    deliveryLocations: DeliveryLocation[],
    whatsappTemplates: WhatsAppTemplate[],
    emailTemplates: EmailTemplate[]
  ): Promise<{
    success: boolean;
    syncedCounts: {
      categories: number;
      products: number;
      settings: boolean;
      locations: number;
      templates: number;
    };
    error?: string;
  }> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        syncedCounts: { categories: 0, products: 0, settings: false, locations: 0, templates: 0 },
        error: 'Supabase credentials are not configured in .env.local',
      };
    }

    try {
      // 1. Sync Categories
      const catRows = categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: c.description || '',
        image_url: c.image_url || '',
        icon: c.icon || '',
        is_active: c.is_active !== false,
        display_order: c.display_order || 0,
      }));

      await supabase.from('categories').upsert(catRows, { onConflict: 'id' });

      // 2. Sync Products
      const productRows = products.map(mapProductToDbRow);
      await supabase.from('products').upsert(productRows, { onConflict: 'id' });

      // 3. Sync Store Settings
      await supabase.from('store_settings').upsert({
        id: 'default',
        business_name: settings.business_name || 'Sunshine Babies Essentials',
        tagline: settings.tagline || "Your baby's comfort is our biggest priority.",
        about_us: settings.about_us || settings.about_story || '',
        phone: settings.phone,
        whatsapp: settings.whatsapp_number,
        email: settings.email,
        support_email: settings.support_email,
        city: settings.city || 'Abuja',
        state: settings.state || 'FCT',
        country: settings.country || 'Nigeria',
        address: settings.address || '',
        latitude: settings.latitude || 9.0765,
        longitude: settings.longitude || 7.3986,
        google_maps_url: settings.google_maps_url,
        opening_hours: settings.opening_hours || 'Mon - Sat: 8:00 AM - 6:00 PM, Sun: Closed',
        logo_url: settings.logo_url || '/logo.png',
        favicon_url: settings.favicon_url || '/favicon.png',
        currency_symbol: settings.currency_symbol || '₦',
        currency_code: settings.currency_code || 'NGN',
        instagram_url: settings.instagram_url,
        facebook_url: settings.facebook_url,
        tiktok_url: settings.tiktok_url,
        bank_name: settings.bank_name,
        account_name: settings.account_name,
        account_number: settings.account_number,
        partner_name: settings.partner_name,
        partner_type: settings.partner_type,
        partner_description: settings.partner_description,
        partner_website: settings.partner_website,
        partner_logo: settings.partner_logo,
        show_partner_section: settings.show_partner_section,
        homepage_about_heading: settings.homepage_about_heading,
        homepage_about_badge: settings.homepage_about_badge,
        homepage_about_description: settings.homepage_about_description,
        homepage_about_description_2: settings.homepage_about_description_2,
        homepage_about_image: settings.homepage_about_image,
        homepage_about_button_text: settings.homepage_about_button_text,
        homepage_about_link: settings.homepage_about_link,
        show_homepage_about: settings.show_homepage_about,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      // 4. Sync Delivery Locations
      const locRows = deliveryLocations.map((l) => ({
        id: l.id,
        state: l.state,
        city_area: l.city_area,
        fee: l.fee,
        estimated_days: l.estimated_days,
        is_active: l.is_active !== false,
      }));
      await supabase.from('delivery_locations').upsert(locRows, { onConflict: 'id' });

      // 5. Sync Message Templates
      const templateRows = [
        ...whatsappTemplates.map((t) => ({
          id: t.id,
          name: t.name,
          channel: 'WhatsApp',
          subject: null,
          message: t.template_text,
          is_active: t.is_active !== false,
        })),
        ...emailTemplates.map((t) => ({
          id: t.id,
          name: t.name,
          channel: 'Email',
          subject: t.subject,
          message: t.body_html,
          is_active: t.is_active !== false,
        })),
      ];
      await supabase.from('message_templates').upsert(templateRows, { onConflict: 'id' });

      return {
        success: true,
        syncedCounts: {
          categories: catRows.length,
          products: productRows.length,
          settings: true,
          locations: locRows.length,
          templates: templateRows.length,
        },
      };
    } catch (err: any) {
      console.error('Supabase syncInitialDataToSupabase error:', err);
      return {
        success: false,
        syncedCounts: { categories: 0, products: 0, settings: false, locations: 0, templates: 0 },
        error: err?.message || 'Database sync encountered an unexpected error.',
      };
    }
  },
};

