import { API_ENDPOINTS } from '@/constants/api';
import { httpFetch } from '@/services/http';
import type { Product } from '@/types';
import type {
  BundleProductDetailResponse,
  ApiBundleProductDetail,
} from '@/types/product-promo';

function parsePrice(str?: string): number | undefined {
  if (!str) return undefined;
  const n = Number(str);
  return Number.isFinite(n) ? n : undefined;
}

function toAbsolute(path?: string | null, fallback = '/assets/promo-item.png') {
  if (!path) return fallback;
  if (/^https?:\/\//i.test(path)) return path;
  return fallback;
}

function mapBundleDetailToUi(p: ApiBundleProductDetail): Product {
  const sale = parsePrice(p.sale_price);
  const base = parsePrice(p.base_price) ?? 0;
  const hasSale = sale !== undefined && sale > 0;

  const images: string[] = (p.photos || [])
    .map((img) => toAbsolute(img))
    .filter((img): img is string => typeof img === 'string' && img.length > 0);

  const attributes = (p.attributes || []).map((group) => ({
    id: group.id,
    name: group.name,
    type: (group.type as 'options' | 'images') ?? 'options',
    values: (group.values || []).map((v) => ({
      id: v.id,
      value: v.value,
      price: v.price,
      image: v.image ? toAbsolute(v.image) : null,
    })),
  }));

  return {
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: hasSale ? sale! : base,
    discountPrice: hasSale ? base : undefined,
    images: images.length > 0 ? images : undefined,
    image: images[0],
    isNew: p.is_newest === 1,
    rating: (() => {
      const r = p.average_rating;
      if (typeof r === 'string') {
        const n = Number(r);
        return Number.isFinite(n) ? n : 0;
      }
      return 0;
    })(),
    sold: (() => {
      const s = p.formatted_sales ?? undefined;
      if (typeof s === 'string') {
        const n = Number(s.replace(/[^0-9.-]+/g, ''));
        return Number.isFinite(n) ? n : 0;
      }
      if (typeof s === 'number') return s;
      return 0;
    })(),
    attributes,
  } as Product;
}

export const promosService = {
  async getBundleDetail(slug: string) {
    const path = `${API_ENDPOINTS.products}/bundles/${encodeURIComponent(
      slug,
    )}`;
    return httpFetch<BundleProductDetailResponse>(path, { method: 'GET' });
  },
  async getBundleDetailUi(slug: string): Promise<Product> {
    const res = await this.getBundleDetail(slug);
    const p = res.data.data;
    return mapBundleDetailToUi(p);
  },
};
