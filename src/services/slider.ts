import { API_ENDPOINTS } from '@/constants/api';
import { httpFetch } from '@/services/http';
import type { SliderResponse, ApiSliderItem } from '@/types/slider';

function toAbsolute(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return undefined;
}

export const sliderService = {
  async getByType(type: string | number) {
    const body = new URLSearchParams();
    body.set('type', String(type));
    return httpFetch<SliderResponse>(API_ENDPOINTS.sliderType, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  async getByTypeUi(type: string | number): Promise<string[]> {
    const res = await this.getByType(type);
    const list: ApiSliderItem[] = res.data.data ?? [];
    return list
      .slice()
      .sort((a, b) => (a.is_sorts ?? 0) - (b.is_sorts ?? 0))
      .map((item) => toAbsolute(item.images))
      .filter((u): u is string => typeof u === 'string' && u.length > 0);
  },
};
