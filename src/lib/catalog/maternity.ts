import { Product } from '../../types';
import { getProductPlaceholderSvg } from '../placeholders';

export const MATERNITY_PRODUCTS: Product[] = [
  {
    id: 'mat-001',
    name: 'Full-Body Contoured U-Shape Pregnancy Pillow',
    slug: 'full-body-contoured-u-shape-pregnancy-pillow',
    description:
      'Engineered to provide simultaneous support to the back, hips, knees, neck, and growing belly. Features premium high-density hypoallergenic microfiber filling wrapped in a 100% breathable velvet removable and washable cover. Greatly eases sleeping discomfort in the second and third trimesters.',
    short_description: 'Ergonomic full-body U-shape support pillow with removable velvet cover.',
    regular_price: 32000,
    discount_price: 26500,
    stock_quantity: 24,
    sku: 'MAT-PIL-001',
    category_id: 'cat-maternity',
    subcategory: 'Maternity Pillows',
    brand: 'Sunshine Babies Maternity',
    age_group: 'Maternity',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Warm Cream', hex: '#FDFBF7' },
        { name: 'Dusty Pink', hex: '#F472B6' },
        { name: 'Slate Gray', hex: '#64748B' },
      ],
    },
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 64,
    attributes: {
      Dimensions: '140cm x 80cm',
      Material: '100% Organic Microfiber & Velvet Cover',
      Care: 'Machine Washable Removable Cover',
    },
    frequently_bought_together_ids: ['mat-002', 'mat-003'],
  },
  {
    id: 'mat-002',
    name: '3-in-1 Postpartum Recovery & Pelvic Support Belly Wrap Band',
    slug: '3-in-1-postpartum-recovery-belly-wrap-band',
    description:
      'Medical-grade 3-piece breathable compression system containing stomach belt, waist belt, and pelvis belt. Helps reduce swelling, supports core abdominal muscles after natural birth or C-section, and accelerates recovery.',
    short_description: 'Triple-compression postpartum recovery belt system for tummy and pelvis.',
    regular_price: 18500,
    discount_price: 15200,
    stock_quantity: 32,
    sku: 'MAT-BLT-002',
    category_id: 'cat-maternity',
    subcategory: 'Maternity Support Belts',
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
      sizes: ['M (Waist 65-85cm)', 'L (Waist 85-95cm)', 'XL (Waist 95-110cm)'],
      colors: [
        { name: 'Nude Beige', hex: '#E2C2A4' },
        { name: 'Classic Black', hex: '#1E293B' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 51,
  },
  {
    id: 'mat-003',
    name: 'Seamless Wireless Maternity & Nursing Bra (3-Pack)',
    slug: 'seamless-wireless-maternity-nursing-bra-3pack',
    description:
      'Ultra-soft wire-free nursing bras with one-handed drop-down clip cups for effortless, discreet breastfeeding. Designed with expandable 4-way stretch cups that adapt to fluctuating breast sizes through pregnancy and postpartum.',
    short_description: 'Pack of 3 ultra-comfortable seamless drop-cup nursing bras.',
    regular_price: 24000,
    discount_price: 19800,
    stock_quantity: 45,
    sku: 'MAT-BRA-003',
    category_id: 'cat-maternity',
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
      sizes: ['Small (32B-34C)', 'Medium (34D-36C)', 'Large (36D-38D)', 'XL (38DD-40D)'],
      colors: [
        { name: 'Nude, Black & Rose Tri-Pack', hex: '#E2C2A4' },
      ],
    },
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 88,
  },
  {
    id: 'mat-004',
    name: 'Over-Bump Seamless Support Maternity Leggings',
    slug: 'over-bump-seamless-support-maternity-leggings',
    description:
      'Engineered with high-waist 360° belly support panel that grows with your baby bump without pinching or rolling down. Non-see-through, buttery soft 4-way stretch fabric perfect for yoga, loungewear, or everyday outings.',
    short_description: 'Non-see-through over-the-belly support leggings for all trimesters.',
    regular_price: 15500,
    discount_price: 12500,
    stock_quantity: 30,
    sku: 'MAT-LEG-004',
    category_id: 'cat-maternity',
    subcategory: 'Maternity Leggings',
    brand: 'Sunshine Babies Maternity',
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
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'Midnight Black', hex: '#0F172A' },
        { name: 'Charcoal Grey', hex: '#334155' },
      ],
    },
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.7,
    reviews_count: 39,
  },
  {
    id: 'mat-005',
    name: 'Bamboo Breathable 360° Privacy Nursing Cover',
    slug: 'bamboo-breathable-360-privacy-nursing-cover',
    description:
      'Offers complete 360° coverage front and back while breastfeeding in public. Features rigid neckline hoop to maintain eye contact with baby and ensure optimal airflow. Made from super-soft, lightweight bamboo jersey.',
    short_description: 'Full-coverage 360° nursing shawl with rigid arch viewing neckline.',
    regular_price: 9500,
    discount_price: 7800,
    stock_quantity: 28,
    sku: 'MAT-COV-005',
    category_id: 'cat-maternity',
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
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 27,
  },
  {
    id: 'mat-006',
    name: 'Wearable Hands-Free Double Electric Breast Pump',
    slug: 'wearable-hands-free-double-electric-breast-pump',
    description:
      'Ultra-silent (<45dB), lightweight, and tubeless wireless breast pump that fits directly inside any standard nursing bra. Features 3 expression modes, 9 suction levels, anti-backflow silicone system, and USB-C fast charging battery.',
    short_description: 'Tubeless, silent hands-free wearable breast pump with LED smart display.',
    regular_price: 68000,
    discount_price: 54900,
    stock_quantity: 14,
    sku: 'MAT-PMP-006',
    category_id: 'cat-maternity',
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
    reviews_count: 92,
  },
  {
    id: 'mat-007',
    name: 'Elegant Button-Down Maternity & Labor Hospital Gown Dress',
    slug: 'elegant-button-down-maternity-labor-hospital-gown-dress',
    description:
      'Designed specifically for pregnancy, labor, and postpartum nursing. Features snaps along the back for easy medical examinations and front button openings for skin-to-skin bonding and breastfeeding. Made of premium breathable cotton.',
    short_description: 'Snapping labor and postpartum nursing gown dress with pockets.',
    regular_price: 21000,
    discount_price: 17500,
    stock_quantity: 20,
    sku: 'MAT-DRS-007',
    category_id: 'cat-maternity',
    subcategory: 'Maternity Dresses',
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
      sizes: ['S/M', 'L/XL', 'XXL'],
      colors: [
        { name: 'Blush Pink', hex: '#F9A8D4' },
        { name: 'Navy Floral', hex: '#1E3A8A' },
        { name: 'Sage Green', hex: '#86EFAC' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 42,
  },
  {
    id: 'mat-008',
    name: 'Organic Cotton Ribbed Maternity & Nursing Top',
    slug: 'organic-cotton-ribbed-maternity-nursing-top',
    description:
      'Soft ribbed modal cotton top with discreet lift-up layer for easy, rapid breastfeeding access. Stretchy side ruching flatters your bump and provides ample room throughout pregnancy.',
    short_description: 'Side-ruched nursing and maternity top with concealed feeding layer.',
    regular_price: 13500,
    discount_price: 11000,
    stock_quantity: 25,
    sku: 'MAT-TOP-008',
    category_id: 'cat-maternity',
    subcategory: 'Maternity Tops',
    brand: 'Sunshine Babies Maternity',
    age_group: 'Maternity',
    images: [
      getProductPlaceholderSvg('Organic Cotton Ribbed Maternity & Nursing Top', 'cat-maternity', 'main'),
      getProductPlaceholderSvg('Organic Cotton Ribbed Maternity & Nursing Top', 'cat-maternity', 'front'),
    ],
    image_views: {
      main: getProductPlaceholderSvg('Organic Cotton Ribbed Maternity & Nursing Top', 'cat-maternity', 'main'),
      front: getProductPlaceholderSvg('Organic Cotton Ribbed Maternity & Nursing Top', 'cat-maternity', 'front'),
    },
    variants: {
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Oatmeal Beige', hex: '#E5DCC5' },
        { name: 'Pure White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#000000' },
      ],
    },
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.7,
    reviews_count: 18,
  },
];
