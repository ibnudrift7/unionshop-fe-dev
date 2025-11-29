export interface ApiBundleAttributeValue {
  id: number;
  value: string;
  image: string | null;
  price: number;
}

export interface ApiBundleAttributeGroup {
  id: number;
  name: string;
  type: string; // 'options' | 'images'
  values: ApiBundleAttributeValue[];
}

export interface ApiBundleProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  category_id: number;
  brand_id: number;
  base_price: string;
  sale_price: string;
  stock_quantity: number;
  is_active: number;
  status: string;
  is_newest: number;
  type: string;
  created_at: string;
  updated_at: string;
  sku_code: string;
  category_name: string;
  average_rating?: string;
  total_reviews?: number;
  formatted_sales?: string;
  photos: string[];
  attributes: ApiBundleAttributeGroup[];
}

export interface BundleProductDetailResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: ApiBundleProductDetail;
}
