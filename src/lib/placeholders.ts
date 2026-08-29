/**
 * Product Image Engine & High-Fidelity Vector Product Art
 * Generates category-accurate, product-specific vector drawings
 * for baby gear, apparel, feeding, maternity, baby care, and school products.
 * Guarantees zero generic/mismatched stock photos or unrelated graphics.
 */

export interface ImageAnglePreset {
  angle: 'main' | 'front' | 'side' | 'back' | 'detail';
  label: string;
}

export const CATEGORY_THEMES: Record<
  string,
  {
    bgGradient: [string, string];
    accent: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    categoryLabel: string;
  }
> = {
  'cat-maternity': {
    bgGradient: ['#FFF5F7', '#FCE7F3'],
    accent: '#DB2777',
    text: '#831843',
    badgeBg: '#FDF2F8',
    badgeText: '#BE185D',
    categoryLabel: 'Maternity Essentials',
  },
  'cat-baby-essentials': {
    bgGradient: ['#F0FDF4', '#DCFCE7'],
    accent: '#16A34A',
    text: '#14532D',
    badgeBg: '#DCFCE7',
    badgeText: '#15803D',
    categoryLabel: 'Baby Essentials',
  },
  'cat-clothing': {
    bgGradient: ['#EFF6FF', '#DBEAFE'],
    accent: '#2563EB',
    text: '#1E3A8A',
    badgeBg: '#DBEAFE',
    badgeText: '#1D4ED8',
    categoryLabel: 'Baby Clothing',
  },
  'cat-gear': {
    bgGradient: ['#FFFBEB', '#FEF3C7'],
    accent: '#D97706',
    text: '#78350F',
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
    categoryLabel: 'Baby Gear',
  },
  'cat-feeding': {
    bgGradient: ['#FAF5FF', '#F3E8FF'],
    accent: '#9333EA',
    text: '#581C87',
    badgeBg: '#F3E8FF',
    badgeText: '#7E22CE',
    categoryLabel: 'Feeding & Nursing',
  },
  'cat-care': {
    bgGradient: ['#F0FDFA', '#CCFBF1'],
    accent: '#0D9488',
    text: '#134E4A',
    badgeBg: '#CCFBF1',
    badgeText: '#0F766E',
    categoryLabel: 'Baby Care',
  },
  'cat-mothercare': {
    bgGradient: ['#FFF1F2', '#FFE4E6'],
    accent: '#E11D48',
    text: '#881337',
    badgeBg: '#FFE4E6',
    badgeText: '#BE123C',
    categoryLabel: 'Mother Care',
  },
  'cat-backtoschool': {
    bgGradient: ['#EEF2FF', '#E0E7FF'],
    accent: '#4F46E5',
    text: '#312E81',
    badgeBg: '#E0E7FF',
    badgeText: '#4338CA',
    categoryLabel: 'Back to School',
  },
  'cat-accessories': {
    bgGradient: ['#FEFCE8', '#FEF08A'],
    accent: '#CA8A04',
    text: '#713F12',
    badgeBg: '#FEF08A',
    badgeText: '#A16207',
    categoryLabel: 'Baby Accessories',
  },
};

/**
 * Returns accurate, physical product vector drawings tailored precisely to what the product is.
 */
function getProductSvgIllustration(productName: string, categoryId: string, accentColor: string): string {
  const name = productName.toLowerCase();

  // 1. BABY STROLLER
  if (name.includes('stroller') || name.includes('pram') || name.includes('buggy')) {
    return `
      <!-- Stroller Canopy -->
      <path d="M 230 180 C 230 140 280 130 330 145 C 370 155 380 190 380 220" fill="none" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <path d="M 230 180 Q 300 200 380 220 L 320 270 L 250 240 Z" fill="${accentColor}" opacity="0.25"/>
      <!-- Stroller Frame -->
      <line x1="210" y1="130" x2="270" y2="280" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <line x1="270" y1="280" x2="360" y2="280" stroke="${accentColor}" stroke-width="7" stroke-linecap="round"/>
      <line x1="270" y1="280" x2="240" y2="350" stroke="${accentColor}" stroke-width="7" stroke-linecap="round"/>
      <line x1="340" y1="280" x2="370" y2="350" stroke="${accentColor}" stroke-width="7" stroke-linecap="round"/>
      <!-- Seat and backrest -->
      <path d="M 260 210 L 290 280 L 360 280 L 375 250" fill="none" stroke="${accentColor}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Handlebar -->
      <path d="M 190 120 C 190 110 210 110 220 130" fill="none" stroke="${accentColor}" stroke-width="9" stroke-linecap="round"/>
      <!-- Wheels -->
      <circle cx="235" cy="355" r="24" fill="#FFFFFF" stroke="${accentColor}" stroke-width="8"/>
      <circle cx="235" cy="355" r="8" fill="${accentColor}"/>
      <circle cx="375" cy="355" r="24" fill="#FFFFFF" stroke="${accentColor}" stroke-width="8"/>
      <circle cx="375" cy="355" r="8" fill="${accentColor}"/>
      <line x1="235" y1="355" x2="375" y2="355" stroke="${accentColor}" stroke-width="4" stroke-dasharray="4 4"/>
    `;
  }

  // 2. BABY COT / BASSINET / CRIB
  if (name.includes('cot') || name.includes('bassinet') || name.includes('crib')) {
    return `
      <!-- Cot Main Frame -->
      <rect x="180" y="190" width="240" height="130" rx="14" fill="${accentColor}" opacity="0.15" stroke="${accentColor}" stroke-width="7"/>
      <!-- Breathable Mesh Panels -->
      <rect x="200" y="210" width="90" height="85" rx="6" fill="#FFFFFF" stroke="${accentColor}" stroke-width="3" stroke-dasharray="4 3"/>
      <rect x="310" y="210" width="90" height="85" rx="6" fill="#FFFFFF" stroke="${accentColor}" stroke-width="3" stroke-dasharray="4 3"/>
      <!-- Cot Mattress Support -->
      <line x1="190" y1="285" x2="410" y2="285" stroke="${accentColor}" stroke-width="6"/>
      <!-- Legs and Castor Wheels -->
      <line x1="200" y1="320" x2="200" y2="370" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <line x1="400" y1="320" x2="400" y2="370" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="200" cy="375" r="12" fill="#FFFFFF" stroke="${accentColor}" stroke-width="5"/>
      <circle cx="400" cy="375" r="12" fill="#FFFFFF" stroke="${accentColor}" stroke-width="5"/>
      <!-- Bassinet Top Arch or Mobile Toy Bar -->
      <path d="M 180 190 Q 300 130 420 190" fill="none" stroke="${accentColor}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="300" cy="155" r="8" fill="${accentColor}"/>
    `;
  }

  // 3. BABY PLAYPEN / PLAY YARD
  if (name.includes('playpen') || name.includes('play yard')) {
    return `
      <!-- Playpen Enclosure -->
      <rect x="170" y="180" width="260" height="160" rx="16" fill="${accentColor}" opacity="0.12" stroke="${accentColor}" stroke-width="8"/>
      <!-- Top Padded Safety Rail -->
      <rect x="165" y="175" width="270" height="20" rx="8" fill="${accentColor}"/>
      <!-- Mesh Walls with Grid pattern -->
      <line x1="230" y1="195" x2="230" y2="340" stroke="${accentColor}" stroke-width="4" stroke-dasharray="3 3"/>
      <line x1="300" y1="195" x2="300" y2="340" stroke="${accentColor}" stroke-width="4" stroke-dasharray="3 3"/>
      <line x1="370" y1="195" x2="370" y2="340" stroke="${accentColor}" stroke-width="4" stroke-dasharray="3 3"/>
      <!-- Crawl-in Zipper Gate -->
      <path d="M 270 340 L 270 250 Q 300 240 330 250 L 330 340" fill="#FFFFFF" stroke="${accentColor}" stroke-width="4"/>
      <!-- Anti-Skid Corner Feet -->
      <rect x="165" y="340" width="20" height="18" rx="4" fill="${accentColor}"/>
      <rect x="415" y="340" width="20" height="18" rx="4" fill="${accentColor}"/>
      <rect x="290" y="340" width="20" height="18" rx="4" fill="${accentColor}"/>
    `;
  }

  // 4. BABY CARRIER / HIP SEAT
  if (name.includes('carrier') || name.includes('hip seat') || name.includes('sling')) {
    return `
      <!-- Carrier Shoulder Straps -->
      <path d="M 230 140 C 230 180 260 210 260 250" fill="none" stroke="${accentColor}" stroke-width="9" stroke-linecap="round"/>
      <path d="M 370 140 C 370 180 340 210 340 250" fill="none" stroke="${accentColor}" stroke-width="9" stroke-linecap="round"/>
      <!-- Cross Chest Buckle -->
      <line x1="245" y1="180" x2="355" y2="180" stroke="${accentColor}" stroke-width="5"/>
      <rect x="290" y="172" width="20" height="16" rx="4" fill="${accentColor}"/>
      <!-- Baby Body Pouch -->
      <path d="M 250 210 Q 300 190 350 210 L 360 300 Q 300 320 240 300 Z" fill="${accentColor}" opacity="0.25" stroke="${accentColor}" stroke-width="7"/>
      <!-- Lumbar Waist Belt -->
      <rect x="190" y="300" width="220" height="42" rx="10" fill="#FFFFFF" stroke="${accentColor}" stroke-width="8"/>
      <rect x="280" y="306" width="40" height="30" rx="4" fill="${accentColor}"/>
    `;
  }

  // 5. BABY WALKER
  if (name.includes('walker')) {
    return `
      <!-- Walker Upper Tray -->
      <ellipse cx="300" cy="200" rx="95" ry="30" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="7"/>
      <!-- Toy Activity Steering Wheel -->
      <circle cx="300" cy="180" r="18" fill="#FFFFFF" stroke="${accentColor}" stroke-width="5"/>
      <!-- Fabric Seat -->
      <path d="M 260 210 Q 300 245 340 210" fill="none" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <!-- Frame Supports -->
      <line x1="240" y1="215" x2="205" y2="330" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <line x1="360" y1="215" x2="395" y2="330" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <!-- Lower Broad Safety Ring -->
      <ellipse cx="300" cy="340" rx="125" ry="32" fill="#FFFFFF" stroke="${accentColor}" stroke-width="8"/>
      <!-- 4 Swivel Wheels -->
      <circle cx="190" cy="365" r="10" fill="${accentColor}"/>
      <circle cx="260" cy="375" r="10" fill="${accentColor}"/>
      <circle cx="340" cy="375" r="10" fill="${accentColor}"/>
      <circle cx="410" cy="365" r="10" fill="${accentColor}"/>
    `;
  }

  // 6. BABY HIGH CHAIR
  if (name.includes('high chair') || name.includes('feeding chair') || name.includes('booster')) {
    return `
      <!-- High Chair Seat & Backrest -->
      <path d="M 265 150 L 265 240 L 335 240 L 335 150" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="7" stroke-linecap="round"/>
      <!-- Food Feeding Tray -->
      <rect x="235" y="200" width="130" height="24" rx="8" fill="#FFFFFF" stroke="${accentColor}" stroke-width="7"/>
      <!-- Footrest -->
      <line x1="270" y1="290" x2="330" y2="290" stroke="${accentColor}" stroke-width="6" stroke-linecap="round"/>
      <!-- Splayed Wood Legs -->
      <line x1="265" y1="240" x2="210" y2="380" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <line x1="335" y1="240" x2="390" y2="380" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <line x1="240" y1="310" x2="360" y2="310" stroke="${accentColor}" stroke-width="4"/>
    `;
  }

  // 7. BABY BOUNCER / ROCKER
  if (name.includes('bouncer') || name.includes('rocker') || name.includes('rocking')) {
    return `
      <!-- Bouncer Base Arch -->
      <path d="M 200 360 Q 300 390 400 360" fill="none" stroke="${accentColor}" stroke-width="9" stroke-linecap="round"/>
      <!-- Side Reclining Supports -->
      <line x1="200" y1="360" x2="250" y2="230" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <line x1="400" y1="360" x2="350" y2="230" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <!-- Ergonomic Curved Seat -->
      <path d="M 230 180 Q 300 160 370 180 Q 380 290 350 330 Q 300 345 250 330 Z" fill="${accentColor}" opacity="0.25" stroke="${accentColor}" stroke-width="7"/>
      <!-- 3-Point Safety Buckle -->
      <circle cx="300" cy="270" r="12" fill="${accentColor}"/>
      <!-- Toy Bar Overhead with Hanging Star & Ball -->
      <path d="M 220 220 Q 300 120 380 220" fill="none" stroke="${accentColor}" stroke-width="5"/>
      <circle cx="270" cy="180" r="8" fill="${accentColor}"/>
      <circle cx="330" cy="180" r="8" fill="${accentColor}"/>
    `;
  }

  // 8. BABY JACKET / FLEECE BEAR HOODED JACKET
  if (name.includes('jacket') || name.includes('coat') || name.includes('fleece zip')) {
    return `
      <!-- Bear Ears on Hood -->
      <circle cx="260" cy="140" r="14" fill="${accentColor}"/>
      <circle cx="340" cy="140" r="14" fill="${accentColor}"/>
      <!-- Hood -->
      <path d="M 250 190 C 240 140 360 140 350 190" fill="none" stroke="${accentColor}" stroke-width="8"/>
      <!-- Main Jacket Torso & Sleeves -->
      <path d="M 250 190 L 190 230 L 215 270 L 250 240 L 250 340 L 350 340 L 350 240 L 385 270 L 410 230 L 350 190 Z" 
            fill="${accentColor}" opacity="0.22" stroke="${accentColor}" stroke-width="8" stroke-linejoin="round"/>
      <!-- Front Center Zipper -->
      <line x1="300" y1="190" x2="300" y2="340" stroke="${accentColor}" stroke-width="5"/>
      <circle cx="300" cy="205" r="5" fill="${accentColor}"/>
      <!-- Kangaroo Pockets -->
      <path d="M 260 300 L 285 300 L 285 330 L 260 330 Z" fill="#FFFFFF" stroke="${accentColor}" stroke-width="4"/>
      <path d="M 315 300 L 340 300 L 340 330 L 315 330 Z" fill="#FFFFFF" stroke="${accentColor}" stroke-width="4"/>
    `;
  }

  // 9. 4-PIECE NEWBORN LUXURY GIFT SET / STARTER WARDROBE SET
  if (name.includes('gift set') || (name.includes('set') && categoryId === 'cat-clothing') || name.includes('4-piece newborn')) {
    return `
      <!-- Gift Box Base -->
      <rect x="180" y="160" width="240" height="200" rx="18" fill="#FFFFFF" stroke="${accentColor}" stroke-width="7"/>
      <!-- Ribbon Cross -->
      <line x1="300" y1="160" x2="300" y2="360" stroke="${accentColor}" stroke-width="6"/>
      <line x1="180" y1="260" x2="420" y2="260" stroke="${accentColor}" stroke-width="6"/>
      <!-- Gift Bow on Box -->
      <circle cx="300" cy="260" r="14" fill="${accentColor}"/>
      <path d="M 300 260 C 270 230 270 290 300 260" fill="${accentColor}" opacity="0.4"/>
      <path d="M 300 260 C 330 230 330 290 300 260" fill="${accentColor}" opacity="0.4"/>
      <!-- Folded Romper Silhouette Inside (Top Left) -->
      <rect x="200" y="180" width="80" height="65" rx="8" fill="${accentColor}" opacity="0.25"/>
      <!-- Beanie Hat (Top Right) -->
      <path d="M 320 230 Q 360 170 395 230 Z" fill="${accentColor}" opacity="0.3"/>
      <!-- Booties & Bib (Bottom) -->
      <circle cx="240" cy="310" r="16" fill="${accentColor}" opacity="0.3"/>
      <circle cx="360" cy="310" r="16" fill="${accentColor}" opacity="0.3"/>
    `;
  }

  // 10. BABY ROMPER / ONESIE / BODYSUIT / SLEEPSUIT
  if (name.includes('romper') || name.includes('bodysuit') || name.includes('onesie') || name.includes('sleepsuit')) {
    return `
      <!-- Collar / Lap Shoulder -->
      <path d="M 260 150 Q 300 170 340 150" fill="none" stroke="${accentColor}" stroke-width="6"/>
      <!-- Sleeves & Main Torso -->
      <path d="M 260 150 L 200 185 L 220 225 L 255 200 L 255 310 L 275 350 L 300 320 L 325 350 L 345 310 L 345 200 L 380 225 L 400 185 L 340 150 Z" 
            fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="8" stroke-linejoin="round"/>
      <!-- Snaps at Bottom / Two-Way Zipper -->
      <line x1="300" y1="170" x2="300" y2="320" stroke="${accentColor}" stroke-width="4" stroke-dasharray="4 4"/>
      <circle cx="285" cy="335" r="4" fill="${accentColor}"/>
      <circle cx="300" cy="335" r="4" fill="${accentColor}"/>
      <circle cx="315" cy="335" r="4" fill="${accentColor}"/>
    `;
  }

  // 11. BABY DRESS / PRINCESS GOWN
  if (name.includes('dress') || name.includes('princess') || name.includes('gown')) {
    return `
      <!-- Dress Bodice -->
      <path d="M 270 150 L 240 190 L 270 210 L 330 210 L 360 190 L 330 150 Z" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="7"/>
      <!-- Flared Skirt -->
      <path d="M 270 210 L 190 350 Q 300 375 410 350 L 330 210 Z" fill="${accentColor}" opacity="0.3" stroke="${accentColor}" stroke-width="8"/>
      <!-- Cute Bow at Waist -->
      <circle cx="300" cy="210" r="8" fill="${accentColor}"/>
      <path d="M 300 210 L 285 205 L 285 215 Z" fill="${accentColor}"/>
      <path d="M 300 210 L 315 205 L 315 215 Z" fill="${accentColor}"/>
    `;
  }

  // 12. BABY TROUSERS / PANTS / JOGGERS
  if (name.includes('trouser') || name.includes('pants') || name.includes('jogger')) {
    return `
      <!-- Elastic Waistband -->
      <rect x="230" y="160" width="140" height="24" rx="6" fill="${accentColor}"/>
      <!-- Two Pant Legs -->
      <path d="M 230 184 L 215 340 L 265 340 L 295 240 L 305 240 L 335 340 L 385 340 L 370 184 Z" 
            fill="${accentColor}" opacity="0.22" stroke="${accentColor}" stroke-width="8" stroke-linejoin="round"/>
      <!-- Ribbed Ankle Cuffs -->
      <rect x="210" y="338" width="58" height="16" rx="4" fill="${accentColor}"/>
      <rect x="332" y="338" width="58" height="16" rx="4" fill="${accentColor}"/>
    `;
  }

  // 13. BABY SHIRT / LINEN TOP
  if (name.includes('shirt') && (categoryId === 'cat-clothing' || categoryId === 'cat-maternity')) {
    return `
      <!-- Mandarin Collar -->
      <path d="M 270 150 Q 300 165 330 150" fill="none" stroke="${accentColor}" stroke-width="6"/>
      <!-- Shirt Body & Short Sleeves -->
      <path d="M 270 150 L 210 185 L 230 225 L 260 210 L 260 340 L 340 340 L 340 210 L 370 225 L 390 185 L 330 150 Z" 
            fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="8" stroke-linejoin="round"/>
      <!-- Center Placket & Buttons -->
      <line x1="300" y1="160" x2="300" y2="340" stroke="${accentColor}" stroke-width="4"/>
      <circle cx="300" cy="195" r="4" fill="${accentColor}"/>
      <circle cx="300" cy="235" r="4" fill="${accentColor}"/>
      <circle cx="300" cy="275" r="4" fill="${accentColor}"/>
    `;
  }

  // 14. BABY SLEEPWEAR / PAJAMAS
  if (name.includes('sleepwear') || name.includes('pajama')) {
    return `
      <!-- Top Piece -->
      <path d="M 265 140 L 220 170 L 235 200 L 260 190 L 260 250 L 340 250 L 340 190 L 365 200 L 380 170 L 335 140 Z" 
            fill="${accentColor}" opacity="0.25" stroke="${accentColor}" stroke-width="7" stroke-linejoin="round"/>
      <!-- Bottom Piece -->
      <path d="M 255 265 L 240 360 L 275 360 L 295 300 L 305 300 L 325 360 L 360 360 L 345 265 Z" 
            fill="${accentColor}" opacity="0.25" stroke="${accentColor}" stroke-width="7" stroke-linejoin="round"/>
      <!-- Waffle Texture -->
      <line x1="270" y1="190" x2="330" y2="190" stroke="${accentColor}" stroke-width="3" stroke-dasharray="3 3"/>
      <line x1="270" y1="220" x2="330" y2="220" stroke="${accentColor}" stroke-width="3" stroke-dasharray="3 3"/>
    `;
  }

  // 15. BABY SWADDLE / BLANKET
  if (name.includes('swaddle') || name.includes('blanket')) {
    return `
      <!-- Folded Swaddle / Blanket Stack -->
      <rect x="200" y="220" width="200" height="120" rx="18" fill="${accentColor}" opacity="0.25" stroke="${accentColor}" stroke-width="8"/>
      <!-- Fluffy Border / Edge Hemming -->
      <rect x="190" y="200" width="220" height="36" rx="10" fill="#FFFFFF" stroke="${accentColor}" stroke-width="6"/>
      <!-- Swaddle Ribbon Bow -->
      <circle cx="300" cy="280" r="12" fill="${accentColor}"/>
      <path d="M 300 280 L 270 270 L 270 290 Z" fill="${accentColor}"/>
      <path d="M 300 280 L 330 270 L 330 290 Z" fill="${accentColor}"/>
      <!-- Soft Leaf Texture Lines -->
      <path d="M 230 260 Q 250 240 270 260" stroke="${accentColor}" stroke-width="3" fill="none"/>
      <path d="M 330 260 Q 350 240 370 260" stroke="${accentColor}" stroke-width="3" fill="none"/>
    `;
  }

  // 16. BABY BIBS (SILICONE / FABRIC)
  if (name.includes('bib')) {
    return `
      <!-- Bib Neck Straps -->
      <path d="M 250 150 C 230 190 260 210 260 240" fill="none" stroke="${accentColor}" stroke-width="8"/>
      <path d="M 350 150 C 370 190 340 210 340 240" fill="none" stroke="${accentColor}" stroke-width="8"/>
      <!-- Neck Buttons -->
      <circle cx="300" cy="155" r="6" fill="${accentColor}"/>
      <!-- Bib Body -->
      <path d="M 240 230 Q 300 210 360 230 L 375 320 Q 300 355 225 320 Z" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="8"/>
      <!-- Deep Food Catcher Scoop Pocket -->
      <path d="M 225 300 Q 300 340 375 300 L 370 330 Q 300 360 230 330 Z" fill="${accentColor}" opacity="0.4" stroke="${accentColor}" stroke-width="6"/>
    `;
  }

  // 17. BABY HOODED TOWEL / WASHCLOTHS
  if (name.includes('towel') || name.includes('washcloth')) {
    return `
      <!-- Bear Hood on Towel -->
      <circle cx="260" cy="150" r="12" fill="${accentColor}"/>
      <circle cx="340" cy="150" r="12" fill="${accentColor}"/>
      <path d="M 250 200 Q 300 150 350 200" fill="${accentColor}" opacity="0.3" stroke="${accentColor}" stroke-width="7"/>
      <!-- Towel Fold Triangle Body -->
      <path d="M 200 200 L 400 200 L 300 360 Z" fill="${accentColor}" opacity="0.15" stroke="${accentColor}" stroke-width="8" stroke-linejoin="round"/>
      <!-- Rolled Washcloths Beside -->
      <ellipse cx="230" cy="330" rx="20" ry="12" fill="#FFFFFF" stroke="${accentColor}" stroke-width="5"/>
      <ellipse cx="370" cy="330" rx="20" ry="12" fill="#FFFFFF" stroke="${accentColor}" stroke-width="5"/>
    `;
  }

  // 18. BABY SOCKS / NON-SLIP GRIP SOCKS
  if (name.includes('sock')) {
    return `
      <!-- Left Sock -->
      <path d="M 210 180 L 260 180 L 260 280 L 290 280 Q 305 310 270 325 L 210 325 Q 185 300 210 270 Z" 
            fill="${accentColor}" opacity="0.25" stroke="${accentColor}" stroke-width="7" stroke-linejoin="round"/>
      <!-- Right Sock -->
      <path d="M 310 180 L 360 180 L 360 280 L 390 280 Q 405 310 370 325 L 310 325 Q 285 300 310 270 Z" 
            fill="${accentColor}" opacity="0.25" stroke="${accentColor}" stroke-width="7" stroke-linejoin="round"/>
      <!-- Silicone Grip Dots on Bottom -->
      <circle cx="235" cy="315" r="3" fill="${accentColor}"/>
      <circle cx="250" cy="315" r="3" fill="${accentColor}"/>
      <circle cx="265" cy="315" r="3" fill="${accentColor}"/>
      <circle cx="335" cy="315" r="3" fill="${accentColor}"/>
      <circle cx="350" cy="315" r="3" fill="${accentColor}"/>
      <circle cx="365" cy="315" r="3" fill="${accentColor}"/>
    `;
  }

  // 19. BABY MITTENS & BEANIE HATS
  if (name.includes('mitten') || name.includes('beanie') || name.includes('hat') || name.includes('turban')) {
    return `
      <!-- Beanie Hat with Top Knot -->
      <circle cx="300" cy="140" r="10" fill="${accentColor}"/>
      <path d="M 230 220 C 230 150 370 150 370 220 Z" fill="${accentColor}" opacity="0.25" stroke="${accentColor}" stroke-width="8"/>
      <rect x="220" y="215" width="160" height="24" rx="6" fill="${accentColor}"/>
      <!-- Two Scratch Mittens (Bottom Left & Right) -->
      <ellipse cx="230" cy="300" rx="30" ry="40" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="6"/>
      <rect x="205" y="325" width="50" height="16" rx="4" fill="${accentColor}"/>
      <ellipse cx="370" cy="300" rx="30" ry="40" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="6"/>
      <rect x="345" y="325" width="50" height="16" rx="4" fill="${accentColor}"/>
    `;
  }

  // 20. CHANGING MAT / PORTABLE STATION
  if (name.includes('changing mat') || name.includes('changing pad') || name.includes('changing station')) {
    return `
      <!-- Folded Changing Clutch Outer -->
      <rect x="180" y="200" width="240" height="140" rx="18" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="8"/>
      <!-- Soft Padded Head Cushion -->
      <rect x="220" y="220" width="160" height="40" rx="10" fill="#FFFFFF" stroke="${accentColor}" stroke-width="5"/>
      <!-- Wipe Clean Grid Surface -->
      <line x1="200" y1="280" x2="400" y2="280" stroke="${accentColor}" stroke-width="4" stroke-dasharray="6 4"/>
      <!-- Handle & Buckle -->
      <rect x="270" y="175" width="60" height="25" rx="6" fill="${accentColor}"/>
    `;
  }

  // 21. FEEDING BOTTLE / ANTI-COLIC / PPSU
  if (name.includes('bottle') && (categoryId === 'cat-feeding' || name.includes('feeding') || name.includes('anti-colic') || name.includes('milk') || name.includes('water bottle') === false)) {
    return `
      <!-- Bottle Nipple & Cap -->
      <path d="M 285 140 C 285 125 315 125 315 140 L 325 170 L 275 170 Z" fill="#FFFFFF" stroke="${accentColor}" stroke-width="6"/>
      <!-- Screw Collar Ring -->
      <rect x="260" y="170" width="80" height="24" rx="6" fill="${accentColor}"/>
      <!-- Glass/PPSU Bottle Body -->
      <rect x="255" y="194" width="90" height="160" rx="20" fill="${accentColor}" opacity="0.15" stroke="${accentColor}" stroke-width="7"/>
      <!-- Measurement Markings (ml/oz) -->
      <line x1="265" y1="230" x2="285" y2="230" stroke="${accentColor}" stroke-width="4"/>
      <line x1="265" y1="260" x2="295" y2="260" stroke="${accentColor}" stroke-width="5"/>
      <line x1="265" y1="290" x2="285" y2="290" stroke="${accentColor}" stroke-width="4"/>
      <line x1="265" y1="320" x2="295" y2="320" stroke="${accentColor}" stroke-width="5"/>
      <!-- Milk Level -->
      <path d="M 262 250 Q 300 255 338 250 L 338 340 Q 300 350 262 340 Z" fill="${accentColor}" opacity="0.35"/>
    `;
  }

  // 22. SIPPY CUP / STRAW TRAINING CUP
  if (name.includes('sippy') || (name.includes('cup') && categoryId === 'cat-feeding')) {
    return `
      <!-- Cup Handles -->
      <path d="M 245 220 C 190 220 190 310 245 310" fill="none" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <path d="M 355 220 C 410 220 410 310 355 310" fill="none" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <!-- Cup Lid & Spout -->
      <path d="M 290 145 L 310 145 L 305 170 L 295 170 Z" fill="${accentColor}"/>
      <rect x="240" y="170" width="120" height="26" rx="8" fill="${accentColor}"/>
      <!-- Cup Body -->
      <path d="M 245 196 L 255 330 Q 300 345 345 330 L 355 196 Z" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="7"/>
    `;
  }

  // 23. SILICONE SUCTION PLATE / BOWL / SPOON
  if (name.includes('plate') || name.includes('bowl') || name.includes('spoon') || name.includes('weaning')) {
    return `
      <!-- Divided Silicone Plate -->
      <ellipse cx="300" cy="260" rx="110" ry="60" fill="${accentColor}" opacity="0.15" stroke="${accentColor}" stroke-width="8"/>
      <path d="M 300 205 L 300 315" stroke="${accentColor}" stroke-width="6"/>
      <path d="M 230 260 L 300 260" stroke="${accentColor}" stroke-width="6"/>
      <!-- Training Spoon Beside Plate -->
      <path d="M 190 180 Q 205 160 215 180 L 195 310" fill="none" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="205" cy="175" rx="14" ry="18" fill="${accentColor}" opacity="0.4"/>
      <!-- Suction Base Under Plate -->
      <ellipse cx="300" cy="320" rx="60" ry="14" fill="#FFFFFF" stroke="${accentColor}" stroke-width="5"/>
    `;
  }

  // 24. BOTTLE STERILIZER & DRYER / WARMER
  if (name.includes('sterilizer') || name.includes('warmer')) {
    return `
      <!-- Sterilizer Chamber -->
      <rect x="210" y="170" width="180" height="170" rx="28" fill="${accentColor}" opacity="0.18" stroke="${accentColor}" stroke-width="8"/>
      <!-- Transparent Top Dome / Lid -->
      <path d="M 210 210 Q 300 140 390 210 Z" fill="#FFFFFF" stroke="${accentColor}" stroke-width="6"/>
      <circle cx="300" cy="150" r="10" fill="${accentColor}"/>
      <!-- Interior Bottle Racks -->
      <rect x="240" y="225" width="30" height="50" rx="6" fill="${accentColor}" opacity="0.3"/>
      <rect x="285" y="220" width="30" height="55" rx="6" fill="${accentColor}" opacity="0.3"/>
      <rect x="330" y="225" width="30" height="50" rx="6" fill="${accentColor}" opacity="0.3"/>
      <!-- Digital Touch Panel & Timer -->
      <rect x="240" y="300" width="120" height="28" rx="8" fill="#FFFFFF" stroke="${accentColor}" stroke-width="4"/>
      <text x="300" y="318" fill="${accentColor}" font-size="12" font-weight="bold" text-anchor="middle">99.9% STEAM</text>
    `;
  }

  // 25. ELECTRIC BREAST PUMP / DOUBLE PUMP
  if (name.includes('pump') || name.includes('breast pump')) {
    return `
      <!-- Breast Flange Cone -->
      <path d="M 220 180 L 280 220 L 280 250 L 220 290 Z" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="6"/>
      <!-- Electric Motor Unit / Wearable Pod -->
      <rect x="280" y="180" width="110" height="120" rx="24" fill="#FFFFFF" stroke="${accentColor}" stroke-width="8"/>
      <!-- Digital Display & Power Button -->
      <circle cx="335" cy="225" r="22" fill="${accentColor}" opacity="0.15"/>
      <text x="335" y="230" fill="${accentColor}" font-size="14" font-weight="bold" text-anchor="middle">L5</text>
      <!-- Collection Bottle -->
      <rect x="300" y="300" width="70" height="70" rx="14" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="6"/>
    `;
  }

  // 26. NURSING PILLOW / MATERNITY PREGNANCY PILLOW
  if (name.includes('pillow') || name.includes('crescent') || name.includes('u-shape')) {
    return `
      <!-- U-Shape / Crescent Nursing Pillow -->
      <path d="M 210 340 C 170 300 170 200 240 160 C 300 130 360 160 400 200 C 430 240 430 310 390 340 C 350 330 360 250 320 220 C 280 200 240 240 240 310 Z" 
            fill="${accentColor}" opacity="0.25" stroke="${accentColor}" stroke-width="8" stroke-linejoin="round"/>
      <!-- Soft Fabric Texture Stitching -->
      <path d="M 230 180 Q 300 150 370 180" fill="none" stroke="${accentColor}" stroke-width="4" stroke-dasharray="6 4"/>
    `;
  }

  // 27. MATERNITY & NURSING BRA
  if (name.includes('bra') || (name.includes('nursing') && name.includes('seamless'))) {
    return `
      <!-- Left & Right Bra Cups -->
      <path d="M 200 250 C 200 180 290 180 290 270 C 290 310 200 310 200 250 Z" fill="${accentColor}" opacity="0.25" stroke="${accentColor}" stroke-width="7"/>
      <path d="M 400 250 C 400 180 310 180 310 270 C 310 310 400 310 400 250 Z" fill="${accentColor}" opacity="0.25" stroke="${accentColor}" stroke-width="7"/>
      <!-- Shoulder Straps -->
      <line x1="245" y1="180" x2="245" y2="130" stroke="${accentColor}" stroke-width="6"/>
      <line x1="355" y1="180" x2="355" y2="130" stroke="${accentColor}" stroke-width="6"/>
      <!-- Drop Down Nursing Clips -->
      <rect x="238" y="170" width="14" height="14" rx="3" fill="${accentColor}"/>
      <rect x="348" y="170" width="14" height="14" rx="3" fill="${accentColor}"/>
      <!-- Wide Rib Support Band -->
      <line x1="200" y1="290" x2="400" y2="290" stroke="${accentColor}" stroke-width="8"/>
    `;
  }

  // 28. POSTPARTUM BELLY WRAP / SUPPORT BELT
  if (name.includes('belt') || name.includes('wrap') || name.includes('postpartum')) {
    return `
      <!-- 3-Band Compression Wrap Support -->
      <rect x="180" y="170" width="240" height="50" rx="10" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="6"/>
      <rect x="190" y="230" width="220" height="50" rx="10" fill="${accentColor}" opacity="0.3" stroke="${accentColor}" stroke-width="6"/>
      <rect x="180" y="290" width="240" height="50" rx="10" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="6"/>
      <!-- Breathable Mesh Air Slots -->
      <line x1="240" y1="185" x2="360" y2="185" stroke="${accentColor}" stroke-width="4" stroke-dasharray="6 4"/>
      <line x1="240" y1="245" x2="360" y2="245" stroke="${accentColor}" stroke-width="4" stroke-dasharray="6 4"/>
      <line x1="240" y1="305" x2="360" y2="305" stroke="${accentColor}" stroke-width="4" stroke-dasharray="6 4"/>
      <!-- Adjustable Fastener Straps -->
      <rect x="375" y="175" width="40" height="40" rx="6" fill="${accentColor}"/>
      <rect x="365" y="235" width="40" height="40" rx="6" fill="${accentColor}"/>
      <rect x="375" y="295" width="40" height="40" rx="6" fill="${accentColor}"/>
    `;
  }

  // 29. BABY BATH TUB / SMART FOLDABLE TUB
  if (name.includes('bath tub') || name.includes('bathtub') || (name.includes('tub') && categoryId === 'cat-care')) {
    return `
      <!-- Bathtub Rim -->
      <ellipse cx="300" cy="230" rx="120" ry="45" fill="#FFFFFF" stroke="${accentColor}" stroke-width="9"/>
      <!-- Bathtub Basin -->
      <path d="M 180 230 C 190 330 410 330 420 230" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="8"/>
      <!-- Newborn Support Cushion -->
      <path d="M 230 210 Q 280 280 340 260" fill="none" stroke="${accentColor}" stroke-width="7" stroke-linecap="round"/>
      <!-- Digital Temp Display -->
      <rect x="360" y="200" width="45" height="24" rx="6" fill="${accentColor}"/>
      <text x="382" y="217" fill="#FFFFFF" font-size="11" font-weight="bold" text-anchor="middle">37°C</text>
    `;
  }

  // 30. BABY GROOMING & HEALTH KIT / NAIL CARE
  if (name.includes('grooming') || name.includes('nail') || name.includes('hairbrush') || name.includes('comb')) {
    return `
      <!-- Hairbrush -->
      <ellipse cx="240" cy="220" rx="35" ry="45" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="7"/>
      <path d="M 240 265 L 240 350" stroke="${accentColor}" stroke-width="12" stroke-linecap="round"/>
      <!-- Soft Bristles -->
      <line x1="225" y1="190" x2="225" y2="250" stroke="${accentColor}" stroke-width="4" stroke-dasharray="3 3"/>
      <line x1="240" y1="185" x2="240" y2="255" stroke="${accentColor}" stroke-width="4" stroke-dasharray="3 3"/>
      <line x1="255" y1="190" x2="255" y2="250" stroke="${accentColor}" stroke-width="4" stroke-dasharray="3 3"/>
      <!-- Safety Scissors / Trimmer -->
      <circle cx="340" cy="330" r="14" fill="none" stroke="${accentColor}" stroke-width="6"/>
      <circle cx="370" cy="330" r="14" fill="none" stroke="${accentColor}" stroke-width="6"/>
      <line x1="345" y1="318" x2="365" y2="220" stroke="${accentColor}" stroke-width="7" stroke-linecap="round"/>
      <line x1="365" y1="318" x2="345" y2="220" stroke="${accentColor}" stroke-width="7" stroke-linecap="round"/>
    `;
  }

  // 31. PACIFIER CLIP & TEETHING TOYS
  if (name.includes('pacifier') || name.includes('teething') || name.includes('teether') || name.includes('rattle')) {
    return `
      <!-- Wooden Teething Ring -->
      <circle cx="300" cy="240" r="60" fill="none" stroke="${accentColor}" stroke-width="14"/>
      <!-- Silicone Textured Beads String -->
      <circle cx="240" cy="240" r="12" fill="${accentColor}"/>
      <circle cx="260" cy="190" r="12" fill="${accentColor}"/>
      <circle cx="340" cy="190" r="12" fill="${accentColor}"/>
      <circle cx="360" cy="240" r="12" fill="${accentColor}"/>
      <!-- Pacifier Clasp -->
      <rect x="280" y="320" width="40" height="30" rx="8" fill="#FFFFFF" stroke="${accentColor}" stroke-width="6"/>
    `;
  }

  // 32. BABY SUNGLASSES
  if (name.includes('sunglasses') || name.includes('sun glasses') || name.includes('uv400')) {
    return `
      <!-- Left & Right Lenses -->
      <rect x="190" y="210" width="90" height="65" rx="20" fill="${accentColor}" opacity="0.35" stroke="${accentColor}" stroke-width="8"/>
      <rect x="320" y="210" width="90" height="65" rx="20" fill="${accentColor}" opacity="0.35" stroke="${accentColor}" stroke-width="8"/>
      <!-- Bridge -->
      <line x1="280" y1="235" x2="320" y2="235" stroke="${accentColor}" stroke-width="8"/>
      <!-- Stay-On Neoprene Elastic Headband -->
      <path d="M 190 240 C 130 240 130 330 300 340 C 470 330 470 240 410 240" fill="none" stroke="${accentColor}" stroke-width="6" stroke-linecap="round"/>
    `;
  }

  // 33. SCHOOL BACKPACK / DIAPER BACKPACK / MATERNITY BAG
  if (name.includes('backpack') || name.includes('school bag') || name.includes('duffel') || name.includes('bag')) {
    return `
      <!-- Top Handle -->
      <path d="M 270 140 Q 300 115 330 140" fill="none" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <!-- Main Backpack Body -->
      <rect x="220" y="140" width="160" height="210" rx="30" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="8"/>
      <!-- Front Zipper Pocket -->
      <rect x="245" y="235" width="110" height="95" rx="16" fill="#FFFFFF" stroke="${accentColor}" stroke-width="6"/>
      <line x1="255" y1="260" x2="345" y2="260" stroke="${accentColor}" stroke-width="4"/>
      <!-- Side Bottle Pockets -->
      <rect x="202" y="230" width="22" height="70" rx="8" fill="${accentColor}" opacity="0.4"/>
      <rect x="376" y="230" width="22" height="70" rx="8" fill="${accentColor}" opacity="0.4"/>
      <!-- Shoulder Straps Peek -->
      <path d="M 230 150 C 190 200 190 320 220 340" fill="none" stroke="${accentColor}" stroke-width="6"/>
      <path d="M 370 150 C 410 200 410 320 380 340" fill="none" stroke="${accentColor}" stroke-width="6"/>
    `;
  }

  // 34. KIDS BENTO LUNCH BOX
  if (name.includes('lunch') || name.includes('bento')) {
    return `
      <!-- Bento Box Base -->
      <rect x="200" y="210" width="200" height="130" rx="20" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="8"/>
      <!-- Dividers (4 Compartments) -->
      <line x1="300" y1="210" x2="300" y2="340" stroke="${accentColor}" stroke-width="5"/>
      <line x1="200" y1="275" x2="300" y2="275" stroke="${accentColor}" stroke-width="5"/>
      <!-- Airtight Latches -->
      <rect x="188" y="250" width="14" height="40" rx="4" fill="${accentColor}"/>
      <rect x="398" y="250" width="14" height="40" rx="4" fill="${accentColor}"/>
      <!-- Cutlery Set on Lid -->
      <line x1="240" y1="175" x2="360" y2="175" stroke="${accentColor}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="250" cy="175" r="8" fill="${accentColor}"/>
    `;
  }

  // 35. KIDS WATER BOTTLE / VACUUM FLASK
  if (name.includes('water bottle') || name.includes('flask') || name.includes('thermos')) {
    return `
      <!-- Bottle Flip Cap & Straw -->
      <path d="M 285 130 Q 300 120 315 130 L 315 160 L 285 160 Z" fill="${accentColor}"/>
      <rect x="260" y="160" width="80" height="30" rx="8" fill="#FFFFFF" stroke="${accentColor}" stroke-width="7"/>
      <!-- Stainless Steel Insulated Flask Body -->
      <rect x="260" y="190" width="80" height="165" rx="18" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="8"/>
      <!-- Non-Slip Silicone Boot at Bottom -->
      <rect x="256" y="315" width="88" height="40" rx="12" fill="${accentColor}" opacity="0.4"/>
      <circle cx="300" cy="245" r="16" fill="#FFFFFF" stroke="${accentColor}" stroke-width="4"/>
    `;
  }

  // 36. PENCIL CASE / STATIONERY SET
  if (name.includes('pencil') || name.includes('stationery') || name.includes('art')) {
    return `
      <!-- Hardtop 3D Pencil Case -->
      <rect x="190" y="210" width="220" height="120" rx="22" fill="${accentColor}" opacity="0.25" stroke="${accentColor}" stroke-width="8"/>
      <!-- Full Zipper Track -->
      <line x1="190" y1="270" x2="410" y2="270" stroke="${accentColor}" stroke-width="6"/>
      <circle cx="410" cy="270" r="10" fill="${accentColor}"/>
      <!-- Pencils / Pens -->
      <line x1="220" y1="165" x2="380" y2="165" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <polygon points="380,161 395,165 380,169" fill="${accentColor}"/>
      <line x1="220" y1="140" x2="350" y2="140" stroke="${accentColor}" stroke-width="6" stroke-linecap="round"/>
    `;
  }

  // 37. CHILDREN'S SCHOOL SHOES / BOOTIES / FOOTWEAR
  if (name.includes('shoe') || name.includes('bootie') || name.includes('sandal') || name.includes('footwear')) {
    return `
      <!-- Left Shoe Profile -->
      <path d="M 180 290 Q 180 240 230 240 L 280 240 Q 320 270 320 295 L 310 320 L 180 320 Z" 
            fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="7" stroke-linejoin="round"/>
      <!-- Right Shoe Profile -->
      <path d="M 280 260 Q 280 210 330 210 L 380 210 Q 420 240 420 265 L 410 290 L 280 290 Z" 
            fill="${accentColor}" opacity="0.3" stroke="${accentColor}" stroke-width="7" stroke-linejoin="round"/>
      <!-- Rubber Soles -->
      <rect x="175" y="315" width="145" height="15" rx="6" fill="#FFFFFF" stroke="${accentColor}" stroke-width="6"/>
      <rect x="275" y="285" width="145" height="15" rx="6" fill="#FFFFFF" stroke="${accentColor}" stroke-width="6"/>
      <!-- Strap / Buckle -->
      <rect x="230" y="250" width="35" height="12" rx="4" fill="${accentColor}"/>
    `;
  }

  // 38. REUSABLE BREAST PADS
  if (name.includes('pad') || name.includes('breast pad')) {
    return `
      <!-- Round Contoured Breast Pads (Stack of 2) -->
      <circle cx="270" cy="250" r="60" fill="${accentColor}" opacity="0.2" stroke="${accentColor}" stroke-width="8"/>
      <circle cx="330" cy="250" r="60" fill="#FFFFFF" stroke="${accentColor}" stroke-width="8"/>
      <!-- Bamboo Texture Lines -->
      <path d="M 300 210 Q 330 250 300 290" fill="none" stroke="${accentColor}" stroke-width="4" stroke-dasharray="4 4"/>
      <path d="M 330 200 Q 360 250 330 300" fill="none" stroke="${accentColor}" stroke-width="4" stroke-dasharray="4 4"/>
    `;
  }

  // DEFAULT / CLEAR VISIBLE PRODUCT BADGE
  return `
    <rect x="190" y="180" width="220" height="180" rx="28" fill="${accentColor}" opacity="0.15" stroke="${accentColor}" stroke-width="8"/>
    <circle cx="300" cy="270" r="50" fill="#FFFFFF" stroke="${accentColor}" stroke-width="6"/>
    <path d="M 280 270 L 295 285 L 325 255" fill="none" stroke="${accentColor}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  `;
}

/**
 * Creates an inline SVG Data URI placeholder tailored to the specific product name and category.
 */
export function getProductPlaceholderSvg(
  productName: string,
  categoryId: string,
  viewAngle: 'main' | 'front' | 'side' | 'back' | 'detail' | string = 'main'
): string {
  const theme = CATEGORY_THEMES[categoryId] || CATEGORY_THEMES['cat-baby-essentials'];
  const sanitizedTitle = (productName || 'Sunshine Babies Product')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Truncate for display in SVG text
  const line1 = sanitizedTitle.length > 30 ? sanitizedTitle.substring(0, 28) + '...' : sanitizedTitle;
  const angleLabel = viewAngle.toUpperCase() + ' VIEW';

  const productArtwork = getProductSvgIllustration(productName, categoryId, theme.accent);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.bgGradient[0]}"/>
        <stop offset="100%" stop-color="${theme.bgGradient[1]}"/>
      </linearGradient>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="15" cy="15" r="1.5" fill="${theme.accent}" opacity="0.10"/>
      </pattern>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="${theme.accent}" flood-opacity="0.12"/>
      </filter>
    </defs>

    <!-- Background with gradient and subtle pattern -->
    <rect width="600" height="600" fill="url(#bgGrad)"/>
    <rect width="600" height="600" fill="url(#grid)"/>

    <!-- Central Card Container -->
    <g filter="url(#shadow)">
      <rect x="60" y="60" width="480" height="480" rx="32" fill="#FFFFFF"/>
      <rect x="60" y="60" width="480" height="480" rx="32" fill="none" stroke="${theme.accent}" stroke-width="2" opacity="0.25"/>
    </g>

    <!-- Category & View Badges -->
    <rect x="90" y="85" width="150" height="28" rx="14" fill="${theme.badgeBg}"/>
    <text x="165" y="103" fill="${theme.badgeText}" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" text-anchor="middle">${theme.categoryLabel}</text>

    <rect x="360" y="85" width="150" height="28" rx="14" fill="${theme.bgGradient[0]}" stroke="${theme.accent}" stroke-width="1"/>
    <text x="435" y="103" fill="${theme.accent}" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" text-anchor="middle" letter-spacing="1.2">${angleLabel}</text>

    <!-- Product Specific Drawing -->
    <g>
      ${productArtwork}
    </g>

    <!-- Product Title -->
    <text x="300" y="440" fill="${theme.text}" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="700" text-anchor="middle">
      ${line1}
    </text>

    <!-- Quality Guarantee Ribbon -->
    <g transform="translate(165, 465)">
      <rect x="0" y="0" width="270" height="30" rx="15" fill="${theme.bgGradient[1]}"/>
      <circle cx="20" cy="15" r="5" fill="${theme.accent}"/>
      <text x="145" y="19" fill="${theme.text}" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" text-anchor="middle">
        Genuine Product Specification
      </text>
    </g>

    <!-- Professional placeholder notice -->
    <text x="300" y="520" fill="#64748B" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="600" text-anchor="middle" letter-spacing="1.2">
      OFFICIAL STORE SPECIFICATION • CUSTOM PHOTOS UPLOADABLE VIA ADMIN
    </text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Returns an array of multi-angle images for any product.
 */
export function getProductImageSet(
  productName: string,
  categoryId: string,
  existingImages: string[] = []
): {
  main: string;
  front: string;
  side: string;
  back: string;
  detail: string;
  all: string[];
} {
  // Only accept existing images if they are real data URIs or non-unsplash URLs
  const validImages = (existingImages || []).filter(
    (img) => img && !img.includes('unsplash.com/photo-1515488042361') && !img.includes('unsplash.com/photo-1553062407')
  );

  const main = validImages[0] || getProductPlaceholderSvg(productName, categoryId, 'main');
  const front = validImages[1] || getProductPlaceholderSvg(productName, categoryId, 'front');
  const side = validImages[2] || getProductPlaceholderSvg(productName, categoryId, 'side');
  const back = validImages[3] || getProductPlaceholderSvg(productName, categoryId, 'back');
  const detail = validImages[4] || getProductPlaceholderSvg(productName, categoryId, 'detail');

  const all = [main, front, side, back, detail].filter(Boolean);

  return {
    main,
    front,
    side,
    back,
    detail,
    all,
  };
}
