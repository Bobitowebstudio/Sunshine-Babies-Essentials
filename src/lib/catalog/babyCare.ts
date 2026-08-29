import { Product } from '../../types';
import { getProductPlaceholderSvg } from '../placeholders';

export const BABY_CARE_PRODUCTS: Product[] = [
  {
    id: 'car-001',
    name: 'Smart Foldable Baby Bath Tub with Real-Time Digital Temperature Sensor',
    slug: 'smart-foldable-baby-bath-tub-digital-temp-sensor',
    description:
      'Ultra-compact collapsible infant bathtub equipped with built-in real-time digital LCD water temperature display to guarantee baby never gets chilled or scalded. Includes ergonomic soft newborn bath cushion hammock and bottom drain plug with heat-sensing color change.',
    short_description: 'Collapsible smart baby bathtub with LCD digital temperature display & newborn cushion.',
    regular_price: 34000,
    discount_price: 28500,
    stock_quantity: 22,
    sku: 'CAR-TUB-001',
    category_id: 'cat-care',
    subcategory: 'Baby Bath Tubs',
    brand: 'PureCare Baby',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Nordic Blue & White', hex: '#60A5FA' },
        { name: 'Powder Pink & White', hex: '#F472B6' },
        { name: 'Sage Mint & White', hex: '#6EE7B7' },
      ],
    },
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 82,
    frequently_bought_together_ids: ['car-002', 'car-004'],
  },
  {
    id: 'car-002',
    name: '8-in-1 Baby Grooming & Health Care Safety Kit in Portable Hard Case',
    slug: '8-in-1-baby-grooming-health-care-safety-kit',
    description:
      'Complete pediatric hygiene toolkit: round-tip stainless safety nail scissors, ergonomic nail clippers, glass nail file, soft silicone finger toothbrush, round-tooth comb, soft bristle goat hair brush, nasal aspirator with soft suction tip, and oral medicine dropper.',
    short_description: '8-piece medical-grade newborn grooming & wellness toolkit in travel zipper case.',
    regular_price: 15500,
    discount_price: 12500,
    stock_quantity: 45,
    sku: 'CAR-GRM-002',
    category_id: 'cat-care',
    subcategory: 'Baby Grooming Kits',
    brand: 'PureCare Baby',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Pastel Aqua', hex: '#67E8F9' },
        { name: 'Blush Coral', hex: '#FDA4AF' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 104,
  },
  {
    id: 'car-003',
    name: 'Natural Wooden Goat Hair Baby Hairbrush & Detangling Comb Set',
    slug: 'natural-wooden-goat-hair-baby-hairbrush-comb-set',
    description:
      'Handcrafted from sustainable solid beech wood with ultra-soft 100% natural goat hair bristles. Gently massages delicate infant scalp, promotes blood circulation, and prevents and treats cradle cap without scratching.',
    short_description: 'Natural solid beech wood & ultra-soft goat bristle cradle cap brush set.',
    regular_price: 12000,
    discount_price: 9800,
    stock_quantity: 35,
    sku: 'CAR-BRS-003',
    category_id: 'cat-care',
    subcategory: 'Baby Hair Brushes',
    brand: 'PureCare Baby',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    },
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 47,
  },
  {
    id: 'car-004',
    name: 'Safe-Touch Electric Baby Nail Trimmer with LED Front Light',
    slug: 'safe-touch-electric-baby-nail-trimmer-led-light',
    description:
      'Whisper-quiet (35dB) motorized electric baby nail file with 6 color-coded interchangeable cushioned sanding heads for different baby age stages (0-3M, 3-6M, 6-12M, 12M+ and adults). Gently files tiny fingernails without touching soft cuticles. Built-in LED light for nighttime clipping.',
    short_description: 'Whisper-quiet electric infant nail file with 6 age-graded sanding pads & LED light.',
    regular_price: 14500,
    discount_price: 11900,
    stock_quantity: 40,
    sku: 'CAR-TRM-004',
    category_id: 'cat-care',
    subcategory: 'Baby Nail Care Kits',
    brand: 'PureCare Baby',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80'
    },
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 91,
  },
  {
    id: 'car-005',
    name: 'Extra-Thick 100% Organic Bamboo Hooded Baby Bath Towel Set with Ears',
    slug: 'extra-thick-organic-bamboo-hooded-baby-bath-towel',
    description:
      'Luxury 500 GSM thick organic bamboo towel with cute teddy bear hood ears. Absorbs water rapidly to prevent post-bath shivering while remaining ultra-gentle on eczema-prone and sensitive baby skin. Includes 2 matching washcloths.',
    short_description: '500 GSM ultra-absorbent organic bamboo hooded towel + 2 washcloths.',
    regular_price: 18500,
    discount_price: 14900,
    stock_quantity: 30,
    sku: 'CAR-TWL-005',
    category_id: 'cat-care',
    subcategory: 'Baby Bath Towels',
    brand: 'Sunshine Babies Care',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Oatmeal Beige', hex: '#E5DCC5' },
        { name: 'Pure Cloud White', hex: '#FFFFFF' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 53,
  },
  {
    id: 'car-006',
    name: 'Multi-Pocket Nursery Diaper Caddy Organizer Basket',
    slug: 'multi-pocket-nursery-diaper-caddy-organizer-basket',
    description:
      'Large portable felt diaper tote with customizable modular velcro dividers and 8 exterior deep pockets. Keeps diapers, wipes, lotions, pacifiers, and burp cloths neatly organized and easily transportable from bedroom to living room.',
    short_description: 'Portable felt diaper organizer caddy with modular dividers & 8 pockets.',
    regular_price: 13500,
    discount_price: 10800,
    stock_quantity: 32,
    sku: 'CAR-CAD-006',
    category_id: 'cat-care',
    subcategory: 'Baby Changing Accessories',
    brand: 'Sunshine Babies Care',
    age_group: 'All Ages',
    images: [
      getProductPlaceholderSvg('Multi-Pocket Nursery Diaper Caddy Organizer Basket', 'cat-care', 'main'),
      getProductPlaceholderSvg('Multi-Pocket Nursery Diaper Caddy Organizer Basket', 'cat-care', 'front'),
    ],
    image_views: {
      main: getProductPlaceholderSvg('Multi-Pocket Nursery Diaper Caddy Organizer Basket', 'cat-care', 'main'),
      front: getProductPlaceholderSvg('Multi-Pocket Nursery Diaper Caddy Organizer Basket', 'cat-care', 'front'),
    },
    variants: {
      colors: [
        { name: 'Charcoal Grey & Leather Handles', hex: '#4B5563' },
        { name: 'Oatmeal Heather', hex: '#D6D3D1' },
      ],
    },
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 68,
  },
];
