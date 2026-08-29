import { Product } from '../../types';
import { getProductPlaceholderSvg } from '../placeholders';

export const BABY_ACCESSORIES_PRODUCTS: Product[] = [
  {
    id: 'acc-001',
    name: 'Food-Grade Silicone Pacifier Clip & Teething Bead Leash (Pack of 3)',
    slug: 'silicone-pacifier-clip-teething-bead-leash-3pack',
    description:
      'Keep pacifiers and teethers off dirty floors. Handcrafted with 100% food-grade chewable silicone beads, natural beechwood clips with plastic inner teeth that grip clothing tightly without puncturing or snagging fabrics.',
    short_description: '3-pack chewable silicone & beechwood pacifier holder clips for all dummy types.',
    regular_price: 6800,
    discount_price: 5200,
    stock_quantity: 45,
    sku: 'ACC-CLP-001',
    category_id: 'cat-accessories',
    subcategory: 'Pacifiers & Clips',
    brand: 'TinySteps',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Earthy Sage & Mustard Trio', hex: '#84A98C' },
        { name: 'Pastel Blush & Mauve Trio', hex: '#F9A8D4' },
      ],
    },
    is_featured: true,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.9,
    reviews_count: 73,
  },
  {
    id: 'acc-002',
    name: 'Natural Wood & Food Silicone Teething Ring Rattle Toy',
    slug: 'natural-wood-silicone-teething-ring-rattle',
    description:
      'Combines smooth organic beechwood with textured silicone ridges to soothe tender swollen gums during teething. Produces a gentle wooden chime sound when shaken to stimulate infant auditory development.',
    short_description: 'Organic beechwood & food silicone teething ring with gentle sensory rattle.',
    regular_price: 5500,
    discount_price: 4200,
    stock_quantity: 38,
    sku: 'ACC-TTH-002',
    category_id: 'cat-accessories',
    subcategory: 'Teethers & Rattles',
    brand: 'PureCare Baby',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Eucalyptus Sage', hex: '#84A98C' },
        { name: 'Warm Terracotta', hex: '#D97706' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: true,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 49,
  },
  {
    id: 'acc-003',
    name: 'Soft Stretchy Nylon Floral Headbands & Bows Set (5-Pack)',
    slug: 'soft-stretchy-nylon-floral-headbands-bows-5pack',
    description:
      'Extremely soft seamless nylon bands that expand gently to fit newborn babies up to toddlers without leaving pressure indentations on soft heads.',
    short_description: '5-pack handcrafted floral and bow nylon baby headbands.',
    regular_price: 7500,
    discount_price: 5900,
    stock_quantity: 40,
    sku: 'ACC-HBD-003',
    category_id: 'cat-accessories',
    subcategory: 'Headbands & Hair Accessories',
    brand: 'PetiteElegance',
    age_group: '0-3 Months',
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
    },
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.8,
    reviews_count: 35,
  },
  {
    id: 'acc-004',
    name: 'Polarized Flexible UV400 Infant & Toddler Sunglasses with Strap',
    slug: 'polarized-flexible-uv400-baby-sunglasses-strap',
    description:
      'Unbreakable flexible TPE frame with 100% UVA/UVB protection polarized TAC lenses. Includes adjustable elastic neoprene stay-on headstrap so glasses stay comfortably on during car rides and outdoor walks.',
    short_description: 'Bendable shatterproof polarized UV400 baby sunglasses with headstrap.',
    regular_price: 8500,
    discount_price: 6800,
    stock_quantity: 32,
    sku: 'ACC-SUN-004',
    category_id: 'cat-accessories',
    subcategory: 'Baby Sunglasses',
    brand: 'TinySteps',
    age_group: '6-12 Months',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80'
    ],
    image_views: {
      main: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
      front: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80'
    },
    variants: {
      colors: [
        { name: 'Matte Mustard Yellow', hex: '#EAB308' },
        { name: 'Pastel Rose Pink', hex: '#F472B6' },
        { name: 'Navy Blue', hex: '#1E3A8A' },
      ],
    },
    is_featured: false,
    is_new_arrival: false,
    is_best_seller: false,
    is_on_sale: true,
    is_out_of_stock: false,
    is_active: true,
    rating: 4.7,
    reviews_count: 28,
  },
];
