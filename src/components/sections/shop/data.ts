import { Category, Product, SpecialProduct } from '@/types';

// Hero / Promo banners
export const heroImages: string[] = [
  '/assets/Background.png',
  '/assets/Background.png',
  '/assets/Background.png',
];

export const promoImages: string[] = [
  '/assets/Cashback.png',
  '/assets/Cashback.png',
  '/assets/Cashback.png',
];

// Location / User points
export interface LocationData {
  points: number;
  name: string;
  address: string;
}

export const locationData: LocationData = {
  points: 100,
  name: 'Ruko Mulyosari Surabaya',
  address: 'Ruko Mulyosari Surabaya, Jl Mulyosari No 76G Kec....',
};

// Categories
export const categories: Category[] = [
  {
    id: 'starter-kit',
    name: 'Starter\nKit',
    image: '/assets/starter-kit.png',
    alt: 'Starter Kit',
  },
  {
    id: 'freebase-liquid',
    name: 'Freebase\nLiquid',
    image: '/assets/freebase.png',
    alt: 'Freebase Liquid',
  },
  {
    id: 'saltnic-liquid',
    name: 'Saltnic\nLiquid',
    image: '/assets/saltnic.png',
    alt: 'Saltnic Liquid',
  },
  {
    id: 'official-merchandise',
    name: 'Official\nMerchandise',
    image: '/assets/official-merch.png',
    alt: 'Official Merchandise',
  },
];

// Voucher sections
export interface Voucher1Data {
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  onClaim?: () => void;
}

export interface Voucher2Data {
  title1: string;
  title2?: string;
  description: string;
  buttonText: string;
  image: string;
  onClaim?: () => void;
}

export const voucher1Data: Voucher1Data = {
  image: '/assets/voucher3.png',
  title: 'Voucher buy 1 get 1 special',
  subtitle: 'UNIONLABS WEBSITE USER.',
  buttonText: 'KLAIM',
};

export const voucher2Data: Voucher2Data = {
  title1: 'Mau Voucher Diskon 10RB?',
  description: 'Gabung & Ambil Vouchernya Sekarang juga!',
  buttonText: 'CLAIM SEKARANG',
  image: '/assets/Voucher.png',
};

export const voucher2List: Voucher2Data[] = [
  voucher2Data,
  { ...voucher2Data, image: '/assets/Voucher2.png' },
];

// Special Today Products
export const specialTodayProducts: SpecialProduct[] = [
  {
    id: '1',
    name: 'Ova Vprime 60 + Freebase',
    image: '/assets/SpecialProduct.png',
    originalPrice: 100000,
    discountPrice: 50000,
  },
  {
    id: '2',
    name: 'Ova Vprime 60 + Freebase 2',
    image: '/assets/SpecialProduct.png',
    originalPrice: 100000,
    discountPrice: 50000,
  },
  {
    id: '3',
    name: 'Ova Vprime 60 + Freebase 3',
    image: '/assets/SpecialProduct.png',
    originalPrice: 100000,
    discountPrice: 50000,
  },
  {
    id: '4',
    name: 'Ova Vprime 60 + Freebase 4',
    image: '/assets/SpecialProduct.png',
    originalPrice: 100000,
    discountPrice: 50000,
  },
];

// General Products
export const products: Product[] = [
  {
    id: '1',
    name: 'Makna - Taro Milk cheese 1',
    image: '/assets/Product.png',
    price: 75000,
    rating: 5.0,
    sold: 500,
    isNew: true,
  },
  {
    id: '2',
    name: 'Makna - Taro Milk cheese 2',
    image: '/assets/Product.png',
    price: 75000,
    rating: 5.0,
    sold: 500,
    isNew: true,
  },
  {
    id: '3',
    name: 'Makna - Taro Milk cheese 3',
    image: '/assets/Product.png',
    price: 75000,
    rating: 5.0,
    sold: 500,
    isNew: false,
  },
  {
    id: '4',
    name: 'Makna - Taro Milk cheese 4',
    image: '/assets/Product.png',
    price: 75000,
    rating: 5.0,
    sold: 500,
    isNew: false,
  },
  {
    id: '5',
    name: 'Makna - Taro Milk cheese 5',
    image: '/assets/Product.png',
    price: 75000,
    rating: 5.0,
    sold: 500,
    isNew: false,
  },
  {
    id: '6',
    name: 'Makna - Taro Milk cheese 6',
    image: '/assets/Product.png',
    price: 75000,
    rating: 5.0,
    sold: 500,
    isNew: false,
  },
];

// Official Merchandise CTA
export const officialMerchData = {
  title: 'Official Merchandise',
  subtitle: 'Bisa dikirim langsung ke lokasimu',
  buttonText: 'Order',
  imageSrc: '/assets/OfficialMerch.png',
};

// Filters used inside the Shop page
export type ShopFilter = 'starter' | 'freebase' | 'saltnic' | 'official';
export const shopFilters: { id: ShopFilter; label: string }[] = [
  { id: 'starter', label: 'Starter kit' },
  { id: 'freebase', label: 'Freebase' },
  { id: 'saltnic', label: 'Saltnic' },
  { id: 'official', label: 'Official merchandise' },
];

export const shopProductsByFilter: Record<ShopFilter, Product[]> = {
  starter: [
    {
      id: 'st-1',
      name: 'Starter Kit Alpha',
      image: '/assets/Product.png',
      price: 250000,
      rating: 4.8,
      sold: 320,
      isNew: true,
    },
    {
      id: 'st-2',
      name: 'Starter Kit Beta',
      image: '/assets/Product.png',
      price: 299000,
      rating: 4.7,
      sold: 210,
    },
    {
      id: 'st-3',
      name: 'Starter Kit Gamma',
      image: '/assets/Product.png',
      price: 199000,
      rating: 4.6,
      sold: 185,
    },
  ],
  freebase: [
    {
      id: 'fb-1',
      name: 'Freebase English Breakfast 7MG',
      image: '/assets/Product.png',
      price: 75000,
      rating: 5.0,
      sold: 500,
      isNew: true,
    },
    {
      id: 'fb-2',
      name: 'Freebase Morning Citrus 9MG',
      image: '/assets/Product.png',
      price: 85000,
      rating: 4.9,
      sold: 420,
    },
  ],
  saltnic: [
    {
      id: 'sn-1',
      name: 'Saltnic Tropical Punch 25MG',
      image: '/assets/SpecialProduct.png',
      price: 95000,
      rating: 4.9,
      sold: 390,
    },
    {
      id: 'sn-2',
      name: 'Saltnic Cool Mint 35MG',
      image: '/assets/SpecialProduct.png',
      price: 99000,
      rating: 4.7,
      sold: 280,
    },
  ],
  official: [
    {
      id: 'om-1',
      name: 'Makna - Jersey Boxy Oversized Purple (M)',
      image: '/assets/OfficialMerch.png',
      price: 375000,
      rating: 5.0,
      sold: 150,
    },
    {
      id: 'om-2',
      name: 'Makna - Kaos Basic Hitam (L)',
      image: '/assets/OfficialMerch.png',
      price: 249000,
      rating: 4.8,
      sold: 260,
    },
  ],
};

export const shopAllProducts: Product[] = [
  ...products, // include general products shown on home page if needed
  ...Object.values(shopProductsByFilter).flat(),
];

export function getProductById(id: string): Product | undefined {
  return shopAllProducts.find((p) => p.id === id);
}

// Utility helper if later we want a single object
export const shopMockData = {
  heroImages,
  promoImages,
  locationData,
  categories,
  voucher1Data,
  voucher2Data,
  voucher2List,
  specialTodayProducts,
  products,
  officialMerchData,
  shopFilters,
  shopProductsByFilter,
  shopAllProducts,
};

export default shopMockData;
