export interface ProductPhoto {
  id: number;
  image: string; // may be filename; backend example shows filenames
  is_cover: number;
  sorts: number;
}

export interface ProductAttribute {
  id: number;
  product_id: number;
  attributes_id: number;
  attribute_name: string;
  attribute_value_id: number;
  attribute_value: string;
  attribute_image: null | string;
  attribute_price: number;
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
  stock_quantity: number;
  stock_alert_threshold: number;
  is_active: number;
  status: string;
  is_newest: number;
  type: string;
  created_at: string;
  updated_at: string;
  sku_code: string;
  category_name: string;
  photos: ProductPhoto[];
  attributes: ProductAttribute[];
}

export interface ProductDetailResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: ApiProductDetail;
}
