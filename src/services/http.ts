import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import {
  getAuthToken,
  getStoredCsrfToken,
  setStoredCsrfToken,
} from '@/lib/auth-token';

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
    const token = getAuthToken();
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

  const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  if (isMutating && !hdr.get('X-CSRF-Token')) {
    let tokenToUse: string | null = null;
    const { token, exp } = getStoredCsrfToken();
    const now = Date.now();
    if (token && exp && now < exp) {
      tokenToUse = token;
    } else {
      // fetch new csrf token
      try {
        const csrfRes = await fetch(buildUrl(API_ENDPOINTS.csrfToken), {
          method: 'GET',
          cache: 'no-store',
          credentials: 'include',
          headers: new Headers({ Accept: 'application/json' }),
        });
        const ctype = csrfRes.headers.get('content-type');
        const isJsonCsrf = ctype?.includes('application/json');
        const csrfPayload = isJsonCsrf
          ? await csrfRes.json()
          : await csrfRes.text();
        const extracted =
          (isJsonCsrf &&
            csrfPayload &&
            (csrfPayload.csrfToken ||
              csrfPayload.token ||
              csrfPayload.csrf ||
              csrfPayload.data?.csrfToken)) ||
          null;
        if (
          csrfRes.ok &&
          typeof extracted === 'string' &&
          extracted.length > 0
        ) {
          tokenToUse = extracted;
          setStoredCsrfToken(extracted);
        }
      } catch {}
    }
    if (tokenToUse) {
      hdr.set('X-CSRF-Token', tokenToUse);
    }
  }

  const response = await fetch(url, {
    method,
    cache,
    credentials: 'include',
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
