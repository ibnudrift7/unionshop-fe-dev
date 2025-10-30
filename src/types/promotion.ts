export interface PromotionItem {
  name: string;
  code: string;
  description: string | null;
  image: string | null;
}

export interface PromotionListResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: PromotionItem[];
}
