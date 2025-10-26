export interface CheckoutPayload {
  shipping_address_id: string | number;
  promo_code: string; 
  points_to_use: string | number;
  order_notes: string;
  courier_id: string | number; 
  shipping_package: string; 
  shipping_day: string | number;
  shipping_fee: string | number; 
}

export interface CheckoutErrorResponse {
  success: false;
  message: string;
}

export type CheckoutResponse =
  | CheckoutErrorResponse
  | {
      success: true;
      message?: string;
      [key: string]: unknown;
    };
