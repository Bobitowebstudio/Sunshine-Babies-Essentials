import { Product } from '../../types';
import { getProductPlaceholderSvg } from '../placeholders';

export const FEEDING_NURSING_PRODUCTS: Product[] = [
  {
    id: 'fed-001',
    name: 'Anti-Colic Natural Flow Wide-Neck Baby Feeding Bottle (240ml / 8oz)',
    slug: 'anti-colic-natural-flow-wide-neck-baby-feeding-bottle-240ml',
    description:
      'Features breast-like peristaltic silicone nipple mimicking natural latch and preventing nipple confusion. Built-in 360° anti-colic air vent valve channels air away from milk, reducing gas, spit-up, and burping.',
    short_description: 'Anti-colic natural latch wide-neck PPSU infant bottle (240ml).',
    regular_price: 8500,
    discount_price: 6900,
    stock_quantity: 48,
    sku: 'FED-BTL-001',
    category_id: 'cat-feeding',
    subcategory: 'Baby Feeding Bottles',
    brand: 'NurtureFlow',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566004100631-35d015d6a491?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1566004100631-35d015d6a491?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Warm Amber Glass', hex: '#D97706' },
        { name: 'Crystal Clear PPSU', hex: '#E0F2FE' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 86,
    frequently_bought_together_ids: ['fed-002', 'fed-006'],
  },
  {
    id: 'fed-002',
    name: 'Complete Baby Feeding Bottle Starter Gift Set (4 Bottles + Teats + Brush)',
    slug: 'complete-baby-feeding-bottle-starter-gift-set',
    description:
      'The ultimate newborn feeding starter box. Includes two 160ml (5oz) slow-flow bottles, two 260ml (9oz) medium-flow bottles, two transition silicone spouts, two 0-6M orthodontic pacifiers, and a 360° bottle cleaning brush with silicone teat cleaner.',
    short_description: 'Full starter pack with 4 anti-colic bottles, pacifiers, and cleaning brush.',
    regular_price: 32000,
    discount_price: 26500,
    stock_quantity: 22,
    sku: 'FED-SET-002',
    category_id: 'cat-feeding',
    subcategory: 'Feeding Bottle Sets',
    brand: 'NurtureFlow',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1000&q=80'
    },
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 94,
  },
  {
    id: 'fed-003',
    name: '360° Weighted Straw Leak-Proof Toddler Sippy Cup (280ml)',
    slug: '360-weighted-straw-leak-proof-toddler-sippy-cup-280ml',
    description:
      'Allows toddler to drink smoothly from any angle—even upside down—thanks to the flexible weighted steel gravity ball inside. 100% spill-proof silicone valve, easy-grip dual handles, and flip-top protective travel lid.',
    short_description: 'Spill-proof gravity ball straw training cup with double handles.',
    regular_price: 8500,
    discount_price: 6800,
    stock_quantity: 36,
    sku: 'FED-CUP-003',
    category_id: 'cat-feeding',
    subcategory: 'Sippy Cups',
    brand: 'TinyBites',
    age_group: '6-12 Months',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Sky Blue', hex: '#93C5FD' },
        { name: 'Coral Rose', hex: '#F472B6' },
        { name: 'Avocado Green', hex: '#86EFAC' },
      ],
    },
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 52,
  },
  {
    id: 'fed-004',
    name: '100% Food-Grade Silicone Divided Suction Baby Plate & Spoon Set',
    slug: 'silicone-divided-suction-baby-plate-spoon-set',
    description:
      'Strong bottom suction base sticks firmly to high chair trays, stopping baby from tipping over their food. 3 divided compartments help introduce balanced food portions. Made from 100% BPA, PVC, and phthalate-free food grade silicone.',
    short_description: 'Divided non-slip suction plate with matching soft silicone training spoon.',
    regular_price: 11000,
    discount_price: 8900,
    stock_quantity: 40,
    sku: 'FED-PLT-004',
    category_id: 'cat-feeding',
    subcategory: 'Baby Plates',
    brand: 'TinyBites',
    age_group: '6-12 Months',
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Eucalyptus Sage', hex: '#6EE7B7' },
        { name: 'Dusty Clay', hex: '#FCA5A5' },
        { name: 'Mustard Honey', hex: '#FDE047' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 67,
  },
  {
    id: 'fed-005',
    name: 'Temperature-Sensing Soft Tip Silicone Baby Weaning Spoons (4-Pack)',
    slug: 'temperature-sensing-soft-tip-silicone-baby-spoons-4pack',
    description:
      'Safety spoon tip turns white if food temperature exceeds 43°C (110°F), preventing mouth scalds. Soft rounded flexible silicone edges protect tender baby gums and newly emerging teeth during self-feeding.',
    short_description: 'Pack of 4 heat-sensitive soft gum protective baby feeding spoons.',
    regular_price: 6500,
    discount_price: 4900,
    stock_quantity: 55,
    sku: 'FED-SPN-005',
    category_id: 'cat-feeding',
    subcategory: 'Baby Spoons',
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
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.7,
    reviews_count: 38,
  },
  {
    id: 'fed-006',
    name: 'Fast Steam 6-in-1 Smart Baby Bottle Warmer & Food Defroster',
    slug: 'fast-steam-6-in-1-smart-baby-bottle-warmer',
    description:
      'Gently warms breast milk or formula to the perfect 37°C temperature in just 3 minutes while preserving vital nutrients and immunoglobulins. Features 24-hour constant thermostat holding mode, steam sterilizing function, and food jar defrosting.',
    short_description: 'Fast 3-minute smart electric bottle warmer with 24H temperature hold.',
    regular_price: 28000,
    discount_price: 23500,
    stock_quantity: 20,
    sku: 'FED-WRM-006',
    category_id: 'cat-feeding',
    subcategory: 'Bottle Warmers',
    brand: 'NurtureFlow Smart',
    age_group: '0-3 Months',
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
    reviews_count: 81,
  },
  {
    id: 'fed-007',
    name: 'Electric Steam & High-Temp Baby Bottle Sterilizer and Dryer',
    slug: 'electric-steam-high-temp-baby-bottle-sterilizer-dryer',
    description:
      'Kills 99.9% of bacteria and germs in 8 minutes using natural steam, then automatically hot-air dries bottles, teats, and pump parts with a clean HEPA filter. Holds up to 6 wide-neck bottles and accessories simultaneously.',
    short_description: 'Sterilizes and dries up to 6 bottles with clean HEPA hot-air filtration.',
    regular_price: 48000,
    discount_price: 39900,
    stock_quantity: 15,
    sku: 'FED-STR-007',
    category_id: 'cat-feeding',
    subcategory: 'Bottle Sterilizers',
    brand: 'NurtureFlow Smart',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&w=1000&q=80'
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 62,
  },
  {
    id: 'fed-008',
    name: 'Ergonomic Crescent Breastfeeding & Nursing Pillow with Cotton Cover',
    slug: 'ergonomic-crescent-breastfeeding-nursing-pillow',
    description:
      'Elevates baby to breast height for ergonomic feeding, relieving strain on arms, shoulders, and lower back. Firm, contoured design stays securely wrapped around mother’s waist.',
    short_description: 'Ergonomic wrap-around nursing support pillow with 100% cotton cover.',
    regular_price: 19500,
    discount_price: 15900,
    stock_quantity: 26,
    sku: 'FED-PIL-008',
    category_id: 'cat-feeding',
    subcategory: 'Nursing Pillows',
    brand: 'MamaCare Pro',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Oatmeal Dot', hex: '#F5F5DC' },
        { name: 'Grey Chevron', hex: '#94A3B8' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 59,
  },
];
