import { Product } from '../../types';
import { getProductPlaceholderSvg } from '../placeholders';

export const BABY_ESSENTIALS_PRODUCTS: Product[] = [
  {
    id: 'ess-001',
    name: '100% Organic Bamboo Muslin Baby Swaddles (4-Pack)',
    slug: 'organic-bamboo-muslin-baby-swaddles-4pack',
    description:
      'Crafted from silky-soft 70% bamboo and 30% organic cotton muslin. Pre-washed for extreme softness, lightweight, and highly breathable to regulate infant body temperature. Large 120cm x 120cm size makes swaddling effortless.',
    short_description: 'Set of 4 ultra-soft, breathable bamboo muslin multi-purpose swaddle blankets.',
    regular_price: 18000,
    discount_price: 14900,
    stock_quantity: 40,
    sku: 'ESS-SWA-001',
    category_id: 'cat-baby-essentials',
    subcategory: 'Baby Swaddles',
    brand: 'Sunshine Babies Nursery',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Safari Animals', hex: '#E5E7EB' },
        { name: 'Eucalyptus Sage', hex: '#A7F3D0' },
        { name: 'Warm Terracotta', hex: '#FDBA74' },
      ],
    },
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 110,
    attributes: {
      Dimensions: '120cm x 120cm (47" x 47")',
      Fabric: '70% Bamboo Rayon, 30% GOTS Organic Cotton',
    },
    frequently_bought_together_ids: ['ess-003', 'ess-006'],
  },
  {
    id: 'ess-002',
    name: 'Plush Sherpa Fleece Reversible Baby Blanket',
    slug: 'plush-sherpa-fleece-reversible-baby-blanket',
    description:
      'Double-layer ultra-warm infant blanket featuring a textured embossed minky front and a fluffy cloud-soft sherpa fleece back. Ideal for cribs, strollers, tummy time, and car rides.',
    short_description: 'Cozy embossed minky & sherpa fleece nursery blanket.',
    regular_price: 16500,
    discount_price: 13500,
    stock_quantity: 26,
    sku: 'ESS-BLK-002',
    category_id: 'cat-baby-essentials',
    subcategory: 'Baby Blankets',
    brand: 'Sunshine Babies Nursery',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Soft Cream', hex: '#FDFBF7' },
        { name: 'Baby Blue', hex: '#93C5FD' },
        { name: 'Blush Pink', hex: '#F472B6' },
      ],
    },
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 53,
  },
  {
    id: 'ess-003',
    name: 'Waterproof Food-Grade Silicone Baby Bibs Set (3-Pack)',
    slug: 'waterproof-food-grade-silicone-baby-bibs-set-3pack',
    description:
      '100% food-grade BPA-free silicone bibs with wide, deep spill-catcher pockets to capture falling foods and liquids. Features 4 adjustable neck buttons suitable for babies and toddlers 6 months to 3 years. Dishwasher safe and wipes clean instantly.',
    short_description: 'Trio of soft waterproof silicone bibs with wide crumb-catcher pockets.',
    regular_price: 9500,
    discount_price: 7900,
    stock_quantity: 50,
    sku: 'ESS-BIB-003',
    category_id: 'cat-baby-essentials',
    subcategory: 'Baby Bibs',
    brand: 'TinyBites',
    age_group: '6-12 Months',
    images: [
      'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Pastel Trio (Sage/Peach/Mustard)', hex: '#D1FAE5' },
        { name: 'Modern Neutral (Beige/Olive/Clay)', hex: '#E5E7EB' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 76,
  },
  {
    id: 'ess-004',
    name: 'Ultra-Soft Hooded Bamboo Baby Bath Towel Set with Washcloths',
    slug: 'ultra-soft-hooded-bamboo-baby-bath-towel-set',
    description:
      'Made from thick 500 GSM natural organic bamboo terry that absorbs water 3x faster than cotton. Keeps baby warm and dry directly out of the bath. Features cute bear ears on the hood.',
    short_description: 'Extra absorbent 500GSM hooded bamboo towel + 2 matching washcloths.',
    regular_price: 17000,
    discount_price: 13900,
    stock_quantity: 28,
    sku: 'ESS-TWL-004',
    category_id: 'cat-baby-essentials',
    subcategory: 'Baby Towels',
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
        { name: 'Cloud White', hex: '#FFFFFF' },
        { name: 'Oatmeal Beige', hex: '#F5F5DC' },
      ],
    },
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 41,
  },
  {
    id: 'ess-005',
    name: 'Non-Slip Soft Grip Cotton Baby Ankle Socks (6-Pack)',
    slug: 'non-slip-soft-grip-cotton-baby-ankle-socks-6pack',
    description:
      'High-cotton blend elastic socks with customized anti-skid silicone dot bottoms to protect crawling babies and active walking toddlers on tile and wooden floors.',
    short_description: 'Pack of 6 breathable combed cotton socks with non-slip grips.',
    regular_price: 7500,
    discount_price: 5900,
    stock_quantity: 65,
    sku: 'ESS-SOX-005',
    category_id: 'cat-baby-essentials',
    subcategory: 'Baby Socks',
    brand: 'TinySteps',
    age_group: '6-12 Months',
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      sizes: ['0-6 Months', '6-12 Months', '1-3 Years'],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 94,
  },
  {
    id: 'ess-006',
    name: 'Scratch-Free Newborn Baby Mittens & Beanie Hat Set',
    slug: 'scratch-free-newborn-baby-mittens-beanie-hat-set',
    description:
      'Protects delicate newborn facial skin from involuntary fingernail scratches while keeping head cozy and warm. Designed with gentle stay-on wristbands that do not leave red marks.',
    short_description: '3 pairs of non-scratch cotton mittens and 3 adjustable knot beanies.',
    regular_price: 8500,
    discount_price: 6800,
    stock_quantity: 35,
    sku: 'ESS-MIT-006',
    category_id: 'cat-baby-essentials',
    subcategory: 'Baby Mittens',
    brand: 'Sunshine Babies Nursery',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Neutral Earth Tones', hex: '#D6D3D1' },
        { name: 'Sweet Pastel Mix', hex: '#FCE7F3' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.7,
    reviews_count: 61,
  },
  {
    id: 'ess-007',
    name: 'Foldable Waterproof Portable Baby Changing Mat',
    slug: 'foldable-waterproof-portable-baby-changing-mat',
    description:
      'Compact foldable diaper changing clutch with built-in cushioned sponge head pillow, waterproof wipe-clean PEVA surface, and zippered storage pockets for wipes and diapers.',
    short_description: 'Waterproof on-the-go travel changing station with padded pillow.',
    regular_price: 12000,
    discount_price: 9900,
    stock_quantity: 30,
    sku: 'ESS-MAT-007',
    category_id: 'cat-baby-essentials',
    subcategory: 'Baby Changing Mats',
    brand: 'Sunshine Babies Care',
    age_group: '0-3 Months',
    images: [
      getProductPlaceholderSvg('Foldable Waterproof Portable Baby Changing Mat', 'cat-baby-essentials', 'main'),
      getProductPlaceholderSvg('Foldable Waterproof Portable Baby Changing Mat', 'cat-baby-essentials', 'front'),
    ],
    image_views: {
      main: getProductPlaceholderSvg('Foldable Waterproof Portable Baby Changing Mat', 'cat-baby-essentials', 'main'),
      front: getProductPlaceholderSvg('Foldable Waterproof Portable Baby Changing Mat', 'cat-baby-essentials', 'front'),
    },
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 32,
  },
  {
    id: 'ess-008',
    name: 'Top-Knot Adjustable Stretchy Newborn Baby Turbans & Hats (4-Pack)',
    slug: 'top-knot-adjustable-newborn-baby-turbans-hats-4pack',
    description:
      'Super stretchy soft ribbed cotton blend newborn hats with adjustable top knots. Soft on sensitive scalps and expands comfortably as baby grows.',
    short_description: 'Set of 4 soft ribbed stretchy newborn top knot caps.',
    regular_price: 9000,
    discount_price: 7200,
    stock_quantity: 24,
    sku: 'ESS-HAT-008',
    category_id: 'cat-baby-essentials',
    subcategory: 'Baby Hats',
    brand: 'TinySteps',
    age_group: '0-3 Months',
    images: [
      getProductPlaceholderSvg('Top-Knot Adjustable Stretchy Newborn Baby Turbans & Hats (4-Pack)', 'cat-baby-essentials', 'main'),
      getProductPlaceholderSvg('Top-Knot Adjustable Stretchy Newborn Baby Turbans & Hats (4-Pack)', 'cat-baby-essentials', 'front'),
    ],
    image_views: {
      main: getProductPlaceholderSvg('Top-Knot Adjustable Stretchy Newborn Baby Turbans & Hats (4-Pack)', 'cat-baby-essentials', 'main'),
      front: getProductPlaceholderSvg('Top-Knot Adjustable Stretchy Newborn Baby Turbans & Hats (4-Pack)', 'cat-baby-essentials', 'front'),
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.6,
    reviews_count: 22,
  },
];
