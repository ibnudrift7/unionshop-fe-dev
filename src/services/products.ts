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
  const sale = parsePrice(p.sale_price);
  const base = parsePrice(p.base_price) ?? 0;
  const hasSale = sale !== undefined && sale > 0;
  const image = /^https?:\/\//i.test(p.cover_image) ? p.cover_image : undefined;
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
    // The OAS shows product detail at /products/{slug}. Our example file name indicates slug 'tanyaacevedo'.
    // We'll construct the path by appending the identifier.
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
    const attributes = (p.attributes || []).map((a) => ({
      id: a.id,
      name: a.attribute_name,
      valueId: a.attribute_value_id,
      value: a.attribute_value,
      price: a.attribute_price,
      image: a.attribute_image ?? undefined,
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
