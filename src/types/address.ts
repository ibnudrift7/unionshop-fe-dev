export interface DefaultAddressData {
  id: number;
  user_id: number;
  recipient_name: string;
  phone: string;
  address_line: string;
  province_id: number;
  city_id: number;
  subdistrict_id: number;
  postal_code: string;
  is_default: number;
  created_at: string;
}

export interface DefaultAddressResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: DefaultAddressData | null;
}
