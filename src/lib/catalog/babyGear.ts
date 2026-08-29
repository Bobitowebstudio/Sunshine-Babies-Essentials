import { Product } from '../../types';
import { getProductPlaceholderSvg } from '../placeholders';

export const BABY_GEAR_PRODUCTS: Product[] = [
  {
    id: 'gear-001',
    name: 'All-Terrain Luxury Compact Fold Baby Stroller',
    slug: 'all-terrain-luxury-compact-fold-baby-stroller',
    description:
      'Engineered with aircraft-grade aluminum chassis, 4-wheel independent shock-absorbing suspension, and multi-position reclining seat (from upright to 175° flat bassinet sleep). Features one-hand auto-gravity fold mechanism, extendable UPF 50+ canopy, and extra-large undercarriage storage basket.',
    short_description: 'Premium one-hand compact auto-folding all-terrain travel stroller.',
    regular_price: 185000,
    discount_price: 159000,
    stock_quantity: 12,
    sku: 'GEAR-STR-001',
    category_id: 'cat-gear',
    subcategory: 'Baby Strollers',
    brand: 'AeroRide Luxe',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Onyx Black & Rose Gold Frame', hex: '#1E293B' },
        { name: 'Heather Grey & Silver Frame', hex: '#64748B' },
        { name: 'Emerald Forest Green', hex: '#065F46' },
      ],
    },
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 78,
    attributes: {
      Weight: '6.8 kg',
      FoldedDimensions: '54cm x 44cm x 24cm (Cabin Sized)',
      MaxWeightCapacity: '22 kg',
      Certification: 'EN1888-2 European Standard',
    },
    frequently_bought_together_ids: ['gear-002', 'gear-009'],
  },
  {
    id: 'gear-002',
    name: 'Ergonomic 6-in-1 Baby Carrier with Lumbar Hip Seat',
    slug: 'ergonomic-6-in-1-baby-carrier-with-lumbar-hip-seat',
    description:
      'International Hip Dysplasia Institute certified ergonomic baby carrier. Features a 3D memory foam anti-slip hip seat that distributes baby’s weight evenly across parents’ shoulders, back, and waist. Includes 3D breathable air-mesh panel, detachable sun hood, and zip storage pockets.',
    short_description: 'Hip-healthy 6-in-1 baby carrier with cushioned lumbar support.',
    regular_price: 36000,
    discount_price: 29500,
    stock_quantity: 24,
    sku: 'GEAR-CAR-002',
    category_id: 'cat-gear',
    subcategory: 'Baby Carriers',
    brand: 'Sunshine Babies Gear',
    age_group: '3-6 Months',
    images: [
      'https://images.unsplash.com/photo-1566004100631-35d015d6a491?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1566004100631-35d015d6a491?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Stone Grey', hex: '#94A3B8' },
        { name: 'Midnight Navy', hex: '#1E3A8A' },
        { name: 'Dusty Pink', hex: '#F472B6' },
      ],
    },
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 115,
  },
  {
    id: 'gear-003',
    name: 'Multi-Functional Anti-Rollover Musical Baby Walker',
    slug: 'multi-functional-anti-rollover-musical-baby-walker',
    description:
      'Wide U-shaped anti-rollover base with 3-position adjustable height settings to prevent bow-leggedness as baby grows. Features detachable interactive electronic music & light activity tray, silent 360° rubber wheels, and a padded machine-washable high-back seat cushion.',
    short_description: 'Anti-rollover height-adjustable baby walker with detachable music toy tray.',
    regular_price: 45000,
    discount_price: 38000,
    stock_quantity: 16,
    sku: 'GEAR-WLK-003',
    category_id: 'cat-gear',
    subcategory: 'Baby Walkers',
    brand: 'TinySteps Gear',
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
      colors: [
        { name: 'Nordic Mint & Grey', hex: '#A7F3D0' },
        { name: 'Pastel Blush', hex: '#FCE7F3' },
      ],
    },
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.7,
    reviews_count: 44,
  },
  {
    id: 'gear-004',
    name: 'Foldable Portable Travel Baby Cot & Bassinet',
    slug: 'foldable-portable-travel-baby-cot-bassinet',
    description:
      '2-tier travel playpen and bedside crib. Includes removable full-size bassinet for infants up to 6 months, wipe-clean changing table, zip-open toddler side play door, breathable all-mesh walls, and compact travel carry bag with wheels.',
    short_description: '2-in-1 portable folding travel cot with bassinet and changing station.',
    regular_price: 88000,
    discount_price: 74500,
    stock_quantity: 10,
    sku: 'GEAR-COT-004',
    category_id: 'cat-gear',
    subcategory: 'Baby Cots',
    brand: 'NurseryDreams',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    },
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 59,
  },
  {
    id: 'gear-005',
    name: 'Extra Large Safety Baby Playpen with Crawling Mat',
    slug: 'extra-large-safety-baby-playpen-crawling-mat',
    description:
      'Spacious 180cm x 150cm secure play yard made with 300D Oxford cloth, padded alloy steel tubing, non-slip suction bases, and 360° full see-through breathable mesh. Includes thick foldable double-sided foam playmat.',
    short_description: 'Large safe play area with padded steel frame and crawling mat.',
    regular_price: 65000,
    discount_price: 54900,
    stock_quantity: 14,
    sku: 'GEAR-PEN-005',
    category_id: 'cat-gear',
    subcategory: 'Baby Playpens',
    brand: 'Sunshine Babies Gear',
    age_group: '6-12 Months',
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=1000&q=80'
    },
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 31,
  },
  {
    id: 'gear-006',
    name: 'Smart Bluetooth Electric Baby Bouncer & Swing Chair',
    slug: 'smart-bluetooth-electric-baby-bouncer-swing-chair',
    description:
      'Imitates the natural gentle swaying motion of parents with 5 sway speeds, built-in soothing lullabies, and Bluetooth audio streaming. Includes remote control, touch screen, and plush supportive infant head pillow.',
    short_description: 'Bluetooth 5-speed motorized soothing baby swing with remote control.',
    regular_price: 75000,
    discount_price: 63000,
    stock_quantity: 12,
    sku: 'GEAR-BNC-006',
    category_id: 'cat-gear',
    subcategory: 'Baby Bouncers',
    brand: 'AeroRide Luxe',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80'
    },
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 67,
  },
  {
    id: 'gear-007',
    name: '3-in-1 Convertible Wooden Baby High Chair with Removable Tray',
    slug: '3-in-1-convertible-wooden-baby-high-chair',
    description:
      'Constructed with solid beech wood legs, BPA-free food tray with dishwasher-safe top insert, 5-point safety harness, and stain-resistant PU leather seat pad. Converts easily from high chair to toddler booster seat and study chair.',
    short_description: 'Modern beech wood convertible high chair and toddler booster seat.',
    regular_price: 52000,
    discount_price: 43500,
    stock_quantity: 18,
    sku: 'GEAR-HCH-007',
    category_id: 'cat-gear',
    subcategory: 'Baby High Chairs',
    brand: 'NurseryDreams',
    age_group: '6-12 Months',
    images: [
      'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80'
    },
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 52,
  },
  {
    id: 'gear-008',
    name: 'Nursery Glider Rocking Chair with Cushioned Ottoman',
    slug: 'nursery-glider-rocking-chair-cushioned-ottoman',
    description:
      'Enclosed metal ball-bearing mechanism ensures ultra-smooth, silent gliding motion ideal for late-night nursing and soothing baby to sleep. Padded armrests feature side storage pockets for books and feeding bottles.',
    short_description: 'Ergonomic smooth gliding nursing rocker with padded footrest ottoman.',
    regular_price: 135000,
    discount_price: 115000,
    stock_quantity: 8,
    sku: 'GEAR-RCK-008',
    category_id: 'cat-gear',
    subcategory: 'Baby Rocking Chairs',
    brand: 'NurseryDreams',
    age_group: 'All Ages',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=1000&q=80'
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 24,
  },
  {
    id: 'gear-009',
    name: 'Waterproof Oxford Multi-Pocket Baby Diaper Backpack Bag',
    slug: 'waterproof-oxford-multi-pocket-baby-diaper-backpack-bag',
    description:
      'Engineered with 16 smart compartments including 3 thermal insulated baby bottle pockets, dedicated waterproof wet-towel zipper pocket, side tissue dispenser, and USB charging port. Features stroller hanging straps and cushioned ergonomic shoulder pads.',
    short_description: 'Large-capacity waterproof diaper bag backpack with insulated bottle slots.',
    regular_price: 26000,
    discount_price: 21500,
    stock_quantity: 35,
    sku: 'GEAR-BAG-009',
    category_id: 'cat-gear',
    subcategory: 'Baby Diaper Bags',
    brand: 'Sunshine Babies Gear',
    age_group: 'All Ages',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Granite Grey', hex: '#64748B' },
        { name: 'Obsidian Black', hex: '#0F172A' },
        { name: 'Blush Pink', hex: '#F472B6' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 142,
  },
];
