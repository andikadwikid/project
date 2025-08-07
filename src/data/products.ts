import { Product, Category, Brand } from '@/types/product';

export const categories: Category[] = [
  {
    id: '1',
    name: 'High Heels',
    slug: 'high-heels',
    image: '/images/categories/high-heels.svg',
    description: 'Elegant high heels untuk berbagai acara formal'
  },
  {
    id: '2',
    name: 'Sneakers',
    slug: 'sneakers',
    image: '/images/categories/sneakers.svg',
    description: 'Sneakers stylish untuk aktivitas sehari-hari'
  },
  {
    id: '3',
    name: 'Flats',
    slug: 'flats',
    image: '/images/categories/flats.svg',
    description: 'Sepatu flat yang nyaman dan chic'
  },
  {
    id: '4',
    name: 'Boots',
    slug: 'boots',
    image: '/images/categories/boots.svg',
    description: 'Boots trendy untuk gaya kasual maupun formal'
  }
];

export const brands: Brand[] = [
  {
    id: '1',
    name: 'Bella Rosa',
    logo: '/images/brands/bella-rosa.png',
    description: 'Premium women shoes with Italian craftsmanship'
  },
  {
    id: '2',
    name: 'Femme Chic',
    logo: '/images/brands/femme-chic.png',
    description: 'Modern and elegant footwear for contemporary women'
  },
  {
    id: '3',
    name: 'Grace Steps',
    logo: '/images/brands/grace-steps.png',
    description: 'Comfortable luxury shoes for everyday elegance'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Elegant Rose Gold Heels',
    price: 1250000,
    originalPrice: 1500000,
    image: '/images/products/rose-gold-heels.svg',
    images: [
      '/images/products/rose-gold-heels.svg',
      '/images/products/rose-gold-heels.svg',
      '/images/products/rose-gold-heels.svg'
    ],
    category: 'High Heels',
    brand: 'Bella Rosa',
    description: 'Sepatu hak tinggi dengan finishing rose gold yang elegan. Cocok untuk acara formal dan pesta malam.',
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['Rose Gold', 'Silver'],
    isNew: false,
    isSale: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'Classic Black Pumps',
    price: 950000,
    image: '/images/products/black-pumps.svg',
    images: [
      '/images/products/black-pumps.svg',
      '/images/products/black-pumps.svg'
    ],
    category: 'High Heels',
    brand: 'Femme Chic',
    description: 'Pumps hitam klasik yang timeless. Essential untuk setiap wanita profesional.',
    sizes: ['35', '36', '37', '38', '39', '40', '41'],
    colors: ['Black'],
    isNew: false,
    isSale: false,
    rating: 4.6,
    reviews: 89
  },
  {
    id: '3',
    name: 'Pastel Pink Sneakers',
    price: 750000,
    image: '/images/products/pink-sneakers.svg',
    images: [
      '/images/products/pink-sneakers.svg',
      '/images/products/pink-sneakers.svg',
      '/images/products/pink-sneakers.svg'
    ],
    category: 'Sneakers',
    brand: 'Grace Steps',
    description: 'Sneakers dengan warna pastel pink yang soft dan feminin. Nyaman untuk aktivitas sehari-hari.',
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['Pastel Pink', 'White', 'Lavender'],
    isNew: true,
    isSale: false,
    rating: 4.9,
    reviews: 156
  },
  {
    id: '4',
    name: 'Nude Ballet Flats',
    price: 650000,
    image: '/images/products/nude-flats.svg',
    images: [
      '/images/products/nude-flats.svg',
      '/images/products/nude-flats.svg'
    ],
    category: 'Flats',
    brand: 'Bella Rosa',
    description: 'Ballet flats dengan warna nude yang versatile. Cocok dipadukan dengan berbagai outfit.',
    sizes: ['35', '36', '37', '38', '39', '40'],
    colors: ['Nude', 'Beige', 'Taupe'],
    isNew: false,
    isSale: false,
    rating: 4.7,
    reviews: 203
  },
  {
    id: '5',
    name: 'Burgundy Ankle Boots',
    price: 1100000,
    originalPrice: 1350000,
    image: '/images/products/burgundy-boots.svg',
    images: [
      '/images/products/burgundy-boots.svg',
      '/images/products/burgundy-boots.svg',
      '/images/products/burgundy-boots.svg'
    ],
    category: 'Boots',
    brand: 'Femme Chic',
    description: 'Ankle boots dengan warna burgundy yang rich dan sophisticated. Perfect untuk musim dingin.',
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['Burgundy', 'Black', 'Brown'],
    isNew: false,
    isSale: true,
    rating: 4.5,
    reviews: 78
  },
  {
    id: '6',
    name: 'White Platform Sneakers',
    price: 850000,
    image: '/images/products/white-platform.svg',
    images: [
      '/images/products/white-platform.svg',
      '/images/products/white-platform.svg'
    ],
    category: 'Sneakers',
    brand: 'Grace Steps',
    description: 'Platform sneakers putih yang trendy dan memberikan tinggi ekstra dengan nyaman.',
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['White', 'Cream'],
    isNew: true,
    isSale: false,
    rating: 4.8,
    reviews: 92
  }
];