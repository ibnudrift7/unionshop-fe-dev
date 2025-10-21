import { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  image: string;
  alt: string;
}

export interface SpecialProduct {
  id: string;
  name: string;
  originalPrice: number;
  discountPrice: number;
  image?: string;
  price?: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  rating: number;
  sold: number;
  image?: string;
  slug?: string;
  images?: string[];
  attributes?: Array<{
    id: number;
    name: string;
    type: 'options' | 'images' | string;
    values: Array<{
      id: number;
      value: string;
      image: string | null;
      price: number;
    }>;
  }>;
  isNew?: boolean;
  discountPrice?: number;
}

export interface NavigationTab {
  icon?: LucideIcon;
  iconSrc?: string;
  activeIconSrc?: string;
  label: string;
  badge?: string;
  id: string;
}
