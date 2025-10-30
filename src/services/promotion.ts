import { httpFetch } from '@/services/http';
import { API_ENDPOINTS } from '@/constants/api';
import type { PromotionListResponse } from '@/types/promotion';

export const promotionService = {
  list() {
    return httpFetch<PromotionListResponse>(API_ENDPOINTS.promotionCodes, {
      method: 'GET',
    });
  },
};
