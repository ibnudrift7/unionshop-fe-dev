import { API_BASE_URL } from '@/constants/api';
import { getAuthToken, getGuestToken } from '@/lib/auth-token';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequestOptions<TBody> {
  method?: HttpMethod;
  body?: TBody;
  headers?: HeadersInit;
  query?: Record<string, string | number | boolean | undefined>;
  cache?: RequestCache;
}

export interface HttpSuccessResponse<TData> {
  data: TData;
  status: number;
  ok: true;
}

export class HttpError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const buildUrl = (
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
): string => {
  const isAbsolute = /^https?:\/\//i.test(path);
  const base = isAbsolute ? path : `${API_BASE_URL}${path}`;
  if (!query) return base;

  const url = new URL(base);
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) return;
    url.searchParams.set(key, String(value));
  });
  return url.toString();
};

export async function httpFetch<TResponse, TBody = unknown>(
  path: string,
  options: HttpRequestOptions<TBody> = {},
): Promise<HttpSuccessResponse<TResponse>> {
  const { method = 'GET', body, headers, query, cache = 'no-store' } = options;

  const url = buildUrl(path, query);
  const hdr = new Headers(defaultHeaders);
  if (headers) {
    const entries = Array.isArray(headers)
      ? headers
      : headers instanceof Headers
      ? Array.from(headers.entries())
      : Object.entries(headers);
    for (const [k, v] of entries) hdr.set(k, v as string);
  }

  const existingAuth = hdr.get('Authorization');
  if (!existingAuth) {
    const token = getAuthToken() || getGuestToken();
    if (token) {
      hdr.set('Authorization', `Bearer ${token}`);
    }
  }

  const isStringBody = typeof body === 'string';
  const isFormDataBody =
    typeof FormData !== 'undefined' && body instanceof FormData;
  const isSearchParamsBody =
    typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams;
  const isBlobBody = typeof Blob !== 'undefined' && body instanceof Blob;

  if (isFormDataBody) {
    hdr.delete('Content-Type');
  }
  if (isSearchParamsBody || isStringBody) {
    if (!hdr.get('Content-Type')) {
      hdr.set('Content-Type', 'application/x-www-form-urlencoded');
    }
  }

  const response = await fetch(url, {
    method,
    cache,
    headers: hdr,
    body: body
      ? isStringBody || isFormDataBody || isSearchParamsBody || isBlobBody
        ? (body as BodyInit)
        : JSON.stringify(body)
      : undefined,
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (isJson && typeof payload === 'object' && payload && 'message' in payload
        ? String((payload as Record<string, unknown>).message)
        : undefined) ?? 'Request failed';

    throw new HttpError(message, response.status, payload);
  }

  return {
    data: payload as TResponse,
    status: response.status,
    ok: true,
  };
}
