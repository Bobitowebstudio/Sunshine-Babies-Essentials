import { Product } from '../../types';
import { getProductPlaceholderSvg } from '../placeholders';

export const MOTHER_CARE_PRODUCTS: Product[] = [
  {
    id: 'mot-001',
    name: 'Organic Bamboo Washable & Reusable Breast Pads (8-Pack with Laundry Bag)',
    slug: 'organic-bamboo-washable-reusable-breast-pads-8pack',
    description:
      'Ultra-soft 3-layer leakproof nursing pads with organic bamboo inner layer against sensitive nipples, microfiber absorbent core, and breathable waterproof PUL outer shell. Eco-friendly and washable with included mesh wash bag.',
    short_description: 'Set of 8 ultra-soft leakproof organic bamboo washable nursing breast pads.',
    regular_price: 11500,
    discount_price: 9200,
    stock_quantity: 50,
    sku: 'MOT-PAD-001',
    category_id: 'cat-mothercare',
    subcategory: 'Breast Pads',
    brand: 'MamaCare Pro',
    age_group: 'Maternity',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 73,
    frequently_bought_together_ids: ['mot-002', 'mot-004'],
  },
  {
    id: 'mot-002',
    name: 'Multi-Compartment Maternity & Labor Hospital Overnight Duffel Bag',
    slug: 'maternity-labor-hospital-overnight-duffel-bag',
    description:
      'Spacious waterproof weekender hospital bag featuring separate dry/wet waterproof zipper compartment, dedicated lower shoe and slipper deck, trolley luggage sleeve, and insulated bottle slots for mother and newborn essentials.',
    short_description: 'Waterproof multi-compartment hospital delivery duffel bag with shoe deck.',
    regular_price: 35000,
    discount_price: 29500,
    stock_quantity: 20,
    sku: 'MOT-BAG-002',
    category_id: 'cat-mothercare',
    subcategory: 'Maternity Hospital Bags',
    brand: 'MamaCare Pro',
    age_group: 'Maternity',
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
        { name: 'Dusty Rose & Gold', hex: '#FDA4AF' },
        { name: 'Slate Charcoal', hex: '#475569' },
      ],
    },
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 88,
  },
  {
    id: 'mot-003',
    name: 'Complete Postpartum Labor Recovery & Soothing Essentials Kit',
    slug: 'complete-postpartum-labor-recovery-soothing-essentials-kit',
    description:
      'All-in-one postpartum care kit for vaginal or C-section recovery: ergonomic upside-down peri wash bottle (300ml), herbal perineal soothing spray, instant cooling crackle maxi pads (4-pack), and 3 pairs of high-waist stretch disposable recovery briefs.',
    short_description: 'Complete 4-piece postpartum perineal soothing & hygiene recovery kit.',
    regular_price: 26000,
    discount_price: 21900,
    stock_quantity: 25,
    sku: 'MOT-KIT-003',
    category_id: 'cat-mothercare',
    subcategory: 'Mother Care Gift Sets',
    brand: 'MamaCare Pro',
    age_group: 'Maternity',
    images: [
      'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80'
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 61,
  },
  {
    id: 'mot-004',
    name: 'Ultra-Quiet Hands-Free Wearable Double Electric Breast Pump with Smart LED Screen',
    slug: 'ultra-quiet-hands-free-wearable-double-electric-breast-pump',
    description:
      'Fits discreetly inside any standard bra without dangling bottles or tubes. Features 3 stimulation/expression modes with 9 customizable suction levels, ultra-quiet <40dB motor, anti-backflow silicone closed system, and 1200mAh USB rechargeable battery.',
    short_description: 'Wireless hands-free wearable double electric pump with memory & LED display.',
    regular_price: 72000,
    discount_price: 59900,
    stock_quantity: 16,
    sku: 'MOT-PMP-004',
    category_id: 'cat-mothercare',
    subcategory: 'Breast Pumps',
    brand: 'MilkyPro Electronic',
    age_group: 'Maternity',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=1000&q=80'
    },
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 95,
  },
  {
    id: 'mot-005',
    name: 'Breathable Bamboo 360° Full-Coverage Privacy Nursing Cover Shawl',
    slug: 'breathable-bamboo-360-privacy-nursing-cover-shawl',
    description:
      'Provides 360° front and back modesty coverage while nursing in public spaces. Rigid open arched neckline allows mom to look down and maintain direct eye contact with baby while promoting constant airflow.',
    short_description: '360° modesty breastfeeding cover with arched eye-contact viewing neck.',
    regular_price: 9500,
    discount_price: 7800,
    stock_quantity: 30,
    sku: 'MOT-COV-005',
    category_id: 'cat-mothercare',
    subcategory: 'Nursing Covers',
    brand: 'MamaCare Pro',
    age_group: 'Maternity',
    images: [
      'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Oatmeal Stripe', hex: '#E5E7EB' },
        { name: 'Dusty Sage', hex: '#A7F3D0' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 34,
  },
  {
    id: 'mot-006',
    name: 'Wireless Seamless Sleep & Nursing Bralette (3-Pack)',
    slug: 'wireless-seamless-sleep-nursing-bralette-3pack',
    description:
      'Buttery-soft modal crossover front bra designed for zero-pressure sleeping and effortless pull-aside nighttime breastfeeding. Expandable 4-way stretch fabric accommodates changing breast sizes from late pregnancy through lactation.',
    short_description: '3-pack wire-free crossover pull-aside sleep & nursing bralettes.',
    regular_price: 22500,
    discount_price: 18900,
    stock_quantity: 35,
    sku: 'MOT-BRA-006',
    category_id: 'cat-mothercare',
    subcategory: 'Nursing Bras',
    brand: 'LuxeMama',
    age_group: 'Maternity',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      sizes: ['S (32B-34C)', 'M (34D-36C)', 'L (36D-38D)', 'XL (38DD-40D)'],
      colors: [
        { name: 'Nude, Black & Rose Tri-Pack', hex: '#E2C2A4' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 57,
  },
];
