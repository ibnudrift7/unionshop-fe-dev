'use client';

import { useQuery } from '@tanstack/react-query';
import { sliderService } from '@/services/slider';
import { HttpError } from '@/services/http';

export function useSlidersQuery(type: 1 | 2 | '1' | '2' = 1, enabled = true) {
  const t = typeof type === 'number' ? String(type) : type;
  return useQuery<string[], HttpError>({
    queryKey: ['sliders', t],
    queryFn: () => sliderService.getByTypeUi(t),
    enabled,
    staleTime: 60_000,
  });
}

export function useHomeSliders(enabled = true) {
  return useSlidersQuery(1, enabled);
}

export function usePromotionSliders(enabled = true) {
  return useSlidersQuery(2, enabled);
}
