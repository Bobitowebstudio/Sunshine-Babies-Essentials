import { Product } from '../../types';
import { getProductPlaceholderSvg } from '../placeholders';

export const BABY_CLOTHING_PRODUCTS: Product[] = [
  {
    id: 'clo-001',
    name: '100% Organic Cotton Long-Sleeve Baby Romper / Sleepsuit (3-Pack)',
    slug: 'organic-cotton-long-sleeve-baby-romper-sleepsuit-3pack',
    description:
      'GOTS-certified 100% organic combed cotton rompers with two-way diagonal zippers for quick nighttime diaper changes without uncovering chest. Features fold-over scratch mitten cuffs and enclosed footies.',
    short_description: '3-pack organic cotton zipper rompers with two-way safety zippers.',
    regular_price: 24500,
    discount_price: 19800,
    stock_quantity: 38,
    sku: 'CLO-RMP-001',
    category_id: 'cat-clothing',
    subcategory: 'Baby Rompers',
    brand: 'PureBaby Organic',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      sizes: ['0-3M', '3-6M', '6-12M', '1-2Y'],
      colors: [
        { name: 'Oatmeal & Sage Trio', hex: '#E6E4D9' },
        { name: 'Dusty Rose & Peach Trio', hex: '#FBCFE8' },
        { name: 'Sky Blue & Grey Trio', hex: '#BAE6FD' },
      ],
    },
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 87,
    frequently_bought_together_ids: ['clo-002', 'ess-005'],
  },
  {
    id: 'clo-002',
    name: 'Soft Ribbed Short-Sleeve Baby Bodysuits (5-Pack)',
    slug: 'soft-ribbed-short-sleeve-baby-bodysuits-5pack',
    description:
      'Ultra-breathable expandable lap-shoulder bodysuits with nickel-free snaps along the bottom. Made of tagless super-soft ribbed cotton that stretches gently with baby’s active movements.',
    short_description: 'Pack of 5 everyday breathable lap-shoulder cotton onesies.',
    regular_price: 19500,
    discount_price: 15900,
    stock_quantity: 42,
    sku: 'CLO-BOD-002',
    category_id: 'cat-clothing',
    subcategory: 'Baby Bodysuits',
    brand: 'TinySteps',
    age_group: '3-6 Months',
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      sizes: ['0-3M', '3-6M', '6-12M', '1-3Y'],
      colors: [
        { name: 'Neutral Minimalist (White/Tan/Grey)', hex: '#E7E5E4' },
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
    id: 'clo-003',
    name: 'Floral Lace Ruffle Baby Princess Dress with Matching Bloomers',
    slug: 'floral-lace-ruffle-baby-princess-dress-bloomers',
    description:
      'Exquisite baby occasion dress with delicate embroidered lace overlay, soft cotton inner lining, cap sleeves, and matching diaper-cover bloomers. Ideal for christenings, birthdays, and family photo sessions.',
    short_description: 'Embroidered lace occasion baby dress with matching ruffle bloomers.',
    regular_price: 22000,
    discount_price: 18500,
    stock_quantity: 20,
    sku: 'CLO-DRS-003',
    category_id: 'cat-clothing',
    subcategory: 'Baby Dresses',
    brand: 'PetiteElegance',
    age_group: '6-12 Months',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      sizes: ['3-6M', '6-12M', '1-2Y', '2-3Y'],
      colors: [
        { name: 'Vintage Cream', hex: '#FFFBEB' },
        { name: 'Blush Blossom', hex: '#FCE7F3' },
      ],
    },
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 36,
  },
  {
    id: 'clo-004',
    name: 'Elastic Waistband Soft Cotton Baby Trousers (3-Pack)',
    slug: 'elastic-waistband-soft-cotton-baby-trousers-3pack',
    description:
      'Comfortable pull-on pants with wide elastic waistbands that prevent pressure on baby’s tummy. Features ribbed ankle cuffs that prevent rolling up during crawling and play.',
    short_description: '3-pack soft pull-on jogger pants with elasticated waistbands.',
    regular_price: 16000,
    discount_price: 12900,
    stock_quantity: 32,
    sku: 'CLO-TRS-004',
    category_id: 'cat-clothing',
    subcategory: 'Baby Trousers',
    brand: 'PureBaby Organic',
    age_group: '6-12 Months',
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      sizes: ['3-6M', '6-12M', '1-2Y', '2-3Y'],
      colors: [
        { name: 'Navy / Mustard / Olive', hex: '#1E3A8A' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.7,
    reviews_count: 48,
  },
  {
    id: 'clo-005',
    name: 'Linen Button-Down Mandarin Collar Baby Shirt',
    slug: 'linen-button-down-mandarin-collar-baby-shirt',
    description:
      'Classic lightweight linen-cotton blend dress shirt for toddlers. Features front wood-look buttons, roll-up sleeve tabs, and a modern band collar.',
    short_description: 'Smart casual linen-cotton toddler shirt with front buttons.',
    regular_price: 14500,
    discount_price: 11900,
    stock_quantity: 22,
    sku: 'CLO-SHT-005',
    category_id: 'cat-clothing',
    subcategory: 'Baby Shirts',
    brand: 'PetiteElegance',
    age_group: '1-3 Years',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      sizes: ['6-12M', '1-2Y', '2-3Y'],
      colors: [
        { name: 'Crisp White', hex: '#FFFFFF' },
        { name: 'Sky Blue', hex: '#BAE6FD' },
        { name: 'Sand Beige', hex: '#D6D3D1' },
      ],
    },
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 29,
  },
  {
    id: 'clo-006',
    name: 'Thermal Two-Piece Baby Sleepwear Pajama Set',
    slug: 'thermal-two-piece-baby-sleepwear-pajama-set',
    description:
      'Snug-fit waffle knit thermal pajamas made for cozy, safe sleeping. Breathable material prevents overheating while keeping toddlers comfortably warm through the night.',
    short_description: 'Two-piece waffle knit pajama set with ribbed cuffs.',
    regular_price: 15500,
    discount_price: 12500,
    stock_quantity: 26,
    sku: 'CLO-SLP-006',
    category_id: 'cat-clothing',
    subcategory: 'Baby Sleepwear',
    brand: 'PureBaby Organic',
    age_group: '1-3 Years',
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      sizes: ['6-12M', '1-2Y', '2-3Y'],
      colors: [
        { name: 'Cocoa Brown', hex: '#78350F' },
        { name: 'Sage Green', hex: '#86EFAC' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.7,
    reviews_count: 19,
  },
  {
    id: 'clo-007',
    name: '4-Piece Newborn Luxury Gift Set (Romper, Hat, Bib, Booties)',
    slug: '4-piece-newborn-luxury-gift-set',
    description:
      'Coordinated luxury starter wardrobe set packaged in an elegant keepsake gift box. Includes 1 footed sleeper romper, 1 adjustable knotted beanie, 1 embroidered bib, and 1 pair of fleece stay-on booties.',
    short_description: 'Complete 4-piece organic newborn gift outfit set in premium box.',
    regular_price: 28000,
    discount_price: 22900,
    stock_quantity: 18,
    sku: 'CLO-SET-007',
    category_id: 'cat-clothing',
    subcategory: 'Baby Clothing Sets',
    brand: 'LuxeBaby Collection',
    age_group: '0-3 Months',
    images: [
      getProductPlaceholderSvg('4-Piece Newborn Luxury Gift Set', 'cat-clothing', 'main'),
      getProductPlaceholderSvg('4-Piece Newborn Luxury Gift Set', 'cat-clothing', 'front'),
    ],
    image_views: {
      main: getProductPlaceholderSvg('4-Piece Newborn Luxury Gift Set', 'cat-clothing', 'main'),
      front: getProductPlaceholderSvg('4-Piece Newborn Luxury Gift Set', 'cat-clothing', 'front'),
    },
    variants: {
      colors: [
        { name: 'Royal Gold & White', hex: '#FEF08A' },
        { name: 'Blush & Rose', hex: '#FBCFE8' },
        { name: 'Ocean Mist Blue', hex: '#BFDBFE' },
      ],
    },
    is_featured: true,
    is_new_arrival: true,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 73,
  },
  {
    id: 'clo-008',
    name: 'Hooded Winter Baby Bear Fleece Zip Jacket',
    slug: 'hooded-winter-baby-bear-fleece-zip-jacket',
    description:
      'High-loft plush fleece outerwear jacket with cute bear ears on the hood, smooth zipper guard to prevent chin pinching, and warm jersey cotton lining.',
    short_description: 'Warm fluffy fleece baby jacket with bear ear hood.',
    regular_price: 18500,
    discount_price: 14900,
    stock_quantity: 24,
    sku: 'CLO-JCK-008',
    category_id: 'cat-clothing',
    subcategory: 'Baby Jackets',
    brand: 'TinySteps',
    age_group: '6-12 Months',
    images: [
      getProductPlaceholderSvg('Hooded Winter Baby Bear Fleece Zip Jacket', 'cat-clothing', 'main'),
      getProductPlaceholderSvg('Hooded Winter Baby Bear Fleece Zip Jacket', 'cat-clothing', 'front'),
    ],
    image_views: {
      main: getProductPlaceholderSvg('Hooded Winter Baby Bear Fleece Zip Jacket', 'cat-clothing', 'main'),
      front: getProductPlaceholderSvg('Hooded Winter Baby Bear Fleece Zip Jacket', 'cat-clothing', 'front'),
    },
    variants: {
      sizes: ['3-6M', '6-12M', '1-2Y'],
      colors: [
        { name: 'Teddy Brown', hex: '#92400E' },
        { name: 'Cream Ivory', hex: '#FDFBF7' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 31,
  },
];
