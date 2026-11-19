export type ThemeMode = 'light' | 'dark';

export interface ColorOption {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'outerwear' | 'knitwear' | 'denim' | 'footwear' | 'accessories';
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  ecoBadge: string;
  ecoImpactText: string;
  co2SavedKg: number;
  images: string[];
  colors: ColorOption[];
  sizes: string[];
  composition: string;
  fitDescription: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isSustainable?: boolean;
  description: string;
  detailBlocks?: { heading?: string; text?: string; image?: string }[];
}

export interface CartItem {
  id: string; // unique identifier for cart entry
  product: Product;
  selectedSize: string;
  selectedColor: ColorOption;
  quantity: number;
}

export interface CollectionItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  itemCount: number;
  slug: string;
}

export interface LookbookHotspot {
  id: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  productId: string;
}

export interface LookbookOutfit {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  hotspots: LookbookHotspot[];
}

export interface InstagramPost {
  id: string;
  handle: string;
  image: string;
  likes: number;
  caption: string;
  productId: string;
}

export type FilterCategory = 'all' | 'new-arrivals' | 'best-sellers' | 'sustainable-lab' | 'outerwear' | 'knitwear' | 'footwear' | 'denim' | 'accessories';
