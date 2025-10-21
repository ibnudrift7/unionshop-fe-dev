import { API_ENDPOINTS } from '@/constants/api';
import { httpFetch } from '@/services/http';
import type {
  ProductsQuery,
  ProductsResponse,
  ApiProduct,
} from '@/types/product';
import type { ProductDetailResponse } from '@/types/product-detail';
import type { Product } from '@/types';

function parsePrice(str?: string): number | undefined {
  if (!str) return undefined;
  const n = Number(str);
  return Number.isFinite(n) ? n : undefined;
}

function mapApiProductToUi(p: ApiProduct): Product {
  const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
  const toAbsolute = (path?: string) => {
    if (!path) return undefined;
    if (/^https?:\/\//i.test(path)) return path;
    return IMG_BASE
      ? `${IMG_BASE.replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`
      : undefined;
  };
  const sale = parsePrice(p.sale_price);
  const base = parsePrice(p.base_price) ?? 0;
  const hasSale = sale !== undefined && sale > 0;
  const image = toAbsolute(p.cover_image);
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: hasSale ? sale! : base,
    discountPrice: hasSale ? base : undefined,
    image,
    isNew: p.is_newest === 1,
    rating: 0,
    sold: 0,
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
  async getProductsUi(params: ProductsQuery = {}): Promise<Product[]> {
    const res = await this.getProducts(params);
    const list = res.data.data ?? [];
    return list.map(mapApiProductToUi);
  },
  async getProductDetail(slugOrId: string) {
    const path = `${API_ENDPOINTS.products}/${encodeURIComponent(slugOrId)}`;
    return httpFetch<ProductDetailResponse>(path, { method: 'GET' });
  },
  async getProductDetailUi(slugOrId: string): Promise<Product> {
    const res = await this.getProductDetail(slugOrId);
    const p = res.data.data;
    const sale = parsePrice(p.sale_price);
    const base = parsePrice(p.base_price) ?? 0;
    const hasSale = sale !== undefined && sale > 0;
    const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
    const toAbsolute = (path?: string) => {
      if (!path) return undefined;
      if (/^https?:\/\//i.test(path)) return path;
      return IMG_BASE
        ? `${IMG_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
        : undefined;
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
      rating: 0,
      sold: 0,
      attributes,
    };
  },
};
