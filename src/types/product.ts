export interface ApiProduct {
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
  is_newest: number;
  sku_code: string;
  category_name: string;
  cover_image: string;
}

export interface ProductsResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: ApiProduct[];
}

export interface ProductsQuery {
  search?: string;
  categoryId?: string;
}
