export interface DefaultAddressData {
  id: number;
  user_id?: number;
  recipient_name: string;
  phone: string;
  address_line: string;
  province_id: number;
  province_name?: string;
  city_id: number;
  city_name?: string;
  subdistrict_id: number;
  subdistrict_name?: string;
  postal_code: string;
  is_default: number;
  latitude?: string;
  longitude?: string;
  created_at?: string;
}

export interface DefaultAddressResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: DefaultAddressData | null;
}

export type AddressItem = DefaultAddressData;

export interface AddressListResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: AddressItem[];
}

export interface CreateAddressPayload {
  recipient_name: string;
  phone: string;
  province_id: number | string;
  city_id: number | string;
  subdistrict_id: number | string;
  address_line: string;
  postal_code: string;
  is_default: 'true' | 'false' | string; // API expects string boolean in form
  subdistrict_name: string;
  latitude?: string;
  longitude?: string;
}

export interface CreateAddressData {
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

export interface CreateAddressResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: CreateAddressData;
}

export interface UpdateAddressPayload {
  recipient_name: string;
  phone: string;
  province_id: number | string;
  city_id: number | string;
  subdistrict_id: number | string;
  address_line: string;
  postal_code: string;
  is_default: 'true' | 'false' | string;
  subdistrict_name: string;
  latitude?: string;
  longitude?: string;
}

export interface UpdateAddressResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: number; // affected rows
}

export interface DeleteAddressResponse {
  statusCode: number;
  message: string;
  success: boolean;
}
