import { API_ENDPOINTS } from '@/constants/api';
import { httpFetch } from '@/services/http';
import type {
  ProductsQuery,
  ProductsResponse,
  ApiProduct,
} from '@/types/product';
import type { ProductDetailResponse } from '@/types/product-detail';
import type { ProductReviewsResponse } from '@/types/product-review';
import type { Product } from '@/types';

function parsePrice(str?: string): number | undefined {
  if (!str) return undefined;
  const n = Number(str);
  return Number.isFinite(n) ? n : undefined;
}

function mapApiProductToUi(
  p: ApiProduct,
  defaultImage: string = '/assets/SpecialProduct.png',
): Product {
  const DEFAULT_IMG = defaultImage;
  const toAbsolute = (path?: string | null): string => {
    if (!path) return DEFAULT_IMG;
    if (/^https?:\/\//i.test(path)) return path;
    return DEFAULT_IMG;
  };
  const sale = parsePrice(p.sale_price);
  const base = parsePrice(p.base_price) ?? 0;
  const hasSale = sale !== undefined && sale > 0;
  const image = toAbsolute(p.cover_image);
  // Prefer API-provided rating and sales when available
  const rating = (() => {
    const r = p.average_rating;
    if (typeof r === 'string') {
      const n = Number(r);
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  })();
  const sold = (() => {
    const s = p.formatted_sales as unknown;
    if (typeof s === 'string') {
      const n = Number(s.replace(/[^0-9.-]+/g, ''));
      return Number.isFinite(n) ? n : 0;
    }
    if (typeof s === 'number') return s as number;
    return 0;
  })();
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: hasSale ? sale! : base,
    discountPrice: hasSale ? base : undefined,
    image,
    isNew: p.is_newest === 1,
    rating,
    sold,
  } as Product;
}

export const productsService = {
  async getProducts(params: ProductsQuery = {}) {
    const { search, categoryId } = params;
    const res = await httpFetch<ProductsResponse>(API_ENDPOINTS.products, {
      method: 'GET',
      query: {
        ...(search ? { search } : {}),
        ...(categoryId ? { category_id: categoryId } : {}),
      },
    });
    return res;
  },
  async getBundles(params: ProductsQuery = {}) {
    const { search, categoryId } = params;
    const path = `${API_ENDPOINTS.products}/bundles`;
    const res = await httpFetch<{ data: ApiProduct[] }>(path, {
      method: 'GET',
      query: {
        ...(search ? { search } : {}),
        ...(categoryId ? { category_id: categoryId } : {}),
      },
    });
    return res;
  },
  async getBundlesUi(params: ProductsQuery = {}): Promise<Product[]> {
    const res = await this.getBundles(params as ProductsQuery);
    const payload = res.data as unknown as { data?: ApiProduct[] };
    const list = payload?.data ?? [];
    return list.map((p) => mapApiProductToUi(p, '/assets/promo-item.png'));
  },
  async getProductsUi(params: ProductsQuery = {}): Promise<Product[]> {
    const res = await this.getProducts(params);
    const list = res.data.data ?? [];
    return list.map((p) => mapApiProductToUi(p));
  },
  async getCategories() {
    const path = API_ENDPOINTS.productCategories;
    return httpFetch<import('@/types/product').CategoriesResponse>(path, {
      method: 'GET',
    });
  },
  async getCategoriesUi(): Promise<import('@/types').Category[]> {
    const res = await this.getCategories();
    const list = res.data.data ?? [];
    const toAbsolute = (path?: string | null) => {
      if (!path) return '/assets/category-placeholder.png';
      if (/^https?:\/\//i.test(path)) return path;
      return '/assets/category-placeholder.png';
    };
    return (list || []).map((c) => ({
      id: String(c.id),
      name: c.name,
      image: toAbsolute(c.image ?? null),
      alt: c.name,
    }));
  },
  async getProductDetail(slugOrId: string) {
    const path = `${API_ENDPOINTS.products}/${encodeURIComponent(slugOrId)}`;
    return httpFetch<ProductDetailResponse>(path, { method: 'GET' });
  },
  async reviews(slug: string, page: number | string = 1) {
    const path = `${API_ENDPOINTS.products}/${encodeURIComponent(
      slug,
    )}/reviews`;
    return httpFetch<ProductReviewsResponse>(path, {
      method: 'GET',
      query: {
        page: String(page),
      },
    });
  },
  async getProductDetailUi(slugOrId: string): Promise<Product> {
    const res = await this.getProductDetail(slugOrId);
    const p = res.data.data;
    const sale = parsePrice(p.sale_price);
    const base = parsePrice(p.base_price) ?? 0;
    const hasSale = sale !== undefined && sale > 0;
    const DEFAULT_IMG = '/assets/SpecialProduct.png';
    const toAbsolute = (path?: string | null): string => {
      if (!path) return DEFAULT_IMG;
      if (/^https?:\/\//i.test(path)) return path;
      return DEFAULT_IMG;
    };
    const images: string[] = (p.photos || [])
      .map((ph) => toAbsolute(ph.image))
      .filter(
        (img): img is string => typeof img === 'string' && img.length > 0,
      );
    const attributes = (p.attributes || []).map((group) => ({
      id: group.id,
      name: group.name,
      type: (group.type as 'options' | 'images') ?? 'options',
      values: (group.values || []).map((v) => ({
        id: v.id,
        value: v.value,
        price: v.price,
        image: v.image ? toAbsolute(v.image) ?? null : null,
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
      // map API average_rating (string) and formatted_sales (string) to UI fields
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
    };
  },
};
