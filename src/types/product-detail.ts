export interface ProductPhoto {
  id: number;
  image: string; // may be filename; backend example shows filenames
  is_cover: number;
  sorts: number;
}

export interface ProductAttributeValue {
  id: number;
  value: string;
  image: string | null; // filename or absolute URL depending on backend
  price: number;
}

export interface ProductAttributeGroup {
  id: number;
  name: string;
  type: string; // e.g., 'options' | 'images'
  values: ProductAttributeValue[];
}

export interface ApiProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  category_id: number;
  brand_id: number;
  base_price: string;
  sale_price: string;
  average_rating?: string;
  total_reviews?: number;
  formatted_sales?: string;
  stock_quantity: number;
  is_active: number;
  status: string;
  is_newest: number;
  type: string;
  created_at: string;
  updated_at: string;
  sku_code: string;
  category_name: string;
  photos: ProductPhoto[];
  attributes: ProductAttributeGroup[];
}

export interface ProductDetailResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: ApiProductDetail;
}
