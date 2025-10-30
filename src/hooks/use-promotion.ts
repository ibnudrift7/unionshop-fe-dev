'use client';

import { useQuery } from '@tanstack/react-query';
import { promotionService } from '@/services/promotion';
import type { PromotionListResponse } from '@/types/promotion';
import type { HttpError } from '@/services/http';

export function usePromotionsQuery(enabled: boolean = true) {
  return useQuery<PromotionListResponse, HttpError>({
    queryKey: ['promotions'],
    queryFn: () => promotionService.list().then((r) => r.data),
    enabled,
    staleTime: 60_000,
  });
}
