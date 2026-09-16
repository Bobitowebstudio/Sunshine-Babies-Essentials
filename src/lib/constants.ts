import {
  Category,
  CompanySettings,
  DeliveryLocation,
  EmailTemplate,
  Product,
  PromotionalBanner,
  WhatsAppTemplate,
} from '../types';
import { INITIAL_CATEGORIES as CATALOG_CATEGORIES, ALL_PRODUCTS } from './catalog';

export const PRIMARY_WHATSAPP_NUMBER = '+234 903 466 5968';
export const PRIMARY_WHATSAPP_CLEAN = '2349034665968';

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  business_name: 'Sunshine Babies Essentials',
  tagline: "Your baby's comfort is our biggest priority.",
  description:
    'A premier baby and maternity essentials store dedicated to providing high-quality, safe, and comfortable products for babies, mothers, and growing families.',
  about_story:
    'Sunshine Babies Essentials was created to support parents and families with thoughtfully selected essentials for every step of childhood. Based in Abuja, FCT, Nigeria, we curate top-tier maternity wear, newborn nursery essentials, pediatric-safe feeding gear, cozy infant clothing, and educational essentials. We know how much your little one means to you, and we are committed to making your shopping experience smooth, trustworthy, and joyful.',
  logo_url: '/logo.png',
  favicon_url: '/favicon.png',
  whatsapp_number: PRIMARY_WHATSAPP_NUMBER,
  phone: PRIMARY_WHATSAPP_NUMBER,
  email: 'info@sunshinebabies.com',
  support_email: 'info@sunshinebabies.com',
  address: '',
  city: 'Abuja',
  state: 'FCT',
  country: 'Nigeria',
  latitude: 9.0765,
  longitude: 7.3986,
  google_maps_url: 'https://maps.google.com/?q=Abuja,+FCT,+Nigeria',
  instagram_url: 'https://instagram.com/sunshinebabiesessentials',
  facebook_url: 'https://facebook.com/sunshinebabiesessentials',
  tiktok_url: 'https://tiktok.com/@sunshinebabiesessentials',
  twitter_url: 'https://x.com/sunshinebabies',
  youtube_url: '',
  hero_banner_image: '',
  footer_text: 'Your trusted destination for premium baby and maternity essentials in Abuja and across Nigeria.',
  primary_color: '#F59E0B', // Radiant sunshine gold
  secondary_color: '#1E293B',
  accent_color: '#EC4899', // Pink accent matching the logo badge
  currency_symbol: '₦',
  currency_code: 'NGN',
  enable_guest_checkout: true,
  enable_whatsapp_orders: true,
  enable_low_stock_alerts: true,
  low_stock_threshold: 5,
  bank_name: 'Guaranty Trust Bank (GTBank)',
  account_name: 'SUNSHINE BABIES ESSENTIALS ENTERPRISE',
  account_number: '0123456789',
  // China Sourcing & Logistics Partner
  partner_name: "Binna's Logistics Global",
  partner_type: 'China Sourcing & Logistics Partner',
  partner_description: 'Our trusted partner for sourcing and logistics from China.',
  partner_website: 'https://binnaslogisticsglobal.com.ng',
  partner_logo: '/binnas.jpeg',
  show_partner_section: true,
  // Homepage About Us Section
  homepage_about_heading: 'Sunshine Babies Essentials',
  homepage_about_badge: 'ABOUT US',
  homepage_about_description:
    'Sunshine Babies Essentials is dedicated to providing quality baby and maternity essentials carefully selected with the comfort, safety and needs of mothers and babies in mind.',
  homepage_about_description_2:
    'Our goal is to make shopping for your little one easier by bringing together trusted baby products, maternity essentials and everyday necessities in one convenient place.',
  homepage_about_image:
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1000&q=80',
  homepage_about_button_text: 'Learn More About Us',
  homepage_about_link: '/about',
  show_homepage_about: true,
  announcement_bar_enabled: true,
  announcement_bar_text:
    'NOTICE: Paystack payment is temporarily unavailable. Please use any of our other available payment options, including bank account payment, payment after delivery, WhatsApp-assisted payment, and other payment methods available on the website. Paystack will be available again soon. We apologise for any inconvenience.',
};

export const INITIAL_CATEGORIES: Category[] = CATALOG_CATEGORIES;
export const INITIAL_PRODUCTS: Product[] = ALL_PRODUCTS;

export const INITIAL_DELIVERY_LOCATIONS: DeliveryLocation[] = [
  {
    id: 'del-1',
    state: 'Lagos',
    city_area: 'Island (VI, Ikoyi, Lekki, Ajah)',
    fee: 2500,
    estimated_days: '1 - 2 Business Days',
    is_active: true,
  },
  {
    id: 'del-2',
    state: 'Lagos',
    city_area: 'Mainland (Ikeja, Surulere, Yaba, Maryland)',
    fee: 3000,
    estimated_days: '1 - 2 Business Days',
    is_active: true,
  },
  {
    id: 'del-3',
    state: 'Lagos',
    city_area: 'Outer Lagos (Ikorodu, Epe, Badagry)',
    fee: 4500,
    estimated_days: '2 - 3 Business Days',
    is_active: true,
  },
  {
    id: 'del-4',
    state: 'Abuja (FCT)',
    city_area: 'Central / Wuse / Maitama / Garki / Gwarinpa',
    fee: 4500,
    estimated_days: '2 - 4 Business Days',
    is_active: true,
  },
  {
    id: 'del-5',
    state: 'Rivers',
    city_area: 'Port Harcourt (GRA, Old GRA, Trans Amadi, Peter Odili)',
    fee: 5000,
    estimated_days: '3 - 5 Business Days',
    is_active: true,
  },
  {
    id: 'del-6',
    state: 'Oyo',
    city_area: 'Ibadan (Bodija, Ring Road, Oluyole, Jericho)',
    fee: 4000,
    estimated_days: '2 - 4 Business Days',
    is_active: true,
  },
  {
    id: 'del-7',
    state: 'Enugu',
    city_area: 'Enugu Urban (Independence Layout, GRA, New Haven)',
    fee: 5000,
    estimated_days: '3 - 5 Business Days',
    is_active: true,
  },
  {
    id: 'del-8',
    state: 'Anambra',
    city_area: 'Awka / Onitsha / Nnewi',
    fee: 5500,
    estimated_days: '3 - 5 Business Days',
    is_active: true,
  },
  {
    id: 'del-9',
    state: 'Kano',
    city_area: 'Kano Metropolis / Nassarawa',
    fee: 6000,
    estimated_days: '4 - 6 Business Days',
    is_active: true,
  },
  {
    id: 'del-10',
    state: 'Delta',
    city_area: 'Asaba / Warri',
    fee: 5500,
    estimated_days: '3 - 5 Business Days',
    is_active: true,
  },
  {
    id: 'del-11',
    state: 'Nationwide (Other States)',
    city_area: 'Standard Interstate Courier Dispatch',
    fee: 6500,
    estimated_days: '4 - 7 Business Days',
    is_active: true,
  },
];

export const INITIAL_WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'wt-1',
    name: 'New Order / Checkout Notice',
    type: 'new_order',
    template_text:
      '🌟 *NEW ORDER #{order_number}* from {customer_name}\n\nHello {business_name}, I have placed an order on your website:\n\n📦 *Order Items:*\n{order_items_summary}\n\n💵 *Financial Summary:*\n• Subtotal: {order_subtotal}\n• Delivery Fee: {delivery_fee}\n• *Total Amount: {order_total}*\n\n📍 *Delivery Details:*\n• Name: {customer_name}\n• Phone: {customer_phone}\n• Address: {delivery_address}\n\nPlease confirm availability and payment details. Thank you!',
    is_active: true,
    is_default: true,
  },
  {
    id: 'wt-2',
    name: 'Order Confirmation to Customer',
    type: 'order_confirmation',
    template_text:
      'Hello *{customer_name}*! 👋\n\nThank you for choosing *{business_name}*! Your order *#{order_number}* has been confirmed.\n\n💰 Total: {order_total}\n🚚 Estimated Delivery: {delivery_address}\n\nOur team is carefully packing your items with the utmost hygiene and love. We will notify you once dispatched! For inquiries, reply right here.',
    is_active: true,
    is_default: false,
  },
  {
    id: 'wt-3',
    name: 'Payment Request',
    type: 'payment_request',
    template_text:
      'Hello *{customer_name}*,\n\nRegarding your order *#{order_number}* for *{order_total}*:\n\nPlease find our official banking details below:\n🏦 Bank: {bank_name}\n💳 Account Name: {account_name}\n🔢 Account Number: {account_number}\n\nKindly share your transfer receipt here for instant verification. Thank you!',
    is_active: true,
    is_default: false,
  },
  {
    id: 'wt-4',
    name: 'Order Shipped / On The Way',
    type: 'order_shipped',
    template_text:
      'Great news *{customer_name}*! 🚚✨\n\nYour order *#{order_number}* is now out for delivery to {delivery_address}.\n\nOur courier will contact you at {customer_phone} prior to arrival. Thank you for shopping with *{business_name}*!',
    is_active: true,
    is_default: false,
  },
  {
    id: 'wt-5',
    name: 'Order Delivered & Thank You',
    type: 'order_delivered',
    template_text:
      'Dear *{customer_name}*,\n\nYour package for order *#{order_number}* has been marked as DELIVERED! 🎉\n\nWe hope you and your little one cherish your items. We would be overjoyed to hear your feedback or see pictures! Have a wonderful day. ✨',
    is_active: true,
    is_default: false,
  },
  {
    id: 'wt-6',
    name: 'Single Product Inquiry',
    type: 'product_inquiry',
    template_text:
      'Hello *{business_name}*! 👋\n\nI am interested in purchasing:\n🛍️ *{product_name}*\n🏷️ SKU: {product_sku}\n💰 Price: {product_price}\n\nCould you please advise on availability and delivery timeline? Thank you!',
    is_active: true,
    is_default: false,
  },
  {
    id: 'wt-7',
    name: 'Back in Stock Notification',
    type: 'stock_available',
    template_text:
      'Good news *{customer_name}*! 🎉\n\nThe item you requested (*{product_name}*) is now BACK IN STOCK at *{business_name}*!\n\nGrab yours before it sells out again here: {product_url}\n\nThank you for waiting!',
    is_active: true,
    is_default: false,
  },
];

export const INITIAL_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'et-1',
    name: 'Order Confirmation',
    type: 'order_confirmation',
    subject: 'Order Confirmed: #{order_number} - {business_name}',
    body_html: `
      <h2>Thank You For Your Order, {customer_name}!</h2>
      <p>We're thrilled to prepare your package for order <strong>#{order_number}</strong>.</p>
      <hr/>
      <h3>Order Details:</h3>
      <p><strong>Total Amount:</strong> {order_total}</p>
      <p><strong>Delivery Location:</strong> {delivery_address}</p>
      <p><strong>Status:</strong> {order_status}</p>
      <br/>
      <p>If you have any questions, reply to this email or chat with us on WhatsApp at {whatsapp_number}.</p>
      <p>Warm regards,<br/>The {business_name} Team</p>
    `,
    is_active: true,
  },
  {
    id: 'et-2',
    name: 'Order Dispatched',
    type: 'order_shipped',
    subject: 'Your order #{order_number} has been dispatched! 🚀',
    body_html: `
      <h2>Your package is on its way!</h2>
      <p>Hi {customer_name}, your order <strong>#{order_number}</strong> has been handed over to our dispatch courier.</p>
      <p>Destination: {delivery_address}</p>
      <p>Estimated arrival in 1-3 business days. The driver will contact {customer_phone}.</p>
      <br/>
      <p>Thank you for choosing {business_name}!</p>
    `,
    is_active: true,
  },
  {
    id: 'et-3',
    name: 'Welcome New Customer',
    type: 'welcome',
    subject: 'Welcome to {business_name} family! ✨',
    body_html: `
      <h2>Welcome, {customer_name}!</h2>
      <p>Thank you for creating an account with {business_name}. You now have access to faster checkout, order tracking, and exclusive discounts for your little blessings.</p>
      <p>Explore our latest arrivals and seasonal promotions at our store.</p>
      <br/>
      <p>Blessings,<br/>The {business_name} Family</p>
    `,
    is_active: true,
  },
];

export const INITIAL_PROMOTIONAL_BANNERS: PromotionalBanner[] = [
  {
    id: 'ban-1',
    title: 'Back-to-School Mega Essentials',
    subtitle: 'Equip your young learners with ergonomic backpacks, thermal bento sets & orthopedic school shoes.',
    description: 'Premium water-resistant school backpacks, leakproof bento lunchboxes, stainless water bottles, and safe school accessories.',
    badge_text: 'BACK TO SCHOOL SALE • UP TO 30% OFF',
    button_text: 'Shop Back-to-School',
    link_url: '/shop?category=cat-backtoschool',
    category_id: 'cat-backtoschool',
    placement: 'all',
    image_url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80',
    mobile_image_url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
    bg_color: 'from-amber-950/80 via-slate-950/85 to-black',
    is_active: true,
    display_order: 1,
  },
  {
    id: 'ban-2',
    title: 'Pure Luxury Newborn & Maternity Care',
    subtitle: 'Hypoallergenic organic cotton sets, advanced anti-colic feeding systems, and soothing mother-care.',
    description: 'Certified organic cotton infant swaddles, hospital bag recovery packs, anti-colic bottles, and soothing postpartum care.',
    badge_text: 'NEW ARRIVALS 2026',
    button_text: 'Explore Newborn Collection',
    link_url: '/shop?category=cat-maternity',
    category_id: 'cat-maternity',
    placement: 'all',
    image_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80',
    mobile_image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    bg_color: 'from-yellow-950/80 via-slate-900/85 to-black',
    is_active: true,
    display_order: 2,
  },
  {
    id: 'ban-3',
    title: 'All-Terrain Strollers & Ergonomic Gear',
    subtitle: 'Engineered for safety, ease of travel, and luxurious comfort on every family journey.',
    description: 'Multi-terrain shock-absorbent strollers, convertible high chairs, ergonomic baby carriers, and safe travel cots.',
    badge_text: 'PREMIUM BABY GEAR',
    button_text: 'View Baby Gear',
    link_url: '/shop?category=cat-gear',
    category_id: 'cat-gear',
    placement: 'hero',
    image_url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
    mobile_image_url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=600&q=80',
    bg_color: 'from-stone-950/80 via-neutral-900/85 to-black',
    is_active: true,
    display_order: 3,
  },
];

export interface BannerImagePreset {
  id: string;
  label: string;
  category: string;
  desktopUrl: string;
  mobileUrl: string;
  thumbnail: string;
}

export const BANNER_IMAGE_PRESETS: BannerImagePreset[] = [
  {
    id: 'preset-school-1',
    label: 'School Backpacks & Supplies',
    category: 'Back to School',
    desktopUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'preset-school-2',
    label: 'Colorful Student Bags & Bottles',
    category: 'Back to School',
    desktopUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'preset-newborn-1',
    label: 'Organic Newborn Swaddles & Care',
    category: 'Newborn & Maternity',
    desktopUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'preset-newborn-2',
    label: 'Infant Clothing & Soft Booties',
    category: 'Newborn & Maternity',
    desktopUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'preset-mother-1',
    label: 'Mother Care & Postpartum Oils',
    category: 'Newborn & Maternity',
    desktopUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'preset-gear-1',
    label: 'Luxury Stroller & Travel Pram',
    category: 'Baby Gear',
    desktopUrl: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'preset-feeding-1',
    label: 'Anti-Colic Feeding Bottles & Care',
    category: 'Feeding & Nursing',
    desktopUrl: 'https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=1200&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'preset-feeding-2',
    label: 'Silicone Tableware & Suction Bowls',
    category: 'Feeding & Nursing',
    desktopUrl: 'https://images.unsplash.com/photo-1584839617966-547dfb6ef5dc?auto=format&fit=crop&w=1200&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1584839617966-547dfb6ef5dc?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1584839617966-547dfb6ef5dc?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'preset-clothing-1',
    label: 'Soft Cotton Rompers & Baby Knitwear',
    category: 'Baby Clothing',
    desktopUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    mobileUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80',
  },
];
