export interface CartAttributeItem {
  name: string;
  value: string;
  price?: number;
}

export interface CartProductInput {
  product_id: number;
  qty: number;
  attributes: Array<Pick<CartAttributeItem, 'name' | 'value'>>;
}

export interface CartItem {
  id: number;
  product_id: number;
  qty: number;
  price?: number; // sometimes named prices in GET
  prices?: number; // GET variant
  sale_price?: number; // POST variant
  subtotal: number;
  attributes: CartAttributeItem[];
  product_name: string;
  slug: string;
  stock_quantity: number;
  base_price?: string;
  sale_price_str?: string;
  product_type: string;
  cover_image: string | null;
}

export interface CartSummary {
  total_items: number;
  subtotal: string; // comes as string from API
}

export interface CartData {
  cart_id: number;
  items: CartItem[];
  summary: CartSummary;
}

export interface CartResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: CartData;
}

export interface ClearCartResponse {
  statusCode: number;
  message: string;
  success: boolean;
}
