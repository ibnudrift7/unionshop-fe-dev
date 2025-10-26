export interface CourierItem {
  id: number;
  name: string; 
  code: string; 
  support_tracking: number;
}

export interface CouriersResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: CourierItem[];
}

export interface ShippingServiceItem {
  code: string; 
  name: string; 
  cost: number; 
  estimated_day: string;
}

export interface ShippingCourierOption {
  code: string; 
  name: string; 
  services: ShippingServiceItem[];
}

export interface ShippingCalculateData {
  origin: { subdistrict_id: string };
  destination: {
    subdistrict_id: number;
    subdistrict_name: string | null;
    city_id: number;
    province_id: number;
    postal_code: string;
  };
  weight: number;
  weight_unit: string; // gram
  shipping_options: Record<string, ShippingCourierOption>; 
}

export interface ShippingCalculateResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: ShippingCalculateData;
}
