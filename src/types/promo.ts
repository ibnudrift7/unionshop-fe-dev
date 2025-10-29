export interface ApplyPromoData {
  promo_id: number;
  promo_code: string;
  promo_name: string;
  discount_type: string;
  discount_value: string; 
  discount_amount: string; 
  subtotal: string; 
  total_after_discount: string;
}

export interface ApplyPromoResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: ApplyPromoData;
}

export interface ApplyPromoErrorResponse {
  success: false;
  message: string;
  errors?: {
    promo_code?: string;
    [key: string]: unknown;
  };
}
