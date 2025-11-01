export interface ApiSliderItem {
  id: number;
  name: string;
  images: string;
  descriptions: string;
  is_sorts: number;
  types: number;
  created_at: string;
}

export interface SliderResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: ApiSliderItem[];
}
