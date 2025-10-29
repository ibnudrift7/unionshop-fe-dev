export interface RegisterGuestPayload {
  email: string;
  full_name: string;
  phone: string;
  shipping_address: {
    province_id: number;
    city_id: number;
    subdistrict_id: number;
    subdistrict_name: string;
    address_line: string;
    postal_code: string;
  };
  cart_items: Array<{
    product_id: number;
    qty: number;
    attributes: Array<{
      name: string;
      value: string;
    }>;
  }>;
}

export interface RegisterGuestResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: {
    token: string;
    user: {
      id: number;
      email: string;
      full_name: string;
      phone: string;
      is_guest: boolean;
    };
    address_id: number;
    cart_id: number;
  };
}
