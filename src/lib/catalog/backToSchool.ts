import { Product } from '../../types';
import { getProductPlaceholderSvg } from '../placeholders';

export const BACK_TO_SCHOOL_PRODUCTS: Product[] = [
  {
    id: 'b2s-001',
    name: 'Ergonomic Orthopedic Waterproof Children\'s School Backpack',
    slug: 'ergonomic-orthopedic-waterproof-childrens-school-backpack',
    description:
      'Engineered with 3D spine-relief cushioned back padding, S-curve honeycomb breathable shoulder straps, and adjustable chest stabilizer clip to protect growing children’s backs. High-density waterproof lotus-leaf fabric with 360° reflective safety strips for road visibility. Multiple organized compartments with laptop/tablet sleeve.',
    short_description: 'Spine-protection waterproof school backpack with reflective safety strips.',
    regular_price: 26000,
    discount_price: 21900,
    stock_quantity: 35,
    sku: 'B2S-BPK-001',
    category_id: 'cat-backtoschool',
    subcategory: 'Children\'s School Backpacks',
    brand: 'JuniorPro Scholar',
    age_group: '10-12 Years',
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Cosmic Space Blue', hex: '#1E3A8A' },
        { name: 'Pastel Dream Pink', hex: '#F472B6' },
        { name: 'Cyber Neon Purple', hex: '#7E22CE' },
      ],
    },
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 89,
    attributes: {
      Dimensions: '42cm x 30cm x 18cm',
      Weight: '650g (Lightweight)',
      Material: 'Water-Repellent 900D Nylon',
      Safety: '360° Nighttime High-Reflective Piping',
    },
    frequently_bought_together_ids: ['b2s-003', 'b2s-004'],
  },
  {
    id: 'b2s-002',
    name: '3-in-1 Complete Children\'s School Bag Set (Backpack + Thermal Lunch Bag + Pencil Pouch)',
    slug: '3-in-1-complete-childrens-school-bag-set',
    description:
      'Coordinated full school travel kit including 1 large multi-pocket student backpack, 1 insulated aluminum-lined thermal lunch bag, and 1 matching zippered stationery pencil pouch. Durable scratch-resistant fabric with reinforced stress-point stitching.',
    short_description: 'Coordinated 3-piece backpack, insulated lunchbox & pencil case set.',
    regular_price: 38000,
    discount_price: 31500,
    stock_quantity: 24,
    sku: 'B2S-SET-002',
    category_id: 'cat-backtoschool',
    subcategory: 'School Bags',
    brand: 'JuniorPro Scholar',
    age_group: '5-7 Years',
    images: [
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Galaxy Dinosaur Navy', hex: '#172554' },
        { name: 'Magical Unicorn Lilac', hex: '#DDD6FE' },
      ],
    },
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 114,
  },
  {
    id: 'b2s-003',
    name: 'Insulated 4-Compartment Stainless Steel Kids Bento Lunch Box',
    slug: 'insulated-4-compartment-stainless-steel-kids-bento-lunch-box',
    description:
      'Removable food-grade 304 stainless steel tray with 4 leakproof divided sections. Features an outer thermal hot-water insulation bowl to keep meals warm before lunchtime, airtight silicone seal latches, and included fork & spoon set stored in the lid.',
    short_description: '4-compartment leakproof 304 stainless steel thermal bento lunch box with cutlery.',
    regular_price: 16500,
    discount_price: 13500,
    stock_quantity: 40,
    sku: 'B2S-LNC-003',
    category_id: 'cat-backtoschool',
    subcategory: 'Lunch Boxes',
    brand: 'EcoJunior',
    age_group: '3-5 Years',
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Mint Green', hex: '#86EFAC' },
        { name: 'Blush Coral', hex: '#FDA4AF' },
        { name: 'Cobalt Blue', hex: '#3B82F6' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 76,
  },
  {
    id: 'b2s-004',
    name: 'Double-Wall Vacuum Insulated Kids Stainless Steel Water Bottle with Straw (500ml)',
    slug: 'double-wall-vacuum-insulated-kids-stainless-water-bottle-500ml',
    description:
      'Keeps drinks icy cold for 24 hours or warm for 12 hours. Features 100% leakproof push-button flip lid with soft food-grade silicone drinking straw, safety lock latch, and protective non-slip silicone bottom boot.',
    short_description: '500ml vacuum insulated 316 stainless water flask with flip straw.',
    regular_price: 12500,
    discount_price: 9900,
    stock_quantity: 50,
    sku: 'B2S-BTL-004',
    category_id: 'cat-backtoschool',
    subcategory: 'Children\'s Water Bottles',
    brand: 'EcoJunior',
    age_group: '7-10 Years',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Dino Green', hex: '#22C55E' },
        { name: 'Ocean Aqua', hex: '#06B6D4' },
        { name: 'Flamingo Pink', hex: '#EC4899' },
      ],
    },
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 65,
  },
  {
    id: 'b2s-005',
    name: '3D Embossed Hardtop Multi-Layer Kids Pencil Case Organizer',
    slug: '3d-embossed-hardtop-multi-layer-kids-pencil-case',
    description:
      'Durable EVA shockproof hard shell with vivid 3D embossed pop-out character designs. Opens like a book with dual zippers, large mesh pocket, 5 individual pen slots, and large bottom compartment that holds up to 60 pencils and stationery items.',
    short_description: 'Shockproof 3D embossed EVA hardtop large capacity pencil case.',
    regular_price: 7500,
    discount_price: 5900,
    stock_quantity: 45,
    sku: 'B2S-PNC-005',
    category_id: 'cat-backtoschool',
    subcategory: 'Pencil Cases',
    brand: 'JuniorPro Scholar',
    age_group: '5-7 Years',
    images: [
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Astronaut Space Theme', hex: '#3B82F6' },
        { name: 'Unicorn Rainbow Theme', hex: '#F472B6' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.7,
    reviews_count: 42,
  },
  {
    id: 'b2s-006',
    name: 'Classic Black Genuine Leather School Uniform Shoes with Cushion Insole',
    slug: 'classic-black-genuine-leather-school-uniform-shoes',
    description:
      'Heavy-duty genuine black leather uniform shoes with scuff-resistant toe bumper, antibacterial memory foam cushioned footbed, easy hook-and-loop Velcro strap, and non-marking slip-resistant rubber soles.',
    short_description: 'Durable genuine leather school uniform shoes with scuff-resistant toes.',
    regular_price: 24000,
    discount_price: 19500,
    stock_quantity: 30,
    sku: 'B2S-SHU-006',
    category_id: 'cat-backtoschool',
    subcategory: 'School Shoes',
    brand: 'StepSmart School',
    age_group: '7-10 Years',
    images: [
      getProductPlaceholderSvg('Classic Black Genuine Leather School Uniform Shoes with Cushion Insole', 'cat-backtoschool', 'main'),
      getProductPlaceholderSvg('Classic Black Genuine Leather School Uniform Shoes with Cushion Insole', 'cat-backtoschool', 'front'),
    ],
    image_views: {
      main: getProductPlaceholderSvg('Classic Black Genuine Leather School Uniform Shoes with Cushion Insole', 'cat-backtoschool', 'main'),
      front: getProductPlaceholderSvg('Classic Black Genuine Leather School Uniform Shoes with Cushion Insole', 'cat-backtoschool', 'front'),
    },
    variants: {
      sizes: ['EU 26', 'EU 28', 'EU 30', 'EU 32', 'EU 34', 'EU 36'],
      colors: [
        { name: 'Polished Black Leather', hex: '#000000' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 58,
  },
  {
    id: 'b2s-007',
    name: 'Non-Slip Breathable Children\'s School Sandals',
    slug: 'non-slip-breathable-childrens-school-sandals',
    description:
      'Lightweight athletic school sandals with adjustable triple-strap Velcro closures, shock-absorbing EVA midsole, and high-traction rubber outsoles for active playground playtime.',
    short_description: 'Comfortable durable double-strap school sandals with arch support.',
    regular_price: 16500,
    discount_price: 13500,
    stock_quantity: 26,
    sku: 'B2S-SAN-007',
    category_id: 'cat-backtoschool',
    subcategory: 'Children\'s Sandals',
    brand: 'StepSmart School',
    age_group: '3-5 Years',
    images: [
      getProductPlaceholderSvg('Non-Slip Breathable Children\'s School Sandals', 'cat-backtoschool', 'main'),
      getProductPlaceholderSvg('Non-Slip Breathable Children\'s School Sandals', 'cat-backtoschool', 'front'),
    ],
    image_views: {
      main: getProductPlaceholderSvg('Non-Slip Breathable Children\'s School Sandals', 'cat-backtoschool', 'main'),
      front: getProductPlaceholderSvg('Non-Slip Breathable Children\'s School Sandals', 'cat-backtoschool', 'front'),
    },
    variants: {
      sizes: ['EU 26', 'EU 28', 'EU 30', 'EU 32', 'EU 34'],
      colors: [
        { name: 'Classic Black', hex: '#1E293B' },
        { name: 'Deep Brown', hex: '#451A03' },
      ],
    },
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 36,
  },
  {
    id: 'b2s-008',
    name: '120-Piece Complete Student Back-to-School Stationery & Art Supplies Kit',
    slug: '120-piece-complete-student-stationery-art-kit',
    description:
      'All-in-one classroom essentials mega bundle: 24 colored pencils, 12 HB graphite pencils, 12 gel pens, dual-hole pencil sharpener, safety scissors, non-toxic glue sticks, geometric ruler set, erasers, and highlighter markers.',
    short_description: 'Complete 120-piece back-to-school writing, geometry & art supply pack.',
    regular_price: 19500,
    discount_price: 15900,
    stock_quantity: 40,
    sku: 'B2S-ART-008',
    category_id: 'cat-backtoschool',
    subcategory: 'Kids\' Stationery Accessories',
    brand: 'JuniorPro Scholar',
    age_group: '10-12 Years',
    images: [
      getProductPlaceholderSvg('120-Piece Complete Student Back-to-School Stationery & Art Supplies Kit', 'cat-backtoschool', 'main'),
      getProductPlaceholderSvg('120-Piece Complete Student Back-to-School Stationery & Art Supplies Kit', 'cat-backtoschool', 'front'),
    ],
    image_views: {
      main: getProductPlaceholderSvg('120-Piece Complete Student Back-to-School Stationery & Art Supplies Kit', 'cat-backtoschool', 'main'),
      front: getProductPlaceholderSvg('120-Piece Complete Student Back-to-School Stationery & Art Supplies Kit', 'cat-backtoschool', 'front'),
    },
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 63,
  },
];
